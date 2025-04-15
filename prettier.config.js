// @ts-expect-error
import pluginSortImports from 'prettier-plugin-organize-imports';
import sortGetPropsPlugin from './prettier-rules/sort-lit-get-properties.js';

// When there are multiple Prettier plugins, there can be conflicts when both try to use the same language parser.
// This occurs because when a language parser is re-assigned, handlers from previous plugins get lost.
// Below we merge the babel parser handling of both plugins to avoid overwriting each other.
// We need this hack until Prettier does something about it.
// Issue: https://github.com/prettier/prettier/issues/12807
/** @type {import("prettier").Parser}  */
const babelParser = {
  ...pluginSortImports.parsers.babel,
  parse: sortGetPropsPlugin.parsers.babel.parse,
};

/** @type {import("prettier").Parser}  */
const typescriptParser = {
  ...pluginSortImports.parsers.typescript,
};

/** @type {import("prettier").Plugin}  */
const myPlugin = {
  parsers: {
    babel: babelParser,
    typescript: typescriptParser,
  },
};

export default {
  plugins: [myPlugin],
  arrowParens: 'always',
  printWidth: 120,
  tabWidth: 2,
  singleQuote: true,
};
