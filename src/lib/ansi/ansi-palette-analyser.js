import { getContrastRatio, hexToRgb, isDark } from '../color.js';

/**
 * @typedef {import('./ansi.types.js').AnsiPalette} AnsiPalette
 * @typedef {keyof AnsiPalette} ColorsType
 */

/** @type {Array<ColorsType>} */
const COLORS = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

/**
 * @param {AnsiPalette} palette
 */
export function analyzePalette(palette) {
  const background = hexToRgb(palette.background);
  /** @type {Array<ColorsType>} */
  const colorsToTest = getColorsToTest(isDark(background));

  const colorsCount = colorsToTest.length;
  let ratioSum = 0;
  let compliantCount = 0;

  /** @type {Partial<Record<ColorsType, { ratio: number, compliant: boolean }>>} */
  const contrasts = {};

  colorsToTest.forEach((colorName) => {
    const ratio = getContrastRatio(background, hexToRgb(palette[colorName]));
    const compliant = ratio >= 4.5;
    if (compliant) {
      compliantCount++;
    }
    ratioSum += ratio;
    contrasts[colorName] = { ratio, compliant };
  });

  return {
    totalColors: colorsCount,
    compliantColors: compliantCount,
    contrastAvg: ratioSum / colorsCount,
    contrasts,
  };
}

/**
 * @param {boolean} isDarkPalette
 * @return {Array<ColorsType>}
 */
function getColorsToTest(isDarkPalette) {
  const result = [...COLORS, isDarkPalette ? 'white' : 'black'];

  // @ts-ignore
  return [...result, ...result.map((c) => `bright-${c}`)];
}
