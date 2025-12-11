import { baseDnsInfo, baseDomains, httpOnlyDomain, longBaseDomains } from '../../stories/fixtures/domains.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-domain-management.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Domains/<cc-domain-management>',
  component: 'cc-domain-management',
};

/**
 * @import { DomainStateDeleting, DomainStateMarkingPrimary, DomainManagementDnsInfoStateLoaded, DomainManagementDnsInfoStateLoading, DomainManagementDnsInfoStateError, DomainManagementListStateLoaded, DomainManagementListStateLoading, DomainManagementListStateError, DomainManagementFormStateIdle, DomainManagementFormStateAdding } from './cc-domain-management.types.js'
 * @import { CcDomainManagement } from './cc-domain-management.js'
 */

const conf = {
  component: 'cc-domain-management',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains.slice(0, 2), ...baseDomains.slice(-1)],
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithMoreDomains = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithHttpOnlyDomain = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains, httpOnlyDomain],
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const dataLoadedWithLongDomains = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: [...baseDomains, httpOnlyDomain, ...longBaseDomains],
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const empty = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: [],
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoading} */
      domainListState: { type: 'loading' },
      /** @type {DomainManagementDnsInfoStateLoading} */
      dnsInfoState: { type: 'loading' },
    },
  ],
});

export const waitingWithAdding = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementFormStateAdding} */
      domainFormState: {
        type: 'adding',
        hostname: {
          value: 'test.example.com',
        },
        pathPrefix: {
          value: '/api',
        },
      },
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const waitingWithDeleting = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
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
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const waitingWithMarkingAsPrimary = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateLoaded} */
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
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementListStateError} */
      domainListState: { type: 'error' },
      /** @type {DomainManagementDnsInfoStateError} */
      dnsInfoState: { type: 'error' },
    },
  ],
});

export const errorWithEmpty = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementFormStateIdle} */
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
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const errorWithPathWithinDomain = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementFormStateIdle} */
      domainFormState: {
        type: 'idle',
        hostname: {
          value: 'example.com/example-route',
        },
        pathPrefix: {
          value: '',
        },
      },
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
  /** @type {(component: CcDomainManagement) => void} */
  onUpdateComplete: (component) => {
    // this is temporary, when we move to Element Internals, the component will expose its form anyway
    component.shadowRoot.querySelector('form').requestSubmit();
  },
});

export const errorWithInvalidDomain = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementFormStateIdle} */
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
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const errorWithInvalidWildcard = makeStory(conf, {
  items: [
    {
      applicationId: 'app_3f9b1c8e-2d7a-4c4f-91a6-8bde78f4a21b',
      /** @type {DomainManagementFormStateIdle} */
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
      /** @type {DomainManagementListStateLoaded} */
      domainListState: {
        type: 'loaded',
        domains: baseDomains,
      },
      /** @type {DomainManagementDnsInfoStateLoaded} */
      dnsInfoState: baseDnsInfo,
    },
  ],
});

export const simulationsWithAddingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
        component.dnsInfoState = baseDnsInfo;
      },
    ),
    storyWait(
      1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '' },
        };
      },
    ),
    storyWait(
      1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '/api' },
        };
      },
    ),
    storyWait(
      1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'adding',
          hostname: { value: 'example.com' },
          pathPrefix: { value: '/api/v2' },
        };
      },
    ),
    storyWait(
      1000,
      /** @param {(CcDomainManagement & { domainListState: DomainManagementListStateLoaded })[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          hostname: { value: '' },
          pathPrefix: { value: '' },
        };
        component.domainListState = {
          ...component.domainListState,
          domains: [
            ...component.domainListState.domains,
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
    ),
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
      },
    ),
    storyWait(
      1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.dnsInfoState = baseDnsInfo;
      },
    ),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = { type: 'error' };
      },
    ),
    storyWait(
      1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.dnsInfoState = { type: 'error' };
      },
    ),
  ],
});
