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

function getStoryUrl ({ section, component, exports, storyName, lang = 'en' }) {
  const sp = new URLSearchParams();
  const hash = [section, component, storyName ?? exports[0], lang].join('/');
  sp.set('stories', hash);
  return '/?' + sp.toString();
}

let cachedStories;

async function getStories () {

  if (cachedStories == null) {
    const storiesFilePaths = await glob('stories/**/cc-*.js');
    cachedStories = storiesFilePaths
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
  }

  return cachedStories;
}

const storyblonPlugin = {
  name: 'storyblon-plugin',
  async serve (context) {

    if (context.path === '/') {

      const stories = await getStories();

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
              grid-template-rows: min-content 1fr 1fr;
              grid-template-areas:
                "controls preview"
                "component-list preview"
                "story-list preview";
              padding: 1em;
            }
            .controls,
            .component-list,
            .story-list {
              background-color: #fff;
              height: 100%;
              margin: 0;
              overflow: auto;
              padding: 0;
            }
            .controls {
              box-sizing: border-box;
              padding: 1em;
            }
            .component-list {
              grid-area: component-list;
            }
            .story-list {
              grid-area: story-list;
            }
            .preview-list {
              display: grid;
              gap: 1em;
              grid-area: preview;
              grid-auto-rows: 1fr;
            }
            .preview-list[data-orientation="rows"] {
              grid-auto-flow: row;
            }
            .preview-list[data-orientation="columns"] {
              grid-auto-flow: column;
            }
            .preview-wrapper {
              background-color: #fff;
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
          <script type="module">

            function createPreview () {
              const wrapper = document.createElement('div');
              wrapper.classList.add('preview-wrapper');
              wrapper.innerHTML = \`<iframe class="preview" src=""></iframe>\`;
              return wrapper;
            }
          
            function updatePreviewsList() {
              const url = new URL(location.href);
              const stories = (url.searchParams.get('stories') ?? '').split(',');
              const $previewList = document.querySelector('.preview-list');
              const previews = Array.from($previewList.querySelectorAll('.preview-wrapper'));
              for (let i = 0; i <= Math.max(0, stories.length - previews.length); i+=1) {
                const $preview = createPreview();
                previews.push($preview);
                $previewList.appendChild($preview);
              }
              for (let i = stories.length; i < previews.length; i+=1) {
                $previewList.removeChild(previews[i]);
              }
              for (let i = 0; i < stories.length; i+=1) {
                const iframe = previews[i].querySelector('iframe');
                if (iframe.dataset.story !== stories[i]) {
                  iframe.dataset.story = stories[i];
                  iframe.src = '/storyblon/story.html?story=' + stories[i];
                }
              }
              
              const componentName = stories[0].split('/')[1];
              Array.from(document.querySelectorAll('.story-list')).forEach((list) => {
                const hidden = (list.dataset.component !== componentName);
                list.classList.toggle('hidden', hidden);
              });
            }
            
            updatePreviewsList();
          
            window.addEventListener('click', (e) => {
              if (e.target.nodeName ==='A') {
                e.preventDefault();
                
                const targetUrl = new URL(e.target.href);
                const targetHashes = (targetUrl.searchParams.get('stories') ?? '').split(',');
                
                const url = new URL(location.href);
                const hashes = e.altKey
                  ? (url.searchParams.get('stories') ?? '').split(',')
                  : [];
                  
                targetHashes.forEach((hash) => hashes.push(hash));
                url.searchParams.set('stories', hashes.join(','));

                history.pushState({}, '', url.toString());
                
                updatePreviewsList();
              }
            });
            document.querySelector('.controls').addEventListener('change', (e) => {
              document.querySelector('.preview-list').dataset.orientation = e.target.value; 
            })
          </script>
        </head>
        <body>
          <div class="controls">
            <label><input type="radio" name="orientation" value="rows" checked>rows</label>
            <label><input type="radio" name="orientation" value="columns">columns</label>
          </div>
          <ul class="component-list">
            ${stories.map((s) => `
              <li class="component-item"><a href="${getStoryUrl(s)}">${s.component}</a></li>
            `).join('')}
          </ul>
          <ul class="story-list placeholder"></ul>
          ${stories.map((s) => `
            <ul class="story-list hidden" data-component="${s.component}">
              ${s.exports.map((storyName) => `
                <li class="story-item"><a href="${getStoryUrl({
        ...s, storyName
      })}" target="preview-a">${enhanceStoryName(storyName)}</a></li>
              `).join('')}
            </ul>
          `).join('')}
          <div class="preview-list" data-orientation="vertical">
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
