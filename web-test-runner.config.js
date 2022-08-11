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
  nodeResolve: true,
  mimeTypes: {
    '**/*.json': 'js',
    '.**/*.json': 'js',
  },
  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <link rel="stylesheet" href="src/styles/default-theme.css" >
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  plugins: [
    cemAnalyzerPlugin,
    rollupAdapter(json()),
  ],
};
