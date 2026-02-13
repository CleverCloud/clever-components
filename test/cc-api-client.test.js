import { expect } from '@bundled-es-modules/chai';
import { getCcApiClientWithOAuth, getCcApiClientWithToken } from '../src/lib/cc-api-client.js';

/**
 * Creates a mock API configuration object for testing.
 * @returns {object} A mock API configuration
 */
function createMockApiConfig() {
  return {
    API_HOST: 'https://api.example.com',
    API_OAUTH_TOKEN: 'token123',
    API_OAUTH_TOKEN_SECRET: 'secret456',
    OAUTH_CONSUMER_KEY: 'consumerKey789',
    OAUTH_CONSUMER_SECRET: 'consumerSecret012',
  };
}

/**
 * A minimal GetUrl-compatible object for testing `client.getUrl()`.
 * Only needs `.params` and `.get()` to satisfy the duck-typed interface.
 */
const TEST_GET_URL = {
  params: {},
  get() {
    return '/v2/test';
  },
  get api() {
    return 'cc-api';
  },
};

describe('getCcApiClientWithOAuth', function () {
  describe('basic functionality', function () {
    it('should return a CcApiClient instance', function () {
      const apiConfig = createMockApiConfig();

      const client = getCcApiClientWithOAuth(apiConfig);

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      // CcApiClient should have a send method
      expect(client.send).to.be.a('function');
    });
  });

  describe('caching behavior', function () {
    it('should return the same client instance when called with the same apiConfig reference', function () {
      const apiConfig = createMockApiConfig();

      const client1 = getCcApiClientWithOAuth(apiConfig);
      const client2 = getCcApiClientWithOAuth(apiConfig);

      expect(client1).to.equal(client2);
    });

    it('should return different client instances when called with different apiConfig values', function () {
      const apiConfig1 = createMockApiConfig();
      const apiConfig2 = { ...createMockApiConfig(), API_HOST: 'https://api.other.com' };

      const client1 = getCcApiClientWithOAuth(apiConfig1);
      const client2 = getCcApiClientWithOAuth(apiConfig2);

      expect(client1).to.not.equal(client2);
    });

    it('should cache based on config content, not object reference', function () {
      const apiConfig1 = createMockApiConfig();
      // Create a second config with identical content but different reference
      const apiConfig2 = { ...apiConfig1 };

      const client1 = getCcApiClientWithOAuth(apiConfig1);
      const client2 = getCcApiClientWithOAuth(apiConfig2);

      // Same content should return the same cached client, even with different references
      expect(client1).to.equal(client2);
    });
  });

  describe('multiple apiConfig handling', function () {
    it('should maintain separate cached clients for different apiConfig values', function () {
      const apiConfig1 = { ...createMockApiConfig(), API_HOST: 'https://api1.example.com' };
      const apiConfig2 = { ...createMockApiConfig(), API_HOST: 'https://api2.example.com' };
      const apiConfig3 = { ...createMockApiConfig(), API_HOST: 'https://api3.example.com' };

      const client1a = getCcApiClientWithOAuth(apiConfig1);
      const client2a = getCcApiClientWithOAuth(apiConfig2);
      const client3a = getCcApiClientWithOAuth(apiConfig3);

      // Get them again
      const client1b = getCcApiClientWithOAuth(apiConfig1);
      const client2b = getCcApiClientWithOAuth(apiConfig2);
      const client3b = getCcApiClientWithOAuth(apiConfig3);

      // Each config should return the same client on subsequent calls
      expect(client1a).to.equal(client1b);
      expect(client2a).to.equal(client2b);
      expect(client3a).to.equal(client3b);

      // But different configs should have different clients
      expect(client1a).to.not.equal(client2a);
      expect(client2a).to.not.equal(client3a);
      expect(client1a).to.not.equal(client3a);
    });
  });

  describe('unauthenticated client (null apiConfig)', function () {
    it('should return a CcApiClient instance when called with null', function () {
      const client = getCcApiClientWithOAuth(null);

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      expect(client.send).to.be.a('function');
    });

    it('should return a CcApiClient instance when called with undefined', function () {
      const client = getCcApiClientWithOAuth(undefined);

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      expect(client.send).to.be.a('function');
    });

    it('should return the same unauthenticated client instance on repeated calls', function () {
      const client1 = getCcApiClientWithOAuth(null);
      const client2 = getCcApiClientWithOAuth(null);
      const client3 = getCcApiClientWithOAuth(undefined);

      expect(client1).to.equal(client2);
      expect(client1).to.equal(client3);
    });

    it('should return a different instance than authenticated clients', function () {
      const apiConfig = createMockApiConfig();

      const authenticatedClient = getCcApiClientWithOAuth(apiConfig);
      const unauthenticatedClient = getCcApiClientWithOAuth(null);

      expect(authenticatedClient).to.not.equal(unauthenticatedClient);
    });

    it('should use the default API host as baseUrl', function () {
      const client = getCcApiClientWithOAuth(null);

      const url = client.getUrl(TEST_GET_URL);
      expect(url.origin).to.equal('https://api.clever-cloud.com');
    });
  });

  describe('host-only apiConfig (unauthenticated with custom host)', function () {
    it('should return a CcApiClient instance when called with only API_HOST', function () {
      const client = getCcApiClientWithOAuth({ API_HOST: 'https://custom.api.com' });

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      expect(client.send).to.be.a('function');
    });

    it('should use the provided API_HOST as baseUrl', function () {
      const client = getCcApiClientWithOAuth({ API_HOST: 'https://custom.api.com' });

      const url = client.getUrl(TEST_GET_URL);
      expect(url.origin).to.equal('https://custom.api.com');
    });

    it('should cache based on config content for host-only configs', function () {
      const config1 = { API_HOST: 'https://custom.api.com' };
      const config2 = { API_HOST: 'https://custom.api.com' };

      const client1 = getCcApiClientWithOAuth(config1);
      const client2 = getCcApiClientWithOAuth(config1);
      const client3 = getCcApiClientWithOAuth(config2);

      expect(client1).to.equal(client2);
      expect(client1).to.equal(client3);
    });

    it('should return a different instance than the null config client', function () {
      const hostOnlyClient = getCcApiClientWithOAuth({ API_HOST: 'https://custom.api.com' });
      const nullClient = getCcApiClientWithOAuth(null);

      expect(hostOnlyClient).to.not.equal(nullClient);
    });

    it('should return a different instance than an authenticated client', function () {
      const hostOnlyClient = getCcApiClientWithOAuth({ API_HOST: 'https://api.example.com' });
      const authenticatedClient = getCcApiClientWithOAuth(createMockApiConfig());

      expect(hostOnlyClient).to.not.equal(authenticatedClient);
    });
  });
});

/**
 * Creates a mock API token configuration object for testing.
 * @returns {object} A mock API token configuration
 */
function createMockApiTokenConfig() {
  return {
    API_TOKEN: 'token123',
    API_HOST: 'https://api-bridge.example.com',
  };
}

describe('getCcApiClientWithToken', function () {
  describe('basic functionality', function () {
    it('should return a CcApiClient instance', function () {
      const apiTokenConfig = createMockApiTokenConfig();

      const client = getCcApiClientWithToken(apiTokenConfig);

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      expect(client.send).to.be.a('function');
    });
  });

  describe('caching behavior', function () {
    it('should return the same client instance when called with the same apiTokenConfig reference', function () {
      const apiTokenConfig = createMockApiTokenConfig();

      const client1 = getCcApiClientWithToken(apiTokenConfig);
      const client2 = getCcApiClientWithToken(apiTokenConfig);

      expect(client1).to.equal(client2);
    });

    it('should return different client instances when called with different apiTokenConfig values', function () {
      const apiTokenConfig1 = createMockApiTokenConfig();
      const apiTokenConfig2 = { ...createMockApiTokenConfig(), API_TOKEN: 'differentToken456' };

      const client1 = getCcApiClientWithToken(apiTokenConfig1);
      const client2 = getCcApiClientWithToken(apiTokenConfig2);

      expect(client1).to.not.equal(client2);
    });

    it('should cache based on config content, not object reference', function () {
      const apiTokenConfig1 = createMockApiTokenConfig();
      // Create a second config with identical content but different reference
      const apiTokenConfig2 = { ...apiTokenConfig1 };

      const client1 = getCcApiClientWithToken(apiTokenConfig1);
      const client2 = getCcApiClientWithToken(apiTokenConfig2);

      // Same content should return the same cached client, even with different references
      expect(client1).to.equal(client2);
    });
  });

  describe('multiple apiTokenConfig handling', function () {
    it('should maintain separate cached clients for different apiTokenConfig values', function () {
      const apiTokenConfig1 = { ...createMockApiTokenConfig(), API_TOKEN: 'token1' };
      const apiTokenConfig2 = { ...createMockApiTokenConfig(), API_TOKEN: 'token2' };
      const apiTokenConfig3 = { ...createMockApiTokenConfig(), API_TOKEN: 'token3' };

      const client1a = getCcApiClientWithToken(apiTokenConfig1);
      const client2a = getCcApiClientWithToken(apiTokenConfig2);
      const client3a = getCcApiClientWithToken(apiTokenConfig3);

      // Get them again
      const client1b = getCcApiClientWithToken(apiTokenConfig1);
      const client2b = getCcApiClientWithToken(apiTokenConfig2);
      const client3b = getCcApiClientWithToken(apiTokenConfig3);

      // Each config should return the same client on subsequent calls
      expect(client1a).to.equal(client1b);
      expect(client2a).to.equal(client2b);
      expect(client3a).to.equal(client3b);

      // But different configs should have different clients
      expect(client1a).to.not.equal(client2a);
      expect(client2a).to.not.equal(client3a);
      expect(client1a).to.not.equal(client3a);
    });
  });

  describe('base URL behavior', function () {
    it('should use the provided API_HOST as baseUrl', function () {
      const apiTokenConfig = createMockApiTokenConfig();

      const client = getCcApiClientWithToken(apiTokenConfig);

      const url = client.getUrl(TEST_GET_URL);
      expect(url.origin).to.equal('https://api-bridge.example.com');
    });

    it('should use the default API bridge host when API_HOST is omitted', function () {
      const client = getCcApiClientWithToken({ API_TOKEN: 'token123' });

      const url = client.getUrl(TEST_GET_URL);
      expect(url.origin).to.equal('https://api-bridge.clever-cloud.com');
    });
  });

  describe('isolation from OAuth clients', function () {
    it('should return a different instance than an OAuth authenticated client', function () {
      const apiTokenConfig = createMockApiTokenConfig();
      const apiConfig = createMockApiConfig();

      const tokenClient = getCcApiClientWithToken(apiTokenConfig);
      const oauthClient = getCcApiClientWithOAuth(apiConfig);

      expect(tokenClient).to.not.equal(oauthClient);
    });

    it('should return a different instance than an unauthenticated OAuth client', function () {
      const apiTokenConfig = createMockApiTokenConfig();

      const tokenClient = getCcApiClientWithToken(apiTokenConfig);
      const unauthenticatedClient = getCcApiClientWithOAuth(null);

      expect(tokenClient).to.not.equal(unauthenticatedClient);
    });
  });
});
