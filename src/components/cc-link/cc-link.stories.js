import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import './cc-link.js';
import '../cc-icon/cc-icon.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { html, render } from 'lit';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-link>',
  component: 'cc-link',
};

const conf = {
  component: 'cc-link',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      href: 'https://www.clever-cloud.com',
      innerHTML: 'Visit Clever Cloud',
    },
  ],
});

export const withA11yDesc = makeStory(conf, {
  items: [
    {
      href: 'https://www.clever-cloud.com',
      a11yDesc: 'Go to Clever Cloud website',
      innerHTML: 'Visit Clever Cloud',
    },
  ],
});

export const withGap = makeStory(conf, {
  dom: (container) => {
    render(
      html`
        <cc-link href="https://www.clever-cloud.com">
          <cc-icon .icon="${iconInfo}"></cc-icon>Go to Clever Cloud website
        </cc-link>
      `,
      container,
    );
  },
});

export const internalLink = makeStory(conf, {
  items: [
    {
      href: '/dashboard',
      innerHTML: 'Go to dashboard',
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      href: 'https://www.clever-cloud.com',
      skeleton: true,
      innerHTML: 'Loading link...',
    },
  ],
});

export const withHtmlContent = makeStory(conf, {
  items: [
    {
      href: 'https://www.clever-cloud.com',
      innerHTML: 'Visit <strong>Clever Cloud</strong>',
    },
  ],
});
