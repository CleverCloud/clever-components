import changelogMd from '../../CHANGELOG.md';
import contributingMd from '../../CONTRIBUTING.md';
import readmeMd from '../../README.md';
import webComponentsMd from '../../WEB-COMPONENTS.md';
import { markdownToDom } from '../lib/markdown.js';

export default {
  title: '0. Welcome|Documentation',
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

export const readme = () => markdownToDom(readmeMd).element;
export const contributing = () => markdownToDom(contributingMd).element;
export const changelog = () => markdownToDom(changelogMd).element;
export const webComponents = () => markdownToDom(webComponentsMd).element;
