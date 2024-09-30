import fs from 'fs';

export function stylesAssetsPlugin(options) {
  const transform = options?.transform ?? ((css) => css);
  return {
    generateBundle: async function () {
      const stylesheet = fs.readFileSync('src/styles/default-theme.css', 'utf8');
      const minifiedStylesheet = transform(stylesheet);

      this.emitFile({
        type: 'asset',
        name: 'default-theme.css',
        source: minifiedStylesheet,
      });
    },
  };
}
