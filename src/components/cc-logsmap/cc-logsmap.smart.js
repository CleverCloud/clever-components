import { GetHeatMapCommand } from '@clevercloud/client/cc-api-commands/metrics/get-heat-map-command.js';
import { StreamRequestsCommand } from '@clevercloud/client/cc-api-commands/metrics/stream-requests-command.js';
import { getCcApiClientWithOAuth } from '../../lib/cc-api-client.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-logsmap.js';

/**
 * @import { CcLogsmap } from './cc-logsmap.js'
 * @import { HeatmapPoint, MapModeType } from '../common.types.js'
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs, UpdateComponentCallback } from '../../lib/smart/smart-component.types.js'
 * @import { RequestsStream } from '@clevercloud/client/cc-api-commands/metrics/stream-requests-command.js'
 * @import { CcApiClient } from '@clevercloud/client/cc-api-client.js'
 */

// Spread the dots of a live batch over this duration so they don't all blink at once.
const POINTS_SPREAD_DURATION = 3000;
// How long a live dot stays on the map before fading out (outlives the spread so dots don't vanish mid-batch).
const POINTS_DELAY = POINTS_SPREAD_DURATION + 2000;

// The heat map aggregates requests into hourly buckets, so its response is byte-identical for the rest of the current
// hour. We cache it until the next hour boundary, plus this margin to let the just-completed bucket be fully ingested
// before we read it.
const HEATMAP_CACHE_INGESTION_MARGIN = 2 * 60 * 1000;

defineSmartComponent({
  selector: 'cc-logsmap',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    appId: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcLogsmap>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, appId } = context;

    const controller = new LogsmapController({ apiConfig, ownerId, appId, component, updateComponent });

    signal.onabort = () => {
      controller.stop();
    };

    // The user can toggle the map mode from the component itself, so we react to the change and (re)load accordingly.
    onEvent('cc-logsmap-mode-change', (mode) => {
      controller.loadMode(mode);
    });

    controller.loadMode(component.mode);
  },
});

/**
 * Drives a `<cc-logsmap>`:
 * * in `heatmap` mode, it fetches the heat map once with `GetHeatMapCommand`,
 * * in `points` mode, it opens a live SSE stream with `StreamRequestsCommand` and adds blinking dots as batches arrive.
 *
 * A generation counter guards every async callback so that stale loads (mode switched or controller stopped in the
 * meantime) are ignored.
 */
class LogsmapController {
  /**
   * @param {object} _
   * @param {ApiConfig} _.apiConfig
   * @param {string} _.ownerId
   * @param {string} [_.appId]
   * @param {CcLogsmap} _.component
   * @param {UpdateComponentCallback<CcLogsmap>} _.updateComponent
   */
  constructor({ apiConfig, ownerId, appId, component, updateComponent }) {
    /** @type {CcApiClient} */
    this._client = getCcApiClientWithOAuth(apiConfig);
    this._ownerId = ownerId;
    this._appId = appId;
    this._component = component;
    this._updateComponent = updateComponent;

    /** @type {RequestsStream|null} */
    this._stream = null;
    /** @type {AbortController|null} */
    this._heatmapAbortController = null;
    /** @type {number} */
    this._generation = 0;
    this._stopped = false;
  }

  /**
   * Cancels the current load (live stream or heat map fetch) and invalidates its async callbacks.
   * @param {MapModeType} [mode]
   */
  loadMode(mode) {
    this._cancel();

    if (this._stopped) {
      return;
    }

    if (mode === 'heatmap') {
      this._loadHeatmap();
    } else {
      this._openPointsStream();
    }
  }

  stop() {
    this._stopped = true;
    this._cancel();
  }

  _cancel() {
    // Invalidate every in-flight callback captured with the previous generation.
    this._generation++;

    this._stream?.close();
    this._stream = null;

    this._heatmapAbortController?.abort();
    this._heatmapAbortController = null;
  }

  _loadHeatmap() {
    const generation = this._generation;
    this._heatmapAbortController = new AbortController();

    this._updateComponent('error', false);
    this._updateComponent('loading', true);
    // Drop the previous result: a stale empty array would make `<cc-map>` show its "no points" message while loading.
    this._updateComponent('heatmapPoints', null);

    this._client
      .send(new GetHeatMapCommand({ ownerId: this._ownerId, applicationId: this._appId }), {
        signal: this._heatmapAbortController.signal,
        cache: { ttl: getHeatmapCacheTtl() },
      })
      .then(
        /** @param {Array<HeatmapPoint>} heatmapPoints */ (heatmapPoints) => {
          if (generation !== this._generation) {
            return;
          }
          this._updateComponent('heatmapPoints', heatmapPoints);
          this._updateComponent('loading', false);
        },
      )
      .catch((error) => {
        if (generation !== this._generation) {
          return;
        }
        console.error(error);
        this._updateComponent('error', true);
        this._updateComponent('loading', false);
      });
  }

  _openPointsStream() {
    const generation = this._generation;

    this._updateComponent('error', false);
    this._updateComponent('loading', true);

    this._client
      .stream(new StreamRequestsCommand({ ownerId: this._ownerId, applicationId: this._appId }))
      .then((stream) => {
        // Mode switched or controller stopped while the stream was being created.
        if (generation !== this._generation) {
          stream.close();
          return null;
        }

        this._stream = stream;

        stream.onOpen(() => {
          if (generation === this._generation) {
            this._updateComponent('loading', false);
          }
        });

        stream.onRequests((locations) => {
          this._component.addPoints(
            locations.map((location) => ({
              lat: location.lat,
              lon: location.lon,
              count: location.count,
              tooltip: location.city,
              delay: POINTS_DELAY,
            })),
            { spreadDuration: POINTS_SPREAD_DURATION },
          );
        });

        return stream.start();
      })
      .catch((error) => {
        if (generation !== this._generation) {
          return;
        }
        console.error(error);
        this._updateComponent('error', true);
        this._updateComponent('loading', false);
      });
  }
}

/**
 * Computes the heat map cache TTL (in ms) so the cached response expires shortly after the next hour boundary, once
 * the just-completed hourly bucket has had time to be ingested.
 *
 * @returns {number}
 */
function getHeatmapCacheTtl() {
  const now = Date.now();
  const nextHourBoundary = new Date(now);
  nextHourBoundary.setHours(nextHourBoundary.getHours() + 1, 0, 0, 0);
  return nextHourBoundary.getTime() - now + HEATMAP_CACHE_INGESTION_MARGIN;
}
