import { hmrPlugin, presets } from '@open-wc/dev-server-hmr';
import rollupCommonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { fromRollup, rollupAdapter } from '@web/dev-server-rollup';
import { esbuildBundlePlugin } from './wds/esbuild-bundle-plugin.js';
import util from 'util';
import rawGlob from 'glob';
import fs from 'fs';
import { parse as babelParse } from '@babel/core';
import { enhanceStoryName } from './stories/lib/story-names.js';

const glob = util.promisify(rawGlob);
const commonjs = fromRollup(rollupCommonjs);

function commonJsIdentifiers (ids) {
  return ids.map((id) => `**/node_modules/${id}/**/*`);
}

function foobar (story, name) {
  if (name == null) {
    console.log(story);
    return 'null';
  }
  return enhanceStoryName(name);
}

function getStoryUrl ({ section, component, exports }, storyName, lang = 'en') {
  const sp = new URLSearchParams();
  sp.set('section', section);
  sp.set('component', component);
  sp.set('story', storyName ?? exports[0]);
  sp.set('lang', 'en');
  return '/storyblon/story.html?' + sp.toString();
}

const storyblonPlugin = {
  name: 'storyblon-plugin',
  async serve (context) {

    if (context.path === '/') {

      const storiesFilePaths = await glob('stories/**/cc-*.js');
      const stories = storiesFilePaths
        .map((fp) => {
          const [_, section] = fp.split('/');
          return {
            fp,
            section,
            fileContent: fs.readFileSync(new URL(fp, import.meta.url), 'utf8'),
          };
        })
        .map((story) => ({
          ...story,
          ast: babelParse(story.fileContent),
        }))
        .map((story) => {
          const defaultEntries = story.ast.program.body
            .find((node) => node.type === 'ExportDefaultDeclaration')
            .declaration
            .properties
            .map((prop) => [prop.key.name, prop.value.value]);
          const { title, component } = Object.fromEntries(defaultEntries);
          const exports = story.ast.program.body
            .filter((node) => node.type === 'ExportNamedDeclaration')
            .map((node) => node.declaration.declarations?.[0]?.id?.name)
            .filter((name) => name != null);
          return { ...story, title, component, exports };
        })
        .filter(({ component, exports }) => component != null && exports != null);

      return `
        <!doctype html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Storyblon</title>
          <style>
            html,
            body {
              margin: 0;
              height: 100%;
            }
            body {
              background-color: #eee;
              box-sizing: border-box;
              display: grid;
              gap: 1em;
              grid-template-columns: 20em 1fr;
              grid-template-rows: 1fr 1fr;
              grid-template-areas:
                "component-list preview"
                "story-list preview";
              padding: 1em;
            }
            .component-list,
            .story-list,
            .preview-wrapper {
              background-color: #fff;
              height: 100%;
              margin: 0;
              overflow: auto;
              padding: 0;
            }
            .component-list {
              grid-area: component-list;
            }
            .story-list {
              grid-area: story-list;
            }
            .preview-wrapper {
              grid-area: preview;
              overflow: hidden;
            }
            .preview {
              border: none;
              margin: 0;
              padding: 0;
              height: 100%;
              width: 100%;
            }
            .component-item,
            .story-item {
              list-style: none;
              margin: 0.5em 1em;
              padding: 0;
            }
            .hidden {
              display: none;
            }
          </style>
          <script>
            window.addEventListener('click', (e) => {
              if (e.target.nodeName ==='A') {
                const url = new URL(e.target.href);
                const componentName = url.searchParams.get('component');console.log(componentName);
                Array.from(document.querySelectorAll('.story-list')).forEach((list) => {
                  const hidden = (list.dataset.component !==componentName);
                  list.classList.toggle('hidden', hidden);
                });
              }
            });
          </script>
        </head>
        <body>
          <ul class="component-list">
            ${stories.map((s) => `
              <li class="component-item"><a href="${getStoryUrl(s)}" target="preview">${s.component}</a></li>
            `).join('')}
          </ul>
          <ul class="story-list placeholder"></ul>
          ${stories.map((s) => `
            <ul class="story-list hidden" data-component="${s.component}">
              ${s.exports.map((storyName) => `
                <li class="story-item"><a href="${getStoryUrl(s, storyName)}" target="preview">${foobar(s, storyName)}</a></li>
              `).join('')}
            </ul>
          `).join('')}
          <div class="preview-wrapper">
            <iframe class="preview" name="preview"></iframe>
          </div>
        </body>
        </html>
      `;
    }
  },
};

export default {
  port: 6006,
  nodeResolve: true,
  // watch: true,
  mimeTypes: {
    '**/*.md': 'js',
    '**/*.json': 'js',
    '.**/*.json': 'js',
  },
  plugins: [
    storyblonPlugin,
    hmrPlugin({
      include: ['src/**/*'],
      presets: [presets.litElement],
      // TODO maybe hook the translation system with HMR
    }),
    rollupAdapter(json()),
    esbuildBundlePlugin({
      pathsToBundle: [
        '/src/lib/leaflet-esm.js',
        '/node_modules/rxjs/dist/esm5/index.js',
        '/node_modules/rxjs/dist/esm5/operators/index.js',
        '/node_modules/chart.js/dist/chart.esm.js',
      ],
    }),
    commonjs({
      // the commonjs plugin is slow, list the required packages explicitly:
      include: commonJsIdentifiers([
        'clipboard-copy',
        'statuses',
        // used by clever-client
        'oauth-1.0a',
        'component-emitter',
      ]),
    }),
  ],
};
