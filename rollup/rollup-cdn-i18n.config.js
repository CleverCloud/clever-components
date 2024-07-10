import path from "path";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import {
  babelPlugin,
  clearPlugin,
  getMainFiles,
  importMetaUrlAssetsPlugin, manualChunkOptions,
  terserPlugin,
  treeshakeOptions
} from "./rollup-common.js";

import { walk } from "estree-walker";
import MagicString from "magic-string";
import fs from "fs";

const version = process.env.VERSION;
if (version == null) {
  throw new Error("VERSION env var is required.");
}

const inputFilesPairs = getMainFiles().map((file) => {
  const entryPath = path.parse(file).name;
  return [entryPath, file];
});
const outputDir = "dist-cdn-i18n";

function getI18nKeyAsVariable (rawKey) {
  return rawKey.toUpperCase().replace(/[-.]/g, "_");
}

function random () {
  return Math.random().toString(36).slice(2, 10);
}

function generateNochunkId (id) {
  return `\0no-chunk__${random()}:${id}`;
}

const NO_CHUNK_REGEX = /^\0no-chunk__[a-z0-9]{8}:(?<id>.*)$/;

const i18nPlugin = {
  name: "i18nPlugin",

  async resolveId (source, rawImporter) {
    if (source.includes("translations/translations.")) {
      const absoluteSource = await this.resolve(source, rawImporter, { skipSelf: true });
      return generateNochunkId(absoluteSource.id);
    }
    const matches = rawImporter?.match(NO_CHUNK_REGEX);
    if (matches != null) {
      const importer = matches.groups.id;
      const absoluteSource = await this.resolve(source, importer, { skipSelf: true });
      return absoluteSource.id;
    }
  },

  async load (id) {
    const matches = id?.match(NO_CHUNK_REGEX);
    if (matches != null) {
      const rawId = matches.groups.id;
      return fs.readFileSync(rawId, "utf8");
    }
  },

  transform (code, id) {

    const ast = this.parse(code);
    const magicString = new MagicString(code);
    let modifiedCode = false;

    if (id.includes("src/translations/translations.")) {

      console.log("transformTranslations", id);

      walk(ast, {
        enter (node, parent, prop, index) {
          const isTranslationsNode = true
            && node.type === "VariableDeclarator"
            && node.id.name === "translations"
            && node.init.type === "ObjectExpression";

          if (isTranslationsNode) {

            const translationsAsVariables = node.init.properties
              .map((node) => {
                const rawKey = node.key.value ?? node.key.name;
                const key = getI18nKeyAsVariable(rawKey);
                // TODO magic string
                const value = code.substring(node.value.start, node.value.end);
                if (node.value.type === "ArrowFunctionExpression") {
                  return `export const ${key} = ${value};`;
                }
                else {
                  return `export const ${key} = () => ${value};`;
                }
              })
              .join("\n");

            magicString.append("\n\n" + translationsAsVariables);
            modifiedCode = true;

          }
        }
      });

      return {
        code: magicString.toString(),
        map: modifiedCode ? magicString.generateMap({ hires: true }) : null
      };

    }
    else if (id.includes("/clever-components/src/") && id.endsWith(".js")) {

      console.log("transform other file", id);

      const i18nKeysToImport = new Set();
      const replacements = [];

      walk(ast, {
        enter (node, parent, prop, index) {

          const is18nCallNode = true
            && node.type === "CallExpression"
            && node.callee.name === "i18n"
            // TODO should warn on TemplateLiteral usage ?
            && node.arguments[0].type === "Literal";

          if (is18nCallNode) {
            const rawKey = node.arguments[0].value;
            const exportedKey = getI18nKeyAsVariable(rawKey);
            modifiedCode = true;
            i18nKeysToImport.add(exportedKey);

            const replacement = node.arguments[1] != null
              ? exportedKey + "(" + code.substring(node.arguments[1].start, node.arguments[1].end) + ")"
              : exportedKey + "()";

            // const paramsNode = node.arguments[1];
            // const paramsString = (paramsNode != null)
            //   ? magicString.toString().substring(paramsNode.start, paramsNode.end)
            //   : '';
            //
            // const replacement = (paramsString !== '')
            //   ? `${exportedKey}(${paramsString})`
            //   : exportedKey;
            //
            replacements.push(() => {
              magicString.overwrite(
                node.start,
                node.end,
                replacement
              );
              modifiedCode = true;
            });
          }
        }
      });

      replacements.forEach((replace) => replace());

      if (i18nKeysToImport.size > 0) {
        const keys = Array.from(i18nKeysToImport).join(", ");
        // TODO better relative path
        magicString.prepend(`import {${keys}} from '../../translations/translations.fr.js';\n`);
      }

      return {
        code: magicString.toString(),
        map: modifiedCode ? magicString.generateMap({ hires: true }) : null
      };

    }
  }
};

export default {
  // defines the files to be included into the build: all components + smart manager + translations + i18n
  input: Object.fromEntries(inputFilesPairs),
  output: {
    dir: `${outputDir}`,
    // sourcemap: true,
    sourcemap: false,
    // add a hash on every file
    entryFileNames: "[name]-[hash].js",
    // sometimes, chunks are so small that they become counterproductive. Here we force some modules to be grouped in the same chunk.
    // manualChunks: manualChunkOptions,
    // Rollup's import hoisting is not really useful here as we're applying a more aggressive import hoisting strategy with the deps-manifest.json
    hoistTransitiveImports: false,
  },
  // fine-grained tree shaking options. Here we force tree shaking for leaflet and shoelace
  treeshake: treeshakeOptions,
  plugins: [
    // output directory cleanup
    clearPlugin({ outputDir }),
    // transform .json files into ES6 modules. (Used by statuses library). TODO: we should get rid of this library
    json(),
    // add (and optimize) svg files used in all new URL('...', import.meta.url) pattern.
    false && importMetaUrlAssetsPlugin(),
    // convert CommonJS modules to ESM
    commonjs(),

    i18nPlugin,

    // support resolving module using Node resolution algorithm. TODO: figure out why we need that
    nodeResolve(),
    // minify JS (if required)
    terserPlugin(),
    // minify HTML and CSS inside components
    false && babelPlugin()
    // add and minify default theme
    // stylesAssetsPlugin({
    //   transform: (stylesheet) => minifyStylesheet(stylesheet),
    // }),
    // generate the deps-manifest.json file that will help our CDN to be smart
    // depsManifestPlugin({ packageVersion: cdnEntryName }),
    // help us visualize and analyze the bundle size
    // visualizerPlugin({ outputDir, packageVersion: cdnEntryName }),
  ]
};
