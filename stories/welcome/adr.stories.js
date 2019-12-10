import { markdownToDom } from '../lib/markdown.js';
import { storiesOf } from '@storybook/html';

const adrReq = require.context('../../docs', true, /adr.+md$/);

const adrAsStories = storiesOf('0. Welcome|Architecture Decision Records', module)
  .addParameters({
    options: {
      showPanel: false,
    },
  });

// We still use storiesOf() here because we don't want to list all ADRs statically
adrReq.keys().forEach((filename) => {
  const markdownText = adrReq(filename).default;
  const { title, element } = markdownToDom(markdownText);
  adrAsStories.add(title, () => element);
});
