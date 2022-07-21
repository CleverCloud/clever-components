export default function (file, api, options) {

  const j = api.jscodeshift;
  const root = j(file.source);

  function sortMembers (a, b) {

    const aPrivate = a.startsWith('_');
    const bPrivate = b.startsWith('_');

    if (aPrivate && !bPrivate) {
      return 1;
    }
    if (!aPrivate && bPrivate) {
      return -1;
    }

    return a.localeCompare(b);
  }

  root
    .find(j.MethodDefinition)
    .filter(({ node }) => {
      return true
        && node.kind === 'get'
        && node.static
        && node.key?.name === 'properties';
    })
    .find(j.ReturnStatement)
    .forEach(({ node }) => {
      node.argument.properties.sort((a, b) => {
        return sortMembers(a.key.name, b.key.name);
      });
    });

  root
    .find(j.MethodDefinition)
    .filter(({ node }) => {
      return true
        && node.kind === 'get'
        && node.static
        && node.key?.name === 'properties';
    })
    .find(j.ReturnStatement)
    .forEach(({ node }) => {
      node.argument.properties.forEach((property) => {
        if (property.key.name.startsWith('_')) {
          const attributeProperty = property.value.properties.find((p) => p.key.name === 'attribute');
          if (attributeProperty == null) {
            property.value.properties.push(
              j.property(
                'init',
                j.identifier('attribute'),
                j.literal(false),
              ),
            );
          }
        }
      });
    });

  // root
  //   .find(j.MethodDefinition)
  //   .filter(({ node }) => {
  //     return true
  //       && node.kind === 'constructor';
  //   })
  //   .find(j.BlockStatement)
  //   .forEach(({ node }) => {
  //     const bodyAssignements = node.body;
  //     bodyAssignements.sort((a, b) => {
  //       if (a?.expression?.callee?.type === 'Super') {
  //         return -1;
  //       }
  //       if (b?.expression?.callee?.type === 'Super') {
  //         return 1;
  //       }
  //       const aName = a?.expression?.left?.property?.name;
  //       const bName = b?.expression?.left?.property?.name;
  //       return sortMembers(aName, bName);
  //     });
  //   });

  return root.toSource({ trailingComma: true });
};
