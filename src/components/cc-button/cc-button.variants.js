import { getVariants } from '../lib.js';

const tickSvg = new URL('../../../src/assets/tick.svg', import.meta.url);
const tickWhiteSvg = new URL('../../../src/assets/tick-white.svg', import.meta.url);

const baseProperties = [
  { innerHTML: 'Skeleton', skeleton: true },
  { innerHTML: 'Simple' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Success', success: true },
  { innerHTML: 'Warning', warning: true },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Button link', link: true },
];

export const variants = getVariants({
  outlined: [false, true],
  disabled: [false, true],
  waiting: [false, true],
  delay: [null, 3],
  image: [null, tickWhiteSvg, tickSvg],
  hideText: [false, true],
  circle: [false, true],
}, baseProperties).filter((variant) => {
  return true
    && (variant.delay == null)
    && (variant.image != null)
    && (variant.hideText === true)
    && (variant.link !== true)
    && (
      ((variant.outlined === true) && (variant.image === tickSvg))
      || ((variant.outlined === false) && (variant.image === tickWhiteSvg))
    );
});

export const style = `
  body {
    margin: 1em;
    display: grid;
    grid-template-columns: repeat(12, auto);
    justify-content: start;
    gap: 1em;
    justify-items: start;
  }
  
  body > * {
    margin: 0;
  }
`;
