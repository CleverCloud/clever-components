import { expect, fixture, nextFrame } from '@open-wc/testing';
import { html } from 'lit';
import './cc-logs.js';

/** @param {number} length @param {number} offset */
function generateLogs(length, offset = 0) {
  return Array.from({ length }, (_, i) => {
    const id = offset + i;
    return {
      id: `log-${id}`,
      date: new Date(1600000000000 + id * 1000),
      message: `Message ${id} lorem ipsum dolor sit amet`,
      metadata: [{ name: 'instance', value: `instance-${id % 4}` }],
    };
  });
}

/**
 * Describes what the user actually sees at the top of the viewport: which log crosses the top edge, and how far above
 * that edge it starts. Both must survive an append for the view to be considered stable.
 *
 * @param {import('./cc-logs.js').CcLogs} el
 * @return {{ id: string, offset: number }}
 */
function topOfViewport(el) {
  const container = el.shadowRoot.querySelector('.logs_container');
  const containerTop = container.getBoundingClientRect().top;
  const logs = el._logsCtrl.getList();
  for (const row of el.shadowRoot.querySelectorAll('.log')) {
    const rect = row.getBoundingClientRect();
    if (rect.bottom > containerTop + 1) {
      return { id: logs[Number(row.dataset.index)]?.id, offset: Math.round(rect.top - containerTop) };
    }
  }
  return { id: null, offset: 0 };
}

/** @param {import('./cc-logs.js').CcLogs} el @param {number} frames */
async function settle(el, frames = 12) {
  for (let i = 0; i < frames; i++) {
    await nextFrame();
  }
}

/**
 * Scrolls the user up into the history and waits for the heights around the new position to settle.
 *
 * @param {import('./cc-logs.js').CcLogs} el
 * @param {number} scrollTop
 */
async function scrollUpTo(el, scrollTop) {
  const container = el.shadowRoot.querySelector('.logs_container');
  container.scrollTop = scrollTop;
  container.dispatchEvent(new Event('scroll'));
  await settle(el);
  expect(el.follow, 'the user is reading history, not following').to.equal(false);
}

// A log line measures ~25px in these tests. We allow one line of tolerance on the anchor offset: the virtualizer
// positions off-screen logs from an estimated height, so a trim can shift things by a few sub-line pixels. What must
// never happen is the view jumping by a whole trim's worth of logs, which the log id assertion catches.
const ANCHOR_OFFSET_TOLERANCE = 26;

describe('cc-logs scroll anchoring', function () {
  // The "ResizeObserver loop completed with undelivered notifications" warning is benign and already filtered by the
  // project's web-test-runner config; swallow it here so it doesn't fail these strict, churn-heavy tests.
  before(function () {
    const original = window.onerror;
    window.onerror = function (message, ...rest) {
      if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
        return true;
      }
      return original ? original.call(this, message, ...rest) : false;
    };
  });

  it('keeps the same log under the viewport top when logs are appended below the limit', async function () {
    const el = await fixture(html`<cc-logs-beta limit="50000" style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(1000));
    await settle(el);
    await scrollUpTo(el, 5000);

    const before = topOfViewport(el);
    for (let i = 0; i < 5; i++) {
      el.appendLogs(generateLogs(200, 1000 + i * 200));
      await settle(el);
    }
    const after = topOfViewport(el);

    expect(after.id, 'the same log is still at the top of the viewport').to.equal(before.id);
    expect(Math.abs(after.offset - before.offset), 'the view did not move').to.be.lessThan(ANCHOR_OFFSET_TOLERANCE);
  });

  // Regression test: once `limit` is reached, every append trims as many logs off the front, which shifts every
  // surviving log's index down. The virtualizer anchors the viewport by index, so without an explicit correction the
  // scroll offset stays put while the content slides under it — the user reading history was carried forward by one
  // trim's worth of logs on every append.
  it('keeps the same log under the viewport top when logs are appended at the limit (front-trim)', async function () {
    const el = await fixture(html`<cc-logs-beta limit="1000" style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(1000));
    await settle(el);
    // Deep enough in the history that the 100 logs trimmed below never reach the anchor.
    await scrollUpTo(el, 15000);

    const before = topOfViewport(el);
    for (let i = 0; i < 5; i++) {
      el.appendLogs(generateLogs(20, 1000 + i * 20));
      await settle(el);
    }
    const after = topOfViewport(el);

    expect(after.id, 'the same log is still at the top of the viewport').to.equal(before.id);
    expect(Math.abs(after.offset - before.offset), 'the view did not move').to.be.lessThan(ANCHOR_OFFSET_TOLERANCE);
  });

  // The update that first crosses `limit` both grows the list and trims its front, so the virtualizer's own
  // index-keyed anchoring kicks in (the count changed) on top of our correction. The view must still hold.
  it('keeps the same log under the viewport top on the append that first reaches the limit', async function () {
    const el = await fixture(html`<cc-logs-beta limit="1000" style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(900));
    await settle(el);
    await scrollUpTo(el, 15000);

    const before = topOfViewport(el);
    el.appendLogs(generateLogs(150, 900));
    await settle(el);
    const after = topOfViewport(el);

    expect(after.id, 'the same log is still at the top of the viewport').to.equal(before.id);
    expect(Math.abs(after.offset - before.offset), 'the view did not move').to.be.lessThan(ANCHOR_OFFSET_TOLERANCE);
  });

  it('still scrolls the trimmed-away history out of the view', async function () {
    const el = await fixture(html`<cc-logs-beta limit="1000" style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(1000));
    await settle(el);
    // The user is reading the very beginning of the buffer: the next appends trim exactly what they are looking at.
    await scrollUpTo(el, 200);

    el.appendLogs(generateLogs(300, 1000));
    await settle(el);

    const container = el.shadowRoot.querySelector('.logs_container');
    expect(container.scrollTop, 'the view stopped at the top of the remaining logs').to.equal(0);
    expect(el.follow, 'the view was not dragged down to the bottom').to.equal(false);
  });
});
