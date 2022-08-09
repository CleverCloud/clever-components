import json from '@rollup/plugin-json';
import { rollupAdapter } from '@web/dev-server-rollup';
import { generateCustomElementsManifest } from './tasks/cem-analyzer.js';

const cemAnalyzerPlugin = {
  name: 'cem-analyzer-plugin',
  async serve (context) {
    if (context.path === '/dist/custom-elements.json') {
      return generateCustomElementsManifest();
    }
  },
};

export default {
  mimeTypes: {
    '**/*.json': 'js',
    '.**/*.json': 'js',
  },
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
  ],
};
