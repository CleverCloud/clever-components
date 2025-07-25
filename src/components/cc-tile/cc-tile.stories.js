import { html, render } from 'lit';
import {
  iconRemixFolderCloudLine as iconFtp,
  iconRemixGitRepositoryLine as iconGit,
  iconRemixGithubLine as iconGitHub,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-icon/cc-icon.js';
import './cc-tile.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-tile>',
  component: 'cc-tile',
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
  component: 'cc-tile',
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
      innerHTML: defaultInnerHtml('(disabled)'),
      disabled: true,
    },
    {
      innerHTML: defaultInnerHtml('(selected & disabled)'),
      disabled: true,
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
      disabled: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      disabled: true,
      selected: true,
    },
  ],
});

export const modeCheck = makeStory(conf, {
  items: [
    {
      innerHTML: defaultInnerHtml(),
      mode: 'check',
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'check',
      selected: true,
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'check',
      disabled: true,
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'check',
      disabled: true,
      selected: true,
    },
  ],
});

export const modeCheckWithWithFooter = makeStory(conf, {
  items: [
    {
      innerHTML: withFooterInnerHtml,
      mode: 'check',
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'check',
      selected: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'check',
      disabled: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'check',
      disabled: true,
      selected: true,
    },
  ],
});

export const modeRadio = makeStory(conf, {
  items: [
    {
      innerHTML: defaultInnerHtml(),
      mode: 'radio',
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'radio',
      selected: true,
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'radio',
      disabled: true,
    },
    {
      innerHTML: defaultInnerHtml(),
      mode: 'radio',
      disabled: true,
      selected: true,
    },
  ],
});

export const modeRadioWithWithFooter = makeStory(conf, {
  items: [
    {
      innerHTML: withFooterInnerHtml,
      mode: 'radio',
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'radio',
      selected: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'radio',
      disabled: true,
    },
    {
      innerHTML: withFooterInnerHtml,
      mode: 'radio',
      disabled: true,
      selected: true,
    },
  ],
});

export const mutilineText = makeStory(conf, {
  items: [
    {
      innerHTML: mulitineInnerHtml,
    },
    {
      innerHTML: mulitineInnerHtml,
      mode: 'check',
      selected: true,
    },
    {
      innerHTML: mulitineInnerHtml,
      mode: 'radio',
    },
  ],
});

export const contentHTML = makeStory(conf, {
  dom: (container) => {
    render(
      html`
        <div style="display: flex; column-gap: 1em;">
          <cc-tile>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconGit}"></cc-icon>
              <span>Git</span>
            </div>
          </cc-tile>
          <cc-tile>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconGitHub}"></cc-icon>
              <span>GitHub</span>
            </div>
          </cc-tile>
          <cc-tile>
            <div slot="body" style="display: flex; align-items: center; column-gap: 0.25em;">
              <cc-icon .icon="${iconFtp}"></cc-icon>
              <span>FTP</span>
            </div>
          </cc-tile>
        </div>
      `,
      container,
    );
  },
});
