import { expect } from '@open-wc/testing';
import { elementUpdated, fixture } from '@open-wc/testing-helpers';
import * as hanbi from 'hanbi';
import { html } from 'lit';
import { addTranslations, setLanguage } from '../../lib/i18n/i18n.js';
import { findActiveElement } from '../../lib/shadow-dom-utils.js';
import { lang, translations } from '../../translations/translations.en.js';
import '../cc-dialog/cc-dialog.js';
import { CcConfirmEvent } from '../common.events.js';
import './cc-dialog-confirm-form.js';

addTranslations(lang, translations);
setLanguage(lang);

/** @import { CcDialog } from '../cc-dialog/cc-dialog.js'; */

/** @param {CcDialog} ccDialogElement */
async function getCancelButton(ccDialogElement) {
  await elementUpdated(ccDialogElement);
  return ccDialogElement
    .querySelector('cc-dialog-confirm-form')
    .shadowRoot.querySelector('cc-dialog-confirm-actions')
    .shadowRoot.querySelector('cc-button[outlined]')
    .shadowRoot.querySelector('button');
}

/** @param {CcDialog} ccDialogElement */
async function getSubmitButton(ccDialogElement) {
  await elementUpdated(ccDialogElement);
  return ccDialogElement
    .querySelector('cc-dialog-confirm-form')
    .shadowRoot.querySelector('cc-dialog-confirm-actions')
    .shadowRoot.querySelector('cc-button[type="submit"]')
    .shadowRoot.querySelector('button');
}

/** @param {CcDialog} ccDialogElement */
async function getCcInputText(ccDialogElement) {
  await elementUpdated(ccDialogElement);
  return ccDialogElement.querySelector('cc-dialog-confirm-form').shadowRoot.querySelector('cc-input-text');
}

function createEventSpy(element, eventType) {
  const spy = hanbi.spy();
  element.addEventListener(eventType, (event) => {
    spy.handler(event);
  });
  return spy;
}

describe('cc-dialog-confirm-form', () => {
  it('closes the dialog without submitting when cancel is clicked', async () => {
    // Test implementation here
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form submit-label="submit"></cc-dialog-confirm-form>
      </cc-dialog>
    `);

    const cancelButton = await getCancelButton(ccDialogElement);
    cancelButton.click();
    await elementUpdated(ccDialogElement);

    expect(ccDialogElement.open).to.be.false;
  });

  it('resets the form when cancel is clicked', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);

    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'some text';
    await elementUpdated(ccDialogElement);

    const cancelButton = await getCancelButton(ccDialogElement);
    cancelButton.click();
    await elementUpdated(ccDialogElement);

    expect(ccInputText.value).to.equal('');
  });

  it('shows form error when submitting empty required fields', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);
    const submitButton = await getSubmitButton(ccDialogElement);
    submitButton.click();
    await elementUpdated(ccDialogElement);

    const ccInputText = await getCcInputText(ccDialogElement);
    expect(ccInputText.errorMessage).to.be.equal('You must enter a value');
  });

  it("shows form error when submitting input that doesn't match confirm-text-to-input", async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);
    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'wrong-text';
    await elementUpdated(ccDialogElement);

    const submitButton = await getSubmitButton(ccDialogElement);
    submitButton.click();
    await elementUpdated(ccDialogElement);

    expect(ccInputText.errorMessage).to.be.equal('Invalid value. Enter "delete-me" as value');
  });

  it('does not emit confirm event when form contains errors', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);
    const confirmEventSpy = createEventSpy(
      ccDialogElement.querySelector('cc-dialog-confirm-form'),
      CcConfirmEvent.TYPE,
    );
    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'wong-text';
    await elementUpdated(ccDialogElement);

    const submitButton = await getSubmitButton(ccDialogElement);
    submitButton.click();
    await elementUpdated(ccDialogElement);

    expect(confirmEventSpy.callCount).to.equal(0);
  });

  it('emits confirm event when form is successfully submitted', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);
    const confirmEventSpy = createEventSpy(
      ccDialogElement.querySelector('cc-dialog-confirm-form'),
      CcConfirmEvent.TYPE,
    );
    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'delete-me';
    await elementUpdated(ccDialogElement);

    const submitButton = await getSubmitButton(ccDialogElement);
    submitButton.click();
    await elementUpdated(ccDialogElement);

    expect(confirmEventSpy.callCount).to.equal(1);
  });

  it('resets the form when the resetForm() method is called', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);

    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'some text';
    await elementUpdated(ccDialogElement);

    const confirmationForm = ccDialogElement.querySelector('cc-dialog-confirm-form');
    confirmationForm.resetForm();
    await elementUpdated(ccDialogElement);
    expect(ccInputText.value).to.equal('');
  });

  it('autofocuses the input when autofocusInput is true', async () => {
    const testTemplate = await fixture(html`
      <div>
        <button @click="${() => testTemplate.querySelector('cc-dialog').show()}">Open dialog</button>
        <cc-dialog heading="Confirmation test">
          <cc-dialog-confirm-form
            confirm-text-to-input="delete-me"
            confirm-input-label="Type 'delete me' to confirm"
            submit-label="submit"
            autofocus-input
          ></cc-dialog-confirm-form>
        </cc-dialog>
      </div>
    `);

    testTemplate.querySelector('button').click();
    await elementUpdated(testTemplate);
    const activeElement = findActiveElement();
    const ccDialogElement = testTemplate.querySelector('cc-dialog');
    const ccInputText = await getCcInputText(ccDialogElement);
    const nativeTextInput = ccInputText.shadowRoot.querySelector('input');

    expect(activeElement).to.equal(nativeTextInput);
  });

  it('resets the form when dialog closes', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <cc-dialog-confirm-form
          confirm-text-to-input="delete-me"
          confirm-input-label="Type 'delete me' to confirm"
          submit-label="submit"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `);

    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'some text';
    await elementUpdated(ccDialogElement);

    // Close the dialog programmatically
    ccDialogElement.open = false;
    await elementUpdated(ccDialogElement);

    expect(ccInputText.value).to.equal('');
  });

  it('does not reset when a different cc-dialog on the page closes', async () => {
    const testTemplate = await fixture(html`
      <div>
        <cc-dialog open heading="First dialog">
          <cc-dialog-confirm-form
            confirm-text-to-input="delete-me"
            confirm-input-label="Type 'delete me' to confirm"
            submit-label="submit"
          ></cc-dialog-confirm-form>
        </cc-dialog>
        <cc-dialog open heading="Second dialog">
          <p>Another dialog on the page</p>
        </cc-dialog>
      </div>
    `);

    const firstDialog = testTemplate.querySelector('cc-dialog:first-of-type');
    const secondDialog = testTemplate.querySelector('cc-dialog:last-of-type');
    const ccInputText = await getCcInputText(firstDialog);
    ccInputText.value = 'some text';
    await elementUpdated(testTemplate);

    // Close second dialog - should NOT reset the first dialog's form
    secondDialog.open = false;
    await elementUpdated(testTemplate);

    expect(ccInputText.value).to.equal('some text');

    // Close first dialog - should reset the form
    firstDialog.open = false;
    await elementUpdated(testTemplate);

    expect(ccInputText.value).to.equal('');
  });

  it('handles should reset on close when form is wrapped in a div', async () => {
    const ccDialogElement = await fixture(html`
      <cc-dialog open heading="Confirmation test">
        <div>
          <cc-dialog-confirm-form
            confirm-text-to-input="delete-me"
            confirm-input-label="Type 'delete me' to confirm"
            submit-label="submit"
          ></cc-dialog-confirm-form>
        </div>
      </cc-dialog>
    `);

    const ccInputText = await getCcInputText(ccDialogElement);
    ccInputText.value = 'some text';
    await elementUpdated(ccDialogElement);

    // Close the dialog programmatically
    ccDialogElement.open = false;
    await elementUpdated(ccDialogElement);

    expect(ccInputText.value).to.equal('');
  });
});
