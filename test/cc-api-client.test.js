import { expect } from '@bundled-es-modules/chai';
import { getCcApiClient } from '../src/lib/cc-api-client.js';

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

describe('getCcApiClient', function () {
  describe('basic functionality', function () {
    it('should return a CcApiClient instance', function () {
      const apiConfig = createMockApiConfig();

      const client = getCcApiClient(apiConfig);

      expect(client).to.not.be.null;
      expect(client).to.not.be.undefined;
      // CcApiClient should have a send method
      expect(client.send).to.be.a('function');
    });
  });

  describe('caching behavior', function () {
    it('should return the same client instance when called with the same apiConfig reference', function () {
      const apiConfig = createMockApiConfig();

      const client1 = getCcApiClient(apiConfig);
      const client2 = getCcApiClient(apiConfig);

      expect(client1 === client2).to.equal(true);
    });

    it('should return different client instances when called with different apiConfig objects', function () {
      const apiConfig1 = createMockApiConfig();
      const apiConfig2 = createMockApiConfig();

      const client1 = getCcApiClient(apiConfig1);
      const client2 = getCcApiClient(apiConfig2);

      expect(client1 === client2).to.equal(false);
    });

    it('should cache based on object reference, not object content', function () {
      const apiConfig1 = createMockApiConfig();
      // Create a second config with identical content but different reference
      const apiConfig2 = { ...apiConfig1 };

      const client1 = getCcApiClient(apiConfig1);
      const client2 = getCcApiClient(apiConfig2);

      // Even though the content is identical, different references should create different clients
      expect(client1 === client2).to.equal(false);
    });
  });

  describe('multiple apiConfig handling', function () {
    it('should maintain separate cached clients for different apiConfig objects', function () {
      const apiConfig1 = createMockApiConfig();
      const apiConfig2 = createMockApiConfig();
      const apiConfig3 = createMockApiConfig();

      const client1a = getCcApiClient(apiConfig1);
      const client2a = getCcApiClient(apiConfig2);
      const client3a = getCcApiClient(apiConfig3);

      // Get them again
      const client1b = getCcApiClient(apiConfig1);
      const client2b = getCcApiClient(apiConfig2);
      const client3b = getCcApiClient(apiConfig3);

      // Each config should return the same client on subsequent calls
      expect(client1a === client1b).to.equal(true);
      expect(client2a === client2b).to.equal(true);
      expect(client3a === client3b).to.equal(true);

      // But different configs should have different clients
      expect(client1a === client2a).to.equal(false);
      expect(client2a === client3a).to.equal(false);
      expect(client1a === client3a).to.equal(false);
    });
  });
});
