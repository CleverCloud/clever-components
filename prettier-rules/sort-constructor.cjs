const { parsers } = require('prettier/parser-babel.js');
const babelParser = parsers.babel;

function prepreocess(code, options) {
  console.log('preprocessing...');
  return code;
}

module.exports = {
  parsers: {
    babel: {
      ...babelParser,
      preprocess: (code, options) => prepreocess(code, options),
    },
  },
};
