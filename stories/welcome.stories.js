import changelog from '../CHANGELOG.md';
import contributing from '../CONTRIBUTING.md';
import marked from 'marked';
import readme from '../README.md';
import webComponents from '../WEB-COMPONENTS.md';
import { storiesOf } from '@storybook/html';

storiesOf('0. Welcome|Documentation', module)
  .add('Readme', () => marked(readme))
  .add('Contributing', () => marked(contributing))
  .add('Changelog', () => marked(changelog))
  .add('Web Components', () => marked(webComponents));
