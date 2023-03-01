import { notify } from '../../src/lib/notifications.js';
import '../../src/components/cc-toaster/cc-toaster.js';

export function waitForNextRepaint () {
  return new Promise(requestAnimationFrame);
}

export function sleep (duration) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration);
  });
}

export function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomCommit () {
  return randomString(8, 'abcdef0123456789');
}
export function randomString (length = 8, alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
  let result = '';
  const charactersLength = alphabet.length;
  for (let i = 0; i < length; i++) {
    result += alphabet.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomPick (array) {
  if (array.length === 0) {
    return null;
  }
  return array[random(0, array.length - 1)];
}

export function randomMetadata () {
  return Object.fromEntries(
    new Array(random(0, 3)).fill(0)
      .map(() => [randomString(), randomString()]),
  );
}
export function randomLog () {
  const date = new Date().toISOString();
  const msg = randomString();
  return {
    id: date + msg,
    timestamp: date,
    metadata: randomMetadata(),
    message: `${msg} `.repeat(random(1, 20)),
  };
}

export function randomLogs (count) {
  return Array(count).fill(0).map(randomLog);
}

export function sendLogs (logger, logs, rate) {
  if (rate === 0) {
    logger.addLogs(logs);
  }
  else {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i === logs.length) {
          clearInterval(interval);
          resolve();
        }
        else {
          logger.addLogs([logs[i]]);
          i++;
        }
      }, rate);
    });
  }
}

export function parseInteger (prop, value, fallback) {
  if (value == null) {
    return fallback;
  }
  try {
    return parseInt(value);
  }
  catch (e) {
    console.error(e);
    notify(window, {
      message: `could not parse option ${prop} with value "${value}" as an integer. fallback ${prop} to "${fallback}"`,
      intent: 'warning',
    });
    return fallback;
  }
}

export function parseBoolean (prop, value, fallback) {
  if (value == null) {
    return fallback;
  }

  if (value?.toLowerCase() === 'true') {
    return true;
  }
  if (value?.toLowerCase() === 'false') {
    return false;
  }
  notify(window, {
    message: `could not parse option ${prop} with value "${value}" as a boolean. fallback ${prop} to "${fallback}"`,
    intent: 'warning',
  });
}

export function round2 (num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function groupBy (array, keyFn) {
  const result = {};

  for (const e of array) {
    const key = keyFn(e);
    const grp = result[key];
    if (grp == null) {
      result[key] = [e];
    }
    else {
      result[key] = [...grp, e];
    }
  }
  return result;
}

export function last (array) {
  if (array == null) {
    return null;
  }

  if (array.length === 0) {
    return null;
  }

  return array[array.length - 1];
}

/**
 *
 * @param {Array<T>} nodes
 * @param {(T) => boolean} predicate
 * @param {(T) => Array<T>} childrenFn
 * @return {null|T}
 * @template T
 */
export function treeFind (nodes, predicate, childrenFn = (n) => n.children) {
  let result = null;
  treeWalk(nodes, (node) => {
    if (predicate(node)) {
      result = node;
      return false;
    }
  }, childrenFn);
  return result;
}

export function treeWalk (nodes, fn, childrenFn = (n) => n.children) {
  for (const node of nodes) {
    if (fn(node) === false) {
      return;
    }
    const children = childrenFn(node);
    if (children?.length > 0) {
      treeWalk(children, fn, childrenFn);
    }
  }
}
