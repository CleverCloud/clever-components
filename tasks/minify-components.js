'use strict';

const path = require('path');
const util = require('util');
const babel = require('@babel/core');
const del = require('del');
const fs = require('fs-extra');
const rawGlob = require('glob');
const SVGO = require('svgo');
const Terser = require('terser');

const glob = util.promisify(rawGlob);

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

// Minify HTML inside lit-html and LitElement html`` templates
// Minify CSS inside LitElement css`` templates
function minifyHtmlCss (code, sourceFileName) {
  return babel.transformSync(code, {
    sourceFileName,
    // Put sourcemap in the file to simplify further manipulation
    sourceMaps: 'inline',
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
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
  });
}

function minifyJs (code, sourceMapUrl) {
  return Terser.minify(code, {
    module: true,
    toplevel: true,
    mangle: {
      // We have some bugs when the leaflet keyword is mangled
      // I still don't know why, WTF?
      reserved: ['leaflet'],
    },
    sourceMap: {
      content: 'inline',
      url: sourceMapUrl,
    },
  });
};

function optimizeSvg (rawSvg, sourceFileName) {
  return svgo
    .optimize(rawSvg, { path: sourceFileName })
    .then(({ data }) => data);
}

async function run () {

  await del('dist/**/*');

  const sourceFilepaths = await glob('./src/**/*.js');

  const filepaths = sourceFilepaths.map((src) => {
    // this seems to get better integration in browsers
    const sourceMapFilename = src.replace('/src/', '/node_modules/@clever/components/');
    const dst = src.replace('/src/', '/dist/');
    const sourceMapUrl = path.parse(dst).base + '.map';
    return { src, sourceMapFilename, dst, sourceMapUrl };
  });

  for (const { src, sourceMapFilename, dst, sourceMapUrl } of filepaths) {
    console.log(`Minifying ${src} ...`);
    await fs.readFile(src, 'utf8')
      .then((code) => minifyHtmlCss(code, sourceMapFilename))
      .then(({ code }) => minifyJs(code, sourceMapUrl))
      .then(async ({ code, map }) => {
        await fs.outputFile(dst, code);
        await fs.outputFile(dst + '.map', map);
      });
    console.log(`   DONE! ${dst}`);
  }

  const svgFilePath = await glob('./src/**/*.svg');
  for (const src of svgFilePath) {
    console.log(`Optimizing ${src} ...`);
    const dst = src.replace('/src/', '/dist/');
    const rawSvg = await fs.readFile(src, 'utf8');
    const minifiedSvg = await optimizeSvg(rawSvg);
    await fs.outputFile(dst, minifiedSvg);
    console.log(`   DONE! ${dst}`);
  }
}

run()
  .then(console.log)
  .catch(console.error);
