import { elementUpdated, expect, fixture, defineCE } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { html, LitElement } from 'lit';
import { formSubmit } from '../../src/lib/form/form-submit-directive.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import '../../src/components/cc-input-date/cc-input-date.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-button/cc-button.js';

/**
 *
 * @param template
 * @return {Promise<Element & {getFormElement: () => HTMLFormElement, getButtonElement: () => HTMLButtonElement}>}
 */
async function getElement (template) {
  const element = await fixture(template);
  await elementUpdated(element);
  return element;
}

async function spyElement (template) {
  const submitSpy = hanbi.spy();
  const invalidSpy = hanbi.spy();

  const element = await getElement(template);
  element.addEventListener('form:submit', (e) => {
    submitSpy.handler(e.detail);
  });
  element.addEventListener('form:invalid', (e) => {
    invalidSpy.handler(e.detail);
  });

  return {
    element,
    submit: async () => {
      await elementUpdated(element);
      element.shadowRoot.querySelector('form').requestSubmit();
    },
    get formElement () {
      return element.shadowRoot.querySelector('form');
    },
    get activeElement () {
      return element.shadowRoot.activeElement;
    },
    events: {
      submit: submitSpy,
      invalid: invalidSpy,
    },
  };
}

describe('FormSubmitDirective', () => {
  describe('with native inputs', () => {
    const form = defineCE(
      class extends LitElement {
        render () {
          return html`
            <form ${formSubmit()}>
              <input name="input1" type="text" required>
              <input name="input2" type="text">
              <input name="input3" type="text" required>
              <input name="input4" type="text">
              <input name="input5" type="text" required>
              <button type="submit">button</button>
            </form>
          `;
        }
      },
    );

    it('should fire invalid event when form is invalid', async () => {
      const spy = await spyElement(`<${form}></${form}>`);

      await spy.submit();

      expect(spy.events.submit.callCount).to.equal(0);
      expect(spy.events.invalid.callCount).to.equal(1);
      expect(spy.events.invalid.getCall(0).args[0]).to.eql([
        {
          name: 'input1',
          validation: {
            valid: false,
            code: 'Please fill out this field.',
          },
        },
        {
          name: 'input2',
          validation: {
            valid: true,
          },
        },
        {
          name: 'input3',
          validation: {
            valid: false,
            code: 'Please fill out this field.',
          },
        },
        {
          name: 'input4',
          validation: {
            valid: true,
          },
        },
        {
          name: 'input5',
          validation: {
            valid: false,
            code: 'Please fill out this field.',
          },
        },
      ]);
    });

    it('should focus invalid input (first)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('input[name=input3]').value = `value`;
      spy.formElement.querySelector('input[name=input5]').value = `value`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('input[name=input1]'));
    });

    it('should focus invalid input (middle)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('input[name=input1]').value = `value`;
      spy.formElement.querySelector('input[name=input5]').value = `value`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('input[name=input3]'));
    });

    it('should focus invalid input (last)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('input[name=input1]').value = `value`;
      spy.formElement.querySelector('input[name=input3]').value = `value`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('input[name=input5]'));
    });

    it('should fire submit event when form is valid', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('input[name=input1]').value = `value for input1`;
      spy.formElement.querySelector('input[name=input3]').value = `value for input3`;
      spy.formElement.querySelector('input[name=input4]').value = `value for input4`;
      spy.formElement.querySelector('input[name=input5]').value = `value for input5`;

      await spy.submit();

      expect(spy.events.invalid.callCount).to.equal(0);
      expect(spy.events.submit.callCount).to.equal(1);
      expect(spy.events.submit.getCall(0).args[0]).to.eql(
        {
          input1: 'value for input1',
          input2: '',
          input3: 'value for input3',
          input4: 'value for input4',
          input5: 'value for input5',
        },
      );
    });
  });
  describe('with cc inputs', () => {
    const form = defineCE(
      class extends LitElement {
        render () {
          const options = [{ label: 'option1', value: 'option1' }, { label: 'option2', value: 'option2' }];
          return html`
            <form ${formSubmit()}>
              <cc-input-text name="input-text" required></cc-input-text>
              <cc-input-number name="input-number" required></cc-input-number>
              <cc-select name="input-select" required .options=${options}></cc-select>
              <cc-input-date name="input-date" required></cc-input-date>
              <cc-button type="submit">button</cc-button>
            </form>
          `;
        }
      },
    );

    it('should fire invalid event when form is invalid', async () => {
      const spy = await spyElement(`<${form}></${form}>`);

      await spy.submit();

      expect(spy.events.submit.callCount).to.equal(0);
      expect(spy.events.invalid.callCount).to.equal(1);
      expect(spy.events.invalid.getCall(0).args[0]).to.eql([
        {
          name: 'input-text',
          validation: {
            valid: false,
            code: 'empty',
          },
        },
        {
          name: 'input-number',
          validation: {
            valid: false,
            code: 'empty',
          },
        },
        {
          name: 'input-select',
          validation: {
            valid: false,
            code: 'empty',
          },
        },
        {
          name: 'input-date',
          validation: {
            valid: false,
            code: 'empty',
          },
        },
      ]);
    });

    it('should focus invalid input (first)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('[name=input-number]').value = 42;
      spy.formElement.querySelector('[name=input-select]').value = `option1`;
      spy.formElement.querySelector('[name=input-date]').value = `2024-03-22T15:20:00.000Z`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('[name=input-text]'));
    });

    it('should focus invalid input (middle)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('[name=input-text]').value = `value`;
      spy.formElement.querySelector('[name=input-select]').value = `option1`;
      spy.formElement.querySelector('[name=input-date]').value = `2024-03-22T15:20:00.000Z`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('[name=input-number]'));
    });

    it('should focus invalid input (last)', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('[name=input-text]').value = `value`;
      spy.formElement.querySelector('[name=input-number]').value = 42;
      spy.formElement.querySelector('[name=input-select]').value = `option1`;

      await spy.submit();

      expect(spy.activeElement).to.equal(spy.formElement.querySelector('[name=input-date]'));
    });

    it('should fire submit event when form is valid', async () => {
      const spy = await spyElement(`<${form}></${form}>`);
      spy.formElement.querySelector('[name=input-text]').value = `value`;
      spy.formElement.querySelector('[name=input-number]').value = 42;
      spy.formElement.querySelector('[name=input-select]').value = `option1`;
      spy.formElement.querySelector('[name=input-date]').value = `2024-03-22T15:20:00.000Z`;

      await spy.submit();

      expect(spy.events.invalid.callCount).to.equal(0);
      expect(spy.events.submit.callCount).to.equal(1);
      expect(spy.events.submit.getCall(0).args[0]).to.eql(
        {
          'input-text': 'value',
          'input-number': '42',
          'input-date': '2024-03-22T15:20:00.000Z',
          'input-select': 'option1',
        },
      );
    });
  });
});
