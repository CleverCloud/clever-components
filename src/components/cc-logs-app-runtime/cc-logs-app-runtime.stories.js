import { makeStory } from '../../stories/lib/make-story.js';
import './cc-logs-app-runtime.js';

export default {
  title: '🚧 Beta/🛠 Logs app/<cc-logs-app-runtime-beta>',
  component: 'cc-logs-app-runtime-beta',
};

const conf = {
  component: 'cc-logs-app-runtime-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-app-runtime-beta {
      height: 800px;
    }
  `,
};

const d = new Date();

const log = (index, fakeTime = true) => {
  return {
    id: `${index}`,
    date: fakeTime ? new Date(d.getTime() + index) : new Date(),
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
  return Array(count)
    .fill(0)
    .map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: logs(100),
    },
  ],
});
