import { baseDnsInfo, baseDomains, httpOnlyDomain, longBaseDomains } from '../../stories/fixtures/domains.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-domain-management.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Domains/<cc-domain-management>',
  component: 'cc-domain-management',
};

/**
 * @typedef {import('./cc-domain-management.types.js').DomainStateDeleting} DomainStateDeleting
 * @typedef {import('./cc-domain-management.types.js').DomainStateMarkingPrimary} DomainStateMarkingPrimary
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateLoaded} DomainManagementListStateLoaded
 */

const conf = /** @type {const} */ ({
  component: 'cc-domain-management',
});

export const defaultStory = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains.slice(0, 2), ...baseDomains.slice(-1)],
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithMoreDomains = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithHttpOnlyDomain = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains, httpOnlyDomain],
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithLongDomains = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains, httpOnlyDomain, ...longBaseDomains],
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: [],
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      domainListState: { type: 'loading' },
      dnsInfoState: { type: 'loading' },
    },
  ],
});

export const waitingWithAdding = makeStory(conf, {
  items: [
    {
      domainFormState: {
        type: 'adding',
        hostname: {
          value: 'test.example.com',
        },
        pathPrefix: {
          value: '/api',
        },
      },
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const waitingWithDeleting = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: baseDomains.map((domain, index) => {
          if (index === 4) {
            /** @type {DomainStateDeleting} */
            const domainStateDeleting = {
              ...domain,
              type: 'deleting',
            };
            return domainStateDeleting;
          }
          return domain;
        }),
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const waitingWithMarkingAsPrimary = makeStory(conf, {
  items: [
    {
      domainListState: {
        type: 'loaded',
        domains: baseDomains.map((domain, index) => {
          if (index === 4) {
            /** @type {DomainStateMarkingPrimary} */
            const domainStateMarkingPrimary = {
              ...domain,
              type: 'marking-primary',
            };
            return domainStateMarkingPrimary;
          }
          return domain;
        }),
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      domainListState: { type: 'error' },
      dnsInfoState: { type: 'error' },
    },
  ],
});

export const errorWithEmpty = makeStory(conf, {
  items: [
    {
      domainFormState: {
        type: 'idle',
        hostname: {
          value: '',
          error: { code: 'empty' },
        },
        pathPrefix: {
          value: '',
        },
      },
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const errorWithPathWithinDomain = makeStory(conf, {
  items: [
    {
      domainFormState: {
        type: 'idle',
        hostname: {
          value: 'example.com/example-route',
        },
        pathPrefix: {
          value: '',
        },
      },
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
  onUpdateComplete: (component) => {
    // this is temporary, when we move to Element Internals, the component will expose its form anyway
    component.shadowRoot.querySelector('form').requestSubmit();
  },
});

export const errorWithInvalidDomain = makeStory(conf, {
  items: [
    {
      domainFormState: {
        type: 'idle',
        hostname: {
          value: '[.example.com',
          error: { code: 'invalid-format' },
        },
        pathPrefix: {
          value: '',
        },
      },
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const errorWithInvalidWildcard = makeStory(conf, {
  items: [
    {
      domainFormState: {
        type: 'idle',
        hostname: {
          value: 'toto*.example.com',
          error: { code: 'invalid-wildcard' },
        },
        pathPrefix: {
          value: '',
        },
      },
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const simulationsWithAddingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    {
      delay: 2000,
      callback: ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
        component.dnsInfoState = baseDnsInfo;
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '' },
        };
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '/api' },
        };
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.domainFormState = {
          type: 'adding',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '/api/v2' },
        };
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: '' },
          pathPrefix: { value: '' },
        };
        const domainListStateLoaded = /** @type {DomainManagementListStateLoaded} */ (component.domainListState);
        component.domainListState = {
          ...domainListStateLoaded,
          domains: [
            ...domainListStateLoaded.domains,
            {
              id: 'm53xpmuw4ra',
              type: 'idle',
              hostname: 'example.com/api/v2',
              pathPrefix: '/',
              isWildcard: false,
              isPrimary: false,
            },
          ],
        };
      },
    },
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    {
      delay: 2000,
      callback: ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.dnsInfoState = baseDnsInfo;
      },
    },
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  items: [{}],
  simulations: [
    {
      delay: 2000,
      callback: ([component]) => {
        component.domainListState = { type: 'error' };
      },
    },
    {
      delay: 1000,
      callback: ([component]) => {
        component.dnsInfoState = { type: 'error' };
      },
    },
  ],
});
