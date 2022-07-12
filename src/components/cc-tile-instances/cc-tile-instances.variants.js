const NANO_ONE = { flavorName: 'nano', count: 1 };
const S_TWO = { flavorName: 'S', count: 2 };

export const variants = [];

function setPropertyValues (propName, objectMatcher, valueList) {
  if (Object.keys(objectMatcher).length === 0) {

    variants.push({ [propName]: });
  }
}

setPropertyValues('state', {}, ['loading', 'error', 'loaded']);
setPropertyValues('instances', { state: 'loading' }, [
  { running: [], deploying: [] },
  { running: [NANO_ONE], deploying: [] },
  { running: [], deploying: [S_TWO] },
  { running: [NANO_ONE], deploying: [S_TWO] },
]);

export const style = `
  cc-tile-instances:not(:defined) {
    display: block;
    min-height: 9em;
    background-color: #fff;
    border: 1px solid #bcc2d1;
    border-radius: 0.25rem;
  }
`;
