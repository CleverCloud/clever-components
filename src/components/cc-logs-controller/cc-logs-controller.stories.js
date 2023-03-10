import './cc-logs-controller.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Logs/<cc-logs-controller>',
  component: 'cc-logs-controller',
};

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
      intent,
      size: 5,
    };
  },
  ip: (metadata) => {
    return {
      strong: true,
      text: `💻 ${metadata.value}`,
      size: 17,
    };
  },
};

const conf = {
  component: 'cc-logs-controller',
  // language=CSS
  css: `
    cc-logs-controller {
      border: 1px solid #ddd;
      border-radius: 0.2em;
      padding: 0.5em;
      height: 800px;
    }
  `,
};

const d = new Date();

const log = (index, fakeTime = true) => {
  return {
    id: `${index}`,
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

const logs = (count, logFactory = log) => {
  return Array(count).fill(0).map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      follow: true,
      metadataDisplay: { ip: { label: 'Afficher l\'adresse IP', hidden: true }, level: { label: 'Afficher le niveau de log', hidden: false } },
      metadataRenderers: CUSTOM_METADATA_RENDERERS,
      logs: logs(100),
    },
  ],
});

enhanceStoriesNames({
  defaultStory,
});
