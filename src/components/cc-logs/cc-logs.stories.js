import './cc-logs.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-toggle/cc-toggle.js';
import { html, render } from 'lit';
import {
  iconRemixAddFill as addIcon,
  iconRemixDeleteBin_2Fill as clearIcon,
  iconRemixPlayFill as playIcon,
  iconRemixStopMiniFill as stopIcon,
  iconRemixDownloadFill as scrollDownIcon,
} from '../../assets/cc-remix.icons.js';
import { ansiPaletteStyle } from '../../lib/ansi/ansi-palette-style.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';
import { TIMESTAMP_DISPLAYS, TIMEZONES } from '../../lib/timestamp-formatter.js';
import { random, range } from '../../lib/utils.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default {
  title: '🛠 Logs/<cc-logs>',
  component: 'cc-logs',
};

const conf = {
  component: 'cc-logs',
  // language=CSS
  css: `
    cc-logs {
      border: 1px solid #ddd;
      border-radius: 0.2em;
    }
  `,
};

const d = new Date();

const log = (index, fakeTime = true, message = (index) => `This is a message (${index})`) => {
  const timestamp = fakeTime ? d.getTime() + index : new Date().getTime();
  return {
    id: `${timestamp}-${index}`,
    timestamp,
    message: message(index),
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

const logWithAnsiMessage = (index) => {
  return {
    ...log(index),
    message: `\u001B[1;32mBold Green\u001B[0m \u001B[3;40;93mItalic Bright-Yellow/Black\u001B[7m=>Inverted\u001B[0m Reset\u001B[7m =>Inverted\u001B[0m \u001B[31m(${index})`,
  };
};

const logs = (count, logFactory = log) => {
  return Array(count).fill(0).map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: logs(5),
    },
  ],
});

export const dataLoadedWithWrapLines = makeStory(conf, {
  css: `
    cc-logs {
      border: 1px solid #ddd;
      border-radius: 0.2em;
      height: 600px;
    }
  `,
  items: [
    {
      logs: logs(50).map((l) => ({ ...l, message: `${l.message}.${' A long message that should wrap.'.repeat(5)}` })),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithTimestamp = makeStory(conf, {
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
    }
  `,
  dom: (container) => {
    const DISPLAYS = TIMESTAMP_DISPLAYS.map((d) => ({ label: d, value: d }));
    const ZONES = TIMEZONES.map((d) => ({ label: d, value: d }));

    const LOGS = logs(5);

    let display = 'datetime-iso';
    let timezone = 'UTC';

    function onDisplayToggle ({ detail }) {
      display = detail;
      refresh();
    }

    function onTimezoneToggle ({ detail }) {
      timezone = detail;
      refresh();
    }

    function refresh () {
      render(template(), container);
    }

    function template () {
      return html`
        <div class="ctrl">
          <cc-toggle legend="Display" .value=${`${display}`} @cc-toggle:input=${onDisplayToggle} .choices=${DISPLAYS} inline></cc-toggle>
          <cc-toggle legend="Timezone" .value=${`${timezone}`} @cc-toggle:input=${onTimezoneToggle} .choices=${ZONES} inline></cc-toggle>
        </div>
        <hr>
        <cc-logs
          id="cc-logs"
          .logs=${LOGS}
          .timestampDisplay=${display}
          .timezone=${timezone}
        ></cc-logs>
      `;
    }

    refresh();
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
    return {
      text: metadata.value,
      strong: true,
      intent,
      size: 5,
    };
  },
  ip: (metadata) => {
    return {
      strong: true,
      size: 15,
    };
  },
};
export const dataLoadedWithCustomMetadataRenderer = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
    },
  ],
});

const HIDDEN_METADATA_RENDERERS = {
  level: {
    hidden: true,
  },
  ip: {
    hidden: true,
  },
};
export const dataLoadedWithHiddenMetadata = makeStory(conf, {
  items: [
    {
      logs: logs(5),
      metadataRenderers: HIDDEN_METADATA_RENDERERS,
    },
  ],
});

export const dataLoadedWithManyMetadata = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithManyMetadata),
    },
  ],
});

export const dataLoadedWithManyMetadataWithWrapLines = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithManyMetadata),
      wrapLines: true,
    },
  ],
});

export const dataLoadedWithAnsiMessage = makeStory(conf, {
  items: [
    {
      logs: logs(5, logWithAnsiMessage),
    },
  ],
});

export const dataLoadedWithAnsiColorPalette = makeStory(conf, {
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
    }
  `,
  dom: (container) => {
    const PALETTES = [
      { label: 'default', value: ansiPaletteStyle(defaultPalette) },
      { label: 'One Light', value: ansiPaletteStyle(oneLightPalette) },
      { label: 'Tokyo Night Light', value: ansiPaletteStyle(tokyoNightLightPalette) },
      { label: 'Night Owl', value: ansiPaletteStyle(nightOwlPalette) },
      { label: 'Everblush', value: ansiPaletteStyle(everblushPalette) },
      { label: 'Hyoob', value: ansiPaletteStyle(hyoobPalette) },
    ];

    const LOGS = logs(5);

    let palette = PALETTES[0].value;

    function onPaletteToggle ({ detail }) {
      palette = detail;
      refresh();
    }

    function refresh () {
      render(template(), container);
    }

    function template () {
      return html`
        <div class="ctrl">
          <cc-toggle 
            legend="Palette"
            .value=${`${palette}`} 
            @cc-toggle:input=${onPaletteToggle} 
            .choices=${PALETTES} 
            inline
          ></cc-toggle>
        </div>
        <hr>
        <cc-logs
          id="cc-logs"
          .logs=${LOGS}
          .metadataRenderers=${CUSTOM_METADATA_RENDERERS}
          style="${palette}"
        ></cc-logs>
      `;
    }

    refresh();
  },
});

export const sandbox = makeStory(conf, {
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
      height: 600px;
    }
  `,
  dom: (container) => {
    const PREDICATES = [
      { label: 'all', value: 'a' },
      { label: '192.168.12.1: WARN/ERROR', value: 'b' },
    ];
    const RATES = [
      { label: '🐌', value: '1000' },
      { label: '🐇', value: '100' },
      { label: '🐎', value: '10' },
    ];
    let timer;
    let rate = 1000;
    let index = 0;
    let follow = true;
    let limit = 1000;
    const predicate = 'a';

    function add () {
      const m = LOREM_IPSUM.split(' ').slice(0, random(0, 50)).join(' ');
      index++;
      container.querySelector('cc-logs').appendLog(log(index, false, (index) => `This is a message ${index}. ${m}`));
    }

    function onPredicateToggle ({ detail }) {
      container.querySelector('cc-logs').filter = detail === 'a'
        ? null
        : [
            {
              metadata: 'level',
              value: 'WARN',
            },
            {
              metadata: 'level',
              value: 'ERROR',
            },
            {
              metadata: 'ip',
              value: '192.168.12.1',
            },
          ];
    }

    function clear () {
      container.querySelector('cc-logs').clear();
    }

    function isStarted () {
      return timer != null;
    }

    function start (rate) {
      if (isStarted()) {
        stop();
      }

      timer = setInterval(add, rate);
      refresh();
    }

    function stop () {
      if (isStarted()) {
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
      range(1, 1).forEach(add);
    }

    function onClearClick () {
      clear();
    }

    function onLimitChanged ({ detail }) {
      limit = detail;
      refresh();
    }

    function onScrollDown () {
      container.querySelector('cc-logs').scrollToBottom();
    }

    function onFollowSwitched () {
      follow = !follow;
      refresh();
    }

    function onFollowChanged (e) {
      follow = e.detail;
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
            .accessibleName=${started ? 'Stop' : 'Run'}
          ></cc-button>
          <cc-button
            @cc-button:click=${onAddClick}
            ?circle=${true}
            ?hide-text=${true}
            ?primary=${true}
            ?outlined=${true}
            .icon=${addIcon}
            accessible-name="Add one log"
          ></cc-button>
          <cc-button
            @cc-button:click=${onClearClick}
            ?circle=${true}
            ?hide-text=${true}
            ?danger=${true}
            ?outlined=${true}
            .icon=${clearIcon}
            accessible-name="Clear"
          ></cc-button>
          
          <cc-input-number
            @cc-input-number:input=${onLimitChanged}
            .value=${limit}
            label="Limit"
            min="0"
            controls
            inline
          ></cc-input-number>

          <cc-toggle legend="Predicate" .value=${`${predicate}`} @cc-toggle:input=${onPredicateToggle} .choices=${PREDICATES} inline></cc-toggle>
          
          <div class="spacer"></div>

          <label for="follow">
            <input id="follow" type="checkbox" @change=${onFollowSwitched} .checked=${follow}> Follow
          </label>
          
          <cc-button
            @cc-button:click=${onScrollDown}
            ?circle=${true}
            ?hide-text=${true}
            ?outlined=${true}
            .icon=${scrollDownIcon}
            accessible-name="Scroll to the bottom"
          ></cc-button>

        </div>
        <hr>
        <cc-logs
          id="cc-logs"
          ?follow=${follow}
          ?wrap-lines=${true}
          .limit=${limit}
          @cc-logs:followChanged=${onFollowChanged}
        ></cc-logs>
      `;
    }

    start(rate);

    return () => {
      stop();
    };
  },
});

enhanceStoriesNames({
  defaultStory,
  dataLoadedWithWrapLines,
  dataLoadedWithTimestamp,
  dataLoadedWithCustomMetadataRenderer,
  dataLoadedWithHiddenMetadata,
  dataLoadedWithManyMetadata,
  dataLoadedWithManyMetadataWithWrapLines,
  dataLoadedWithAnsiMessage,
  dataLoadedWithAnsiColorPalette,
  sandbox,
});
