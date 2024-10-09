/* eslint-disable quote-props */
module.exports = {
  'rules': {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': ["**/*.test.js"],
      'optionalDependencies': false,
      'peerDependencies': false,
    }],
  },
};
