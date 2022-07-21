module.exports = function (file, api, options) {

  // console.log(file, api, options);
  // console.log(file);

  const j = api.jscodeshift;

  // console.log(file.source);

  return j(file.source)
    .find(j.MethodDefinition)
    .filter(({ node }) => {
      return true
        && node.kind === 'get'
        && node.static
        && node.key?.name === 'properties';
    })
    .find(j.ReturnStatement)
    .replaceWith(({ node }) => {
      node.argument.properties.sort((a, b) => {

        const aPrivate = a.key.name.startsWith('_');
        const bPrivate = b.key.name.startsWith('_');

        if (aPrivate && !bPrivate) {
          return 1;
        }
        if (!aPrivate && bPrivate) {
          return -1;
        }

        return a.key.name.localeCompare(b.key.name);
      });
      return node;
    })
    .toSource();
};
