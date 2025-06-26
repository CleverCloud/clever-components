import { DateFormatter } from '../../lib/date/date-formatter.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-img-diff-viewer.js';

const FORMATTER_SHORT = new DateFormatter('datetime-short');

export default {
  tags: ['autodocs'],
  title: '🛠 Utility/<cc-img-diff-viewer>',
  component: 'cc-img-diff-viewer',
};

const conf = {
  component: 'cc-img-diff-viewer',
};

/**
 * @typedef {import('./cc-img-diff-viewer.js').CcImgDiffViewer} CcImgDiffViewer
 */

const baseImgSrc = new URL('../../stories/assets/cc-addon-admin-base.png', import.meta.url).href;
const changedImgSrc = new URL('../../stories/assets/cc-addon-admin-changes.png', import.meta.url).href;

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcImgDiffViewer>>} */
  items: [
    {
      baseImgSrc,
      baseImgText: 'cc-addon-admin - baseline - ' + FORMATTER_SHORT.format(new Date('2025-06-24T16:03:00')),
      changedImgSrc,
      changedImgText: 'cc-addon-admin - changes - ' + FORMATTER_SHORT.format(new Date('2025-06-24T16:05:00')),
    },
  ],
});
