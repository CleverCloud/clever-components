import './cc-ansi-palette.js';
import '../cc-toggle/cc-toggle.js';
import '../cc-select/cc-select.js';
import { html, render } from 'lit';
import { analyzePalette } from '../../lib/ansi/ansi-palette-analyser.js';
import { getGoghPalettes } from '../../lib/ansi/gogh-palettes.js';
import defaultPalette from '../../lib/ansi/palettes/default.js';
import everblushPalette from '../../lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../lib/ansi/palettes/tokyo-night-light.js';

import { hexToRgb, isDark } from '../../lib/color.js';
import { i18n } from '../../lib/i18n.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 Logs/<cc-ansi-palette>',
  component: 'cc-ansi-palette',
};

const conf = {
  component: 'cc-ansi-palette',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: defaultPalette,
    },
  ],
});

export const withEverblushPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: everblushPalette,
    },
  ],
});

export const withHyoobPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: hyoobPalette,
    },
  ],
});
export const withNightOwlPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: nightOwlPalette,
    },
  ],
});
export const withOneLightPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: oneLightPalette,
    },
  ],
});
export const withTokyoNightLightPalette = makeStory(conf, {
  items: [
    {
      name: 'default',
      palette: tokyoNightLightPalette,
    },
  ],
});

export const goghPalettes = makeStory(conf, {
  // language=CSS
  css: `
    .ctrl {
      display: flex;
      gap: 0.5em;
      align-items: center;
      flex-wrap: wrap;
    }

    .spacer {
      flex: 1;
    }

    hr {
      border-top: 1px solid #ddd;
    }

    cc-ansi-palette {
      border: 1px solid #ddd;
      border-radius: 0.2em;
    }
  `,
  lazy: true,
  dom: async (container) => {
    const goghPalettes = await getGoghPalettes();
    const PALETTES = Object.fromEntries(Object.entries(goghPalettes).map(([name, p]) => {
      return [name, {
        name: name,
        palette: p,
        type: isDark(hexToRgb(p.background)) ? 'dark' : 'light',
        analysis: analyzePalette(p),
      }];
    }));

    const TYPES = [
      { label: 'light', value: 'light' },
      { label: 'dark', value: 'dark' },
    ];

    const paletteChoicesByType = (type) => {
      return Object.values(PALETTES)
        .filter((p) => p.type === type)
        .sort((p1, p2) => {
          const compliantColors = p2.analysis.compliantColors - p1.analysis.compliantColors;
          if (compliantColors !== 0) {
            return compliantColors;
          }
          return p2.analysis.contrastAvg - p1.analysis.contrastAvg;
        })
        .map((p) => {
          return {
            label: `${p.name} - ${p.analysis.compliantColors}/${p.analysis.totalColors} - ${i18n('cc-ansi-palette.ratio', { ratio: p.analysis.contrastAvg })}`,
            value: p.name,
          };
        });
    };

    let type = 'light';
    let paletteChoices = paletteChoicesByType(type);
    let paletteName = paletteChoices[0].value;

    function onTypeToggle ({ detail }) {
      type = detail;
      paletteChoices = paletteChoicesByType(type);
      if (PALETTES[paletteName].type !== type) {
        paletteName = paletteChoices[0].value;
      }
      refresh();
    }

    function onPaletteToggle ({ detail }) {
      paletteName = detail;
      refresh();
    }

    function refresh () {
      render(template(), container);
    }

    function template () {
      return html`
        <div class="ctrl">
          <cc-toggle 
            legend="Type"
            inline
            .value=${`${type}`}
            .choices=${TYPES}
            @cc-toggle:input=${onTypeToggle}
          ></cc-toggle>
          <cc-select
            label="Palette"
            inline
            .options=${paletteChoices}
            .value=${paletteName}
            @cc-select:input=${onPaletteToggle}
          ></cc-select>
        </div>
        <hr>
        <cc-ansi-palette
          .name=${paletteName}
          .palette=${PALETTES[paletteName].palette}
        ></cc-ansi-palette>
      `;
    }

    refresh();
  },
});

enhanceStoriesNames({
  defaultStory,
  withEverblushPalette,
  withHyoobPalette,
  withNightOwlPalette,
  withOneLightPalette,
  withTokyoNightLightPalette,
  goghPalettes,
});
