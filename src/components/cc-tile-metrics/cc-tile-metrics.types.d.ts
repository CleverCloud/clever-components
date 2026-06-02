import type { MetricData } from '@clevercloud/client/cc-api-commands/metrics/metrics.types.js';

export type TileMetricsMetricsState =
  | TileMetricsMetricsStateLoading
  | TileMetricsMetricsStateError
  | TileMetricsMetricsStateLoaded
  | TileMetricsMetricsStateEmpty;

export interface TileMetricsMetricsStateLoaded {
  type: 'loaded';
  metricsData: MetricsData;
}

export interface TileMetricsMetricsStateLoading {
  type: 'loading';
}

export interface TileMetricsMetricsStateError {
  type: 'error';
}

export interface TileMetricsMetricsStateEmpty {
  type: 'empty';
}

export type Metric = MetricData;

export interface MetricsData {
  cpuMetrics: Metric[];
  memMetrics: Metric[];
}

export type TileMetricsGrafanaLinkState =
  | TileMetricsGrafanaLinkStateLoaded
  | TileMetricsGrafanaLinkStateLoading
  | TileMetricsGrafanaLinkStateHidden;

export interface TileMetricsGrafanaLinkStateLoaded {
  type: 'loaded';
  link: string;
}

export interface TileMetricsGrafanaLinkStateLoading {
  type: 'loading';
}

export interface TileMetricsGrafanaLinkStateHidden {
  type: 'hidden';
}

// this is what we retrieve directly from the API
export interface RawMetric {
  data: { timestamp: number; value: string }[];
  name: 'mem' | 'cpu';
  resource: string;
  unit: string;
}
