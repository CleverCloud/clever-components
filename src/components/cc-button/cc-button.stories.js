import {
  iconRemixCloseLine as iconClose,
  iconRemixErrorWarningFill as iconError,
} from '../../assets/cc-remix.icons.js';
import { allFormControlsStory } from '../../stories/all-form-controls.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import '../cc-notice/cc-notice.js';
import './cc-button.js';

const infoSvg = new URL('../../assets/info.svg', import.meta.url);
const closeSvg = new URL('../../stories/assets/close.svg', import.meta.url);
const warningSvg = new URL('../../stories/assets/warning.svg', import.meta.url);

const baseItems = [
  { innerHTML: 'Simple' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Success', success: true },
  { innerHTML: 'Warning', warning: true },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Button link', link: true },
];

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-button>',
  component: 'cc-button',
};

const conf = {
  component: 'cc-button',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    :host {
      align-items: center;
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
 
 * When \`delay\` is set, \`cc-click\` events are not fired immediately.
 * They are fired after the number of seconds set with \`delay\`.
 * During this \`delay\`, the user is presented a "click to cancel" label.
 * If the user clicks on "click to cancel", the \`cc-click\` event is not fired.
 * If the \`disabled\` mode is set during the delay, the \`cc-click\` event is not fired.
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
  docs: `If the \`disabled\` mode is set during the delay, the \`cc-click\` event is not fired.`,
  items: [{ delay: 3, innerHTML: 'With delay' }, { innerHTML: 'Toggle disabled on other button' }],
  simulations: [
    storyWait(0, ([withDelay, toggle]) => {
      toggle.addEventListener('cc-click', () => {
        withDelay.disabled = !withDelay.disabled;
      });
    }),
  ],
});

export const image = makeStory(conf, {
  docs: `
If you need an image+text button:

* use the default slot for the text
* use the \`image\` attribute to set the URL of the image

Here you can see this combination in various situations:
  `,
  items: [
    { innerHTML: 'Basic', image: warningSvg, primary: true },
    { innerHTML: 'Outlined', image: warningSvg, outlined: true },
    { innerHTML: 'Disabled', image: warningSvg, disabled: true },
    { innerHTML: 'Waiting', image: warningSvg, waiting: true },
    { innerHTML: 'Delay', image: warningSvg, delay: 3 },
    { innerHTML: 'Link', image: warningSvg, link: true },
    { innerHTML: 'Waiting link', image: warningSvg, link: true, waiting: true },
    { innerHTML: 'Skeleton', image: warningSvg, skeleton: true },
    { innerHTML: 'Skeleton link', image: warningSvg, link: true, skeleton: true },
  ],
});

export const icon = makeStory(conf, {
  css: `cc-button { --cc-icon-size: 20px; }`,
  items: [
    { innerHTML: 'Basic', icon: iconError, primary: true },
    { innerHTML: 'Outlined', icon: iconError, outlined: true },
    { innerHTML: 'Disabled', icon: iconError, disabled: true },
    { innerHTML: 'Waiting', icon: iconError, waiting: true },
    { innerHTML: 'Delay', icon: iconError, delay: 3 },
    { innerHTML: 'Link', icon: iconError, link: true },
    { innerHTML: 'Skeleton', icon: iconError, skeleton: true },
  ],
});

export const hideText = makeStory(conf, {
  docs: `
If you need a button with just an image:

* use the default slot for the text, it will not be displayed but will be used for accessibility purposes
* use the \`image\` attribute to set the URL of the image
* add the \`hide-text\` attribute to hide the text
  * The slotted text is used to set \`title\` and \`aria-label\` attributes on the inner \`<button>\`

As you can see here, \`hide-text\` can only be used if there is an \`image\` or an \`icon\`:
  `,
  css: `cc-button { --cc-icon-size: 20px; }`,
  items: [
    { image: closeSvg, innerHTML: 'Close foo', hideText: true },
    { image: infoSvg, innerHTML: 'Info bar', hideText: true },
    { icon: iconError, innerHTML: 'Info bar', hideText: true },
    { innerHTML: 'hide-text but no image', hideText: true },
  ],
});

export const accessibleName = makeStory(conf, {
  css: `
    div {
      margin-top: 2em;
      margin-bottom: 0.5em;
    }
  `,
  dom: (container) => {
    container.innerHTML = `
        <p>The accessible name can be checked by using the accessibility inspector of your browser.</p>
        <p>You may also hover the buttons because we populate the <code>title</code> attribute with the same value.</p>
        
        <div>With <code>a11y-name</code> attribute:</div>
        <cc-button a11y-name="Add to estimation - NodeJS XS" primary>Add to estimation</cc-button>
        <cc-button a11y-name="Remove from estimation - NodeJS XS" danger outlined>Remove from estimation</cc-button>
    `;
  },
});

export const skeleton = makeStory(conf, {
  docs: `You should use the \`skeleton\` mode when you don't know the label of the button yet. If you already know it, you should just use \`disabled\` while you wait for something.`,
  items: baseItems.map((p) => ({ ...p, skeleton: true })),
});

export const circle = makeStory(conf, {
  docs: `
If you need a button with just an image in a circle form:

* use the default slot for the text, it will not be displayed but will be used for accessibility purposes
* use the \`image\` attribute to set the URL of the image
* add the \`hide-text\` attribute to hide the text
  * The slotted text is used to set \`title\` and \`aria-label\` attributes on the inner \`<button>\`
* add the \`circle\` attribute to get the circle form

As you can see here, \`circle\` can only be used if there is an \`image\` or an \`icon\` and in \`hide-text\` :
  `,
  css: `cc-button { --cc-icon-size: 24px; }`,
  items: [
    { image: closeSvg, innerHTML: 'Close foo', hideText: true, circle: true },
    { image: infoSvg, innerHTML: 'Info bar', hideText: true, circle: true },
    { icon: iconClose, innerHTML: 'Close foo', hideText: true, circle: true },
    { innerHTML: 'hide-text but no image', hideText: true, circle: true },
    { image: closeSvg, innerHTML: 'image but no hide-text', circle: true },
  ],
});

export const waitingAndCircle = makeStory(conf, {
  items: [
    { image: closeSvg, innerHTML: 'Close foo', hideText: true, circle: true, waiting: true },
    { image: infoSvg, innerHTML: 'Info bar', hideText: true, circle: true, waiting: true },
  ],
});

export const allFormControls = allFormControlsStory;
