import fs from 'fs';
import path from 'path';
import { asyncWalk } from 'estree-walker';
import glob from 'glob';
import MagicString from 'magic-string';
import copy from 'rollup-plugin-copy';
import { clearPlugin, minifyStylesheet } from './rollup-common.js';

const sourceDir = 'src';
const outputDir = 'src-new';

// https://github.com/rollup/rollup/pull/4565
// https://github.com/rollup/rollup/pull/4549
// https://github.com/remaxjs/rollup-plugin-rename/pull/1

const filesToExposeGlobs = [
  'src/**/*.js',
  'stories/**/*.js',
];

console.log(filesToExposeGlobs);

const MATCHER = /\/(?<fileName>(?<componentName>cc-.+?)(?:\.stories|\.smart.*)?)\.js$/;

const filesToExposePairs = filesToExposeGlobs
  .flatMap((pattern) => glob.sync(pattern))
  .map((file) => {
    const matches = file.match(MATCHER);
    if (matches != null) {
      const { fileName, componentName } = matches.groups;
      console.log([file, fileName, componentName]);
      const output = `components/${componentName}/${fileName}`;
      return [output, file];
    }
    const output = file
      .replace(/^src\//, '')
      .replace('stories/assets/', 'stories/fixtures/')
      .replace('stories/maps/', 'stories/fixtures/')
      .replace('stories/atoms/', 'stories/')
      .replace('stories/mixins/', 'mixins/')
      .replace(/\.js$/, '');
    return [output, file];
  });

const input = Object.fromEntries(filesToExposePairs);

// process.exit();

export default {
  input,
  output: {
    dir: outputDir,
    sourcemap: false,
    // We don't need the hash in this situation
    assetFileNames: 'assets/[name].[ext]',
  },
  // preserveModules: true,
  plugins: [
    clearPlugin({ outputDir }),
    // importMetaAssets({
    //   // Let's assume we don't have import.meta.url assets in our deps to speed up things
    //   exclude: 'node_modules/**',
    // }),
    (() => {
      /**
       * Extract the relative path from an AST node representing this kind of expression `new URL('./path/to/asset.ext', import.meta.url)`.
       *
       * @param {import('estree').Node} node - The AST node
       * @returns {string} The relative path
       */
      function getRelativeAssetPath (node) {
        const browserPath = node.arguments[0].value;
        return browserPath.split('/').join(path.sep);
      }

      /**
       * Checks if a AST node represents this kind of expression: `new URL('./path/to/asset.ext', import.meta.url)`.
       *
       * @param {import('estree').Node} node - The AST node
       * @returns {boolean}
       */
      function isNewUrlImportMetaUrl (node) {
        return (
          node.type === 'NewExpression'
          && node.callee.type === 'Identifier'
          && node.callee.name === 'URL'
          && node.arguments.length === 2
          && node.arguments[0].type === 'Literal'
          && typeof getRelativeAssetPath(node) === 'string'
          && node.arguments[1].type === 'MemberExpression'
          && node.arguments[1].object.type === 'MetaProperty'
          && node.arguments[1].property.type === 'Identifier'
          && node.arguments[1].property.name === 'url'
        );
      }

      return {
        name: 'rollup-plugin-import-meta-assets',

        async transform (code, id) {
          const ast = this.parse(code);
          const magicString = new MagicString(code);
          let modifiedCode = false;

          await asyncWalk(ast, {
            enter: async (node) => {
              if (isNewUrlImportMetaUrl(node)) {
                const absoluteScriptDir = path.dirname(id);
                const relativeAssetPath = getRelativeAssetPath(node);
                const absoluteAssetPath = path.resolve(absoluteScriptDir, relativeAssetPath);
                const assetName = path.basename(absoluteAssetPath);

                try {
                  const assetContents = await fs.promises.readFile(absoluteAssetPath);
                  const ref = this.emitFile({
                    type: 'asset',
                    name: assetName,
                    source: assetContents,
                  });
                  const hasHref = code.substr(node.end, '.href'.length) === '.href';
                  magicString.overwrite(
                    node.start,
                    node.end + (hasHref ? '.href'.length : 0),
                    `import.meta.ROLLUP_FILE_URL_${ref}`,
                  );
                  modifiedCode = true;
                }
                catch (error) {
                  this.error(error, node.arguments[0].start);
                }
              }
            },
          });

          return {
            code: magicString.toString(),
            map: modifiedCode ? magicString.generateMap({ hires: true }) : null,
          };
        },
      };
    })(),
    copy({
      targets: [
        {
          src: 'src/styles/default-theme.css',
          dest: 'dist/styles',
          transform: (stylesheet) => minifyStylesheet(stylesheet),
        },
      ],
    }),
  ],
};
