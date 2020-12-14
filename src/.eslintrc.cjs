/* eslint-disable quote-props */
module.exports = {
  'env': {
    'browser': true,
  },
  'rules': {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': false,
      'optionalDependencies': false,
      'peerDependencies': false,
    }],
  },
};
