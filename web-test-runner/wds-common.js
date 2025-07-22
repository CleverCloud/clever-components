import rollupCommonjs from '@rollup/plugin-commonjs';
import { fromRollup } from '@web/dev-server-rollup';
import { esbuildBundlePlugin } from './esbuild-bundle-plugin.js';

const commonjs = fromRollup(rollupCommonjs);

function commonJsIdentifiers(ids) {
  return ids.map((id) => `**/node_modules/${id}/**/*`);
}

// regroup ES module files into one bundle
export const esbuildBundlePluginWithConfig = esbuildBundlePlugin({
  pathsToBundle: ['/src/lib/leaflet-esm.js', '/node_modules/chart.js/dist/chart.esm.js'],
});

// convert CommonJS modules to ES6 to be included in the rollup bundle
export const commonjsPluginWithConfig = commonjs({
  // the commonjs plugin is slow, list the required packages explicitly:
  include: commonJsIdentifiers([
    'statuses',
    // used by clever-client
    'oauth-1.0a',
    'component-emitter',
  ]),
});
