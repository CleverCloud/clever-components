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
 * Logs long enough to wrap over several lines, with a height that varies from one log to the next.
 *
 * @param {number} length @param {number} offset
 */
function generateWrappingLogs(length, offset = 0) {
  return generateLogs(length, offset).map((log, i) => ({
    ...log,
    message: `${log.message} ${'lorem ipsum dolor sit amet consectetur '.repeat((i % 7) + 1)}`,
  }));
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

  // Regression test: the virtualizer positions the logs it has not rendered yet from an estimated line height. When
  // that estimate is too small, scrolling renders rows that measure taller than assumed, each row above the viewport
  // corrects the scroll offset by its own error, and the view slides by the accumulated difference — with no log
  // appended at all.
  // The row height follows the host's font size. Small sizes matter: below ~15px, anything in the row that does not
  // scale with the host (such as a button keeping its user agent font size) ends up driving the row height.
  for (const fontSize of ['11px', '14px', '16px', '20px']) {
    it(`does not move the view after a scroll when no log is appended (font-size: ${fontSize})`, async function () {
      const el = await fixture(
        html`<cc-logs-beta style="display:block; height:300px; font-size:${fontSize};"></cc-logs-beta>`,
      );
      await el.updateComplete;
      el.appendLogs(generateLogs(1000));
      await settle(el);

      const container = el.shadowRoot.querySelector('.logs_container');
      container.scrollTop = 5000;
      container.dispatchEvent(new Event('scroll'));
      await settle(el, 4);
      const before = topOfViewport(el);

      await settle(el, 20);
      const after = topOfViewport(el);

      expect(after.id, 'the same log is still at the top of the viewport').to.equal(before.id);
      expect(after.offset, 'the view did not move').to.equal(before.offset);
      expect(Math.round(container.scrollTop), 'the scroll offset was not corrected').to.equal(5000);
    });

    it(`estimates the logs it has not rendered at the real line height (font-size: ${fontSize})`, async function () {
      const el = await fixture(
        html`<cc-logs-beta style="display:block; height:300px; font-size:${fontSize};"></cc-logs-beta>`,
      );
      await el.updateComplete;
      el.appendLogs(generateLogs(100));
      await settle(el);

      const row = el.shadowRoot.querySelector('.log');
      expect(el._sizeEstimator.rowHeight, 'the estimate matches a rendered line').to.equal(
        Math.round(row.getBoundingClientRect().height),
      );
    });
  }

  // Regression test: the virtualizer skips its own measurements while the user is scrolling (it waits for the scroll
  // to end). We render the rows in normal flow, so an unmeasured row is laid out at its real height anyway and every
  // row below it in the window sits where the virtualizer does not expect it. With `wrap-lines` a row is several lines
  // tall while an unmeasured one is assumed to be one, so the view slides by whole lines mid-scroll, then snaps back
  // once the scroll ends.
  it('knows the real height of every rendered row, while the user is still scrolling (wrap-lines)', async function () {
    const el = await fixture(
      html`<cc-logs-beta wrap-lines style="display:block; height:300px; width:400px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    el.appendLogs(generateWrappingLogs(2000));
    await settle(el);

    // Jump deep into history the component has never rendered, and look before the scroll has ended.
    const container = el.shadowRoot.querySelector('.logs_container');
    container.scrollTop = Math.round(container.scrollHeight / 3);
    container.dispatchEvent(new Event('scroll'));
    await el.updateComplete;
    await el.updateComplete;

    const virtualizer = el._getVirtualizer();
    expect(virtualizer.isScrolling, 'the scroll has not ended yet').to.equal(true);
    const measurements = virtualizer.getMeasurements();
    /** @type {Array<string>} */
    const misplaced = [];
    for (const row of el.shadowRoot.querySelectorAll('.log')) {
      const index = Number(row.dataset.index);
      const realHeight = Math.round(row.getBoundingClientRect().height);
      const knownHeight = Math.round(measurements[index].size);
      if (realHeight !== knownHeight) {
        misplaced.push(`index ${index}: ${realHeight}px tall, known as ${knownHeight}px`);
      }
    }
    expect(
      misplaced.length,
      `the virtualizer knows the height of every rendered row (${misplaced.length} it does not, e.g. ${misplaced.slice(0, 3).join(' ; ')})`,
    ).to.equal(0);
  });

  // Regression test: a log the component has not rendered yet is estimated from the number of characters it holds (see
  // `LogsSizeEstimator.estimateHeight()`). Assuming a single line, as a non-wrapped log always is, packs the whole history the user
  // has not visited into a fraction of the height it really needs, and scrolling up into it moves the rows around the
  // viewport by the accumulated error.
  it('estimates a log it has not rendered at the height it really takes (wrap-lines)', async function () {
    const el = await fixture(
      html`<cc-logs-beta follow wrap-lines style="display:block; height:300px; width:400px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    // Stream in several times so the estimate is calibrated on the logs going past, as it is in a real stream.
    for (let batch = 0; batch < 8; batch++) {
      el.appendLogs(generateWrappingLogs(100, batch * 100));
      await settle(el, 4);
    }
    await settle(el);

    const logs = el._logsCtrl.getList();
    /** @type {Array<string>} */
    const misestimated = [];
    for (const row of el.shadowRoot.querySelectorAll('.log')) {
      const index = Number(row.dataset.index);
      const realHeight = Math.round(row.getBoundingClientRect().height);
      const estimatedHeight = el._sizeEstimator.estimateHeight(logs[index]);
      // One line of tolerance: a message wraps on its spaces, so the last line of a log is only partly filled.
      if (Math.abs(estimatedHeight - realHeight) > el._sizeEstimator._lineHeight) {
        misestimated.push(`${logs[index].id}: ${realHeight}px tall, estimated at ${estimatedHeight}px`);
      }
    }
    expect(
      misestimated.length,
      `every log is estimated within a line of its height (${misestimated.length} are not, e.g. ${misestimated.slice(0, 3).join(' ; ')})`,
    ).to.equal(0);
  });

  // Regression test: the characters a line holds used to be read from the width of the first rendered row's text. That
  // text shrinks to fit a short message, so the count depended on which log came first. Changing the count moves the
  // logs, which changes the first rendered log: the count flipped between two values on every update, and the updates
  // chained forever without yielding to the browser, which froze the tab.
  it('counts the characters a line holds whatever log is rendered first (wrap-lines)', async function () {
    /** @param {string} message */
    async function charsPerLineFromWidth(message) {
      const el = await fixture(
        html`<cc-logs-beta wrap-lines style="display:block; height:300px; width:800px;"></cc-logs-beta>`,
      );
      await el.updateComplete;
      el.appendLogs([{ ...generateLogs(1)[0], message }]);
      await settle(el);
      return el._sizeEstimator._charsPerLineFromWidth;
    }

    const fromShortLog = await charsPerLineFromWidth('short');
    const fromLongLog = await charsPerLineFromWidth('lorem ipsum dolor sit amet consectetur '.repeat(5));

    expect(fromShortLog, 'a line holds more than the short message').to.be.greaterThan('short'.length);
    expect(fromShortLog, 'the count does not depend on the message').to.equal(fromLongLog);
  });

  // Regression test: the characters a line holds were only re-read when the rendered logs changed. Resizing the
  // component while the same logs stay on screen left the count at the old width, so every log the component had not
  // rendered was estimated for a line that no longer existed.
  it('counts the characters a line holds again when the component is resized (wrap-lines)', async function () {
    const el = await fixture(
      html`<cc-logs-beta wrap-lines style="display:block; height:300px; width:800px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    // Few enough logs to all be rendered: the rendered logs do not change with the width.
    el.appendLogs(generateWrappingLogs(5));
    await settle(el);
    const charsPerLineAt800 = el._sizeEstimator._charsPerLineFromWidth;

    el.style.width = '400px';
    await settle(el);

    expect(el._sizeEstimator._charsPerLineFromWidth, 'a line holds fewer characters').to.be.lessThan(charsPerLineAt800);
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
