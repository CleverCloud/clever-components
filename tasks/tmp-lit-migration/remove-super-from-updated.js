import { applyCodemod } from './apply-codemod.js';

applyCodemod((ms, { node, parent, prop, index }) => {
  if (node.type === 'ClassMethod' && node.key.name === 'updated') {
    const superUpdateCallIndex = node.body.body.findIndex((n) => {
      return n.type === 'ExpressionStatement'
        && n.expression.type === 'CallExpression'
        && n.expression.callee.type === 'MemberExpression'
        && n.expression.callee.object.type === 'Super'
        && n.expression.callee.property.name === 'update';
    });
    if (superUpdateCallIndex >= 1) {
      const previousStatement = node.body.body[superUpdateCallIndex - 1];
      const superUpdateCall = node.body.body[superUpdateCallIndex];
      ms.overwrite(previousStatement.end, superUpdateCall.end, '');
    }
    if (superUpdateCallIndex === 0) {
      const superUpdateCall = node.body.body[superUpdateCallIndex];
      ms.overwrite(node.body.start + 1, superUpdateCall.end, '');
    }
  }
});
