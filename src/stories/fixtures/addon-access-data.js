/**
 * @typedef {import('../../components/cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredential} AddonCredential
 * @typedef {import('../../components/cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialCode} AddonCredentialCode
 * @typedef {import('../../components/cc-addon-credentials-content/cc-addon-credentials-content.types.js').AddonCredentialNg} AddonCredentialNg
 */

/**
 * Helper to filter items from the base fixture based on their codes.
 * Returns credentials matching the provided codes.
 * @param {Array<AddonCredentialCode|AddonCredentialNg['code']>} codes - The credential codes to filter by
 * @returns {AddonCredential[]} The filtered credentials matching the input codes
 */
export function getFilteredAddonCredentials(codes) {
  return BASE_ADDON_ACCESS_ITEMS.filter((credential) => codes.includes(credential.code));
};

/** @type {Array<AddonCredential>} */
export const BASE_ADDON_ACCESS_ITEMS = [
  {
    code: 'user',
    value: 'toto',
  },
  {
    code: 'password',
    value: 'my-secret-password',
  },
  {
    code: 'api-client-user',
    value: 'api-client-toto',
  },
  {
    code: 'api-client-secret',
    value: 'api-client-secret-value',
  },
  {
    code: 'api-url',
    value: 'https://api.example.com',
  },
  {
    code: 'api-key',
    value: 'api-key-value',
  },
  {
    code: 'api-password',
    value: 'api-password-value',
  },
  {
    code: 'initial-password',
    value: 'initial-password-value',
  },
  {
    code: 'host',
    value: 'example.com',
  },
  {
    code: 'port',
    value: '5432',
  },
  {
    code: 'token',
    value: 'token-value',
  },
  {
    code: 'direct-host',
    value: 'direct.example.com',
  },
  {
    code: 'direct-port',
    value: '6543',
  },
  {
    code: 'direct-uri',
    value: 'direct://example.com:6543',
  },
  {
    code: 'database-name',
    value: 'my-database',
  },
  {
    code: 'cluster-full-name',
    value: 'cluster-full-name-value',
  },
  {
    code: 'uri',
    value: 'postgres://user:pass@example.com:5432/my-database',
  },
  {
    code: 'tenant',
    value: 'tenant-value',
  },
  {
    code: 'api-server-url',
    value: 'https://vgcytprqneuv-ui-otoroshi.example.com',
  },
  {
    code: 'download-kubeconfig',
    value: 'https://example.com/fake-file.txt',
  },
  {
    code: 'ng',
    value: {
      status: 'disabled',
    },
  },
];
