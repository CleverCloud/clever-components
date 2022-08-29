import { applyCodemod } from './apply-codemod.js';

applyCodemod((ms, { node, parent, prop, index }) => {
  if (node.type === 'ImportDeclaration') {
    if (node.source.value === 'lit-element') {
      ms.overwrite(node.source.start, node.source.end, `'lit'`);
    }
    if (node.source.value.match(/^lit-html\/?/)) {
      const id = node.source.value.replace(/^lit-html/, 'lit');
      ms.overwrite(node.source.start, node.source.end, `'${id}'`);
    }
  }
});
