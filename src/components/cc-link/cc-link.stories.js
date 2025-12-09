import {
  iconRemixArrowLeftLine as iconGoBack,
  iconRemixInformationFill as iconInfo,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-icon/cc-icon.js';
import './cc-link.js';

const infoSvg = new URL('../../assets/info.svg', import.meta.url);

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
      href: 'https://example.com',
      innerHTML: 'Visit Example',
    },
    {
      href: 'https://example.com',
      innerHTML: 'Visit Example',
      skeleton: true,
    },
  ],
});

export const subtle = makeStory(conf, {
  items: [
    {
      mode: 'subtle',
      href: '/goback',
      innerHTML: 'Back to the list',
      icon: iconGoBack,
    },
    {
      skeleton: true,
      mode: 'subtle',
      href: '/goback',
      innerHTML: 'Back to the list',
      icon: iconGoBack,
    },
  ],
});

export const button = makeStory(conf, {
  displayMode: 'flex-wrap',
  items: [
    {
      mode: 'button',
      href: 'https://example.com',
      innerHTML: 'edit the informations',
    },
    {
      skeleton: true,
      mode: 'button',
      href: 'https://example.com',
      innerHTML: 'edit the informations',
    },
  ],
});

export const buttonWithFullWidth = makeStory(conf, {
  items: [
    {
      mode: 'button',
      href: 'https://example.com',
      innerHTML: 'edit the informations',
    },
    {
      skeleton: true,
      mode: 'button',
      href: 'https://example.com',
      innerHTML: 'edit the informations',
    },
  ],
});

export const downloadLink = makeStory(conf, {
  items: [
    {
      href: '/path/to/invoice.pdf',
      download: 'invoice.pdf',
      innerHTML: '',
    },
    {
      href: '/path/to/invoice.pdf',
      download: 'invoice.pdf',
      innerHTML: 'Download PDF',
    },
    {
      href: '/path/to/invoice.pdf',
      download: 'invoice.pdf',
      innerHTML: 'Download PDF',
      skeleton: true,
    },
    {
      mode: 'button',
      href: '/path/to/config.json',
      download: 'config.json',
      innerHTML: 'Get config',
    },
  ],
});

export const withA11yDesc = makeStory(conf, {
  items: [
    {
      href: 'https://example.com',
      a11yDesc: 'Go to Example website',
      innerHTML: 'Visit Example',
    },
    {
      href: '/dashboard',
      a11yDesc: 'custom a11y desc if needed',
      innerHTML: 'Go to dashboard',
    },
  ],
});

export const withIcon = makeStory(conf, {
  items: [
    {
      href: 'https://example.com',
      a11yDesc: 'Go to Example website',
      icon: iconInfo,
      innerHTML: 'Visit Example',
    },
  ],
});

export const withImage = makeStory(conf, {
  items: [
    {
      href: 'https://example.com',
      a11yDesc: 'Go to Example website',
      image: infoSvg,
      innerHTML: 'Visit Example',
    },
  ],
});

export const withImageAndIcon = makeStory(conf, {
  items: [
    {
      href: 'https://example.com',
      a11yDesc: 'Go to Example website',
      icon: iconInfo,
      image: infoSvg,
      innerHTML: 'Visit Example',
    },
  ],
});

export const internalLink = makeStory(conf, {
  items: [
    {
      href: '/dashboard',
      innerHTML: 'Go to dashboard',
    },
  ],
});

export const withHtmlContent = makeStory(conf, {
  items: [
    {
      href: 'https://example.com',
      innerHTML: 'Visit <strong>Example</strong>',
    },
  ],
});
