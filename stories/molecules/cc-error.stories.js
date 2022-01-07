import '../../src/molecules/cc-error.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

const baseItems = [
  { innerHTML: 'Something went wrong while loading something <strong>really</strong>, really important.' },
  { innerHTML: 'Something went wrong while loading something <strong>really</strong>, really important. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a. Sed volutpat dolor nec rutrum vulputate. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer rhoncus turpis orci, at tempor tortor scelerisque varius. Integer nec fermentum dui. Integer vitae dolor sit amet erat ullamcorper elementum. Donec blandit lacinia erat, vitae blandit libero ornare id. In luctus odio a lacus dignissim, id posuere tortor lacinia. Pellentesque sed massa ac tellus tincidunt rutrum. Praesent commodo enim nibh, ut consectetur tortor consequat non. Aliquam mi enim, mattis eu velit quis, sollicitudin fringilla ex. Donec at augue ultrices, porta justo in, mattis tortor. Nunc sollicitudin nisi eget urna condimentum semper. Pellentesque sagittis quam eu mollis viverra. Proin tincidunt auctor nibh quis suscipit.' },
];

export default {
  title: '🧬 Molecules/<cc-error>',
  component: 'cc-error',
};

const conf = {
  component: 'cc-error',
  css: `
    cc-error {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: baseItems,
});

export const info = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'info' })),
});

export const loading = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'loading' })),
});

export const confirm = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'confirm' })),
});

export const notice = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, notice: true })),
});

export const noticeInfo = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'info', notice: true })),
});

export const noticeLoading = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'loading', notice: true })),
});

export const noticeConfirm = makeStory(conf, {
  items: baseItems.map((p) => ({ ...p, mode: 'confirm', notice: true })),
});

enhanceStoriesNames({
  defaultStory,
  info,
  loading,
  confirm,
  notice,
  noticeInfo,
  noticeConfirm,
});
