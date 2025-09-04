import { html, render } from 'lit';
import {
  iconRemixFolderCloudLine as iconFtp,
  iconRemixGitRepositoryLine as iconGit,
  iconRemixGithubLine as iconGitHub,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-icon/cc-icon.js';
import './cc-picker-option.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-picker-option>',
  component: 'cc-picker-option',
};

const defaultInnerHtml = (state = '') => `
  <div slot="body">A simple interactive tile ${state}</div>
`;
const withFooterInnerHtml = `
  <div slot="body">The tile's body...</div>
  <div slot="footer">... and its footer</div>
`;
const mulitineInnerHtml = `
  <div slot="body">
    A content displayed...
    <br>
    ...on two lines.
  </div>
`;

const conf = {
  component: 'cc-picker-option',
  displayMode: 'flex-wrap',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      innerHTML: defaultInnerHtml(),
    },
    {
      innerHTML: defaultInnerHtml('(selected)'),
      selected: true,
    },
    {
      innerHTML: defaultInnerHtml('(readonly)'),
      readonly: true,
    },
    {
      innerHTML: defaultInnerHtml('(disabled)'),
      disabled: true,
    },
    {
      innerHTML: defaultInnerHtml('(selected & disabled)'),
      disabled: true,
      selected: true,
    },
    {
      innerHTML: defaultInnerHtml('(error)'),
      error: true,
    },
    {
      innerHTML: defaultInnerHtml('(selected & error)'),
      error: true,
      selected: true,
    },
  ],
});

export const defaultWithWithFooter = makeStory(conf, {
  items: [
    {
      innerHTML: withFooterInnerHtml,
    },
    {
      innerHTML: withFooterInnerHtml,
      selected: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      readonly: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      disabled: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      disabled: true,
      selected: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      error: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      error: true,
      selected: true,
    },
  ],
});

export const radioSelectionStyle = makeStory(conf, {
  items: [
    {
      innerHTML: defaultInnerHtml(),
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      selected: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      readonly: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      disabled: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      disabled: true,
      selected: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      error: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      error: true,
      selected: true,
      selectionStyle: 'radio',
    },
  ],
});

export const radioSelectionStyleWithWithFooter = makeStory(conf, {
  items: [
    {
      innerHTML: withFooterInnerHtml,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      selected: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      readonly: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      disabled: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      disabled: true,
      selected: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      error: true,
      selectionStyle: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      error: true,
      selected: true,
      selectionStyle: 'radio',
    },
  ],
});

export const mutilineText = makeStory(conf, {
  items: [
    {
      innerHTML: mulitineInnerHtml,
      selected: true,
    },
    {
      innerHTML: mulitineInnerHtml,
      selected: true,
      selectionStyle: 'radio',
    },
  ],
});

export const contentHTML = makeStory(conf, {
  dom: (container) => {
    render(
      html`
        <div style="display: flex; column-gap: 1em;">
          <cc-picker-option>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconGit}"></cc-icon>
              <span>Git</span>
            </div>
          </cc-picker-option>
          <cc-picker-option>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconGitHub}"></cc-icon>
              <span>GitHub</span>
            </div>
          </cc-picker-option>
          <cc-picker-option>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconFtp}"></cc-icon>
              <span>FTP</span>
            </div>
          </cc-picker-option>
        </div>
      `,
      container,
    );
  },
});
