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

/** @param {number} ms */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** @param {import('./cc-logs.js').CcLogs} el */
function snap(el) {
  const c = el.shadowRoot.querySelector('.logs_container');
  const v = el._getVirtualizer();
  return {
    follow: el.follow,
    scrollTop: Math.round(c.scrollTop),
    distToBottom: Math.round(v.getTotalSize() - c.clientHeight - c.scrollTop),
  };
}

describe('cc-logs native follow', function () {
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

  it('follows the initial big append', async function () {
    const el = await fixture(html`<cc-logs-beta follow style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(2000));
    for (let i = 0; i < 8; i++) {
      await nextFrame();
    }
    const s = snap(el);
    expect(s.follow, 'follow stays on').to.equal(true);
    expect(s.scrollTop, 'pinned to bottom').to.be.greaterThan(0);
    expect(s.distToBottom, 'at bottom').to.be.lessThan(8);
  });

  it('keeps following through a throttled stream then silence', async function () {
    const el = await fixture(html`<cc-logs-beta follow style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    const transitions = [];
    el.addEventListener('cc-logs-follow-change', (e) => transitions.push(e.detail));
    for (let b = 0; b < 25; b++) {
      el.appendLogs(generateLogs(200, b * 200));
      await nextFrame();
    }
    await wait(300);
    await nextFrame();
    const s = snap(el);
    expect(s.follow, `follow stayed on (transitions=${transitions})`).to.equal(true);
    expect(s.distToBottom).to.be.lessThan(8);
  });

  it('unfollows on user scroll-up and re-follows at the bottom', async function () {
    const el = await fixture(html`<cc-logs-beta follow style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    el.appendLogs(generateLogs(2000));
    for (let i = 0; i < 8; i++) {
      await nextFrame();
    }
    const c = el.shadowRoot.querySelector('.logs_container');

    // User scrolls up.
    c.scrollTop = 100;
    c.dispatchEvent(new Event('scroll'));
    await nextFrame();
    expect(el.follow, 'unfollowed after scroll-up').to.equal(false);

    // New logs arrive: view must NOT jump to bottom.
    el.appendLogs(generateLogs(200, 2000));
    for (let i = 0; i < 4; i++) {
      await nextFrame();
    }
    expect(el.follow, 'stays unfollowed while reading history').to.equal(false);
    expect(c.scrollTop, 'view stayed up').to.be.lessThan(2000);

    // User scrolls back to the bottom.
    c.scrollTop = c.scrollHeight;
    c.dispatchEvent(new Event('scroll'));
    await nextFrame();
    expect(el.follow, 're-followed at bottom').to.equal(true);
  });

  it('lets the user break out of follow with a wheel-up during fast streaming', async function () {
    const el = await fixture(html`<cc-logs-beta follow style="display:block; height:300px;"></cc-logs-beta>`);
    await el.updateComplete;
    const c = el.shadowRoot.querySelector('.logs_container');

    // Logs stream in on every frame (so the virtualizer keeps re-pinning to the bottom and its `scrollState` stays
    // busy). Mid-stream, the user flicks the wheel up to read history — this must break out of follow even though a
    // programmatic scroll is in flight, and the following appends must not re-pin the view under them.
    for (let b = 0; b < 12; b++) {
      el.appendLogs(generateLogs(200, b * 200));
      if (b === 6) {
        c.scrollTop = 100;
        c.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true }));
      }
      await nextFrame();
    }

    expect(el.follow, 'wheel-up unfollowed during streaming').to.equal(false);
    expect(c.scrollTop, 'view was not re-pinned to the bottom').to.be.lessThan(2000);
  });

  it('keeps following once the list is capped at the limit (front-trim)', async function () {
    const el = await fixture(
      html`<cc-logs-beta follow limit="500" style="display:block; height:300px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    // Stream well past the limit so front-trim kicks in repeatedly.
    for (let b = 0; b < 15; b++) {
      el.appendLogs(generateLogs(200, b * 200));
      await wait(20);
    }
    for (let i = 0; i < 6; i++) {
      await nextFrame();
    }
    const s = snap(el);
    expect(el._logsCtrl.listLength, 'capped at limit').to.equal(500);
    expect(s.follow, 'still following at limit').to.equal(true);
    expect(s.distToBottom, 'still pinned to bottom').to.be.lessThan(8);
  });

  it('skips the costly size-cache realign while following at the limit', async function () {
    const el = await fixture(
      html`<cc-logs-beta follow limit="500" style="display:block; height:300px;"></cc-logs-beta>`,
    );
    await el.updateComplete;
    // Fill past the limit so front-trim is now happening on every append.
    for (let b = 0; b < 5; b++) {
      el.appendLogs(generateLogs(200, b * 200));
      await wait(20);
    }
    for (let i = 0; i < 6; i++) {
      await nextFrame();
    }
    expect(el._logsCtrl.listLength, 'capped at limit').to.equal(500);
    expect(el.follow, 'following').to.equal(true);

    // The realign shift is the only thing that ever REPLACES the virtualizer's `itemSizeCache` Map (the virtualizer
    // itself only mutates it in place). While following, the shift+recompute is skipped — the dominant per-append cost
    // at a large limit — because the re-measured bottom window keeps heights correct on its own.
    const cacheRef = el._getVirtualizer().itemSizeCache;
    el.appendLogs(generateLogs(200, 1000));
    for (let i = 0; i < 6; i++) {
      await nextFrame();
    }

    expect(el.follow, 'still following after another front-trim').to.equal(true);
    expect(el._getVirtualizer().itemSizeCache, 'the size-cache Map is not rebuilt while following').to.equal(cacheRef);
  });
});
