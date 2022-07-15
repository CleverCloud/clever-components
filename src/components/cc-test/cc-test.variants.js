import { getVariants, getVariantsFromComponent } from '../lib.js';

export const variants = getVariants({
  ...(await getVariantsFromComponent('cc-test')),
  name: ['Galimede', 'Florian', 'Bob', 'Pierre'],
});

// language=CSS
export const style = ``;
