import { afterEach, describe, expect, it } from 'vitest';
import { getAssetUrl, setAssetsBaseUrl } from '../src/lib/assets-url.js';
import { getDevHubUrl, getDocUrl, setDevHubBaseUrl } from '../src/lib/dev-hub-url.js';

describe('assets-url module', () => {
  describe('getAssetUrl function', () => {
    it('should return URL with default assets URL for path without leading slash', () => {
      expect(getAssetUrl('images/logo.png')).toBe('https://assets.clever-cloud.com/images/logo.png');
    });

    it('should return URL with default assets URL for path with leading slash', () => {
      expect(getAssetUrl('/images/logo.png')).toBe('https://assets.clever-cloud.com/images/logo.png');
    });

    it('should handle empty path', () => {
      expect(getAssetUrl('')).toBe('https://assets.clever-cloud.com/');
    });

    it('should handle path with only slash', () => {
      expect(getAssetUrl('/')).toBe('https://assets.clever-cloud.com/');
    });

    it('should handle nested paths', () => {
      expect(getAssetUrl('css/styles/main.css')).toBe('https://assets.clever-cloud.com/css/styles/main.css');
    });
  });

  describe('setAssetsBaseUrl function', () => {
    const originalUrl = 'https://assets.clever-cloud.com/';

    afterEach(() => {
      setAssetsBaseUrl(originalUrl);
    });

    it('should set custom base URL without trailing slash', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com');
      expect(getAssetUrl('images/logo.png')).toBe('https://custom-cdn.example.com/images/logo.png');
    });

    it('should set custom base URL with trailing slash', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com/');
      expect(getAssetUrl('images/logo.png')).toBe('https://custom-cdn.example.com/images/logo.png');
    });

    it('should handle base URL with multiple trailing slashes', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com///');
      expect(getAssetUrl('images/logo.png')).toBe('https://custom-cdn.example.com///images/logo.png');
    });

    it('should work with localhost URL', () => {
      setAssetsBaseUrl('http://localhost:3000');
      expect(getAssetUrl('images/logo.png')).toBe('http://localhost:3000/images/logo.png');
    });

    it('should work with relative path base URL', () => {
      setAssetsBaseUrl('/static/assets');
      expect(getAssetUrl('images/logo.png')).toBe('/static/assets/images/logo.png');
    });

    it('should preserve query parameters and fragments in paths', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com');
      expect(getAssetUrl('images/logo.png?v=123&t=456#section')).toBe(
        'https://custom-cdn.example.com/images/logo.png?v=123&t=456#section',
      );
    });

    it('should reset to new URL after multiple calls', () => {
      setAssetsBaseUrl('https://first-cdn.example.com');
      expect(getAssetUrl('test.png')).toBe('https://first-cdn.example.com/test.png');

      setAssetsBaseUrl('https://second-cdn.example.com/');
      expect(getAssetUrl('test.png')).toBe('https://second-cdn.example.com/test.png');
    });
  });
});

describe('dev-hub-url module', () => {
  describe('getDocUrl', () => {
    it('should append /doc/ and path to base URL without trailing slash', () => {
      expect(getDocUrl('foo/bar')).toBe('https://www.clever.cloud/developers/doc/foo/bar');
    });

    it('should handle path with leading slash', () => {
      expect(getDocUrl('/foo/bar')).toBe('https://www.clever.cloud/developers/doc/foo/bar');
    });

    it('should handle empty path', () => {
      expect(getDocUrl()).toBe('https://www.clever.cloud/developers/doc');
    });
  });

  describe('getDevHubUrl', () => {
    it('should append path to base URL without trailing slash', () => {
      expect(getDevHubUrl('foo/bar')).toBe('https://www.clever.cloud/developers/foo/bar');
    });

    it('should handle path with leading slash', () => {
      expect(getDevHubUrl('/foo/bar')).toBe('https://www.clever.cloud/developers/foo/bar');
    });

    it('should handle empty path', () => {
      expect(getDevHubUrl()).toBe('https://www.clever.cloud/developers');
    });
  });

  describe('setDevHubBaseUrl', () => {
    const originalUrl = 'https://www.clever.cloud/developers';

    afterEach(() => {
      setDevHubBaseUrl(originalUrl);
    });

    it('should set custom base URL without trailing slash', () => {
      setDevHubBaseUrl('https://custom-dev-hub.example.com');
      expect(getDevHubUrl('foo/bar')).toBe('https://custom-dev-hub.example.com/foo/bar');
    });

    it('should set custom base URL with trailing slash', () => {
      setDevHubBaseUrl('https://custom-dev-hub.example.com/');
      expect(getDevHubUrl('foo/bar')).toBe('https://custom-dev-hub.example.com/foo/bar');
    });

    it('should affect getDocUrl', () => {
      setDevHubBaseUrl('https://custom-dev-hub.example.com');
      expect(getDocUrl('foo/bar')).toBe('https://custom-dev-hub.example.com/doc/foo/bar');
    });

    it('should work with localhost URL', () => {
      setDevHubBaseUrl('http://localhost:8080');
      expect(getDevHubUrl('foo/bar')).toBe('http://localhost:8080/foo/bar');
      expect(getDocUrl('foo/bar')).toBe('http://localhost:8080/doc/foo/bar');
    });

    it('should work with relative path base URL', () => {
      setDevHubBaseUrl('/local/dev-hub');
      expect(getDevHubUrl('foo/bar')).toBe('/local/dev-hub/foo/bar');
      expect(getDocUrl('foo/bar')).toBe('/local/dev-hub/doc/foo/bar');
    });

    it('should reset to new URL after multiple calls', () => {
      setDevHubBaseUrl('https://first-hub.example.com');
      expect(getDevHubUrl('test')).toBe('https://first-hub.example.com/test');

      setDevHubBaseUrl('https://second-hub.example.com/');
      expect(getDevHubUrl('test')).toBe('https://second-hub.example.com/test');
    });
  });
});
