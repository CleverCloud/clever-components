import { expect } from '@bundled-es-modules/chai';
import { getAssetUrl, setAssetsBaseUrl } from '../src/lib/assets-url.js';

describe('assets-url module', () => {
  describe('getAssetUrl function', () => {
    it('should return URL with default assets URL for path without leading slash', () => {
      expect(getAssetUrl('images/logo.png')).to.equal('https://assets.clever-cloud.com/images/logo.png');
    });

    it('should return URL with default assets URL for path with leading slash', () => {
      expect(getAssetUrl('/images/logo.png')).to.equal('https://assets.clever-cloud.com/images/logo.png');
    });

    it('should handle empty path', () => {
      expect(getAssetUrl('')).to.equal('https://assets.clever-cloud.com/');
    });

    it('should handle path with only slash', () => {
      expect(getAssetUrl('/')).to.equal('https://assets.clever-cloud.com/');
    });

    it('should handle nested paths', () => {
      expect(getAssetUrl('css/styles/main.css')).to.equal('https://assets.clever-cloud.com/css/styles/main.css');
    });
  });

  describe('setAssetsBaseUrl function', () => {
    const originalUrl = 'https://assets.clever-cloud.com/';

    afterEach(() => {
      setAssetsBaseUrl(originalUrl);
    });

    it('should set custom base URL without trailing slash', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com');
      expect(getAssetUrl('images/logo.png')).to.equal('https://custom-cdn.example.com/images/logo.png');
    });

    it('should set custom base URL with trailing slash', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com/');
      expect(getAssetUrl('images/logo.png')).to.equal('https://custom-cdn.example.com/images/logo.png');
    });

    it('should handle base URL with multiple trailing slashes', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com///');
      expect(getAssetUrl('images/logo.png')).to.equal('https://custom-cdn.example.com///images/logo.png');
    });

    it('should work with localhost URL', () => {
      setAssetsBaseUrl('http://localhost:3000');
      expect(getAssetUrl('images/logo.png')).to.equal('http://localhost:3000/images/logo.png');
    });

    it('should work with relative path base URL', () => {
      setAssetsBaseUrl('/static/assets');
      expect(getAssetUrl('images/logo.png')).to.equal('/static/assets/images/logo.png');
    });

    it('should preserve query parameters and fragments in paths', () => {
      setAssetsBaseUrl('https://custom-cdn.example.com');
      expect(getAssetUrl('images/logo.png?v=123&t=456#section')).to.equal(
        'https://custom-cdn.example.com/images/logo.png?v=123&t=456#section',
      );
    });

    it('should reset to new URL after multiple calls', () => {
      setAssetsBaseUrl('https://first-cdn.example.com');
      expect(getAssetUrl('test.png')).to.equal('https://first-cdn.example.com/test.png');

      setAssetsBaseUrl('https://second-cdn.example.com/');
      expect(getAssetUrl('test.png')).to.equal('https://second-cdn.example.com/test.png');
    });
  });
});
