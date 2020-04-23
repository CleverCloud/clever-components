import '../../src/atoms/cc-button.js';
import notes from '../../.components-docs/cc-button.md';
import closeSvg from '../../src/assets/close.svg';
import infoSvg from '../../src/assets/info.svg';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const baseItems = [
  { innerHTML: 'Simple' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Success', success: true },
  { innerHTML: 'Warning', warning: true },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Button link', link: true },
];

export default {
  title: '🧬 Atoms|<cc-button>',
  component: 'cc-button',
  parameters: { notes },
};

const conf = {
  component: 'cc-button',
  events: ['cc-button:click'],
  css: `
    cc-button {
      margin: 0.5rem;
    }
  `,
};

export const modes = makeStory(conf, {
  items: baseItems,
});

export const outlined = makeStory(conf, {
  docs: `
* A button in \`simple\` mode does not need the \`outlined\` mode.
* In most cases, you should set \`outlined\` mode and keep non \`outlined\` (filled) buttons for primary actions.
`,
  items: baseItems.map((p) => ({ ...p, outlined: true })),
});

export const disabled = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, disabled: true })),
});

export const outlinedAndDisabled = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, outlined: true, disabled: true })),
});

export const waiting = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, waiting: true })),
});

export const waitingAndOutlined = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, outlined: true, waiting: true })),
});

export const delay = makeStory(conf, {
  docs: `
\`<cc-button>\` have a delay mechanism:
 
 * When \`delay\` is set, \`cc-button:click\` events are not fired immediately.
 * They are fired after the number of seconds set with \`delay\`.
 * During this \`delay\`, the user is presented a "click to cancel" label.
 * If the user clicks on "click to cancel", the \`cc-button:click\` event is not fired.
 * If the \`disabled\` mode is set during the delay, the \`cc-button:click\` event is not fired.
  `,
  items: baseItems.map((p) => ({ ...p, delay: 3 })),
});

export const delayZero = makeStory(conf, {
  docs: `If you have several buttons with and without delay, you may want them to have the same width. If you set \`delay=0\`, the button will have the same width as other buttons with delay, but the event will be triggered instantly.`,
  items: baseItems.map((p) => ({ ...p, delay: 0 })),
});

export const delayAndOutlined = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, delay: 3, outlined: true })),
});

export const delayAndDisabled = makeStory(conf, {
  docs: `If the \`disabled\` mode is set during the delay, the \`cc-button:click\` event is not fired.`,
  items: [
    { delay: 3, innerHTML: 'With delay' },
    { innerHTML: 'Toggle disabled on other button' },
  ],
  simulations: [
    storyWait(0, ([withDelay, toggle]) => {
      toggle.addEventListener('cc-button:click', () => {
        withDelay.disabled = !withDelay.disabled;
      });
    }),
  ],
});

export const image = makeStory(conf, {
  docs: `If you need a simple image button, use the \`src\` attribute to set the URL of an image and don't use the slot.`,
  items: [
    { image: closeSvg },
    { image: infoSvg },
  ],
});

export const skeleton = makeStory(conf, {
  docs: `You should use the \`skeleton\` mode when you don't know the label of the button yet. If you already know it, you should just use \`disabled\` while you wait for something.`,
  items: baseItems.map((p) => ({ ...p, skeleton: true })),
});

enhanceStoriesNames({
  modes,
  outlined,
  disabled,
  outlinedAndDisabled,
  waiting,
  waitingAndOutlined,
  delay,
  delayZero,
  delayAndOutlined,
  delayAndDisabled,
  image,
  skeleton,
});
