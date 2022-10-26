import { notify } from '../src/lib/notifications.js';

export function waitForNextRepaint () {
  return new Promise(requestAnimationFrame);
}

export function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
export function randomLog () {
  const date = new Date().toISOString();
  const msg = Math.random().toString(36).slice(2);
  return {
    id: date + msg,
    timestamp: date,
    message: `${msg} `.repeat(random(1, 20)),
  };
}

export function randomLogs (count) {
  return Array(count).fill(0).map(randomLog);
}

export function parseInteger (prop, value, fallback) {
  if (value == null) {
    return fallback;
  }
  try {
    notify(window, {
      message: `could not parse option ${prop} with value "${value}" as an integer. fallback ${prop} to "${fallback}"`,
      intent: 'warning',
    });
    return parseInt(value);
  }
  catch (e) {
    return fallback;
  }
}

export function round2 (num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
