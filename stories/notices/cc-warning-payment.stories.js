import '../../src/notices/cc-warning-payment.js';
import { makeStory } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 Notices/<cc-warning-payment>',
  component: 'cc-warning-payment',
};

const conf = {
  component: 'cc-warning-payment',
  css: `
    cc-warning-payment {
      margin-bottom: 1rem;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    { mode: 'overview', errors: [{ type: 3, orgaName: 'Secret startup', orgaBillingLink: '/the-page/secret-startup' }] },
  ],
});

export const modeHome = makeStory(conf, {
  items: [
    { mode: 'home', errors: [{ type: 1, orgaName: 'ACME coporation', orgaBillingLink: '/the-page/acme-coporation' }] },
    { mode: 'home', errors: [{ type: 2, orgaName: 'My side project', orgaBillingLink: '/the-page/my-side-project' }] },
    { mode: 'home', errors: [{ type: 3, orgaName: 'Secret startup', orgaBillingLink: '/the-page/secret-startup' }] },
    {
      mode: 'home',
      errors: [
        { type: 1, orgaName: 'ACME coporation', orgaBillingLink: '/the-page/acme-coporation' },
        { type: 2, orgaName: 'My side project', orgaBillingLink: '/the-page/my-side-project' },
        { type: 3, orgaName: 'Secret startup', orgaBillingLink: '/the-page/secret-startup' },
      ],
    },
  ],
});

export const modeOverview = makeStory(conf, {
  items: [
    { mode: 'overview', errors: [{ type: 1, orgaName: 'ACME coporation', orgaBillingLink: '/the-page/acme-coporation' }] },
    { mode: 'overview', errors: [{ type: 2, orgaName: 'My side project', orgaBillingLink: '/the-page/my-side-project' }] },
    { mode: 'overview', errors: [{ type: 3, orgaName: 'Secret startup', orgaBillingLink: '/the-page/secret-startup' }] },
  ],
});

export const modeBilling = makeStory(conf, {
  items: [
    { mode: 'billing', errors: [{ type: 1 }] },
    { mode: 'billing', errors: [{ type: 2 }] },
    { mode: 'billing', errors: [{ type: 3 }] },
  ],
});

enhanceStoriesNames({
  defaultStory,
  modeHome,
  modeOverview,
  modeBilling,
});
