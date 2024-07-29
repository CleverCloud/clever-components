import ansiRegEx from 'ansi-regex';
import { css, html, unsafeCSS } from 'lit';
import { MemoryCache } from '../memory-cache.js';

/**
 * @typedef {import('./ansi.types.js').AnsiPart} AnsiPart
 */

/** @type {AnsiParser} - Lazy loaded parser */
let ansiParser;

const ANSI_EFFECTS = [
  {
    name: 'bold',
    code: 1,
    escapes: [21, 22],
    style: 'font-weight: bold',
  },
  {
    name: 'dim',
    code: 2,
    escapes: [21, 22],
    style: 'opacity: 0.5',
  },
  {
    name: 'italic',
    code: 3,
    escapes: [23],
    style: 'font-style: italic',
  },
  {
    name: 'underline',
    code: 4,
    escapes: [24],
    style: 'text-decoration: underline',
  },
  {
    name: 'inverse',
    code: 7,
    escapes: [27],
  },
  {
    name: 'hidden',
    code: 8,
    escapes: [28],
    style: 'display: none',
  },
  {
    name: 'strikethrough',
    code: 9,
    escapes: [29],
    style: 'text-decoration: line-through;',
  },
];

const ANSI_COLORS = [
  {
    name: 'black',
    code: 30,
  },
  {
    name: 'red',
    code: 31,
  },
  {
    name: 'green',
    code: 32,
  },
  {
    name: 'yellow',
    code: 33,
  },
  {
    name: 'blue',
    code: 34,
  },
  {
    name: 'magenta',
    code: 35,
  },
  {
    name: 'cyan',
    code: 36,
  },
  {
    name: 'white',
    code: 37,
  },

  {
    name: 'bright-black',
    code: 90,
  },
  {
    name: 'bright-red',
    code: 91,
  },
  {
    name: 'bright-green',
    code: 92,
  },
  {
    name: 'bright-yellow',
    code: 93,
  },
  {
    name: 'bright-blue',
    code: 94,
  },
  {
    name: 'bright-magenta',
    code: 95,
  },
  {
    name: 'bright-cyan',
    code: 96,
  },
  {
    name: 'bright-white',
    code: 97,
  },
];

const ANSI_STYLES_MAP = new Map();
ANSI_EFFECTS.forEach((s) => {
  ANSI_STYLES_MAP.set(s.name, { ...s, type: 'effect' });
});
ANSI_COLORS.forEach((style) => {
  const textStyleName = `text-${style.name}`;
  const bgStyleName = `bg-${style.name}`;

  const fgCode = style.code;
  const bgCode = style.code + 10;

  ANSI_STYLES_MAP.set(textStyleName, { name: textStyleName, code: fgCode, escapes: [39], type: 'color' });
  ANSI_STYLES_MAP.set(bgStyleName, { name: bgStyleName, code: bgCode, escapes: [49], type: 'color' });
});

/**
 * Remove all ANSI escape codes from the given text.
 * @param {string} text
 * @return {string}
 */
export function stripAnsi(text) {
  return text.replace(ansiRegEx(), '');
}

/**
 * Converts the given text into Lit template according to the ANSI escape codes found in text.
 *
 * When using this, don't forget to include the `ansiPaletteStyle` CSS rules to a parent element. (see ./ansi-palette-style)
 *
 * @param {string} text
 */
export function ansiToLit(text) {
  if (ansiParser == null) {
    ansiParser = new AnsiParser();
  }

  const tokens = ansiParser.parse(text);
  return tokens.map((token) => {
    if (token.styles.length === 0) {
      return token.text;
    }

    const cssClass = token.styles.map((styleName) => `ansi-${styleName}`).join(' ');
    return html`<span class="${cssClass}">${token.text}</span>`;
  });
}

/**
 * When you want to support ANSI, you also need to import the CSS rules.
 */
export const ansiStyles = [
  css`
    .ansi-reset {
      background-color: var(--cc-color-ansi-background);
      color: var(--cc-color-ansi-foreground);
      font-style: normal;
      font-weight: normal;
      opacity: 1;
      text-decoration: none;
    }

    .ansi-inverse {
      background-color: var(--cc-color-ansi-foreground);
      color: var(--cc-color-ansi-background);
    }
  `,
  ...[
    ...ANSI_EFFECTS.map((style) => {
      if (style.style != null) {
        return `.ansi-${style.name} {${style.style};}`;
      }
      return null;
    }).filter((s) => s != null),
    ...ANSI_COLORS.map((style) => {
      const styleName = style.name;
      const styleVar = `var(--cc-color-ansi-${styleName})`;

      return `
          .ansi-text-${styleName} {
            color: ${styleVar};
          }
          .ansi-text-${styleName}.ansi-inverse {
            background-color: ${styleVar} !important;
          }
          .ansi-bg-${styleName} {
            background-color: ${styleVar};
          }
          .ansi-bg-${styleName}.ansi-inverse {
            color: ${styleVar} !important;
          }`;
    }),
  ].map(unsafeCSS),
];

// --
// -- From this point, the code below is a rework of `ansi-style-parser` npm library.
// -- It uses modern JavaScript
// -- Adds support of combination with semicolon : ^<ESC^>[1;31;106m
// -- Uses an in memory cache to speed up parsing

class AnsiParser {
  constructor() {
    /** @type {Map<string, string>} */
    this.codeToStyle = new Map();
    /** @type {Map<string, Set<string>>} */
    this.escapeCodes = new Map();

    /** @type {MemoryCache<string, Array<AnsiPart>>} */
    this.cache = new MemoryCache((str) => this._doParse(str), 1000);

    this._init();
  }

  _init() {
    /** @type {Map<string, Set<string>>} */
    const commonEscapes = new Map();

    /**
     * @param {string} name
     * @param {string} code
     * @param {Array<string>} escapes
     */
    const handleCode = (name, code, escapes) => {
      const ansiCode = toAnsi(code);
      this.codeToStyle.set(ansiCode, name);

      escapes.forEach((num) => {
        const escCode = toAnsi(num);
        addToIndexMap(this.escapeCodes, escCode, name);
        addToIndexMap(commonEscapes, escCode, ansiCode);
      });
      addToIndexMap(this.escapeCodes, toAnsi(''), name);
      addToIndexMap(this.escapeCodes, toAnsi(0), name);
    };

    ANSI_STYLES_MAP.forEach((style) => {
      handleCode(style.name, style.code, style.escapes);
    });

    for (const styles of commonEscapes.values()) {
      styles.forEach((style1) => {
        styles.forEach((style2) => {
          if (style1 !== style2) {
            addToIndexMap(this.escapeCodes, style1, this.codeToStyle.get(style2));
          }
        });
      });
    }
  }

  /**
   * @param {string} str
   * @return {Array<AnsiPart>}
   */
  parse(str) {
    return this.cache.get(str);
  }

  /**
   * @param {string} str
   * @return {Array<AnsiPart>}
   */
  _doParse(str) {
    /** @type {Array<AnsiPart>} */
    const result = [];
    let curr = str;
    /** @type {Array<string>} */
    const currStyle = [];

    let regexExec = ansiRegEx().exec(curr);
    while (regexExec != null) {
      if (regexExec.index > 0) {
        result.push({
          styles: currStyle.slice(0),
          text: curr.substring(0, regexExec.index),
        });
      }

      // here we handle combination with semicolon. For example: `^<ESC^>[1;31;106m`
      const ansiCodes = fromAnsi(regexExec[0])
        .split(';')
        .map((c) => toAnsi(c));

      ansiCodes.forEach((ansiCode) => {
        this.escapeCodes.get(ansiCode)?.forEach((styleName) => {
          removeElm(currStyle, styleName);
        });
        if (this.codeToStyle.has(ansiCode)) {
          currStyle.push(this.codeToStyle.get(ansiCode));
        }
      });

      curr = curr.substring(regexExec.index + regexExec[0].length);

      regexExec = ansiRegEx().exec(curr);
    }
    if (curr.length > 0) {
      result.push({
        styles: currStyle,
        text: curr,
      });
    }
    return result;
  }
}

/**
 *
 * @param {Map<string, Set<string>>} map
 * @param {string} key
 * @param {string} value
 */
function addToIndexMap(map, key, value) {
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(value);
}

/**
 * @param {Array<T>} arr
 * @param {T} val
 * @template T
 */
function removeElm(arr, val) {
  const i = arr.indexOf(val);
  if (i >= 0) {
    arr.splice(i, 1);
  }
}

/**
 * @param {string|number} code
 * @return {string}
 */
function toAnsi(code) {
  return `\u001b[${code}m`;
}

/**
 * @param {string} ansiCode
 * @return {string}
 */
function fromAnsi(ansiCode) {
  return ansiCode.slice(2, ansiCode.length - 1);
}
