import { stripAnsi } from '../../lib/ansi/ansi.js';
import { truncateString } from '../../lib/utils.js';

/**
 * @import { Log, Metadata, MetadataRenderer, MetadataRendering } from './cc-logs.types.js'
 */

/** @type {MetadataRendering} The default metadata renderer */
const DEFAULT_METADATA_RENDERING = {
  hidden: false,
  intent: 'neutral',
  showName: false,
  size: 'auto',
  strong: false,
};

// How wrong the predicted number of lines has to be, relative to the measured one, before the characters per line are
// corrected. Correcting costs a full recompute of the positions, and the prediction is compared against the handful of
// logs on screen, so a small difference is noise: acting on it makes the count oscillate between two values and the
// component re-measure itself on every frame.
const CHARS_PER_LINE_TOLERANCE = 0.05;

// region Metadata

/**
 * @param {Metadata} metadata
 * @param {{[metadataName: string]: MetadataRenderer}} [metadataRenderers]
 * @return {MetadataRendering}
 */
export function getMetadataRendering(metadata, metadataRenderers) {
  const renderer = metadataRenderers?.[metadata.name];

  if (renderer == null) {
    return DEFAULT_METADATA_RENDERING;
  }

  const metadataRendering = typeof renderer === 'function' ? renderer(metadata) : renderer;

  /** @type {MetadataRendering} */
  return {
    ...DEFAULT_METADATA_RENDERING,
    ...metadataRendering,
  };
}

/**
 * @param {Metadata} metadata
 * @param {MetadataRendering} metadataRendering
 * @return {string}
 */
export function getMetadataText(metadata, metadataRendering) {
  return metadataRendering.text != null
    ? metadataRendering.text
    : `${metadataRendering.showName ? `${metadata.name}: ` : ''}${metadata.value}`;
}

/**
 * What a metadata is rendered as. Shared by the rendering and the height estimate, so the estimate follows the
 * rendering.
 *
 * @param {Metadata} metadata
 * @param {{[metadataName: string]: MetadataRenderer}} [metadataRenderers]
 * @return {{ rendering: MetadataRendering, text: string, size: number }|null} The rendering, the text as displayed
 * and the minimum width in characters (`0` for none), or `null` when the metadata is hidden.
 */
export function getRenderedMetadata(metadata, metadataRenderers) {
  const rendering = getMetadataRendering(metadata, metadataRenderers);
  if (rendering.hidden) {
    return null;
  }

  const text = getMetadataText(metadata, rendering);
  const size = typeof rendering.size === 'number' && rendering.size > 0 ? rendering.size : 0;
  return { rendering, text: size > 0 ? truncateString(text, size) : text, size };
}

// endregion

// region Line count

/**
 * How many characters a log is made of, one entry per line its own text already breaks into (the message is rendered
 * with `pre-wrap`, so its line breaks are kept). The metadata is rendered before the message on the same line, so it
 * counts towards the first one.
 *
 * @param {Log} log
 * @param {{[metadataName: string]: MetadataRenderer}} [metadataRenderers]
 * @return {Array<number>}
 */
export function getLogCharCounts(log, metadataRenderers) {
  const charCounts = stripAnsi(log.message)
    .split('\n')
    .map((line) => line.length);
  charCounts[0] += getMetadataCharCount(log, metadataRenderers);
  return charCounts;
}

/**
 * How many characters wide the metadata of a log is rendered. A metadata with a `size` is padded to (and truncated
 * at) that many characters, the others take the width of their text, and they are separated by one space.
 *
 * @param {Log} log
 * @param {{[metadataName: string]: MetadataRenderer}} [metadataRenderers]
 * @return {number}
 */
function getMetadataCharCount(log, metadataRenderers) {
  if (log.metadata == null) {
    return 0;
  }

  const renderedMetadata = log.metadata
    .map((metadata) => getRenderedMetadata(metadata, metadataRenderers))
    .filter((rendered) => rendered != null);
  const charCount = renderedMetadata.reduce((sum, rendered) => sum + Math.max(rendered.size, rendered.text.length), 0);
  return charCount + Math.max(0, renderedMetadata.length - 1);
}

/**
 * How many lines a log is expected to take once wrapped.
 *
 * @param {Array<number>} charCounts The characters of each line of the log, see `getLogCharCounts()`.
 * @param {number} charsPerLine How many characters fit on one wrapped line.
 * @return {number}
 */
export function estimateLineCount(charCounts, charsPerLine) {
  let lineCount = 0;
  for (const charCount of charCounts) {
    lineCount += Math.max(1, Math.ceil(charCount / charsPerLine));
  }
  return lineCount;
}

/**
 * How many lines a rendered log really takes, going by the height it was measured at.
 *
 * @param {number} height The measured height of the log row, in pixels.
 * @param {number} rowHeight The height of a single-line row, padding included, in pixels.
 * @param {number} lineHeight The height of one line of text, in pixels.
 * @return {number}
 */
export function countLines(height, rowHeight, lineHeight) {
  return Math.max(1, Math.round((height - rowHeight) / lineHeight) + 1);
}

/**
 * Moves the characters per line factor towards what would have predicted the measured number of lines.
 *
 * The move is damped by half, and a difference under `CHARS_PER_LINE_TOLERANCE` is left alone, because the logs it
 * learns from change as the user scrolls.
 *
 * @param {number} factor The current factor.
 * @param {number} estimatedLineCount How many lines the rendered logs were predicted to take.
 * @param {number} measuredLineCount How many lines they really take.
 * @return {number} The new factor, or `factor` itself when there is nothing to correct.
 */
export function calibrateCharsPerLineFactor(factor, estimatedLineCount, measuredLineCount) {
  if (measuredLineCount === 0 || estimatedLineCount === 0 || estimatedLineCount === measuredLineCount) {
    return factor;
  }

  const ratio = estimatedLineCount / measuredLineCount;
  if (Math.abs(ratio - 1) < CHARS_PER_LINE_TOLERANCE) {
    return factor;
  }

  return (factor + factor * ratio) / 2;
}

// endregion
