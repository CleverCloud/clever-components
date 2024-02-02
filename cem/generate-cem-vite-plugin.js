import { cli } from '@custom-elements-manifest/analyzer/cli.js';

export default function generateCem () {
  const virtualModuleId = '/dist/custom-elements.json';
  // the `\0` convention is recommended by rollup when dealing with virtual files / modules
  // see https://vitejs.dev/guide/api-plugin#virtual-modules-convention for more info
  // Based on this convention we should have used `virtual:custom-elements.json` but it would
  // complicate things because once storybook is built, we actually import the manifest from this path
  // To sum it up: in dev mode we import a virtual module, in prod we import an actual file.
  // We use the actual path of the manifest as module id to avoid having to set a different path in dev / build
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    // the name is required, it will show up in warnings and errors
    name: 'generate-cem',
    resolveId (id) {
      if (id.includes(virtualModuleId)) {
        return resolvedVirtualModuleId;
      }
    },
    async load (id) {
      if (id === resolvedVirtualModuleId) {
        const cemJson = await cli({
          argv: ['analyze'],
          noWrite: true,
        });

        return JSON.stringify(cemJson);
      }
    },
  };
}
