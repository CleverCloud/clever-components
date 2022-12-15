import { promises as fs } from 'fs';
import path from 'path';
import util from 'util';
import rawGlob from 'glob';
import SVGO from 'svgo';
import { pascalCase } from '../src/lib/change-case.js';

const glob = util.promisify(rawGlob);

/**
 * A Rollup plugin built on top of the `load` hook (see more here: https://rollupjs.org/guide/en/#load).
 * It is used to generate icons wrapped in ES modules, which are meant to be loaded in `<cc-icon>` component.
 *
 * Note: if there is a modification to your icon files (added, deleted or updated icon(s)), don't forget to
 * relaunch your server, as livereload is not yet supported.
 */
export function createIconAssetsPlugin () {
  return {
    name: 'icon-plugin',
    load (filepath) {
      if (filepath.includes('cc-clever.icons.js')) {
        return buildIcons({
          namespace: 'clever',
          glob: 'src/assets/**/*.svg',
          svgoPlugins: [{ removeViewBox: false }, { removeDimensions: true }],
        });
      }
      if (filepath.includes('cc-remix.icons.js')) {
        return buildIcons({
          namespace: 'remix',
          glob: 'node_modules/remixicon/icons/**/*.svg',
          svgoPlugins: [{ removeViewBox: false }, { removeDimensions: true }],
        });
      }
    },
  };
}

/**
 * @param {object} config config defining icons to be built
 * @param {string} config.namespace icon namespace
 * @param {string} config.glob icon files glob
 * @param {array<object>|null} config.svgoPlugins plugins to pass to SVGO
 * @returns {Promise<string>}
 */
async function buildIcons (config) {
  let output = '';

  const startTime = process.hrtime();
  console.log(`Generating '${config.namespace}' icon set...`);

  const iconPaths = await glob(config.glob);
  for (const iconPath of iconPaths) {
    // retrieve filename from path
    const filename = path.basename(iconPath, '.svg');

    // build module variable name from the icon filename and namespace
    const variableName = `icon${pascalCase(config.namespace)}${pascalCase(filename)}`;

    // load icon file (svg expected) and optimize with SVGO
    const svgContent = await getSvgContentFromPath(iconPath, config.svgoPlugins);

    // ES module base object
    const iconWrapper = {
      content: svgContent,
    };

    // append ES module generated string
    output += `export const ${variableName} = ${JSON.stringify(iconWrapper, null, 2)};`;
  }

  const elapsedTime = process.hrtime(startTime);
  const durationInSeconds = (elapsedTime[0] + (elapsedTime[1] / 1e9)).toFixed(2);
  console.log(`Icon set '${config.namespace}' successfully generated! (in ${durationInSeconds}s)`);

  return output;
}

/**
 * @param {string} svgPath path to an SVG file
 * @param {array<object>|null} svgoPlugins plugins to pass to SVGO
 * @returns {Promise<string>} SVG file content
 */
async function getSvgContentFromPath (svgPath, svgoPlugins) {
  const rawSvg = await fs.readFile(svgPath, 'utf8');
  const plugins = svgoPlugins ?? [];
  const svgo = await new SVGO({ plugins }).optimize(rawSvg, { plugins });
  return svgo.data;
}
