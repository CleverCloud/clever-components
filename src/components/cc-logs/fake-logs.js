import { random, randomPick, range } from '../../lib/utils.js';

const LONG_MESSAGE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const SHORT_MESSAGE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';

const ANSI_EFFECTS = [1, 3, 4, 9];
const ANSI_COLORS = range(31, 36);

function withAnsi(message) {
  return message
    .split(' ')
    .slice(0, random(5, 50))
    .map((w) => {
      const effect = randomPick(ANSI_EFFECTS);
      const color = randomPick(ANSI_COLORS);
      return `\u001B[${effect};${color}m${w}`;
    })
    .join('\u001B[0m ');
}

export const CUSTOM_METADATA_RENDERERS = {
  level: (metadata) => {
    let intent = 'neutral';
    if (metadata.value === 'ERROR') {
      intent = 'danger';
    } else if (metadata.value === 'WARN') {
      intent = 'warning';
    } else if (metadata.value === 'INFO') {
      intent = 'info';
    }
    return {
      strong: true,
      intent,
      size: 5,
    };
  },
  ip: (metadata) => ({
    text: `💻 ${metadata.value}`,
    strong: true,
    size: 17,
  }),
};

/**
 *
 * @param {number} index
 * @param {boolean} [longMessage = false]
 * @param {boolean} [ansi = false]
 * @param {boolean} [manyMetadata = false]
 * @return {Log}
 */
export function createFakeLog(index, { longMessage = false, ansi = false, manyMetadata = false }) {
  const msg = longMessage ? LONG_MESSAGE : SHORT_MESSAGE;
  const message = ansi ? withAnsi(msg) : msg;
  /**
   * @type {Array<Metadata>}
   */
  const metadata = manyMetadata
    ? range(1, 20).map((i) => ({ name: `metadata${i}`, value: `value${i}` }))
    : [
        { name: 'level', value: randomPick(['INFO', 'WARN', 'DEBUG', 'ERROR']) },
        { name: 'ip', value: randomPick(['192.168.12.1', '192.168.48.157']) },
      ];

  const date = new Date();
  return {
    id: `${date.getTime()}-${index}`,
    date,
    message: `Message ${index}. ${message}`,
    metadata,
  };
}

/**
 *
 * @param {number} count
 * @param [options]
 * @param [options.longMessage = false]
 * @param [options.ansi = false]
 * @param [options.manyMetadata = false]
 * @return {Array<Log>}
 */
export function createFakeLogs(count, options) {
  return Array(count)
    .fill(0)
    .map((_, i) => createFakeLog(i, options ?? {}));
}
