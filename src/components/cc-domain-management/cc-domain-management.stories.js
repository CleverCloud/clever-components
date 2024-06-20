import { randomString } from '../../lib/utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-domain-management.js';

export default {
  tags: ['autodocs'],
  title: '🛠️ Domains/<cc-domain-management>',
  component: 'cc-domain-management',
};

/**
 * @typedef {import('./cc-domain-management.types.js').DomainStateIdle} DomainStateIdle
 * @typedef {import('./cc-domain-management.types.js').DomainStateDeleting} DomainStateDeleting
 * @typedef {import('./cc-domain-management.types.js').DomainStateMarkingPrimary} DomainStateMarkingPrimary
 * @typedef {import('./cc-domain-management.types.js').DomainManagementDnsInfoStateLoaded} DomainManagementDnsInfoStateLoaded
 * @typedef {import('./cc-domain-management.types.js').DomainManagementDnsInfoStateLoading} DomainManagementDnsInfoStateLoading
 * @typedef {import('./cc-domain-management.types.js').DomainManagementDnsInfoStateError} DomainManagementDnsInfoStateError
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateLoaded} DomainManagementListStateLoaded
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateLoading} DomainManagementListStateLoading
 * @typedef {import('./cc-domain-management.types.js').DomainManagementListStateError} DomainManagementListStateError
 * @typedef {import('./cc-domain-management.types.js').DomainManagementFormStateIdle} DomainManagementFormStateIdle
 * @typedef {import('./cc-domain-management.types.js').DomainManagementFormStateAdding} DomainManagementFormStateAdding
 * @typedef {import('./cc-domain-management.js').CcDomainManagement} CcDomainManagement
 */

const conf = {
  component: 'cc-domain-management',
};

const randomDomainName = randomString(7).toLowerCase();

/** @type {DomainStateIdle[]} */
const baseDomains = [
  { type: 'idle', fqdn: 'www.example.com', isPrimary: true },
  { type: 'idle', fqdn: 'example.com', isPrimary: false },
  { type: 'idle', fqdn: 'blog.example.com', isPrimary: false },
  { type: 'idle', fqdn: '*.example.com', isPrimary: false },
  { type: 'idle', fqdn: 'example.com/api', isPrimary: false },
  { type: 'idle', fqdn: 'example.org', isPrimary: false },
  { type: 'idle', fqdn: 'www.example.org/blog', isPrimary: false },
  { type: 'idle', fqdn: 'blog.example.org', isPrimary: false },
  { type: 'idle', fqdn: 'perso.example.org', isPrimary: false },
  { type: 'idle', fqdn: `${randomDomainName}.cleverapps.io`, isPrimary: false },
];

/** @type {DomainStateIdle[]} */
const longBaseDomains = [
  { type: 'idle', fqdn: 'very-very-very-very-very-very-very-very-very-long.example.com', isPrimary: false },
  { type: 'idle', fqdn: 'very-very-very-very-very-very-very-very-very-long.example.com', isPrimary: false },
  { type: 'idle', fqdn: 'very-very-very-very-very-very-very-very-very-long.cleverapps.io', isPrimary: false },
];

/** @type {DomainStateIdle} */
const httpOnlyDomain = { type: 'idle', fqdn: `subdomain.${randomDomainName}.cleverapps.io`, isPrimary: false };

/** @type {DomainManagementDnsInfoStateLoaded} */
const baseDnsInfo = {
  type: 'loaded',
  cnameValue: 'example.com.',
  aValues: [
    '93.184.216.34',
    '93.184.216.34',
    '93.184.216.34',
    '93.184.216.34',
    '93.184.216.34',
    '93.184.216.34',
  ],
};

export const defaultStory = makeStory(conf, {
  items: [{
    /** @type {DomainManagementListStateLoaded} */
    domainListState: {
      type: 'loaded',
      domains: [...baseDomains.slice(0, 2), ...baseDomains.slice(-1)],
    },
    /** @type {DomainManagementDnsInfoStateLoaded} */
    dnsInfoState: baseDnsInfo,
  }],
});

export const dataLoadedWithMoreDomains = makeStory(conf, {
  items: [{
    /** @type {DomainManagementListStateLoaded} */
    domainListState: {
      type: 'loaded',
      domains: baseDomains,
    },
    /** @type {DomainManagementDnsInfoStateLoaded} */
    dnsInfoState: baseDnsInfo,
  }],
});

export const dataLoadedWithHttpOnlyDomain = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: '',
      },
      pathPrefix: {
        value: '',
      },
    },
    /** @type {DomainManagementListStateLoaded} */
    domainListState: {
      type: 'loaded',
      domains: [...baseDomains, httpOnlyDomain],
    },
    /** @type {DomainManagementDnsInfoStateLoaded} */
    dnsInfoState: baseDnsInfo,
  }],
});

export const dataLoadedWithLongDomains = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: '',
      },
      pathPrefix: {
        value: '',
      },
    },
    /** @type {DomainManagementListStateLoaded} */
    domainListState: {
      type: 'loaded',
      domains: [...baseDomains, httpOnlyDomain, ...longBaseDomains],
    },
    /** @type {DomainManagementDnsInfoStateLoaded} */
    dnsInfoState: baseDnsInfo,
  }],
});

export const empty = makeStory(conf, {
  items: [{
    /** @type {DomainManagementListStateLoaded} */
    domainListState: {
      type: 'loaded',
      domains: [],
    },
    /** @type {DomainManagementDnsInfoStateLoaded} */
    dnsInfoState: baseDnsInfo,
  }],
});

export const loading = makeStory(conf, {
  items: [{
    /** @type {DomainManagementListStateLoading} */
    domainListState: { type: 'loading' },
    /** @type {DomainManagementDnsInfoStateLoading} */
    dnsInfoState: { type: 'loading' },
  }],
});

export const waitingWithAdding = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateAdding} */
    domainFormState: {
      type: 'adding',
      domain: {
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
  }],
});

export const waitingWithDeleting = makeStory(conf, {
  items: [{
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
  }],
});

export const waitingWithMarkingAsPrimary = makeStory(conf, {
  items: [{
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
  }],
});

export const error = makeStory(conf, {
  items: [{
    /** @type {DomainManagementListStateError} */
    domainListState: { type: 'error' },
    /** @type {DomainManagementDnsInfoStateError} */
    dnsInfoState: { type: 'error' },
  }],
});

export const errorWithEmpty = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: '',
        error: 'empty',
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
  }],
});

// FIXME: fix this story, we cannot declare this error from here, it has to be done through the submit event
export const errorWithPathWithinDomain = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: 'example.com/example-path',
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
  }],
});

export const errorWithInvalidDomain = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: '[.example.com',
        error: 'invalid-format',
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
  }],
});

export const errorWithInvalidWildcard = makeStory(conf, {
  items: [{
    /** @type {DomainManagementFormStateIdle} */
    domainFormState: {
      type: 'idle',
      domain: {
        value: 'toto*.example.com',
        error: 'invalid-wildcard',
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
  }],
});

export const simulationsWithAddingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
        component.dnsInfoState = baseDnsInfo;
      }),
    storyWait(1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          domain: { value: 'example.com' },
          pathPrefix: { value: '' },
        };
      }),
    storyWait(1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          domain: { value: 'example.com' },
          pathPrefix: { value: '/api' },
        };
      }),
    storyWait(1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'adding',
          domain: { value: 'example.com' },
          pathPrefix: { value: '/api/v2' },
        };
      }),
    storyWait(1000,
      /** @param {(CcDomainManagement & { domainListState: DomainManagementListStateLoaded })[]} components */
      ([component]) => {
        component.domainFormState = {
          type: 'idle',
          domain: { value: '' },
          pathPrefix: { value: '' },
        };
        component.domainListState = {
          ...component.domainListState,
          domains: [
            ...component.domainListState.domains,
            { type: 'idle', isPrimary: false, fqdn: 'example.com/api/v2' },
          ],
        };
      }),
  ],
});

export const simulationsWithLoadingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = {
          type: 'loaded',
          domains: baseDomains,
        };
      }),
    storyWait(1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.dnsInfoState = baseDnsInfo;
      }),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(2000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.domainListState = { type: 'error' };
      }),
    storyWait(1000,
      /** @param {CcDomainManagement[]} components */
      ([component]) => {
        component.dnsInfoState = { type: 'error' };
      }),
  ],
});
