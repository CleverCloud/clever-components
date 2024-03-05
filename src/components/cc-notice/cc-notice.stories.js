import './cc-notice.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-notice>',
  component: 'cc-notice',
};

const conf = {
  component: 'cc-notice',
};

const INTENTS = ['info', 'success', 'warning', 'danger'];
const LONG_HEADING = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
      et dolore magna aliqua. Sed augue lacus viverra vitae congue.`;
const LONG_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
      et dolore magna aliqua. Sed augue lacus viverra vitae congue. Nisl rhoncus mattis rhoncus urna. Sem fringilla 
      ut morbi tincidunt. Tristique senectus et netus et. Nulla pellentesque dignissim enim sit amet venenatis urna. 
      Mattis nunc sed blandit libero. Libero id faucibus nisl tincidunt eget nullam. Iaculis urna id volutpat lacus 
      laoreet non curabitur.`;

const BASE_ITEMS = INTENTS.map((intent) => (
  {
    intent,
    heading: 'This is a title',
    message: `this is a message with ${intent} intent.`,
  }));

export const defaultStory = makeStory(conf, {
  items: BASE_ITEMS,
});

export const customMessage = makeStory(conf, {
  items: BASE_ITEMS.map((item) => ({
    ...item,
    // language=HTML
    innerHTML: `
      <div slot="message" style="display:flex; justify-content: space-between;align-items: center">
        <p style="margin: 0;">My pretty cool custom slotted message.</p>
        <div class="btn-wrapper" style="background-color:#fff;">
          <cc-button outlined>ACTION</cc-button>
        </div>
      </div>
      `,
  })),
});

export const withOtherIcons = makeStory(conf, {
  items: BASE_ITEMS.map((item) => ({
    ...item,
    innerHTML: `
        <div slot="icon"><img src="http://placekitten.com/24/24" alt="placeholder kitten" style="display: block;"></div>
      `,
  })),
});

export const withNoIcons = makeStory(conf, {
  items: BASE_ITEMS.map((item) => ({ ...item, noIcon: true })),
});

export const withNoIconsAndNoHeading = makeStory(conf, {
  items: BASE_ITEMS.map(({ intent, message }) => ({ intent, message, noIcon: true })),
});

export const withNoHeading = makeStory(conf, {
  items: BASE_ITEMS.map(({ intent, message }) => ({ intent, message })),
});

export const withCloseableNotice = makeStory(conf, {
  items: BASE_ITEMS.map((item) => ({ ...item, closeable: true })),
});

export const withCloseableAndNoIcons = makeStory(conf, {
  items: BASE_ITEMS.map((item) => ({ ...item, noIcon: true, closeable: true })),
});

export const withLongTextAndCloseable = makeStory(conf, {
  items: BASE_ITEMS.map(({ intent }) => (
    {
      closeable: true,
      intent,
      heading: LONG_HEADING,
      message: LONG_TEXT,
    }
  )),
});

export const withLongText = makeStory(conf, {
  items: BASE_ITEMS.map(({ intent }) => (
    {
      intent,
      heading: LONG_HEADING,
      message: LONG_TEXT,
    }
  )),
});

export const withLongTextAndNoHeading = makeStory(conf, {
  items: BASE_ITEMS.map(({ intent }) => (
    {
      intent,
      message: LONG_TEXT,
    }
  )),
});
