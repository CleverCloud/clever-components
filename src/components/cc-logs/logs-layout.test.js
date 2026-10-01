import { expect } from '@bundled-es-modules/chai';
import {
  calibrateCharsPerLineFactor,
  countLines,
  estimateLineCount,
  getLogCharCounts,
  getMetadataRendering,
  getMetadataText,
  getRenderedMetadata,
} from './logs-layout.js';

/**
 * @import { Log } from './cc-logs.types.js'
 */

/**
 * @param {string} message
 * @param {Array<{name: string, value: string}>} [metadata]
 * @return {Log}
 */
function createLog(message, metadata = []) {
  return { id: '0', date: new Date(0), message, metadata };
}

const metadata = { name: 'instance', value: 'abcdef' };

describe('logs layout', function () {
  describe('getMetadataRendering() function', function () {
    it('should return the default rendering when there is no renderer', function () {
      expect(getMetadataRendering(metadata, undefined)).to.eql({
        hidden: false,
        intent: 'neutral',
        showName: false,
        size: 'auto',
        strong: false,
      });
    });
    it('should merge a static renderer with the default rendering', function () {
      expect(getMetadataRendering(metadata, { instance: { strong: true, size: 4 } })).to.include({
        hidden: false,
        intent: 'neutral',
        strong: true,
        size: 4,
      });
    });
    it('should call a function renderer with the metadata', function () {
      const rendering = getMetadataRendering(metadata, { instance: (m) => ({ text: m.value.toUpperCase() }) });
      expect(rendering).to.include({ text: 'ABCDEF', intent: 'neutral' });
    });
  });

  describe('getMetadataText() function', function () {
    it('should return the value', function () {
      expect(getMetadataText(metadata, {})).to.equal('abcdef');
    });
    it('should prefix the value with the name when showName is true', function () {
      expect(getMetadataText(metadata, { showName: true })).to.equal('instance: abcdef');
    });
    it('should return the rendering text when there is one', function () {
      expect(getMetadataText(metadata, { text: 'custom', showName: true })).to.equal('custom');
    });
  });

  describe('getRenderedMetadata() function', function () {
    it('should return null when the metadata is hidden', function () {
      expect(getRenderedMetadata(metadata, { instance: { hidden: true } })).to.equal(null);
    });
    it('should return a size of 0 when size is "auto"', function () {
      expect(getRenderedMetadata(metadata, undefined)).to.include({ text: 'abcdef', size: 0 });
    });
    it('should return a size of 0 when size is not positive', function () {
      expect(getRenderedMetadata(metadata, { instance: { size: -2 } })).to.include({ text: 'abcdef', size: 0 });
    });
    it('should keep the text as is when it fits in the size', function () {
      expect(getRenderedMetadata(metadata, { instance: { size: 10 } })).to.include({ text: 'abcdef', size: 10 });
    });
    it('should truncate the text to the size', function () {
      expect(getRenderedMetadata(metadata, { instance: { size: 4 } })).to.include({ text: 'abc…', size: 4 });
    });
  });

  describe('getLogCharCounts() function', function () {
    it('should count the characters of a single line message', function () {
      expect(getLogCharCounts(createLog('hello world'), undefined)).to.eql([11]);
    });
    it('should count each line of a multi-line message', function () {
      expect(getLogCharCounts(createLog('hello\n\nworld!'), undefined)).to.eql([5, 0, 6]);
    });
    it('should not count ANSI escape sequences', function () {
      expect(getLogCharCounts(createLog('\u001b[31mred\u001b[0m'), undefined)).to.eql([3]);
    });
    it('should add the metadata and their separators to the first line', function () {
      const log = createLog('msg\nnext', [
        { name: 'a', value: 'xx' },
        { name: 'b', value: 'yyy' },
      ]);
      // 'xx' + ' ' + 'yyy' + 'msg'
      expect(getLogCharCounts(log, undefined)).to.eql([9, 4]);
    });
    it('should count a sized metadata at its size, whether its text is shorter or longer', function () {
      const log = createLog('msg', [
        { name: 'short', value: 'ab' },
        { name: 'long', value: 'abcdefgh' },
      ]);
      // 5 + ' ' + 3 + 'msg'
      expect(getLogCharCounts(log, { short: { size: 5 }, long: { size: 3 } })).to.eql([12]);
    });
    it('should not count hidden metadata nor their separator', function () {
      const log = createLog('msg', [
        { name: 'a', value: 'xx' },
        { name: 'b', value: 'yyy' },
      ]);
      expect(getLogCharCounts(log, { b: { hidden: true } })).to.eql([5]);
    });
  });

  describe('estimateLineCount() function', function () {
    it('should count one line for a line that fits', function () {
      expect(estimateLineCount([10], 10)).to.equal(1);
    });
    it('should count the wrapped lines of a line that does not fit', function () {
      expect(estimateLineCount([21], 10)).to.equal(3);
    });
    it('should count one line for an empty line', function () {
      expect(estimateLineCount([0], 10)).to.equal(1);
    });
    it('should add up every line of a multi-line log', function () {
      expect(estimateLineCount([5, 0, 25], 10)).to.equal(5);
    });
  });

  describe('countLines() function', function () {
    it('should count one line for a single-line row', function () {
      expect(countLines(21, 21, 17)).to.equal(1);
    });
    it('should count the extra lines of a wrapped row', function () {
      expect(countLines(21 + 17 * 2, 21, 17)).to.equal(3);
    });
    it('should round a sub-pixel height to the nearest line count', function () {
      expect(countLines(21 + 17 * 2 + 0.4, 21, 17)).to.equal(3);
      expect(countLines(21 + 17 * 2 - 0.4, 21, 17)).to.equal(3);
    });
    it('should count at least one line', function () {
      expect(countLines(0, 21, 17)).to.equal(1);
    });
  });

  describe('calibrateCharsPerLineFactor() function', function () {
    it('should keep the factor when the prediction is right', function () {
      expect(calibrateCharsPerLineFactor(1, 10, 10)).to.equal(1);
    });
    it('should keep the factor when nothing was measured or predicted', function () {
      expect(calibrateCharsPerLineFactor(1, 10, 0)).to.equal(1);
      expect(calibrateCharsPerLineFactor(1, 0, 10)).to.equal(1);
    });
    it('should keep the factor when the difference is under the tolerance', function () {
      expect(calibrateCharsPerLineFactor(1, 104, 100)).to.equal(1);
      expect(calibrateCharsPerLineFactor(1, 96, 100)).to.equal(1);
    });
    it('should move half way towards the measured ratio', function () {
      // predicted 80 lines, measured 100: lines hold fewer characters than assumed
      expect(calibrateCharsPerLineFactor(1, 80, 100)).to.equal(0.9);
      expect(calibrateCharsPerLineFactor(0.5, 120, 100)).to.be.closeTo(0.55, 1e-9);
    });
  });
});
