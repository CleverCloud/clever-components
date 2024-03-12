import './cc-domain-management.js';
import { makeStory } from '../../stories/lib/make-story.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-domain-management>',
  component: 'cc-domain-management',
};

const conf = {
  component: 'cc-domain-management',
};

export const defaultStory = makeStory(conf, {
  items: [{
    state: {
      type: 'loaded',
      domains: [
        { name: 'clever-cloud.com', dnsKO: true, primary: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
        { name: 'clever-cloud.com', dnsKO: true, tlsKO: true },
        { name: 'blog.clever-cloud.com', dnsKO: false, tlsKO: false },
        { name: 'www.clever-cloud.com', dnsKO: false, tlsKO: true },
        { name: 'toto.clever-cloud.com', dnsKO: true, tlsKO: false },
        { name: 'clever-cloud.com/api', dnsKO: false, tlsKO: false },
      ],
    },
  }],
});
