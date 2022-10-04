import path from 'path';
import { importMetaAssets } from '@web/rollup-plugin-import-meta-assets';
import CleanCSS from 'clean-css';
import glob from 'glob';
import babel from 'rollup-plugin-babel';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import SVGO from 'svgo';

const svgo = new SVGO({
  // See https://github.com/svg/svgo#what-it-can-do
  plugins: [
    { inlineStyles: true },
    { removeDoctype: true },
    { removeXMLProcInst: false },
    { removeComments: true },
    { removeMetadata: true },
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessDefs: true },
    { removeXMLNS: false },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: false },
    { removeHiddenElems: false },
    { removeEmptyText: false },
    { removeEmptyContainers: false },
    { removeViewBox: false },
    { cleanupEnableBackground: false },
    { minifyStyles: true },
    { convertStyleToAttrs: false },
    { convertColors: true },
    { convertPathData: true },
    { convertTransform: false },
    { removeUnknownsAndDefaults: true },
    { removeNonInheritableGroupAttrs: false },
    { removeUselessStrokeAndFill: false },
    { removeUnusedNS: true },
    { prefixIds: false },
    { cleanupIDs: true },
    { cleanupNumericValues: true },
    { cleanupListOfValues: false },
    { moveElemsAttrsToGroup: false },
    { moveGroupAttrsToElems: false },
    { collapseGroups: false },
    { removeRasterImages: false },
    { mergePaths: false },
    { convertShapeToPath: false },
    { convertEllipseToCircle: false },
    { sortAttrs: true },
    { sortDefsChildren: false },
    { removeDimensions: false },
    { removeAttrs: false },
    { removeAttributesBySelector: false },
    { removeElementsByAttr: false },
    { addClassesToSVGElement: false },
    { addAttributesToSVGElement: false },
    { removeOffCanvasPaths: false },
    { removeStyleElement: false },
    { removeScriptElement: false },
    { reusePaths: false },
  ],
});

export function multiGlob (patterns, opts) {
  return patterns.flatMap((pattern) => glob.sync(pattern, opts));
}

export function minifyStylesheet (stylesheet) {
  const minifiedStylesheet = new CleanCSS().minify(stylesheet);

  return minifiedStylesheet.styles;
}

export function getMainFiles (sourceDir) {

  const mainFilesPatterns = [
    `${sourceDir}/components/**/*.js`,
    `${sourceDir}/lib/i18n.js`,
    `${sourceDir}/lib/smart-manager.js`,
    `${sourceDir}/translations/*.js`,
  ];

  const ignorePatterns = [
    `${sourceDir}/components/**/*.stories.js`,
    `${sourceDir}/components/**/*.test.js`,
  ];

  return multiGlob(mainFilesPatterns, { ignore: ignorePatterns });
}

export function getAllSourceFiles (sourceDir) {

  const allSourceFilesPatterns = `${sourceDir}/**/*.js`;

  const ignorePatterns = [
    `${sourceDir}/**/*.test.js`,
    `${sourceDir}/**/*.stories.js`,
    `${sourceDir}/stories/**/*`,
  ];

  return glob.sync(allSourceFilesPatterns, { ignore: ignorePatterns });
}

export function clearPlugin ({ outputDir }) {
  return clear({
    targets: [outputDir],
  });
}

export function importMetaUrlAssetsPlugin () {
  return importMetaAssets({
    // Let's assume we don't have import.meta.url assets in our deps to speed up things
    exclude: 'node_modules/**',
    transform: (svgBuffer, id) => {
      return svgo
        .optimize(svgBuffer.toString())
        .then(({ data }) => data);
    },
  });
}

export function terserPlugin () {
  return terser({
    output: { comments: false },
  });
}

export function babelPlugin () {
  return babel({
    plugins: [
      // Minify HTML inside lit-html and LitElement html`` templates
      // Minify CSS inside LitElement css`` templates
      [
        'template-html-minifier',
        {
          modules: {
            lit: [
              'html',
              { name: 'css', encapsulation: 'style' },
            ],
          },
          htmlMinifier: {
            caseSensitive: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeRedundantAttributes: true,
            // This clearly DOES NOT work well with template strings and lit-element
            sortAttributes: false,
            sortClassName: true,
            minifyCSS: { level: 2 },
          },
        },
      ],
    ],
  });
}

export function visualizerPlugin ({ outputDir, packageVersion }) {
  const filename = (packageVersion != null)
    ? `${outputDir}/visualizer-stats-${packageVersion}.html`
    : `${outputDir}/visualizer-stats.html`;
  return visualizer({
    filename,
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
  });
};

export const manualChunkOptions = (id) => {
  const isSmall = id.endsWith('src/lib/events.js')
    || id.endsWith('src/styles/skeleton.js')
    || id.endsWith('src/styles/waiting.js')
    || id.endsWith('lit/directives/if-defined.js')
    || id.endsWith('lit/directives/class-map.js');
  if (isSmall) {
    return 'vendor';
  }
};

export const treeshakeOptions = {
  moduleSideEffects: (id, external) => {
    const relativeId = path.relative(process.cwd(), id);
    const isComponent = /^src\/.+\/cc-[a-z-]+\.js$/.test(relativeId);
    const isEntryPoint = /^src\/[a-z-]+\.js$/.test(relativeId);

    // More details at src/lib/leaflet-esm.js
    const isLeaflet = relativeId.endsWith('leaflet-esm.js')
      || relativeId.includes('leaflet/src/layer/vector/Renderer.getRenderer.js')
      || relativeId.includes('leaflet/src/layer/Tooltip.js')
      || relativeId.includes('leaflet/src/control');

    // Shoelace exposes components with window.customElements.define()
    const isShoelace = relativeId.includes('@shoelace-style/shoelace');

    return isComponent || isEntryPoint || isLeaflet || isShoelace;
  },
};
