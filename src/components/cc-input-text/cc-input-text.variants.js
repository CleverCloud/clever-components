import { getVariants } from '../lib.js';

const baseProperties = [];

const componentName = 'cc-input-text';
const completeJson = await fetch('/dist/custom-elements.json').then((r) => r.json());
const componentModule = completeJson.modules.find((m) => m.path.endsWith(`/${componentName}.js`));

const propertiesFromCem = componentModule.declarations[0].members
  ?.filter((m) => m.kind === 'field' && m.type.text === 'boolean')
  ?.map((m) => [m.name, [false, true]]);

export const variants = getVariants({
  ...Object.fromEntries(propertiesFromCem),
  // clipboard: [false, true],
  // disabled: [false, true],
  // inline: [false, true],
  // label: [undefined, 'The Label', 'A very long label (Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu.)'],
  // multi: [false, true],
  // name: ['field-name'],
  // placeholder: [undefined, 'Some placeholder'],
  // readonly: [false, true],
  // required: [false, true],
  // secret: [false, true],
  // skeleton: [false, true],
  // tags: [undefined, ['one', 'two', 'three']],
  // value: [undefined, 'The value'],
});

// language=CSS
export const style = `

`;
