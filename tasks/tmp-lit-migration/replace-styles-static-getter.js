import { applyCodemod } from './apply-codemod.js';

applyCodemod((ms, { node, parent, prop, index }) => {
  if (node.type === 'ClassMethod' && node.static && node.key.name === 'styles') {
    const returnStatement = node.body.body[0];
    if (returnStatement.type !== 'ReturnStatement' || node.body.body.length !== 1) {
      throw new Error('Bad properties');
    }
    const newBody = ms.slice(returnStatement.argument.start, returnStatement.argument.end)
      .split('\n')
      .map((line, i) => (i === 0) ? line : line.slice(2))
      .join('\n');
    ms.overwrite(node.start, node.end, 'static styles = ' + newBody + ';');
  }
});
