import { cli } from '@custom-elements-manifest/analyzer/cli.js';

const path = '/dist/custom-elements.json';

// This plugin generates and serves the CEM on demand.
export const cemAnalyzerPlugin = {
  name: 'cem-analyzer-plugin',
  // we disable transform cache to enforce generation for every call
  transform(context) {
    if (context.path === path) {
      return {
        transformCache: false,
      };
    }
  },
  async serve(context) {
    if (context.path === path) {
      const cemJson = await cli({
        argv: ['analyze'],
        noWrite: true,
      });

      return JSON.stringify(cemJson);
    }
  },
};
