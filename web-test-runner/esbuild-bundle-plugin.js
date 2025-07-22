import esbuild from 'esbuild';

// /!\ This is an experimental plugin for now
// We created this because some of our deps have way to many separated ES module files (Leaflet, chart.js...)
export function esbuildBundlePlugin({ pathsToBundle }) {
  return {
    async transform(context) {
      if (pathsToBundle.includes(context.request.url)) {
        const bundle = esbuild.buildSync({
          entryPoints: [context.request.url.slice(1)],
          bundle: true,
          format: 'esm',
          minify: true,
          write: false,
          // prevents esbuild from bundling types instead of the actual package
          // because of the `paths` option within the regular `tsconfig.json` file
          tsconfig: 'src/lib/leaflet/tsconfig-empty.json',
        });

        const code = bundle.outputFiles[0].text;

        return code;
      }
    },
  };
}
