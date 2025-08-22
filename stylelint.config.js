/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-order', 'stylelint-no-unsupported-browser-features'],
  customSyntax: 'postcss-styled-syntax',
  rules: {
    'order/properties-alphabetical-order': true,
    'no-duplicate-selectors': true,
    'color-hex-length': 'short',
    'selector-attribute-quotes': 'always',
    'value-no-vendor-prefix': true,
    'font-weight-notation': 'named-where-possible',
    'font-family-name-quotes': 'always-unless-keyword',
    'comment-whitespace-inside': 'always',
    'comment-empty-line-before': null,
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['first-nested', 'after-single-line-comment'],
        ignore: ['after-comment'],
      },
    ],
    'selector-pseudo-element-colon-notation': 'double',
    'media-feature-name-no-vendor-prefix': true,
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'plugin/no-unsupported-browser-features': [
      true,
      {
        browsers: ['extends browserslist-config-baseline'],
        ignore: [
          'css3-cursors',
          'intrinsic-width',
          'css-resize',
          'css-display-contents',
          'css-subgrid',
          'multicolumn',
          'css-clip-path',
          'css-masks',
          'css-container-queries',
        ],
      },
    ],
    'property-no-vendor-prefix': null,
    'selector-class-pattern': [
      '^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$',
      {
        message: 'Expected class selector to be either kebab-case, kebab--case or snake__case',
      },
    ],
    'selector-id-pattern': [
      '^([a-z][a-z0-9]*)((-{1,2}|_{1,2})[a-z0-9]+)*$',
      {
        message: 'Expected id selector to be either kebab-case, kebab--case or snake__case',
      },
    ],
  },
};
