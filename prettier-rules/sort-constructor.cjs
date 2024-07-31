const { parsers } = require('prettier/parser-babel.js');
const babelParser = parsers.babel;

function prepreocess(code, options) {}

module.exports = {
  parsers: {
    babel: {
      ...babelParser,
      preprocess: (code, options) => prepreocess(code, options),
    },
  },
};
