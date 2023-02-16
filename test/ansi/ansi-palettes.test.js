import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import defaultPalette from '../../src/lib/ansi/palettes/default.js';
import everblushPalette from '../../src/lib/ansi/palettes/everblush.js';
import hyoobPalette from '../../src/lib/ansi/palettes/hyoob.js';
import nightOwlPalette from '../../src/lib/ansi/palettes/night-owl.js';
import oneLightPalette from '../../src/lib/ansi/palettes/one-light.js';
import tokyoNightLightPalette from '../../src/lib/ansi/palettes/tokyo-night-light.js';

const getElement = (paletteStyle, fgStyle) => {
  return html`<span style="${paletteStyle};color: var(--ansi-${fgStyle});">Test contrast</span>`;
};

const darkPalettes = {
  Everblush: everblushPalette,
  Hyoob: hyoobPalette,
  'Night Owl': nightOwlPalette,
};
const lightPalettes = {
  default: defaultPalette,
  'One Light': oneLightPalette,
  'Tokyo Night Light': tokyoNightLightPalette,
};
const fgStyles = [
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
];

const testsSuite = [
  ...Object.entries(darkPalettes).map(([name, palette]) => ({
    name,
    palette,
    fgStyles: [...fgStyles, 'white'],
  })),
  ...Object.entries(lightPalettes).map(([name, palette]) => ({
    name,
    palette,
    fgStyles: [...fgStyles, 'black'],
  })),
];

testsSuite.forEach((t) => {
  describe(`${t.name} palette contrast is accessible`, () => {
    t.fgStyles.forEach((fgStyle) => {
      it(`with "${fgStyle}" foreground`, async () => {
        const element = await fixture(getElement(t.palette, fgStyle));
        await elementUpdated(element);
        await expect(element).to.be.accessible();
      });
    });
  });
});
