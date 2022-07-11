import { execSync } from 'child_process';

const BROWSER_NAMES = ['Mozilla Firefox', 'Chromium'];

const raw = execSync('wmctrl -l', { encoding: 'utf8' });
const windowList = raw.trim().split('\n');

const WINDOW_REGEX = /^([^ ]+) +(.+?) (.*)$/;

function getWindow (windowString) {
  const [, id, desktop, title] = windowString.match(WINDOW_REGEX) ?? [];
  return { id, desktop, title };
}

const browsers = windowList
  .map((w) => getWindow(w))
  .filter((w) => w.desktop === '0')
  .filter((w) => w.title.includes('@Storyblon'));

console.log(browsers);

function moveWindow (window, x, y, w, h) {
  execSync(`wmctrl -i -r ${window.id} -b remove,maximized_vert`);
  execSync(`wmctrl -i -r ${window.id} -b remove,maximized_horz`);
  execSync(`wmctrl -i -r ${window.id} -e 0,${x},${y},${w},${h}`);
}

const width = 650;
const height = 1050;
moveWindow(browsers[0], 0 + (width - 20) * 0, 30, width, height);
moveWindow(browsers[1], 0 + (width - 20) * 1, 30 + 3, width, height - 3);
moveWindow(browsers[2], 0 + (width - 20) * 2, 30 + 38, width, height - 38);

// const width = 1900;
// const height = 370;
// moveWindow(browsers[0], 0, 20 + (height - 30) * 0, width, height);
// moveWindow(browsers[1], 0, 20 + (height - 30) * 1, width, height);
// moveWindow(browsers[2], 0, 20 + (height - 30) * 2, width, height);
