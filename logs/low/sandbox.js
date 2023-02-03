import Chart from 'chart.js/auto';
import { html, render } from 'lit';
import { addTranslations, setLanguage } from '../../src/lib/i18n.js';
import { lang, translations } from '../../src/translations/translations.en.js';
import '../../src/components/cc-logs-poc/cc-logs-poc.js';
import '../../src/components/cc-logs-poc/cc-logs-dom.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-toaster/cc-toaster.js';
import '../../src/components/cc-toggle/cc-toggle.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import { parseInteger, randomLogs, round2, waitForNextRepaint } from '../utils/utils.js';

addTranslations(lang, translations);
setLanguage(lang);

document.addEventListener('cc:notify', (event) => {
  document.querySelector('cc-toaster').show(event.detail);
});

let $logs;
function getLogsElement () {
  return $logs;
}

const appenders = [];
function repeat (fn, rate) {
  appenders.push(setInterval(fn, rate));
}
function stop () {
  appenders.forEach((a) => {
    clearInterval(a);
  });
}

async function addRandomLogs (count) {
  const logs = randomLogs(count);
  const { value } = await measure(`add-${count}`, () => getLogsElement().addLogs(logs));
  const total = refreshCount();
  if (total % 10 === 0) {
    addData(new Intl.NumberFormat().format(total), value);
  }
}

function clearLogs () {
  getLogsElement().clear();
  refreshCount();
  clearData();
}

const $measure = document.querySelector('#measure');
let lastMeasure;
async function measure (name, fn) {
  const start = performance.now();
  fn();

  await waitForNextRepaint();

  const duration = performance.now() - start;

  if (lastMeasure != null && lastMeasure.name === name) {
    lastMeasure.value = (lastMeasure.value * lastMeasure.count + duration) / (lastMeasure.count + 1);
    lastMeasure.count = lastMeasure.count + 1;
  }
  else {
    lastMeasure = {
      name,
      value: duration,
      count: 1,
    };
  }

  console.log('measure', name, duration, 'avg', lastMeasure.value);
  if ($measure != null) {
    $measure.innerHTML = `${name}<br/>${round2(duration)} ms.<br/>AVG : ${round2(lastMeasure.value)} ms.`;
  }

  return lastMeasure;
}

const sets = {
  clear: {
    async run () {
      await measure('clear', () => clearLogs());
    },
  },
  random: {
    async run (options) {
      await addRandomLogs(100);
      repeat(async () => await addRandomLogs(parseInt(getMicrobatching())), parseInteger('rate', options.rate, 1000));
    },
  },
  stop: {
    run () {
      stop();
    },
  },
  'add-random': {
    async run (options) {
      const count = parseInteger('count', options.count, 0);
      if (count > 0) {
        await addRandomLogs(count);
      }
    },
  },
};

function applySet (setId, options) {
  const set = sets[setId];

  if (set.run) {
    set.run(options);
  }
}

document.querySelector('.left').addEventListener('cc-button:click', (e) => {
  const button = e.target;
  if (!button.matches('cc-button')) {
    return;
  }

  applySet(button.dataset.set, button.dataset);
});

// control

/**
 * @type {HTMLElement}
 */
const $ctrl = document.querySelector('.ctrl');
const $logsWrapper = document.querySelector('.wrapper');

const modes = [
  { label: 'lit-virtualizer', value: 'lit-virtualizer' },
  { label: 'lit-repeat', value: 'lit-repeat' },
  { label: 'lit-map', value: 'lit-map' },
  { label: 'dom', value: 'dom' },
];

const ctrlModel = {
  mode: 'lit-virtualizer',
  limit: 0,
  follow: true,
  wrapLines: true,
};

const onModeChanged = ({ detail: mode }) => {
  if (ctrlModel.mode !== mode) {
    ctrlModel.mode = mode;
    stop();
    refresh(true);
  }
};

const onFollowChanged = () => {
  ctrlModel.follow = !ctrlModel.follow;
  refresh();
};

const onWrapLinesChanged = () => {
  ctrlModel.wrapLines = !ctrlModel.wrapLines;
  refresh();
};

const onLimitChanged = ({ detail: limit }) => {
  ctrlModel.limit = limit;
  refresh();
};

function refreshCtrl () {
  render(html`
    <cc-toggle .choices=${modes} value=${ctrlModel.mode} @cc-toggle:input=${onModeChanged}></cc-toggle>
    
    <div style="flex:1"></div>
    
    <label for="follow">
      <input id="follow" type="checkbox" @change=${onFollowChanged} .checked=${ctrlModel.follow}> Follow
    </label>

    <label for="wrapLines">
      <input id="wrapLines" type="checkbox" @change=${onWrapLinesChanged} .checked=${ctrlModel.wrapLines}> Wrap lines
    </label>

    <cc-input-number label="Limit" value=${ctrlModel.limit} @cc-input-number:input=${onLimitChanged} inline="true"></cc-input-number>
  `, $ctrl);
}

async function refreshLogs (modeChanged = false) {
  if (modeChanged) {

    if ($logs != null) {
      $logs.style.display = 'none';
      await waitForNextRepaint();
      $logs.remove();
    }

    const mode = ctrlModel.mode;
    const useLit = mode.startsWith('lit-');
    const useVirtualizer = mode === 'lit-virtualizer';
    const useRepeat = mode === 'lit-repeat';

    if (useLit) {
      $logs = document.createElement('cc-logs-poc');
      $logs.withVirtualizer = useVirtualizer;
      $logs.withRepeat = useRepeat;
    }
    else {
      $logs = document.createElement('cc-logs-dom');
    }

    $logsWrapper.appendChild($logs);
  }

  $logs.follow = ctrlModel.follow;
  $logs.wrapLines = ctrlModel.wrapLines;
  $logs.limit = ctrlModel.limit;
}

function refresh (modeChanged = false) {
  refreshLogs(modeChanged);
  refreshCtrl();
}

refresh(true);

const $counter = document.querySelector('#count');
function refreshCount () {
  const count = $logs?.count() ?? 0;
  if ($counter != null) {
    $counter.innerHTML = `Count: ${new Intl.NumberFormat().format(count)}`;
  }
  return count;
}

// ---chart

const chart = new Chart(
  document.getElementById('chart'),
  {
    type: 'line',
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      plugins: {
        tooltip: {
          enabled: false,
        },
      },
    },
    data: {
      labels: [],
      datasets: [
        {
          label: 'Repaint duration average',
          data: [],
        },
      ],
    },
  },
);

function addData (label, data) {
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
  });
  chart.update();
}

function clearData () {
  chart.data.labels = [];
  chart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });
  chart.update();
}

// ---
function getMicrobatching () {
  return document.querySelector('#microbatching').value;
}
