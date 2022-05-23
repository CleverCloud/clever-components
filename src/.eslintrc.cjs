/* eslint-disable quote-props */
module.exports = {
  'rules': {
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': false,
      'optionalDependencies': false,
      'peerDependencies': false,
    }],
  },
};
