import esbuild from 'esbuild';

// /!\ This is an experimentatl plugin for now
// We created this because some of our deps have way to many separated ES module files (RxJS, Leaflet...)
export function esbuildBundlePlugin ({ pathsToBundle }) {
  return {

    async transform (context) {

      if (pathsToBundle.includes(context.request.url)) {

        const bundle = esbuild.buildSync({
          entryPoints: [context.request.url.slice(1)],
          bundle: true,
          format: 'esm',
          minify: true,
          write: false,
        });

        const code = bundle.outputFiles[0].text;

        return code;
      }
    },
  };
}
