/**
 * CEM analyzer plugin: support-cssdisplay-jsdoc
 *
 * This plugin adds support for the @cssdisplay JSDoc tag.
 * This JSDoc tag helps author to document the default display of a custom element.
 *
 * This plugin will add a custom field "cssDisplay" to the CEM.
 * This plugin will also add this info at the beginning of the description, just after the first empty line.
 */
export default function supportCssdisplayJsdoc() {
  return {
    name: 'support-cssdisplay-jsdoc',
    analyzePhase({ ts, node, moduleDoc }) {
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:
          node?.jsDoc?.forEach((jsDoc) => {
            jsDoc?.tags
              ?.filter((tag) => tag.tagName.getText() === 'cssdisplay')
              ?.forEach((tag) => {
                const cssDisplay = tag.comment;

                const classDeclaration = moduleDoc.declarations.find(
                  (declaration) => declaration.name === node.name.getText(),
                );
                classDeclaration.cssDisplay = cssDisplay;

                const displayLine = `🎨 default CSS display: \`${cssDisplay}\``;

                const descriptionLines = classDeclaration.description.split('\n');
                const firstEmptyLineIndex = descriptionLines.findIndex((line) => line === '');
                if (firstEmptyLineIndex === -1) {
                  descriptionLines.push('', displayLine);
                } else {
                  descriptionLines.splice(firstEmptyLineIndex, 0, '', displayLine);
                }
                classDeclaration.description = descriptionLines.join('\n');
              });
          });
      }
    },
  };
}
