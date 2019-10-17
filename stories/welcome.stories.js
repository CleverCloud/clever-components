import changelog from '../CHANGELOG.md';
import contributing from '../CONTRIBUTING.md';
import readme from '../README.md';
import webComponents from '../WEB-COMPONENTS.md';
import { markdownToDom } from './lib/markdown.js';
import { storiesOf } from '@storybook/html';

const adrReq = require.context('../docs', true, /adr.+md$/);

storiesOf('0. Welcome|Documentation', module)
  .add('Readme', () => markdownToDom(readme).element)
  .add('Contributing', () => markdownToDom(contributing).element)
  .add('Changelog', () => markdownToDom(changelog).element)
  .add('Web Components', () => markdownToDom(webComponents).element);

const adrAsStories = storiesOf('0. Welcome|Architecture Decision Records', module);

adrReq.keys().forEach(filename => {
  const markdownText = adrReq(filename).default;
  const { title, element } = markdownToDom(markdownText);
  adrAsStories.add(title, () => element);
});
