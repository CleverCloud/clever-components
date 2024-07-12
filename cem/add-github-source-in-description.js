/**
 * CEM analyzer plugin: add-github-source-in-description
 *
 * This plugin adds the public GitHub source in the description of each element.
 * It adds it at the beginning of the description, just after the first empty line.
 */
export default function addGithubSourceInDescription(options = {}) {
  const { githubProject } = options;
  return {
    name: 'add-github-source-in-description',
    moduleLinkPhase({ moduleDoc }) {
      const sourceLine = `🧐 [component's source code on GitHub](https://github.com/${githubProject}/blob/master/${moduleDoc.path})`;

      moduleDoc.declarations
        ?.filter((declaration) => declaration.kind === 'class')
        ?.forEach((declaration) => {
          const descriptionLines = declaration.description.split('\n');
          const firstEmptyLineIndex = descriptionLines.findIndex((line) => line === '');
          if (firstEmptyLineIndex === -1) {
            descriptionLines.push('', sourceLine);
          } else {
            descriptionLines.splice(firstEmptyLineIndex, 0, '', sourceLine);
          }
          declaration.description = descriptionLines.join('\n');
        });
    },
  };
}
