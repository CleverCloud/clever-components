import { getVariants } from '../lib.js';

const NANO_ONE = { flavorName: 'nano', count: 1 };
const S_TWO = { flavorName: 'S', count: 2 };

export const variants = getVariants({
  instances: [
    null,
    { running: [], deploying: [] },
    { running: [NANO_ONE], deploying: [] },
    { running: [], deploying: [S_TWO] },
    { running: [NANO_ONE], deploying: [S_TWO] },
  ],
  state: ['loading', 'error', 'loaded'],
}).filter((variant) => {
  return true
    && (
      (variant.state !== 'loaded' && variant.instances == null)
      || (variant.state === 'loaded' && variant.instances != null)
    );
});

// export const variants = getVariants({
//   // disabled: [{}, [true, false]],
// });

export const style = `
  cc-tile-instances:not(:defined) {
    display: block;
    min-height: 9em;
    background-color: #fff;
    border: 1px solid #bcc2d1;
    border-radius: 0.25rem;
  }
`;
