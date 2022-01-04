import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import {
  babelPlugin,
  clearPlugin,
  importMetaUrlAssetsPlugin,
  inputs,
  manualChunkOptions,
  shimShadyRender,
  terserPlugin,
  treeshakeOptions,
  visualizerPlugin,
} from './rollup-common.js';
import path from 'path';
import { walk } from 'estree-walker';
import MagicString from 'magic-string';
import fs from 'fs';
import { depsManifestPlugin } from './rollup-plugin-deps-manifest.js';

function getVersion () {
  const gitTag = process.env.GIT_TAG_NAME;
  if (gitTag == null) {
    throw new Error('Could not read version from git tag!');
  }
  return gitTag.trim();
}

const packageVersion = getVersion();

function rand () {
  return Math.random().toString(36).slice(2);
}

const sourceDir = 'src';
const outputDir = 'dist-cdn-i18n';

function getI18nKeyAsVariable (rawKey) {
  return rawKey.toUpperCase().replace(/[-.]/g, '_');
}

export default {
  input: inputs(sourceDir, (file) => {
    const { name: entryPath } = path.parse(file);
    return [entryPath, file];
  }),
  output: {
    dir: outputDir,
    // sourcemap: true,
    entryFileNames: '[name]-[hash].js',
    manualChunks: manualChunkOptions,
    hoistTransitiveImports: false,
  },
  treeshake: treeshakeOptions,
  preserveModules: false,
  plugins: [
    clearPlugin({ outputDir }),
    json(),
    importMetaUrlAssetsPlugin(),
    shimShadyRender(),
    commonjs(),
    resolve(),

    // inline i18n
    {
      name: 'i18n-thing-two',

      resolveId (id, importer) {
        if (id.startsWith('NOCHUNK:')) {
          const [prefix, rawId] = id.split('@');
          return prefix + '@' + (new URL(rawId, 'file://' + importer).pathname);
        }
        if (importer != null && importer.startsWith('NOCHUNK:')) {
          const [_, rawImporter] = importer.split('@');
          return new URL(id, 'file://' + rawImporter).pathname;
        }
      },

      load (id) {
        if (id.startsWith('NOCHUNK:')) {
          const [_, rawId] = id.split('@');
          return fs.readFileSync(rawId, 'utf8');
        }
      },

      transform (code, id) {

        const ast = this.parse(code);
        const magicString = new MagicString(code);
        let modifiedCode = false;

        if (id.includes('src/translations/translations.')) {

          walk(ast, {
            enter (node, parent) {
              const isTranslationsNode = true
                && node.type === 'VariableDeclarator'
                && node.id.name === 'translations'
                && node.init.type === 'ObjectExpression';

              if (isTranslationsNode) {

                const translationsAsVariables = node.init.properties
                  .map((node) => {
                    const key = getI18nKeyAsVariable(node.key.value ?? node.key.name);
                    const value = magicString.toString().substring(node.value.start, node.value.end);
                    return `export const ${key} = ${value};`;
                  })
                  .join('\n');

                magicString.append('\n\n' + translationsAsVariables);
                modifiedCode = true;

              }
            },
          });

          return {
            code: magicString.toString(),
            map: modifiedCode ? magicString.generateMap({ hires: true }) : null,
          };
        }

        const i18nKeysToImport = new Set();
        const replacements = [];

        walk(ast, {
          enter (node) {

            const is18nCallNode = true
              && node.type === 'CallExpression'
              && node.callee.name === 'i18n';

            if (is18nCallNode) {

              const key = node.arguments[0]?.quasis?.[0]?.value?.raw ?? node.arguments[0].value;
              const exportedKey = getI18nKeyAsVariable(key);
              i18nKeysToImport.add(exportedKey);

              const paramsNode = node.arguments[1];
              const paramsString = (paramsNode != null)
                ? magicString.toString().substring(paramsNode.start, paramsNode.end)
                : '';

              const replacement = (paramsString !== '')
                ? `${exportedKey}(${paramsString})`
                : exportedKey;

              replacements.push(() => {
                magicString.overwrite(
                  node.start,
                  node.end,
                  replacement,
                );
                modifiedCode = true;
              });

            }
          },
        });

        replacements.forEach((replace) => replace());

        if (i18nKeysToImport.size !== 0) {
          magicString.prepend(`import {${Array.from(i18nKeysToImport).join(',')}} from 'NOCHUNK:${rand()}@../translations/translations.en.js';\n`);
        }

        return {
          code: magicString.toString(),
          map: modifiedCode ? magicString.generateMap({ hires: true }) : null,
        };
      },
    },

    terserPlugin(),

    // minify literal holes
    {
      renderChunk (code) {

        const ast = this.parse(code);
        const magicString = new MagicString(code);
        let modifiedCode = false;

        walk(ast, {
          enter (node, parent) {

            const isLitHtmlNode = true
              && node.type === 'TaggedTemplateExpression';
            // && node.tag.name === 'html';

            if (isLitHtmlNode) {

              node.quasi.expressions.forEach((expressionNode, index) => {

                if (expressionNode.type !== 'Literal') {
                  return;
                }

                const beforeQuasi = node.quasi.quasis[index];
                const afterQuasi = node.quasi.quasis[index + 1];

                magicString.overwrite(
                  beforeQuasi.end,
                  afterQuasi.start,
                  expressionNode.value,
                );
                modifiedCode = true;
              });
            }
          },
        });

        return {
          code: magicString.toString(),
          map: modifiedCode ? magicString.generateMap({ hires: true }) : null,
        };

      },
    },

    babelPlugin(),
    depsManifestPlugin({ packageVersion }),
    visualizerPlugin({ outputDir }),
  ],
};

terserPlugin;
