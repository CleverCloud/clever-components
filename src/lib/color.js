/**
 * @typedef {import('./color.types.js').RgbColor} RgbColor
 * @typedef {import('./color.types.js').HslColor} HslColor
 */

/**
 * Transforms the given color in hex format into RGB.
 * @param {string} hex
 * @return {RgbColor}
 * @throws Error when the given color is not in hex format.
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result == null) {
    throw new Error(`The color "${hex}" is not in hex format`);
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Transforms the given RGB color into hex format.
 * @param {RgbColor} color
 * @return {string}
 */
export function rgbToHex(color) {
  return '#' + [color.r, color.g, color.b].map((n) => n.toString(16).padStart(2, '0')).join('');
}

/**
 * Transforms the given RGB color into HSL format.
 * @param {RgbColor} color
 * @return {HslColor}
 */
export function rgbToHsl(color) {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;

  const max = Math.max(r, Math.max(g, b));
  const min = Math.min(r, Math.min(g, b));
  const delta = max - min;

  let h;
  if (delta === 0) {
    h = 0;
  } else if (max === r) {
    h = 60 * (((g - b) / delta) % 6);
  } else if (max === g) {
    h = 60 * ((b - r) / delta + 2);
  } else {
    h = 60 * ((r - g) / delta + 4);
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s, l };
}

/**
 * Transforms the given HSL color into RGB format.
 * @param {HslColor} hsl
 * @return {RgbColor}
 */
export function hslToRgb(hsl) {
  const c = (1 - Math.abs(2 * hsl.l - 1)) * hsl.s;
  const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
  const m = hsl.l - c / 2;

  let p;

  if (hsl.h >= 0 && hsl.h < 60) {
    p = { r: c, g: x, b: 0 };
  } else if (hsl.h >= 60 && hsl.h < 120) {
    p = { r: x, g: c, b: 0 };
  } else if (hsl.h >= 120 && hsl.h < 180) {
    p = { r: 0, g: c, b: x };
  } else if (hsl.h >= 180 && hsl.h < 240) {
    p = { r: 0, g: x, b: c };
  } else if (hsl.h >= 240 && hsl.h < 300) {
    p = { r: x, g: 0, b: c };
  } else if (hsl.h >= 300 && hsl.h < 360) {
    p = { r: c, g: 0, b: x };
  }

  return {
    r: (p.r + m) * 255,
    g: (p.g + m) * 255,
    b: (p.b + m) * 255,
  };
}

/**
 * Get the luminosity of the given RGB color
 * @param {RgbColor} color
 * @return {number}
 */
export function getLuminosity(color) {
  return (
    getComposantValue(color.r) * 0.2126 + getComposantValue(color.g) * 0.7152 + getComposantValue(color.b) * 0.0722
  );
}

/**
 * Returns whether the given color is dark.
 *
 * @param {RgbColor} color
 * @return {boolean}
 */
export function isDark(color) {
  return getLuminosity(color) < 0.5;
}

/**
 * @param {RgbColor} color1
 * @param {RgbColor} color2
 * @return {number}
 */
export function getContrastRatio(color1, color2) {
  const l1 = getLuminosity(color1);
  const l2 = getLuminosity(color2);
  return l1 > l2 ? computeContrast(l1, l2) : computeContrast(l2, l1);
}

/**
 * @param {RgbColor} color
 * @param {number} percent
 * @return {RgbColor}
 */
export function shadeColor(color, percent) {
  const shade = /** @param {number} n */ (n) => {
    return Math.round(Math.max(0, Math.min(255, n + Math.round(2.55 * percent))));
  };

  return {
    r: shade(color.r),
    g: shade(color.g),
    b: shade(color.b),
  };
}

/**
 * @param {number} lighterLuminosity
 * @param {number} darkerLuminosity
 * @return {number}
 */
function computeContrast(lighterLuminosity, darkerLuminosity) {
  return (lighterLuminosity + 0.05) / (darkerLuminosity + 0.05);
}

/**
 * @param {number} composant
 * @return {number}
 */
function getComposantValue(composant) {
  const c = composant / 255;
  if (c <= 0.03928) {
    return c / 12.92;
  } else {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  }
}
