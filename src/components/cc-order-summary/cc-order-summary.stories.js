import { makeStory } from '../../stories/lib/make-story.js';
import './cc-order-summary.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Creation Tunnel/<cc-order-summary-beta>',
  component: 'cc-order-summary-beta',
};

const conf = {
  component: 'cc-order-summary-beta',
  // language=CSS
  css: `
    cc-order-summary-beta {
      margin-inline: auto;
      padding-block: 2em;
      width: 100%;
      max-width: 25em;
    }
    cc-order-summary-beta:not(:last-of-type) {
      border-bottom: 1px dotted #EAEAEA;
    }
    cc-order-summary-beta code {
      font-size: 1.25em;
    }
    cc-order-summary-beta ul {
      margin-block: 0;
      padding-inline-start: 1.5em;
      list-style-type: circle;
    }
  `,
};

const appBaseDatas = {
  name: 'Front-end application',
  logo: {
    url: 'https://assets.clever-cloud.com/logos/nodejs.svg',
    alt: 'NodeJS logo',
  },
  configuration: [
    { label: 'Instance count', value: '1' },
    { label: 'Instance size', value: 'XS' },
    { label: 'Zone', value: 'Paris (par)' },
    { label: 'Estimated price for 30 days', value: '16.00€' },
  ],
  tags: ['A.I.', 'preprod', '   '],
};
const appInnerHTML = `
  <div slot="detail">Your instance is powered by 1 vCPUs and 1024 MiB of RAM.</div>
  <div slot="detail">The tags related to your zone are <code>for:applications</code>, <code>infra:clever-cloud</code>.</div>
`;

const addonBaseDatas = {
  name: 'Customer orders database',
  logo: {
    url: 'https://assets.clever-cloud.com/logos/pgsql.svg',
    alt: 'PostgreSQL logo',
  },
  configuration: [
    { label: 'Plan', value: 'M Medium Space' },
    { label: 'Zone', value: 'Montreal (mtl)' },
    { label: 'Version', value: '15' },
    { label: 'Options', value: 'Kibana, APM, Encryption' },
    { label: 'Estimated price for 30 days', value: '98.00€' },
  ],
  tags: ['customer', 'prod'],
};
const addonInnerHTML = `
  <div slot="detail">
    <div>Your plan detailed features are:</div>
    <ul>
      <li>Backups: Daily - 7 Retained</li>
      <li>Logs: Yes</li>
      <li>Max DB size: 5 GB</li>
      <li>Memory: 1 GB</li>
      <li>Metrics: Yes</li>
      <li>Migration Tool: Yes</li>
      <li>Type: Dedicated</li>
      <li>vCPU: 1</li>
      <li>Version: 4.0.3</li>
    </ul>
  </div>
  <div slot="detail">The tags related to your zone are <code>for:applications</code>, <code>infra:ovh</code>.</div>
`;

export const defaultStory = makeStory(conf, {
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...addonBaseDatas,
      },
      innerHTML: addonInnerHTML,
    },
  ],
});

export const loadingModes = makeStory(conf, {
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
        submitStatus: 'waiting',
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        submitStatus: 'disabled',
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        skeleton: true,
      },
      innerHTML: appInnerHTML,
    },
  ],
});

export const missingInfos = makeStory(conf, {
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
        tags: null,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        logo: null,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        tags: null,
        logo: null,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        name: '',
        tags: ['  ', '  preprod  '],
        logo: null,
      },
      innerHTML: appInnerHTML,
    },
  ],
});
