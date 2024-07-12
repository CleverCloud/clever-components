import { getContrastRatio, hexToRgb, isDark } from '../color.js';

const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan'];

/**
 *
 * @param {AnsiPalette} palette
 */
export function analyzePalette(palette) {
  const background = hexToRgb(palette.background);
  const colorsToTest = getColorsToTest(isDark(background));

  const colorsCount = colorsToTest.length;
  let ratioSum = 0;
  let compliantCount = 0;

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

function getColorsToTest(isDarkPalette) {
  const result = [...colors, isDarkPalette ? 'white' : 'black'];

  return [...result, ...result.map((c) => `bright-${c}`)];
}
