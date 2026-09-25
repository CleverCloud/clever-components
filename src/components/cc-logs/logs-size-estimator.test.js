import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { LogsSizeEstimator } from './logs-size-estimator.js';

/**
 * @import { Log } from './cc-logs.types.js'
 */

const FONT = '16px monospace';
const LINE_HEIGHT = 20;
const PADDING = 2;
const ROW_HEIGHT = LINE_HEIGHT + PADDING * 2;

/**
 * @param {string} message
 * @param {Array<{name: string, value: string}>} [metadata]
 * @return {Log}
 */
function createLog(message, metadata = []) {
  return { id: '0', date: new Date(0), message, metadata };
}

/**
 * A log row laid out like the component's: a gutter, then the text up to the end of the row.
 *
 * @param {number} rowWidth
 * @return {Promise<HTMLElement>} The text element.
 */
async function createRow(rowWidth) {
  const row = await fixture(html`
    <p style="display: flex; margin: 0; width: ${rowWidth}px;">
      <span style="flex: none; width: 50px;"></span>
      <span style="font: ${FONT}; line-height: ${LINE_HEIGHT}px; padding: ${PADDING}px 0;">text</span>
    </p>
  `);
  return /** @type {HTMLElement} */ (row.lastElementChild);
}

/**
 * @param {number} lineWidth
 * @return {number} How many characters of `FONT` fit in the given width.
 */
function charsFitting(lineWidth) {
  const context = document.createElement('canvas').getContext('2d');
  context.font = FONT;
  return Math.floor(lineWidth / (context.measureText('0'.repeat(100)).width / 100));
}

describe('LogsSizeEstimator', function () {
  describe('before reading the layout', function () {
    it('should estimate every log at the fallback row height', function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      expect(estimator.rowHeight).to.equal(21);
      expect(estimator.estimateHeight(createLog('a'.repeat(1000)))).to.equal(21);
    });
  });

  describe('readLayout() method', function () {
    it('should do nothing without an element', function () {
      const estimator = new LogsSizeEstimator();
      expect(estimator.readLayout(null)).to.equal(false);
      expect(estimator.rowHeight).to.equal(21);
    });
    it('should read the row height from the line height and the padding', async function () {
      const estimator = new LogsSizeEstimator();
      expect(estimator.readLayout(await createRow(400))).to.equal(true);
      expect(estimator.rowHeight).to.equal(ROW_HEIGHT);
    });
    it('should report no change when the layout is the same', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      const text = await createRow(400);
      estimator.readLayout(text);
      expect(estimator.readLayout(text)).to.equal(false);
    });
    it('should report a change when the row gets narrower', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      const text = await createRow(400);
      estimator.readLayout(text);
      text.parentElement.style.width = '200px';
      expect(estimator.readLayout(text)).to.equal(true);
    });
  });

  describe('estimateHeight() method', function () {
    it('should estimate a single line without wrap-lines', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.readLayout(await createRow(400));
      expect(estimator.estimateHeight(createLog('a'.repeat(1000)))).to.equal(ROW_HEIGHT);
    });
    it('should estimate the row height when no log is given', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      estimator.readLayout(await createRow(400));
      expect(estimator.estimateHeight(undefined)).to.equal(ROW_HEIGHT);
    });
    it('should add one line per wrapped line, going by the characters a line holds', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      estimator.readLayout(await createRow(400));
      const charsPerLine = charsFitting(350);

      expect(estimator.estimateHeight(createLog('a'.repeat(charsPerLine)))).to.equal(ROW_HEIGHT);
      expect(estimator.estimateHeight(createLog('a'.repeat(charsPerLine + 1)))).to.equal(ROW_HEIGHT + LINE_HEIGHT);
      expect(estimator.estimateHeight(createLog('a'.repeat(charsPerLine * 3)))).to.equal(ROW_HEIGHT + LINE_HEIGHT * 2);
    });
    it('should follow a width change', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      const text = await createRow(400);
      estimator.readLayout(text);
      // Fits on one line at 350px, and exactly on two at 175px.
      const log = createLog('a'.repeat(charsFitting(175) * 2));
      expect(estimator.estimateHeight(log)).to.equal(ROW_HEIGHT);

      text.parentElement.style.width = `${50 + 175}px`;
      estimator.readLayout(text);
      expect(estimator.estimateHeight(log)).to.equal(ROW_HEIGHT + LINE_HEIGHT);
    });
    it('should count the metadata on the first line, and forget the count when the renderers change', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      estimator.readLayout(await createRow(400));
      const charsPerLine = charsFitting(350);
      // 'xx' + message fills the line exactly
      const log = createLog('a'.repeat(charsPerLine - 2), [{ name: 'instance', value: 'xx' }]);
      expect(estimator.estimateHeight(log)).to.equal(ROW_HEIGHT);

      // metadata padded to 3 characters: one character too many
      estimator.metadataRenderers = { instance: { size: 3 } };
      expect(estimator.estimateHeight(log)).to.equal(ROW_HEIGHT + LINE_HEIGHT);
    });
  });

  describe('calibrate() method', function () {
    it('should do nothing without wrap-lines', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.readLayout(await createRow(400));
      const log = createLog('a');
      expect(estimator.calibrate([{ log, height: ROW_HEIGHT + LINE_HEIGHT * 5 }])).to.equal(false);
    });
    it('should keep the estimates when the logs take the predicted number of lines', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      estimator.readLayout(await createRow(400));
      const log = createLog('a'.repeat(charsFitting(350) * 2));
      expect(estimator.calibrate([{ log, height: ROW_HEIGHT + LINE_HEIGHT }])).to.equal(false);
    });
    it('should hold fewer characters per line when the logs take more lines than predicted', async function () {
      const estimator = new LogsSizeEstimator();
      estimator.wrapLines = true;
      estimator.readLayout(await createRow(400));
      const charsPerLine = charsFitting(350);
      const fullLine = createLog('a'.repeat(charsPerLine));
      const longLog = createLog('a'.repeat(charsPerLine * 4));
      expect(estimator.estimateHeight(fullLine)).to.equal(ROW_HEIGHT);

      // predicted 4 lines, measured 6
      expect(estimator.calibrate([{ log: longLog, height: ROW_HEIGHT + LINE_HEIGHT * 5 }])).to.equal(true);
      expect(estimator.estimateHeight(fullLine)).to.equal(ROW_HEIGHT + LINE_HEIGHT);
    });
  });
});
