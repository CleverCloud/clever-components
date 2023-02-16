import './cc-logs.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-badge/cc-badge.js';
import { html, render } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import {
  iconRemixAddFill as addIcon,
  iconRemixDeleteBin_2Fill as clearIcon,
  iconRemixPlayFill as playIcon,
  iconRemixStopMiniFill as stopIcon,
  iconRemixDownloadFill as scrollDownIcon,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🧬 Logs/<cc-logs>',
  component: 'cc-logs',
};

const conf = {
  component: 'cc-logs',
  // language=CSS
  css: `
    cc-logs {
      border: 1px solid #ddd;
      border-radius: 0.2em;
      padding: 0.5em;
    }
  `,
};

const d = new Date();

const log = (index, fakeTime = true) => {
  return {
    timestamp: fakeTime ? d.getTime() + index : new Date().getTime(),
    message: `This is a message (${index})`,
    metadata: [
      {
        name: 'level',
        value: index % 4 === 0 ? 'INFO' : index % 3 === 0 ? 'WARN' : index % 2 === 0 ? 'DEBUG' : 'ERROR',
      },
      {
        name: 'ip',
        value: index % 2 === 0 ? '192.168.12.1' : '192.168.48.157',
      },
    ],
  };
};

const logWithManyMetadata = (index) => {
  return {
    ...log(index),
    metadata: [
      ...Array(10).fill(0).map((_, index) => ({
        name: `metadata${index + 1}`,
        value: `value${index + 1}`,
      })),
    ],
  };
};

const logs = (count, logFactory = log) => {
  return Array(count).fill(0).map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5) },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      logs: { state: 'loading' },
    },
  ],
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      logs: { state: 'error' },
    },
  ],
});

export const dataLoadedWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: {
        state: 'loaded',
        logs: logs(5).map((l) => ({ ...l, message: `${l.message}.${' A long message that should wrap.'.repeat(5)}` })),
      },
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithNoTimestamp = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5) },
      timestampDisplay: 'hidden',
    },
  ],
});

export const dataLoadedWithFormattedTimestamp = makeStory(conf, {
  // language=CSS
  css: `
    .ctrl {
      display: flex;
      gap: 0.5em;
      align-items: center;
      flex-wrap: wrap;
    }

    .spacer {
      flex: 1;
    }

    hr {
      border-top: 1px solid #ddd;
    }

    cc-logs {
      border: 1px solid #ddd;
      border-radius: 0.2em;
      padding: 0.5em;
    }
  `,
  dom: (container) => {
    const PATTERNS = [
      { label: 'datetime', value: 'datetime' },
      { label: 'time', value: 'time' },
    ];
    const PRECISIONS = [
      { label: 'milliseconds', value: 'milliseconds' },
      { label: 'seconds', value: 'seconds' },
    ];

    const LOGS = logs(5);

    let pattern = 'datetime';
    let precision = 'milliseconds';
    let utc = true;
    let showZoneOffset = true;

    function onPatternToggle ({ detail }) {
      pattern = detail;
      refresh();
    }

    function onPrecisionToggle ({ detail }) {
      precision = detail;
      refresh();
    }

    function onUtcChanged () {
      utc = !utc;
      refresh();
    }

    function onShowZoneOffsetChanged () {
      showZoneOffset = !showZoneOffset;
      refresh();
    }

    function refresh () {
      render(template(), container);
    }

    function template () {
      const timestampDisplay = { pattern, precision, utc, showZoneOffset };

      return html`
        <div class="ctrl">
          <cc-toggle legend="Pattern" .value=${`${pattern}`} @cc-toggle:input=${onPatternToggle} .choices=${PATTERNS} inline></cc-toggle>
          <cc-toggle legend="Precision" .value=${`${precision}`} @cc-toggle:input=${onPrecisionToggle} .choices=${PRECISIONS} inline></cc-toggle>
          
          <label for="utc">
            <input id="utc" type="checkbox" @change=${onUtcChanged} .checked=${utc}> UTC
          </label>
          <label for="showZoneOffset">
            <input id="showZoneOffset" type="checkbox" @change=${onShowZoneOffsetChanged} .checked=${showZoneOffset}> ShowZoneOffset
          </label>
        </div>
        <hr>
        <cc-logs
          id="cc-logs"
          .logs=${{ state: 'loaded', logs: LOGS }}
          .timestampDisplay=${timestampDisplay}
        ></cc-logs>
      `;
    }

    refresh();
  },
});

export const dataLoadedWithFollow = makeStory(conf, {
  // language=CSS
  css: `
    .ctrl {
      display: flex;
      gap: 0.5em;
      align-items: center;
      flex-wrap: wrap;
    }

    .spacer {
      flex: 1;
    }

    hr {
      border-top: 1px solid #ddd;
    }

    cc-logs {
      border: 1px solid #ddd;
      border-radius: 0.2em;
      padding: 0.5em;
    }
  `,
  dom: (container) => {
    const RATES = [
      { label: '🐌', value: '1000' },
      { label: '🐇', value: '100' },
      { label: '🐎', value: '10' },
    ];
    let logs = [];
    let timer = null;
    let rate = 1000;
    let index = 0;
    let follow = true;

    function isStarted () {
      return timer != null;
    }

    function add () {
      index++;
      logs = [...logs, log(index, false)];
      refresh();
    }

    function clear () {
      logs = [];
      refresh();
    }

    function start (rate) {
      if (timer != null) {
        stop();
      }

      timer = setInterval(add, rate);
      refresh();
    }

    function stop () {
      if (timer != null) {
        clearInterval(timer);
        timer = null;
      }
      refresh();
    }

    function toggleStartStop () {
      if (isStarted()) {
        stop();
      }
      else {
        start(rate);
      }
    }

    function onRateToggle ({ detail }) {
      rate = parseInt(detail);
      refresh();
      start(rate);
    }

    function onStartStopClick () {
      toggleStartStop();
    }

    function onAddClick () {
      add();
    }

    function onClearClick () {
      clear();
    }

    function onScrollDown () {
      container.querySelector('cc-logs').scrollToBottom();
    }

    function onFollowChanged () {
      follow = !follow;
      refresh();
    }

    function refresh () {
      render(template(), container);
    }

    function template () {
      const started = isStarted();

      return html`
        <div class="ctrl">
          <cc-toggle .value=${`${rate}`} @cc-toggle:input=${onRateToggle} .choices=${RATES}></cc-toggle>
          <cc-button
            @cc-button:click=${onStartStopClick}
            ?circle=${true}
            ?hide-text=${true}
            ?danger=${started}
            ?success=${!started}
            .icon=${started ? stopIcon : playIcon}
          ></cc-button>
          <cc-button
            @cc-button:click=${onAddClick}
            ?circle=${true}
            ?hide-text=${true}
            ?primary=${true}
            ?outlined=${true}
            .icon=${addIcon}
          ></cc-button>
          <cc-button
            @cc-button:click=${onClearClick}
            ?circle=${true}
            ?hide-text=${true}
            ?danger=${true}
            ?outlined=${true}
            .icon=${clearIcon}
          ></cc-button>

          <div class="spacer"></div>

          <label for="follow">
            <input id="follow" type="checkbox" @change=${onFollowChanged} .checked=${follow}> Follow
          </label>
          
          <cc-button
            @cc-button:click=${onScrollDown}
            ?circle=${true}
            ?hide-text=${true}
            ?outlined=${true}
            .icon=${scrollDownIcon}
          ></cc-button>

        </div>
        <hr>
        <cc-logs
          id="cc-logs"
          .logs=${{ state: 'loaded', logs: logs }}
          ?follow=${follow}
        ></cc-logs>
      `;
    }

    start(rate);
  },
});

const CUSTOM_METADATA_RENDERERS = {
  level: (metadata) => {
    let intent = 'neutral';
    if (metadata.value === 'ERROR') {
      intent = 'danger';
    }
    else if (metadata.value === 'WARN') {
      intent = 'warning';
    }
    else if (metadata.value === 'INFO') {
      intent = 'info';
    }

    return html`
      <cc-badge .intent=${intent}>${metadata.value}</cc-badge>`;
  },
  ip: (metadata) => {
    return html`
      <cc-badge weight="outlined">💻 ${metadata.value}</cc-badge>`;
  },
};
export const dataLoadedWithCustomMetadataRenderer = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5) },
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
    },
  ],
});

export const dataLoadedWithManyMetadata = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5, logWithManyMetadata) },
    },
  ],
});

export const dataLoadedWithManyMetadataWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5, logWithManyMetadata) },
      wrapLines: true,
    },
  ],
});

const CUSTOM_MESSAGE_RENDERER = (message) => {
  return html`${unsafeHTML(message.replace('message', `<span style="background-color: #e3ffd6;">message</span>`))}`;
};
export const dataLoadedWithCustomMessageRenderer = makeStory(conf, {
  items: [
    {
      logs: { state: 'loaded', logs: logs(5) },
      messageRenderer: CUSTOM_MESSAGE_RENDERER,
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorWithLoading,
  dataLoadedWithWrapLines,
  dataLoadedWithNoTimestamp,
  dataLoadedWithFormattedTimestamp,
  dataLoadedWithFollow,
  dataLoadedWithCustomMetadataRenderer,
  dataLoadedWithManyMetadata,
  dataLoadedWithManyMetadataWithWrapLines,
  dataLoadedWithCustomMessageRenderer,
});
