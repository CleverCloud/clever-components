module.exports = {
  'extends': 'standard',
  'plugins': [
    'import',
  ],
  'rules': {
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', 'stroustrup'],
    'comma-dangle': ['error', 'always-multiline'],
    'import/extensions': ['error', 'always'],
    'import/first': ['error'],
    'import/newline-after-import': ['error', { 'count': 1 }],
    'import/no-useless-path-segments': ['error', { 'noUselessIndex': true }],
    'import/order': ['error', { 'alphabetize': { 'order': 'asc', 'caseInsensitive': true } }],
    'line-comment-position': ['error', { 'position': 'above' }],
    'operator-linebreak': ['error', 'before'],
    'padded-blocks': 'off',
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'semi': ['error', 'always'],
  },
};
