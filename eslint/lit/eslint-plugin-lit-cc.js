import sortLitGetProperties from './custom-rules/sort-lit-get-properties.js';

export default {
  meta: {
    name: 'lit-cc',
    version: '0.1.0',
  },
  rules: {
    'sort-get-properties': sortLitGetProperties,
  },
};
