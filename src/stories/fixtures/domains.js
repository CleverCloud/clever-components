import { randomString } from '../../lib/utils.js';

/**
 * @import { DomainStateIdle, DomainManagementDnsInfoStateLoaded } from '../../components/cc-domain-management/cc-domain-management.types.js'
 */

export const randomDomainName = randomString(5).toLowerCase();

/** @type {DomainStateIdle[]} */
export const baseDomains = [
  { type: 'idle', id: 'r51xpmaw1ra', hostname: 'www.example.com', pathPrefix: '/', isWildcard: false, isPrimary: true },
  { type: 'idle', id: 'q6h54peg23f', hostname: 'example.com', pathPrefix: '/', isWildcard: false, isPrimary: false },
  { type: 'idle', id: 'nzy6tm7z2ep', hostname: 'blog.example.com', pathPrefix: '/', isWildcard: false, isPrimary: false },
  { type: 'idle', id: 'kunhycl66k8', hostname: 'example.com', pathPrefix: '/', isWildcard: true, isPrimary: false },
  { type: 'idle', id: 'v4xhvg869mi', hostname: 'example.com', pathPrefix: '/api', isWildcard: false, isPrimary: false },
  { type: 'idle', id: '2yzrgtjfego', hostname: 'example.org', pathPrefix: '/', isWildcard: false, isPrimary: false },
  { type: 'idle', id: '5013jfpxoiw', hostname: 'www.example.org', pathPrefix: '/blog', isWildcard: false, isPrimary: false },
  { type: 'idle', id: '1c0nn0rr6bc', hostname: 'blog.example.org', pathPrefix: '/', isWildcard: false, isPrimary: false },
  { type: 'idle', id: 'ppoite5krzc', hostname: 'perso.example.org', pathPrefix: '/', isWildcard: false, isPrimary: false },
  { type: 'idle', id: '6zf47vbo1pj', hostname: `app-${randomDomainName}.cleverapps.io`, pathPrefix: '/', isWildcard: false, isPrimary: false },
];

/** @type {DomainStateIdle[]} */
export const longBaseDomains = [
  {
    type: 'idle',
    id: '3lmu7pyitz5',
    hostname: 'very-very-very-very-very-very-very-very-very-long.example.com',
    pathPrefix: '/',
    isWildcard: false,
    isPrimary: false,
  },
  {
    type: 'idle',
    id: '4534rl5l9nn',
    hostname: 'very-very-very-very-very-very-very-very-very-long.example.com',
    pathPrefix: '/',
    isWildcard: false,
    isPrimary: false,
  },
  {
    type: 'idle',
    id: '5pqikcys2dk',
    hostname: 'very-very-very-very-very-very-very-very-very-long.cleverapps.io',
    pathPrefix: '/',
    isWildcard: false,
    isPrimary: false,
  },
];

/** @type {DomainStateIdle} */
export const httpOnlyDomain = {
  type: 'idle',
  id: 'dm0wy7xnpyo',
  hostname: `subdomain.app-${randomDomainName}.cleverapps.io`,
  pathPrefix: '/',
  isWildcard: false,
  isPrimary: false,
};


/** @type {DomainManagementDnsInfoStateLoaded} */
export const baseDnsInfo = {
  type: 'loaded',
  cnameRecord: 'example.com.',
  aRecords: ['93.184.216.34', '93.184.216.34', '93.184.216.34', '93.184.216.34', '93.184.216.34', '93.184.216.34'],
};

