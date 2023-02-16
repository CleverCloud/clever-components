/**
 * @typedef {import('./ansi.types.js').AnsiPalette} AnsiPalette
 */

/**
 * @param {AnsiPalette} palette - The palette
 * @return {string} - The CSS style corresponding to the given palette.
 */
export function ansiPaletteStyle (palette) {
  return [
    ...Object.entries(palette).map(([colorName, color]) => `--ansi-${colorName}: ${color}`),
    'color: var(--ansi-foreground)',
    'background-color: var(--ansi-background);',
  ].join(';');
}
