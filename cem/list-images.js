import { sortBy } from '../src/lib/utils.js';

function isRelativeImageUrlExpression(ts, node) {
  return (
    node?.expression?.getText() === 'URL' &&
    node.arguments.length === 2 &&
    node.arguments[0].text.startsWith('../assets/') &&
    node.arguments[0].text.endsWith('.svg') &&
    node.arguments[1].getText() === 'import.meta.url'
  );
}

/**
 * CEM analyzer plugin: list-images
 *
 * This plugin looks for images referenced in components and list them in the description.
 */
export default function listImages() {
  return {
    name: 'list-images',
    analyzePhase({ ts, node, moduleDoc, context }) {
      // Use context to store all images we found
      if (context.images == null) {
        context.images = [];
      }

      switch (node.kind) {
        case ts.SyntaxKind.NewExpression:
          if (isRelativeImageUrlExpression(ts, node)) {
            const imageSrc = node.arguments[0].text.replace('../assets/', 'assets/');
            const imageName = node.arguments[0].text.replace('../assets/', '');
            context.images.push({ imageSrc, imageName, modulePath: moduleDoc.path });
          }
      }
    },
    packageLinkPhase({ customElementsManifest, context }) {
      // Sort images by name
      context?.images?.sort(sortBy('imageName'));

      customElementsManifest?.modules?.forEach((module) => {
        module?.declarations
          ?.filter((declaration) => declaration.kind === 'class')
          ?.forEach((declaration) => {
            // If there are images for this module, add the list to the description
            const images = context?.images?.filter(({ modulePath }) => modulePath === module.path);
            if (images?.length > 0 && declaration.description != null) {
              const imagesDocumentation = [
                '## Images',
                '',
                '| | |',
                '|-------|------|',
                ...images.map(({ imageSrc, imageName }) => {
                  return `| <img src="${imageSrc}" style="height: 1.5rem; vertical-align: middle"> | <code>${imageName}</code>`;
                }),
              ].join('\n');
              declaration.description = declaration.description + '\n\n' + imagesDocumentation;
            }
          });
      });
    },
  };
}
