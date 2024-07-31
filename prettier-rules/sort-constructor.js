import { parsers } from 'prettier/parser-babel.js';

const babelParser = parsers.babel;

const organizeConstructor = (code, options) => {
  console.log(code);

  return code;
};

const plugin = {
  parsers: {
    babel: babelParser,
  },
};

export { plugin };
