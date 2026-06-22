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
      // One log in ten carries a marker so a message filter keeps a spread-out subset.
      message: id % 10 === 0 ? `Message ${id} TARGET lorem ipsum` : `Message ${id} lorem ipsum`,
      metadata: [],
    };
  });
}

/** @param {number} ms */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('cc-logs inspect scroll', function () {
  // The "ResizeObserver loop completed with undelivered notifications" warning is benign; swallow it so it doesn't
  // fail these strict, churn-heavy tests.
  before(function () {
    const original = window.onerror;
    window.onerror = function (message, ...rest) {
      if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
        return true;
      }
      return original ? original.call(this, message, ...rest) : false;
    };
  });

  it('scrolls the inspected log into view once the host clears the message filter', async function () {
    const el = await fixture(
      html`<cc-logs-beta message-filter="TARGET" style="display:block; height:300px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    el.appendLogs(generateLogs(200));
    for (let i = 0; i < 6; i++) {
      await nextFrame();
    }

    // Real hosts (cc-logs-*-runtime) clear the message filter when a log is inspected.
    el.addEventListener('cc-log-inspect', () => {
      el.messageFilter = '';
    });

    // Select a TARGET log far from the top: filtered index 10 maps to full-list index 100.
    el._logsCtrl.toggleSelection(10);
    await el.updateComplete;

    el._onInspectLogButtonClick();
    // Let the filter-clearing update land and the virtualizer's scroll reconcile converge.
    for (let i = 0; i < 10; i++) {
      await nextFrame();
    }
    await wait(50);
    await nextFrame();

    const c = el.shadowRoot.querySelector('.logs_container');
    const row = el.shadowRoot.querySelector('.log[data-index="100"]');

    // The inspected log (full-list index 100, not the filtered index 10) is the one rendered and brought into view.
    expect(row, 'the inspected log is rendered').to.not.equal(null);

    const cRect = c.getBoundingClientRect();
    const rRect = row.getBoundingClientRect();
    // It is within the viewport...
    expect(rRect.top, 'inspected row below container top').to.be.greaterThan(cRect.top - 5);
    expect(rRect.bottom, 'inspected row above container bottom').to.be.lessThan(cRect.bottom + 5);
    // ...and roughly centered, not pinned to an edge.
    const rowCenter = rRect.top + rRect.height / 2;
    const containerCenter = cRect.top + cRect.height / 2;
    expect(Math.abs(rowCenter - containerCenter), 'inspected row roughly centered').to.be.lessThan(cRect.height / 2);
  });
});
