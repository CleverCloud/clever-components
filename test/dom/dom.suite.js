import { expect } from '@bundled-es-modules/chai';
import { scrollChildIntoParent } from '../../src/lib/dom.js';

describe('dom', () => {

  // NOTE: scrollChildIntoParent implementation is debounced and has a smooth transition
  // We need to wait for the changes to be applied so to ease the test writing, we use a wrapper
  async function scrollChildIntoParentAsync (...params) {
    return new Promise((resolve) => {
      scrollChildIntoParent(...params);
      setTimeout(resolve, 750);
    });
  }

  it('scrollChildIntoParent()', async function () {

    // This test will be a bit long because of debounce delay + smooth transition
    // => 6 calls to scrollChildIntoParentAsync
    this.timeout(6 * 1000);

    const $body = document.querySelector('body');
    const $container = document.querySelector('.container');
    const $items = Array.from(document.querySelectorAll('.item'));

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[1] is already visible
      await scrollChildIntoParentAsync($container, $items[1]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position does not change
      expect($container.scrollTop).to.equal(containerVerticalScrollPosition);
    }

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[2] is half visible half below the $container visible area
      await scrollChildIntoParentAsync($container, $items[2]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position changes
      expect($container.scrollTop).not.to.equal(containerVerticalScrollPosition);
      // => both item and container bottom rect are aligned
      const itemRect = $items[2].getBoundingClientRect();
      const containerRect = $container.getBoundingClientRect();
      expect(itemRect.bottom).to.equal(containerRect.bottom);
    }

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[9] is 100% below the $container visible area
      await scrollChildIntoParentAsync($container, $items[9]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position changes
      expect($container.scrollTop).not.to.equal(containerVerticalScrollPosition);
      // => both item and container bottom rect are aligned
      const itemRect = $items[9].getBoundingClientRect();
      const containerRect = $container.getBoundingClientRect();
      expect(itemRect.bottom).to.equal(containerRect.bottom);
    }

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[8] is already visible
      await scrollChildIntoParentAsync($container, $items[8]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position does not change
      expect($container.scrollTop).to.equal(containerVerticalScrollPosition);
    }

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[7] is half visible half above the $container visible area
      await scrollChildIntoParentAsync($container, $items[7]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position changes
      expect($container.scrollTop).not.to.equal(containerVerticalScrollPosition);
      // => both item and container top rect are aligned
      const itemRect = $items[7].getBoundingClientRect();
      const containerRect = $container.getBoundingClientRect();
      expect(itemRect.top).to.equal(containerRect.top);
    }

    {
      const bodyVerticalScrollPosition = $body.scrollTop;
      const containerVerticalScrollPosition = $container.scrollTop;
      // items[0] is 100% above the $container visible area
      await scrollChildIntoParentAsync($container, $items[0]);
      // => $body vertical scroll position does not change
      expect($body.scrollTop).to.equal(bodyVerticalScrollPosition);
      // => $container vertical scroll position changes
      expect($container.scrollTop).not.to.equal(containerVerticalScrollPosition);
      // => both item and container top rect are aligned
      const itemRect = $items[0].getBoundingClientRect();
      const containerRect = $container.getBoundingClientRect();
      expect(itemRect.top).to.equal(containerRect.top);
    }
  });
});
