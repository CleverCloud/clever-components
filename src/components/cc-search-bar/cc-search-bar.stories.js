import { html, render } from 'lit';
import {
  iconRemixBook_2Line as iconDocumentation,
  iconRemixBuilding_4Line as iconOrganisations,
  iconRemixGlobalLine as iconOtherResources,
  iconRemixArticleLine as iconPages,
  iconRemixCloudLine as iconResources,
} from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import './cc-search-bar.js';

/** @import { CcSearchBar } from './cc-search-bar.js' */

/** @param {HTMLElement} container */
const getCcSearchBar = (container) => /** @type {CcSearchBar} */ (container.querySelector('cc-search-bar'));

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-search-bar>',
  component: 'cc-search-bar',
};

const conf = {
  component: 'cc-search-bar',
  css: `
    cc-search-bar {
      max-width: 500px;
    }
  `,
};

/** @type {import('./cc-search-bar.types.js').SearchBarSection[]} */
const defaultSections = [
  {
    label: 'Organisations',
    icon: iconOrganisations,
    items: [
      { label: 'ACME BAR', href: '#acme-bar' },
      { label: 'ACME FOO', href: '#acme-foo' },
    ],
  },
  {
    label: 'Quick access pages',
    icon: iconPages,
    items: [
      { label: 'API token', href: '#api-token' },
      { label: 'Labs', href: '#labs' },
    ],
  },
  {
    label: 'Ressources in this organisation',
    icon: iconResources,
    items: [
      { label: 'APM --0307-42dc-af99-b485ecc44536', href: '#apm-1', itemType: 'app' },
      { label: 'fs-matomot-with-posthog', href: '#matomot-1', itemType: 'addon' },
      { label: 'APM - apps-0307-42dc-af99-b485ecc44536', href: '#apm-2', itemType: 'app' },
      {
        label: 'network-groupups_4d65a2d6-0307-af99-b485ecc44536',
        href: '#ng-1',
        itemType: 'network-group',
      },
      {
        label: 'fs-matomot-with-posthog - 9a84bf38-f874-4caf-a8608-f874-4caf-a8608-f874-4caf-a8608',
        href: '#matomot-2',
        itemType: 'app',
      },
      { label: 'test-kube-config', href: '#kube-1', itemType: 'cke' },
      { label: 'test-addon-pulsar', href: '#pulsar-1', itemType: 'addon' },
      { label: 'my-oauth-consumer', href: '#consumer-1', itemType: 'oauth-consumer' },
      { label: 'matomo-addon-provider', href: '#provider-1', itemType: 'addon-provider' },
    ],
  },
  {
    label: 'Ressources in others organisations',
    icon: iconOtherResources,
    items: [
      { label: 'APM --0307-42dc-af99-b485ecc44536', href: '#apm-3', itemType: 'app' },
      { label: 'fs-matomot-with-posthog', href: '#matomot-3', itemType: 'addon' },
      { label: 'APM - apps-0307-42dc-af99-b485ecc44536', href: '#apm-4', itemType: 'app' },
      {
        label: 'network-groupups_4d65a2d6-0307-af99-b485ecc44536',
        href: '#ng-2',
        itemType: 'network-group',
      },
      {
        label:
          'fs-matomot-with-posthog - 9a84bf38-f874-4caf-a8608-f874-4caf-a8608-f874-4caf-a8608-f874-4caf-a860-7d37b0df2a175',
        href: '#matomot-4',
        itemType: 'app',
      },
      { label: 'test-kube-config', href: '#kube-2', itemType: 'cke' },
      { label: 'test-addon-pulsar', href: '#pulsar-2', itemType: 'addon' },
    ],
  },
  {
    label: 'Documentation',
    icon: iconDocumentation,
    items: [
      { label: 'Request the API', href: 'https://www.clever-cloud.com/developers/api/' },
      {
        label: 'Network Groups',
        href: 'https://www.clever-cloud.com/developers/doc/network-groups/',
      },
      { label: 'Operators', href: 'https://www.clever-cloud.com/developers/doc/addons/' },
      {
        label: 'Pulsar policies',
        href: 'https://www.clever-cloud.com/developers/doc/addons/pulsar/',
      },
    ],
  },
];

export const defaultStory = makeStory(conf, {
  docs: `
Shows the populated state with a sample query (\`a\`) so the categorized results are visible: organizations,
quick access pages, resources, and documentation. Each section has its own icon and label, and items can have
an optional badge or external link indicator. With an empty query, see the \`empty\` story.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcSearchBar(container).show()}" primary>Open Search Bar</cc-button>
        <cc-search-bar open value="a" .sections="${defaultSections}"></cc-search-bar>
      `,
      container,
    );
  },
});

export const empty = makeStory(conf, {
  docs: `
Shows the initial state — the search bar is open but no search has been performed yet. The text invites the
user to start searching and lists what can be searched.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcSearchBar(container).show()}" primary>Open Search Bar</cc-button>
        <cc-search-bar open .sections="${[]}"></cc-search-bar>
      `,
      container,
    );
  },
});

export const noResult = makeStory(conf, {
  docs: `
Shows the no-result state — a search has been performed but no item matches. The text invites the user to try
different keywords.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcSearchBar(container).show()}" primary>Open Search Bar</cc-button>
        <cc-search-bar open value="zzzzzz" .sections="${defaultSections}"></cc-search-bar>
      `,
      container,
    );
  },
});

export const withValue = makeStory(conf, {
  docs: `
Shows the search bar with a pre-filled value — items whose label includes the query (case-insensitive) are kept,
empty sections are hidden.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcSearchBar(container).show()}" primary>Open Search Bar</cc-button>
        <cc-search-bar open value="matomot" .sections="${defaultSections}"></cc-search-bar>
      `,
      container,
    );
  },
});

export const withKeywordFilter = makeStory(conf, {
  docs: `
The query supports \`is:<value>\` keyword tokens. Items match a keyword token when it is in their derived
matchers — \`is:<itemType>\` is added automatically for items with an \`itemType\`, and additional matchers can
be provided via the \`matchers\` field. Tokens can be combined: \`is:app apm\` keeps only \`itemType: 'app'\`
items whose label includes \`apm\`.
  `,
  /** @param {HTMLElement} container */
  dom: (container) => {
    render(
      html`
        <cc-button @cc-click="${() => getCcSearchBar(container).show()}" primary>Open Search Bar</cc-button>
        <cc-search-bar open value="is:app apm" .sections="${defaultSections}"></cc-search-bar>
      `,
      container,
    );
  },
});
