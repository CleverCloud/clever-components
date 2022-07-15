import { getVariants } from '../lib.js';

const tickSvg = new URL('../../../src/assets/tick.svg', import.meta.url);
const tickWhiteSvg = new URL('../../../src/assets/tick-white.svg', import.meta.url);

const baseProperties = [
  // { innerHTML: 'Skeleton', skeleton: true },
  { innerHTML: 'Simple' },
  { innerHTML: 'Primary', primary: true },
  { innerHTML: 'Success', success: true },
  { innerHTML: 'Warning', warning: true },
  { innerHTML: 'Danger', danger: true },
  { innerHTML: 'Button link', link: true },
];

export const variants = getVariants({
  circle: [false, true],
  delay: [undefined, 3],
  disabled: [false, true],
  hideText: [false, true],
  image: [undefined, tickWhiteSvg, tickSvg],
  outlined: [false, true],
  skeleton: [false, true],
  waiting: [false, true],
}, baseProperties);
//   .filter((variant) => {
//   return true
//     && (variant.delay == null)
//     && (variant.image != null)
//     && (variant.hideText === true)
//     && (variant.link !== true)
//     && (
//       ((variant.outlined === true) && (variant.image === tickSvg))
//       || ((variant.outlined === false) && (variant.image === tickWhiteSvg))
//     );
// });

export const style = `
  
`;
