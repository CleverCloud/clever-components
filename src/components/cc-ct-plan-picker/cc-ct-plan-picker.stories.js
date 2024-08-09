// Don't forget to import the component you're presenting!
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-ct-plan-picker.js';

export default {
  // this makes storybook generate a doc from the custom elements manifest
  tags: ['autodocs'],
  title: '🛠 Creation Tunnel/<cc-ct-plan-picker>',
  // This component name is used by Storybook's docs page for the API table.
  // It will use `custom-elements.json` documentation file.
  // Run `npm run components:docs-json` to generate this JSON file.
  component: 'cc-ct-plan-picker',
};

const conf = {
  component: 'cc-ct-plan-picker',
  // You may need to add some CSS just for your stories.
  // language=CSS
  css: `cc-ct-plan-picker {
  }`,
};

const DEFAULT_DB_PLAN = [
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
    relatedPlans: [],
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
    relatedPlans: [
      [
        {
          id: 'xxs_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '1 GB',
                computable_value: '1073741824',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xxs_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '2 GB',
                computable_value: '2147483648',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xxs_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '3 GB',
                computable_value: '3221225472',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
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
    relatedPlans: [
      [
        {
          id: 'xs_tny',
          name: 'Tiny Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '2 GB',
                computable_value: '2147483648',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xs_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '5 GB',
                computable_value: '5368709120',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xs_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '10 GB',
                computable_value: '10737418240',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xs_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '15 GB',
                computable_value: '16106127360',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
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
    relatedPlans: [
      [
        {
          id: 's_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '10 GB',
                computable_value: '10737418240',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 's_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '15 GB',
                computable_value: '16106127360',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 's_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '20 GB',
                computable_value: '21474836480',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 's_hug',
          name: 'Huge Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '50 GB',
                computable_value: '53687091200',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
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
    relatedPlans: [
      [
        {
          id: 'm_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '20 GB',
                computable_value: '21474836480',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'm_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '40 GB',
                computable_value: '42949672960',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'm_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '80 GB',
                computable_value: '85899345920',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
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
    relatedPlans: [
      {
        id: 'l_sml',
        name: 'Small Space',
        details: [
          {
            code: 'disk-size',
            icon: {
              content:
                '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
            },
            data: {
              name: 'Max DB size',
              type: 'BYTES',
              value: '40 GB',
              computable_value: '42949672960',
              name_code: 'disk-size',
            },
          },
        ],
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
    relatedPlans: [
      [
        {
          id: 'xl_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '80 GB',
                computable_value: '85899345920',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xl_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '160 GB',
                computable_value: '171798691840',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xl_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '320 GB',
                computable_value: '343597383680',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xl_hug',
          name: 'Huge Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '480 GB',
                computable_value: '515396075520',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xl_gnt',
          name: 'Giant Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '640 GB',
                computable_value: '687194767360',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
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
    relatedPlans: [
      [
        {
          id: 'xxl_sml',
          name: 'Small Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '160 GB',
                computable_value: '171798691840',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xxl_med',
          name: 'Medium Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '320 GB',
                computable_value: '343597383680',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xxl_big',
          name: 'Big Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '640 GB',
                computable_value: '687194767360',
                name_code: 'disk-size',
              },
            },
          ],
        },
        {
          id: 'xxl_hug',
          name: 'Huge Space',
          details: [
            {
              code: 'disk-size',
              icon: {
                content:
                  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
              },
              data: {
                name: 'Max DB size',
                type: 'BYTES',
                value: '960 GB',
                computable_value: '1030792151040',
                name_code: 'disk-size',
              },
            },
          ],
        },
      ],
    ],
  },
];

const DEFAULT_DB_RELATED_PLAN = [
  {
    id: 'xs_tny',
    name: 'Tiny Space',
    details: [
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Max DB size',
          type: 'BYTES',
          value: '2 GB',
          computable_value: '2147483648',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'xs_sml',
    name: 'Small Space',
    details: [
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Max DB size',
          type: 'BYTES',
          value: '5 GB',
          computable_value: '5368709120',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'xs_med',
    name: 'Medium Space',
    details: [
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Max DB size',
          type: 'BYTES',
          value: '10 GB',
          computable_value: '10737418240',
          name_code: 'disk-size',
        },
      },
    ],
  },
  {
    id: 'xs_big',
    name: 'Big Space',
    details: [
      {
        code: 'disk-size',
        icon: {
          content:
            '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3v18a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1h16a1 1 0 011 1zM5 16v4h14v-4H5zm10 1h2v2h-2v-2z"/></svg>',
        },
        data: {
          name: 'Max DB size',
          type: 'BYTES',
          value: '15 GB',
          computable_value: '16106127360',
          name_code: 'disk-size',
        },
      },
    ],
  },
];

// The first story in the file will appear before the API table in Storybook's docs page.
// We call it the "default story" and it's used as the main presentation of your component.
// You can set several instances/items to show different situations
// but no need to get exhaustive or too detailed ;-)
export const defaultStory = makeStory(conf, {
  items: [
    {
      plans: DEFAULT_DB_PLAN,
      relatedPlans: DEFAULT_DB_RELATED_PLAN,
    },
  ],
});

// If your component contains remote data,
// you'll need a "skeleton screen" while the user's waiting for the data.
export const skeleton = makeStory(conf, {
  items: [{}],
});

// If your component contains remote data,
// don't forget the case where there is no data (ex: empty lists...).
export const empty = makeStory(conf, {
  items: [{ three: [] }],
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
