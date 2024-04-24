/**
 * @typedef {import('./ansi.types.js').AnsiPalette} AnsiPalette
 */

/**
 * @param {AnsiPalette} palette - The palette
 * @return {string} - The CSS style corresponding to the given palette.
 */
export function ansiPaletteStyle(palette) {
  return [
    ...Object.entries(palette).map(([colorName, color]) => `--cc-color-ansi-${colorName}: ${color}`),
    'color: var(--cc-color-ansi-foreground)',
    'background-color: var(--cc-color-ansi-background);',
  ].join(';');
}
