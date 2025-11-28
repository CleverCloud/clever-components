import { elementUpdated, expect, fixture, nextFrame } from '@open-wc/testing';
import * as hanbi from 'hanbi';
import { html } from 'lit';
import { typeText } from '../../../test/helpers/element-helper.js';
import '../cc-dialog/cc-dialog.js';
import { CcDialogConfirmEvent } from './cc-dialog-confirmation-form.events.js';
import './cc-dialog-confirmation-form.js';

// Helper: Get internal input from shadow root
function getConfirmInput(element) {
  return element.shadowRoot.querySelector('cc-input-text');
}

// Helper: Get submit button from shadow root
function getSubmitButton(element) {
  return element.shadowRoot.querySelector('cc-button[type="submit"]');
}

// Helper: Get cancel button from shadow root
function getCancelButton(element) {
  return element.shadowRoot.querySelector('cc-button[outlined]');
}

// Helper: Get the internal native input from cc-input-text
function getNativeInput(ccInputText) {
  return ccInputText.shadowRoot.querySelector('input');
}

// Helper: Spy on events
function createEventSpy(element, eventType) {
  const spy = hanbi.spy();
  element.addEventListener(eventType, (event) => {
    spy.handler(event);
  });
  return spy;
}

describe('cc-dialog-confirmation-form component', () => {
  describe('Simple confirmation mode (no input)', () => {
    it('should render only action buttons when confirmInputLabel is not provided', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);
      const submitButton = getSubmitButton(form);
      const cancelButton = getCancelButton(form);

      expect(input).to.be.null;
      expect(submitButton).to.not.be.null;
      expect(cancelButton).to.not.be.null;
    });

    it('should render only action buttons when confirmTextToInput is not provided', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Confirm"
              confirmInputLabel="Type to confirm"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input).to.be.null;
    });

    it('should render only action buttons when both confirmInputLabel and confirmTextToInput are empty strings', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Confirm"
              confirmInputLabel=""
              confirmTextToInput=""
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input).to.be.null;
    });
  });

  describe('Confirmation with input mode', () => {
    it('should render input when both confirmInputLabel and confirmTextToInput are provided', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input).to.not.be.null;
      expect(input.label).to.equal('Type to confirm');
    });

    it('should display confirmTextToInput in help text', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);
      const helpText = input.querySelector('[slot="help"]');

      expect(helpText.textContent).to.equal('delete-me');
    });

    it('should mark input as required', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input.required).to.be.true;
    });
  });

  describe('Autofocus behavior', () => {
    it('should focus the input when dialog opens and autofocusInput is true', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Delete Application">
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
              autofocusInput
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const dialog = container.querySelector('cc-dialog');
      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);
      const nativeInput = getNativeInput(input);

      dialog.show();
      await elementUpdated(dialog);
      await nextFrame();

      expect(document.activeElement).to.equal(nativeInput);
    });

    it('should not focus the input when dialog opens and autofocusInput is false', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open</button>
          <cc-dialog heading="Delete Application">
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);
      const nativeInput = getNativeInput(input);

      opener.focus();
      dialog.show();
      await elementUpdated(dialog);
      await nextFrame();

      expect(document.activeElement).to.not.equal(nativeInput);
    });
  });

  describe('Cancel button', () => {
    it('should display default cancel label when cancelLabel is not provided', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelButton = getCancelButton(form);

      expect(cancelButton.textContent.trim()).to.not.equal('');
    });

    it('should display custom cancel label when provided', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm" cancelLabel="No thanks"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelButton = getCancelButton(form);

      expect(cancelButton.textContent.trim()).to.equal('No thanks');
    });

    it('should close the dialog when cancel button is clicked', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const dialog = container.querySelector('cc-dialog');
      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelButton = getCancelButton(form);

      expect(dialog.open).to.be.true;

      cancelButton.click();
      await elementUpdated(dialog);

      expect(dialog.open).to.be.false;
    });

    it('should dispatch cancel event with bubbles and composed flags', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelSpy = createEventSpy(form, 'cancel');
      const cancelButton = getCancelButton(form);

      cancelButton.click();
      await elementUpdated(form);

      const event = cancelSpy.lastCall.args[0];
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
    });

    it('should be disabled when waiting is true', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm" waiting></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelButton = getCancelButton(form);

      expect(cancelButton.disabled).to.be.true;
    });

    it('should not be disabled when waiting is false', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const cancelButton = getCancelButton(form);

      expect(cancelButton.disabled).to.be.false;
    });
  });

  describe('Submit button', () => {
    it('should display submitLabel', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Delete Now"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.textContent.trim()).to.equal('Delete Now');
    });

    it('should have primary intent by default', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.primary).to.be.true;
      expect(submitButton.danger).to.be.false;
    });

    it('should have danger intent when submitIntent is danger', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Delete" submitIntent="danger"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.danger).to.be.true;
      expect(submitButton.primary).to.be.false;
    });

    it('should have primary intent when submitIntent is primary', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm" submitIntent="primary"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.primary).to.be.true;
      expect(submitButton.danger).to.be.false;
    });

    it('should show waiting state when waiting is true', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm" waiting></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.waiting).to.be.true;
    });

    it('should not show waiting state when waiting is false', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.waiting).to.be.false;
    });

    it('should have type="submit"', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const submitButton = getSubmitButton(form);

      expect(submitButton.type).to.equal('submit');
    });
  });

  describe('Event dispatching in simple mode', () => {
    it('should dispatch CcDialogConfirmEvent when submit button is clicked', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const confirmSpy = createEventSpy(form, CcDialogConfirmEvent.TYPE);
      const submitButton = getSubmitButton(form);

      submitButton.click();
      await elementUpdated(form);

      expect(confirmSpy.called).to.be.true;
      const event = confirmSpy.lastCall.args[0];
      expect(event).to.be.instanceOf(CcDialogConfirmEvent);
    });
  });

  describe('Form submission with input validation', () => {
    it('should not dispatch confirm event when input validation fails', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const confirmSpy = createEventSpy(form, CcDialogConfirmEvent.TYPE);
      const input = getConfirmInput(form);

      // Type wrong text
      await typeText(input, 'wrong-text');

      const submitButton = getSubmitButton(form);
      submitButton.click();
      await elementUpdated(form);

      expect(confirmSpy.called).to.be.false;
    });

    it('should dispatch confirm event when input validation succeeds', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const confirmSpy = createEventSpy(form, CcDialogConfirmEvent.TYPE);
      const input = getConfirmInput(form);

      // Type correct text
      await typeText(input, 'delete-me');

      const submitButton = getSubmitButton(form);
      submitButton.click();
      await elementUpdated(form);

      expect(confirmSpy.called).to.be.true;
    });

    it('should dispatch confirm event when submit button is clicked with valid input', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="my-app"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const confirmSpy = createEventSpy(form, CcDialogConfirmEvent.TYPE);
      const input = getConfirmInput(form);

      await typeText(input, 'my-app');

      const submitButton = getSubmitButton(form);
      submitButton.click();
      await elementUpdated(form);

      expect(confirmSpy.called).to.be.true;
      const event = confirmSpy.lastCall.args[0];
      expect(event).to.be.instanceOf(CcDialogConfirmEvent);
    });
  });

  describe('Input readonly state', () => {
    it('should make input readonly when waiting is true', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
              waiting
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input.readonly).to.be.true;
    });

    it('should not make input readonly when waiting is false', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input.readonly).to.be.false;
    });

    it('should update input readonly state when waiting changes', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      expect(input.readonly).to.be.false;

      form.waiting = true;
      await elementUpdated(form);

      expect(input.readonly).to.be.true;

      form.waiting = false;
      await elementUpdated(form);

      expect(input.readonly).to.be.false;
    });
  });

  describe('resetForm() method', () => {
    it('should reset the form when resetForm is called in input mode', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      // Type some text
      await typeText(input, 'delete-me');

      // Get the internal input value
      const internalInput = input.shadowRoot.querySelector('input');
      expect(internalInput.value).to.equal('delete-me');

      // Reset the form
      form.resetForm();
      await elementUpdated(form);

      // Value should be cleared
      expect(internalInput.value).to.equal('');
    });

    it('should handle resetForm when form ref is not set', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');

      // This should not throw
      expect(() => form.resetForm()).to.not.throw();
    });
  });

  describe('Custom validator behavior', () => {
    it('should validate that input matches confirmTextToInput exactly', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="exact-match"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      // Type partial match
      await typeText(input, 'exact');
      expect(input.validate().valid).to.be.false;
    });

    it('should be valid when input exactly matches confirmTextToInput', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="exact-match"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      await typeText(input, 'exact-match');
      expect(input.validate().valid).to.be.true;
    });

    it('should be case-sensitive when validating input', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="CaseSensitive"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');
      const input = getConfirmInput(form);

      await typeText(input, 'casesensitive');
      expect(input.validate().valid).to.be.false;

      await typeText(input, 'CaseSensitive');
      expect(input.validate().valid).to.be.true;
    });
  });

  describe('Waiting state updates', () => {
    it('should update waiting state on all elements when property changes', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');

      expect(form.waiting).to.be.false;

      form.waiting = true;
      await elementUpdated(form);

      const submitButton = getSubmitButton(form);
      const cancelButton = getCancelButton(form);
      const input = getConfirmInput(form);

      expect(submitButton.waiting).to.be.true;
      expect(cancelButton.disabled).to.be.true;
      expect(input.readonly).to.be.true;
    });
  });

  describe('Mode switching', () => {
    it('should switch from simple mode to input mode when properties are set', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form submitLabel="Confirm"></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');

      let input = getConfirmInput(form);
      expect(input).to.be.null;

      form.confirmInputLabel = 'Type to confirm';
      form.confirmTextToInput = 'delete-me';
      await elementUpdated(form);

      input = getConfirmInput(form);
      expect(input).to.not.be.null;
    });

    it('should switch from input mode to simple mode when properties are cleared', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <cc-dialog-confirmation-form
              submitLabel="Delete"
              confirmInputLabel="Type to confirm"
              confirmTextToInput="delete-me"
            ></cc-dialog-confirmation-form>
          </cc-dialog>
        </div>
      `);

      const form = container.querySelector('cc-dialog-confirmation-form');

      let input = getConfirmInput(form);
      expect(input).to.not.be.null;

      form.confirmInputLabel = null;
      form.confirmTextToInput = null;
      await elementUpdated(form);

      input = getConfirmInput(form);
      expect(input).to.be.null;
    });
  });
});
