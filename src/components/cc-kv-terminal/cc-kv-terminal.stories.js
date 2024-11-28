import { makeStory } from '../../stories/lib/make-story.js';
import './cc-kv-terminal.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Kv Explorer/<cc-kv-terminal-beta>',
  component: 'cc-kv-terminal-beta',
};

/**
 * @typedef {import('./cc-kv-terminal.js').CcKvTerminal} CcKvConsole
 */

const conf = {
  component: 'cc-kv-terminal-beta',
  beta: true,
};

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcKvConsole>>} */
  items: [
    {
      state: {
        type: 'idle',
        history: [
          { commandLine: 'PING', result: ['"PONG"'], success: true },
          { commandLine: 'SET "my first key" "an awesome key"', result: ['"OK"'], success: true },
          { commandLine: 'GET "my first key"', result: ['"an awesome key"'], success: true },
        ],
      },
    },
  ],
});

export const withError = makeStory(conf, {
  /** @type {Array<Partial<CcKvConsole>>} */
  items: [
    {
      state: {
        type: 'idle',
        history: [
          { commandLine: 'PINGG', result: [`ERR unknown command 'pingg', with args beginning with: `], success: false },
        ],
      },
    },
  ],
});

export const withCommandRunning = makeStory(conf, {
  /** @type {Array<Partial<CcKvConsole>>} */
  items: [
    {
      state: {
        type: 'running',
        history: [
          { commandLine: 'PING', result: ['"PONG"'], success: true },
          { commandLine: 'SET "my first key" "an awesome key"', result: ['"OK"'], success: true },
          { commandLine: 'GET "my first key"', result: ['"an awesome key"'], success: true },
        ],
        commandLine: 'INFO',
      },
    },
  ],
});

export const withCustomTheme = makeStory(
  {
    ...conf,
    css: `cc-kv-terminal-beta { 
      --cc-kv-terminal-color-background: #fafafa;
      --cc-kv-terminal-color-foreground: black;
      --cc-kv-terminal-color-foreground-success: blue;
      --cc-kv-terminal-color-foreground-error: #750000;
    }`,
  },
  {
    /** @type {Array<Partial<CcKvConsole>>} */
    items: [
      {
        state: {
          type: 'running',
          history: [
            { commandLine: 'PING', result: ['"PONG"'], success: true },
            { commandLine: 'SET "my first key" "an awesome key"', result: ['"OK"'], success: true },
            { commandLine: 'GET "my first key"', result: ['"an awesome key"'], success: true },
            {
              commandLine: 'PINGG',
              result: [`ERR unknown command 'pingg', with args beginning with: `],
              success: false,
            },
          ],
          commandLine: 'INFO',
        },
      },
    ],
  },
);
