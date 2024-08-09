// Don't forget to import the component you're presenting!
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ct-plan-item.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-plan-item>',
  // This component name is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-ct-plan-item',
};

const conf = {
  component: 'cc-ct-plan-item',
  // You may need to add some CSS just for your stories.
  // language=CSS
  css: `cc-ct-plan-item {
  }`,
};

const DEFAULT_ITEMS = [
  {
    id: 'dev',
    name: 'Free tier',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: 'Shared',
          computable_value: '0',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: 'Shared',
          computable_value: '0',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'xxs',
    name: 'XXS',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '512 MB',
          computable_value: '536870912',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '1',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'xs',
    name: 'XS',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '1 GB',
          computable_value: '1073741824',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '1',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 's',
    name: 'S',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '2 GB',
          computable_value: '2147483648',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '2',
          computable_value: '2',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'm',
    name: 'M',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '4 GB',
          computable_value: '4294967296',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '4',
          computable_value: '4',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'l',
    name: 'L',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '8 GB',
          computable_value: '8589934592',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '6',
          computable_value: '6',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'xl',
    name: 'XL',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '16 GB',
          computable_value: '17179869184',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '8',
          computable_value: '8',
          name_code: 'cpu',
        },
      },
    ],
  },
  {
    id: 'xxl',
    name: 'XXL',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '32 GB',
          computable_value: '34359738368',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '10',
          computable_value: '10',
          name_code: 'cpu',
        },
      },
    ],
  },
];

const DEFAULT_REDIS = [
  {
    id: 's_mono',
    name: 'S',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '1 vCPU',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '128MB',
          computable_value: '134217728',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '1',
          computable_value: '1',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '100',
          computable_value: '100',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'm_mono',
    name: 'M',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '1 vCPU',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '256MB',
          computable_value: '268435456',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '5',
          computable_value: '5',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '250',
          computable_value: '250',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'l_mono',
    name: 'L',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '1 vCPU',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '512MB',
          computable_value: '536870912',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '10',
          computable_value: '10',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '500',
          computable_value: '500',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'xl_mono',
    name: 'XL',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '1 vCPU',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '1GB',
          computable_value: '1073741824',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '10',
          computable_value: '10',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '500',
          computable_value: '500',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'xxl_mono',
    name: '2XL',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '2 vCPUs',
          computable_value: '2',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '2.5GB',
          computable_value: '2684354560.0',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '10',
          computable_value: '10',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '750',
          computable_value: '750',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'xxxl_mono',
    name: '3XL',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '4 vCPUs',
          computable_value: '4',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '5120MB',
          computable_value: '5368709120',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '20',
          computable_value: '20',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '1000',
          computable_value: '1000',
          name_code: 'connection-limit',
        },
      },
    ],
  },
  {
    id: 'xxxxl_mono',
    name: '4XL',
    details: [
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'CPU',
          type: 'NUMBER',
          value: '6 vCPUs',
          computable_value: '6',
          name_code: 'cpu',
        },
      },
      {
        code: 'max-db-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Size',
          type: 'BYTES',
          value: '10GB',
          computable_value: '10737418240',
          name_code: 'max-db-size',
        },
      },
      {
        code: 'databases',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 9.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5zm-18 5c0 2.485 4.03 4.5 9 4.5s9-2.015 9-4.5v3c0 2.485-4.03 4.5-9 4.5s-9-2.015-9-4.5v-3zm9-2.5c-4.97 0-9-2.015-9-4.5S7.03 3 12 3s9 2.015 9 4.5-4.03 4.5-9 4.5z"/></svg>',
        },
        data: {
          name: 'Databases',
          type: 'NUMBER',
          value: '20',
          computable_value: '20',
          name_code: 'databases',
        },
      },
      {
        code: 'connection-limit',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13a6 6 0 100-12 6 6 0 000 12zm3 5a3 3 0 014.293-2.708l-4 4.001A2.988 2.988 0 0115 18zm1.707 2.708l4-4.001a3 3 0 01-4.001 4.001zM18 13a5 5 0 100 10 5 5 0 000-10zm-6 1c.084 0 .168.001.252.004A6.968 6.968 0 0011 18c0 1.487.464 2.866 1.255 4H4a8 8 0 018-8z"/></svg>',
        },
        data: {
          name: 'Connection limit',
          type: 'NUMBER',
          value: '1500',
          computable_value: '1500',
          name_code: 'connection-limit',
        },
      },
    ],
  },
];

const DEFAULT_JENKINS = [
  {
    id: 'XS',
    name: 'XS',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '1 GB',
          computable_value: '1073741824',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '1',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Disk',
          type: 'BYTES',
          value: '5 GB',
          computable_value: '5368709120',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'S',
    name: 'S',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '2 GB',
          computable_value: '2147483648',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '1',
          computable_value: '1',
          name_code: 'cpu',
        },
      },
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Disk',
          type: 'BYTES',
          value: '10 GB',
          computable_value: '10737418240',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'M',
    name: 'M',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '4 GB',
          computable_value: '4294967296',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '2',
          computable_value: '2',
          name_code: 'cpu',
        },
      },
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Disk',
          type: 'BYTES',
          value: '20 GB',
          computable_value: '21474836480',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'L',
    name: 'L',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '8 GB',
          computable_value: '8589934592',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '4',
          computable_value: '4',
          name_code: 'cpu',
        },
      },
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Disk',
          type: 'BYTES',
          value: '40 GB',
          computable_value: '42949672960',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'XL',
    name: 'XL',
    details: [
      {
        code: 'memory',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h20a1 1 0 011 1v9a1 1 0 01-1 1v2a1 1 0 01-1 1h-7.414l-1-1h-1.172l-1 1H3a1 1 0 01-1-1v-2a1 1 0 01-1-1V6a1 1 0 011-1zm2 11v1h5.586l1-1H4zm9.414 0l1 1H20v-1h-6.586zM7 9H5v3h2V9zm2 0v3h2V9H9zm6 0h-2v3h2V9zm2 0v3h2V9h-2z"/></svg>',
        },
        data: {
          name: 'Memory',
          type: 'BYTES',
          value: '16 GB',
          computable_value: '17179869184',
          name_code: 'memory',
        },
      },
      {
        code: 'cpu',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 18h12V6H6v12zm8 2h-4v2H8v-2H5a1 1 0 01-1-1v-3H2v-2h2v-4H2V8h2V5a1 1 0 011-1h3V2h2v2h4V2h2v2h3a1 1 0 011 1v3h2v2h-2v4h2v2h-2v3a1 1 0 01-1 1h-3v2h-2v-2zM8 8h8v8H8V8z"/></svg>',
        },
        data: {
          name: 'vCPUS',
          type: 'NUMBER',
          value: '8',
          computable_value: '8',
          name_code: 'cpu',
        },
      },
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Disk',
          type: 'BYTES',
          value: '80 GB',
          computable_value: '85899345920',
          name_code: 'disk-size',
        },
      },
    ],
  },
];

const DEFAULT_MAILPACE = [
  {
    id: 'clever_solo',
    name: 'Solo',
    details: [],
  },
  {
    id: 'clever_scaling_10',
    name: 'Scaling 10k',
    details: [],
  },
  {
    id: 'clever_scaling_20',
    name: 'Scaling 20k',
    details: [],
  },
  {
    id: 'clever_scaling_30',
    name: 'Scaling 30k',
    details: [],
  },
  {
    id: 'clever_scaling_40',
    name: 'Scaling 40k',
    details: [],
  },
  {
    id: 'clever_scaling_50',
    name: 'Scaling 50k',
    details: [],
  },
  {
    id: 'clever_scaling_70',
    name: 'Scaling 70k',
    details: [],
  },
  {
    id: 'clever_scaling_100',
    name: 'Scaling 100k',
    details: [],
  },
];

export const defaultStory = makeStory(conf, {
  items: DEFAULT_ITEMS,
});

export const redis = makeStory(conf, {
  items: DEFAULT_REDIS,
});

export const jenkins = makeStory(conf, {
  items: DEFAULT_JENKINS,
});

export const mailpace = makeStory(conf, {
  items: DEFAULT_MAILPACE,
});

// If your component contains remote data,
// don't forget the case where you have loading errors.
// If you have other kind of errors (ex: saving errors...).
// You need to name your stories with the `errorWith` prefix.
export const error = makeStory(conf, {
  items: [{ error: true }],
});

// If your component contains remote data,
// try to present all the possible data combination.
// You need to name your stories with the `dataLoadedWith` prefix.
// Don't forget edge cases (ex: small/huge strings, small/huge lists...).
export const dataLoadedWithFoo = makeStory(conf, {
  items: [{ one: 'Foo', three: [{ foo: 42 }] }],
});

// If your component can trigger updates/deletes remote data,
// don't forget the case where the user's waiting for an operation to complete.
export const waiting = makeStory(conf, {
  items: [{ one: 'Foo', three: [{ foo: 42 }], waiting: true }],
});

// If your component contains remote data,
// it will have several state transitions (ex: loading => error, loading => loaded, loaded => saving...).
// When transitioning from one state to another, we try to prevent the display from "jumping" or "blinking" too much.
// Using "simulations", you can simulate several steps in time to present how your component behaves when it goes through different states.
export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.three = [{ foo: 42 }];
      componentError.error = true;
    }),
    storyWait(1000, ([component]) => {
      component.three = [{ foo: 42 }, { foo: 43 }];
    }),
  ],
});
