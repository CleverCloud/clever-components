import './cc-logs-application-view.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  title: '🚧 Beta/🛠 Logs/<cc-logs-application-view-beta>',
  component: 'cc-logs-application-view-beta',
};

const conf = {
  component: 'cc-logs-application-view-beta',
  beta: true,
  // language=CSS
  css: `
    cc-logs-application-view-beta {
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
  return Array(count).fill(0).map((_, i) => logFactory(i));
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      logs: logs(100),
    },
  ],
});
