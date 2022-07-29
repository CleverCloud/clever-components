import path from 'path';

export function indexGeneratorPlugin (files) {
  return {
    name: 'index-generator',
    generateBundle (options, outputBundle) {

      const source = files
        .map((f) => {
          const filename = path.parse(f).base;
          return `import './${filename}';`;
        })
        .join('\n');

      this.emitFile({
        type: 'asset',
        id: 'index',
        fileName: 'index.js',
        source,
      });
    },
  };
}
