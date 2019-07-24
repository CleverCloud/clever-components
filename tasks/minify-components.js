'use strict';

const babel = require('@babel/core');
const del = require('del');
const fs = require('fs-extra');
const path = require('path');
const rawGlob = require('glob');
const Terser = require('terser');
const util = require('util');

const glob = util.promisify(rawGlob);

// Minify HTML inside lit-html and LitElement html`` templates
// Minify CSS inside LitElement css`` templates
function minifyHtmlCss (code, sourceFileName) {
  return babel.transformSync(code, {
    sourceFileName,
    // Put sourcemap in the file to simplify further manipulation
    sourceMaps: 'inline',
    plugins: [
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
            collapseWhitespace: true,
            removeComments: true,
            caseSensitive: true,
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
      properties: {
        // mangle "private properties/functions" starting with _
        regex: /^_/,
      },
    },
    sourceMap: {
      content: 'inline',
      url: sourceMapUrl,
    },
  });
};

async function run () {

  await del('dist/**/*');

  const sourceFilepaths = await glob('./components/**/*.js');

  const filepaths = sourceFilepaths.map((src) => {
    // this seems to get better integration in browsers
    const sourceMapFilename = src.replace('/components/', '/node_modules/@clever/components/');
    const dst = src.replace('/components/', '/dist/');
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
}

run()
  .then(console.log)
  .catch(console.error);
