// @ts-ignore no types available for this dependency
import { cli } from '@custom-elements-manifest/analyzer/cli.js';

/**
 * This Plugin should only be used in dev mode
 * This plugin handles resolving, loading and hot replacing the CEM (virtual) module.
 * In dev mode, we need to rely on a virtual file for the CEM so that we don't have
 * to constantly write a new CEM on the disk.
 * We have defined an alias that changes all `/dist/custom-elements.json` imports to
 * `virtual:custom-elements.json` (see dev config in `/.storybook/main.js`, `viteFinal`).
 *
 * To sum it up: in dev mode we import a virtual module/file, in prod we import an actual file.
 */
export default function generateCem() {
  // The naming `virtual` and `\0` are important,
  // see: https://vitejs.dev/guide/api-plugin#virtual-modules-convention for more info
  const virtualModuleId = 'virtual:custom-elements.json';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    // the name is required, it will show up in warnings and errors
    name: 'generate-cem',
    /** @type {import('vite').Rollup.ResolveIdHook} */
    resolveId(id) {
      if (id.includes(virtualModuleId)) {
        return resolvedVirtualModuleId;
      }
    },
    /** @type {import('vite').Rollup.LoadHook} */
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        const cemJson = await cli({
          argv: ['analyze'],
          noWrite: true,
        });

        return JSON.stringify(cemJson);
      }
    },
    /** @param {import('vite').HmrContext} context */
    handleHotUpdate({ server, file }) {
      const isComponentFileRegex = /cc-[^/]+\.js$/;

      if (file.match(isComponentFileRegex)) {
        const cemModule = server.moduleGraph.getModuleById(resolvedVirtualModuleId);

        // When serving a component file outside of Storybook (`demo-smart` / `sandbox`),
        // the cemModule is `undefined` because CEM is not imported by any file (no docs to display, no Storybook UI, etc.)
        if (cemModule == null) {
          return;
        }

        server.moduleGraph.invalidateModule(cemModule);
      }
    },
  };
}
