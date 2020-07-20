import json from '@rollup/plugin-json';
import glob from 'glob';
import babel from 'rollup-plugin-babel';
import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
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

export function inputs (sourceDir, entryMapper) {

  const filesToExposeGlobs = [
    `${sourceDir}/index.js`,
    `${sourceDir}/addon/*.js`,
    `${sourceDir}/atoms/*.js`,
    `${sourceDir}/env-var/*.js`,
    `${sourceDir}/lib/i18n.js`,
    `${sourceDir}/maps/*.js`,
    `${sourceDir}/molecules/*.js`,
    `${sourceDir}/overview/*.js`,
    `${sourceDir}/tcp-redirections/*.js`,
    `${sourceDir}/translations/*.js`,
  ];

  const filesToExposePairs = filesToExposeGlobs
    .flatMap((pattern) => glob.sync(pattern))
    .map(entryMapper);

  return Object.fromEntries(filesToExposePairs);
}

export function plugins (sourceDir, outputDir) {
  return [
    clear({
      targets: [outputDir],
    }),
    json(),
    copy({
      targets: [{
        src: `${sourceDir}/assets/*.svg`,
        dest: outputDir + `/assets`,
        transform: (svgBuffer) => {
          return svgo
            .optimize(svgBuffer.toString())
            .then(({ data }) => data);
        },
      }],
    }),
    terser({
      output: { comments: false },
    }),
    babel({
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        // Minify HTML inside lit-html and LitElement html`` templates
        // Minify CSS inside LitElement css`` templates
        [
          'template-html-minifier',
          {
            modules: {
              'lit-html': ['html'],
              'lit-element': [
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
    }),
    visualizer({
      filename: `${outputDir}/stats.html`,
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
  ];
}
