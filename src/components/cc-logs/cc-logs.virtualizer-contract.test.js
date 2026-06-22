import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { VIRTUALIZER_PRIVATE_FIELDS } from './cc-logs.js';

// cc-logs reaches into a few `@tanstack/virtual-core` internals (to detect user vs programmatic scrolls and to realign
// the index-keyed size cache after a FIFO front-trim). Some of those are declared `private` in the library's types and
// are accessed by string key. If an upgrade renames any of them, those reach-ins silently turn into no-ops — breaking
// follow detection and reintroducing overlapping lines, with no error. This suite pins that contract so an
// incompatible upgrade fails here in CI instead.
describe('cc-logs @tanstack/virtual-core internal contract', function () {
  it('still exposes the internals cc-logs depends on', async function () {
    const el = await fixture(html`<cc-logs-beta style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    const virtualizer = el._getVirtualizer();

    // Private internals accessed by string key (see `VIRTUALIZER_PRIVATE_FIELDS` in cc-logs.js). They are all
    // initialised in the virtualizer constructor, so a rename makes the `in` check fail.
    for (const field of VIRTUALIZER_PRIVATE_FIELDS) {
      expect(field in virtualizer, `virtualizer still exposes the private internal "${field}"`).to.equal(true);
    }

    // Public-but-internal-contract fields we mutate directly during the cache realign.
    expect(virtualizer.itemSizeCache, 'itemSizeCache is a Map').to.be.instanceOf(Map);
    expect(Array.isArray(virtualizer.measurementsCache), 'measurementsCache is an Array').to.equal(true);

    // Methods cc-logs calls to drive scrolling and measurement.
    for (const method of [
      'scrollToIndex',
      'scrollToEnd',
      'getTotalSize',
      'getVirtualItems',
      'measureElement',
      'range',
    ]) {
      const value = virtualizer[method];
      // `range` is an accessor returning an object/null; the rest are methods.
      expect(value, `virtualizer.${method} exists`).to.not.equal(undefined);
    }
  });
});
