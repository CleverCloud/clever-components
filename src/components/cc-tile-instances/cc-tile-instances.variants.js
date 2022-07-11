const NANO_ONE = { flavorName: 'nano', count: 1 };
const S_TWO = { flavorName: 'S', count: 2 };

const stateValues = ['loading', 'loaded', 'error'];

export const variants = [
  // {},
  { state: 'loading' },
  { state: 'error' },
  // { state: 'loaded' },
  { state: 'loaded', instances: { running: [], deploying: [] } },
  { state: 'loaded', instances: { running: [NANO_ONE], deploying: [] } },
  { state: 'loaded', instances: { running: [], deploying: [S_TWO] } },
  { state: 'loaded', instances: { running: [NANO_ONE], deploying: [S_TWO] } },
];

export const style = `
  cc-tile-instances:not(:defined) {
    display: block;
    min-height: 9em;
    background-color: #fff;
    border: 1px solid #bcc2d1;
    border-radius: 0.25rem;
  }
`;
