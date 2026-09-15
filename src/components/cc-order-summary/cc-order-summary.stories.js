import { iconRemixReceiptLine } from '../../assets/cc-remix.icons.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-icon/cc-icon.js';
import './cc-order-summary.js';

export default {
  tags: ['autodocs'],
  title: '🚧 Beta/🛠 Creation Tunnel/<cc-order-summary-beta>',
  component: 'cc-order-summary-beta',
};

/**
 * @import { CcIcon } from '../cc-icon/cc-icon.js'
 * @import { ConfigurationItem, OrderSummary, TotalItem } from './cc-order-summary.types.js'
 */

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

/** @returns {CcIcon} */
function createTitleIcon() {
  const titleIcon = /** @type {CcIcon} */ (document.createElement('cc-icon'));
  titleIcon.icon = iconRemixReceiptLine;
  titleIcon.setAttribute('slot', 'title-icon');
  return titleIcon;
}

/** @type {Array<ConfigurationItem>} */
const appBaseConfigDatas = [
  { label: 'Instance count', value: '1' },
  { label: 'Instance size', value: 'XS' },
  { label: 'Zone', value: 'Paris (par)' },
];

/** @type {TotalItem} */
const appBaseTotalDatas = { label: 'Estimated price for 30 days', value: '16.00€' };

/** @type {OrderSummary} */
const appBaseDatas = {
  name: 'Front-end application',
  productName: 'Node.js',
  logo: {
    url: getAssetUrl('/logos/nodejs.svg'),
    alt: 'NodeJS logo',
  },
  configuration: appBaseConfigDatas,
  total: appBaseTotalDatas,
  tags: ['A.I.', 'preprod', '   '],
};
const appInnerHTML = `
  <div slot="detail">Your instance is powered by 1 vCPUs and 1024 MiB of RAM.</div>
  <div slot="detail">The tags related to your zone are <code>for:applications</code>, <code>infra:clever-cloud</code>.</div>
`;

/** @type {OrderSummary} */
const addonBaseDatas = {
  name: 'Customer orders database',
  productName: 'PostgreSQL',
  logo: {
    url: getAssetUrl('/logos/pgsql.svg'),
    alt: 'PostgreSQL logo',
  },
  configuration: [
    { label: 'Plan', value: 'M Medium Space' },
    { label: 'Zone', value: 'Montreal (mtl)' },
    { label: 'Version', value: '15' },
    { label: 'Options', value: 'Kibana, APM, Encryption' },
  ],
  total: { label: 'Estimated price for 30 days', value: '98.00€' },
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

export const wideCard = makeStory(conf, {
  docs: 'Above `30em` of card width, the configuration rows become a label over value grid and the submit button moves next to the total.',
  // The card lays itself out from its own width, so we only need a wider container to get the grid layout.
  // language=CSS
  css: [
    conf.css,
    `
      cc-order-summary-beta {
        max-width: 60em;
      }
    `,
  ].join(''),
  items: [
    {
      orderSummary: {
        ...addonBaseDatas,
      },
      innerHTML: addonInnerHTML,
    },
    {
      orderSummary: {
        ...addonBaseDatas,
        configuration: [
          { label: 'Plan', value: 'M Medium Space' },
          { label: 'Zone', value: 'Montreal (mtl)' },
          { label: 'Options', value: 'Kibana, APM, Encryption, Backups, Logs, Metrics, Migration Tool' },
          { label: 'Version', value: '15' },
        ],
      },
      innerHTML: addonInnerHTML,
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
        configuration: [
          { label: 'Instance count', value: '1' },
          { label: 'Instance size', value: 'XS' },
          { label: 'Zone', value: 'Paris (par)', skeleton: true },
        ],
        total: { ...appBaseTotalDatas, skeletonValueOnly: true },
      },
      innerHTML: appInnerHTML,
    },
  ],
});

export const waitingAndDisabled = makeStory(conf, {
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
  ],
});

export const withAriaLive = makeStory(conf, {
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
        total: { ...appBaseTotalDatas, a11yLive: true },
      },
      innerHTML: appInnerHTML,
    },
  ],
});

export const withStyledTitle = makeStory(conf, {
  docs: 'The title size and color are left to the consumer through `--cc-order-summary-title-font-size` and `--cc-order-summary-title-color`. The `title-icon` slot holds a leading icon.',
  // language=CSS
  css: [
    conf.css,
    `
      cc-order-summary-beta {
        --cc-order-summary-title-color: var(--cc-color-text-primary-strongest);
        --cc-order-summary-title-font-size: 1.5em;
      }
    `,
  ].join(''),
  items: [
    {
      orderSummary: {
        ...appBaseDatas,
      },
      children: () => [createTitleIcon(), appInnerHTML],
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
        logo: { ...appBaseDatas.logo, alt: '' },
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        productName: null,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        total: null,
      },
      innerHTML: appInnerHTML,
    },
    {
      orderSummary: {
        ...appBaseDatas,
        total: null,
        configuration: [],
      },
    },
    {
      orderSummary: {
        ...appBaseDatas,
        name: '',
        productName: null,
        tags: ['  ', '  preprod  '],
        logo: null,
      },
      innerHTML: appInnerHTML,
    },
  ],
});
