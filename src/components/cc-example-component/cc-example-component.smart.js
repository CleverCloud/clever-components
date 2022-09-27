import { defineSmartComponent } from '../../lib/define-smart-component.js';

/**
 * @typedef {import('./cc-example-component.types.js').CcExampleComponentSmartDefinition} CcExampleComponentSmartDefinition
 * @typedef {import('./cc-example-component.types.js').Person} Person
 */

defineSmartComponent(/** @type {CcExampleComponentSmartDefinition} */({
  selector: 'cc-example-component',
  params: {
    personId: { type: String },
  },
  onContextUpdate ({ container, component, context, onEvent, updateComponent, signal }) {

    onEvent('the-event', (detail) => {
      console.log(detail.one);
      // console.log(detail.notOk);
    });

    // updateComponent('person', (person) => {
    //   // person.foo = 42;
    // });

    updateComponent('person', { state: 'loading' });

    fetchData({ id: context.personId })
      .then(({ name, age, funny }) => {
        updateComponent('person', (person) => {
          if (person.state === 'loaded') {
            person.name = name;
            person.age = age;
            // person.notOk = 42;
          }
        });
        updateComponent('person', {
          state: 'loaded',
          name: name,
          age: age,
          funny: funny,
          // notOk: 42,
        });
      })
      .catch((err) => {
        updateComponent('person', { state: 'error' });
      });

  },
}));

/**
 * @param {object} o
 * @param {string} o.id
 * @returns {Promise<Person>}
 */
async function fetchData ({ id }) {
  return {
    name: 'John',
    age: 42,
    funny: true,
  };
}
