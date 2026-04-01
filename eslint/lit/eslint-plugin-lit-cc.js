import sortLitElementMembers from './custom-rules/sort-lit-element-members.js';
import sortLitGetProperties from './custom-rules/sort-lit-get-properties.js';

export default {
  meta: {
    name: 'lit-cc',
    version: '0.1.0',
  },
  rules: {
    'sort-element-members': sortLitElementMembers,
    'sort-get-properties': sortLitGetProperties,
  },
};
