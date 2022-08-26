import { applyCodemod } from './apply-codemod.js';

function getLitProperties (node) {
  // static properties = {}
  if (node.type === 'ClassProperty' && node.static && node.key.name === 'properties') {
    return node.value.properties;
  }
  // static get properties () { return {} }
  if (node.type === 'ClassMethod' && node.static && node.key.name === 'properties') {
    return node.body.body[0].argument.properties;
  }
}

applyCodemod((ms, { node, parent, prop, index }) => {
  const properties = getLitProperties(node);
  if (properties != null) {
    properties
      .filter((p) => p.key.name.startsWith('_'))
      .forEach((p) => {
        const newOptions = p.value.properties
          .map((po) => {
            if (po.key.name === 'attribute') {
              return null;
            }
            return ms.slice(po.start, po.end);
          })
          .filter((a) => a != null);
        newOptions.push('state: true');
        ms.overwrite(p.value.start, p.value.end, `{ ${newOptions.join(', ')} }`);
      });
  }
});
