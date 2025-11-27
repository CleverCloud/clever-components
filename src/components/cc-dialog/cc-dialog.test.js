import { elementUpdated, expect, fixture, nextFrame } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import * as hanbi from 'hanbi';
import { html } from 'lit';
import { CcDialogCloseEvent, CcDialogFocusRestorationFail } from './cc-dialog.events.js';
import './cc-dialog.js';

// Helper: Get close button from shadow root
function getCloseButton(element) {
  return element.shadowRoot.querySelector('.dialog-close');
}

// Helper: Spy on events
function createEventSpy(element, eventType) {
  const spy = hanbi.spy();
  element.addEventListener(eventType, (event) => {
    spy.handler(event);
  });
  return spy;
}

describe('cc-dialog component', () => {
  describe('Opening/Closing Dialog', () => {
    it('should open dialog when show() is called', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');

      expect(dialog.open).to.equal(false);

      dialog.show();
      await elementUpdated(dialog);

      expect(dialog.open).to.equal(true);
    });

    it('should close dialog when hide() is called', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcDialogCloseEvent.TYPE);

      expect(dialog.open).to.equal(true);

      dialog.hide();
      await elementUpdated(dialog);

      expect(dialog.open).to.equal(false);
      expect(closeSpy.called).to.equal(true);
    });
  });

  describe('Focus Management - On Open', () => {
    it('should capture focus element before opening dialog', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus was restored to the opener button
      expect(document.activeElement).to.equal(opener);
    });

    it('should capture active element from nested shadowRoot', async () => {
      const container = await fixture(html`
        <div>
          <div id="nested-container">
            <button id="nested-button">Nested Button</button>
          </div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const nestedButton = container.querySelector('#nested-button');
      const dialog = container.querySelector('cc-dialog');

      nestedButton.focus();

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus was restored to the nested button
      expect(document.activeElement).to.equal(nestedButton);
    });
  });

  describe('Focus Management - While Open', () => {
    it('should trap focus inside dialog (external elements become inert)', async () => {
      const container = await fixture(html`
        <div>
          <button id="external-button">External Button</button>
          <cc-dialog heading="Test Dialog">
            <button id="internal-button">Internal Button</button>
          </cc-dialog>
        </div>
      `);
      const externalButton = container.querySelector('#external-button');
      const dialog = container.querySelector('cc-dialog');

      externalButton.focus();
      expect(document.activeElement).to.equal(externalButton);

      dialog.show();
      await elementUpdated(dialog);

      // Try to focus the external button while dialog is open
      externalButton.focus();

      // Verify focus did NOT move to external button (it should remain inside dialog)
      expect(document.activeElement).to.not.equal(externalButton);
    });
  });

  describe('Focus Management - On Close - Success', () => {
    it('should restore focus to previously focused element on close', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus was restored to the opener button
      expect(document.activeElement).to.equal(opener);
      // Verify no focus restoration fail event was dispatched
      expect(failSpy.called).to.equal(false);
    });

    it('should restore focus to button inside opening element', async () => {
      const container = await fixture(html`
        <div>
          <div id="opener-container">
            <button id="opener">Open Dialog</button>
          </div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus was restored to the button
      expect(document.activeElement).to.equal(opener);
      // Verify no focus restoration fail event was dispatched
      expect(failSpy.called).to.equal(false);
    });
  });

  describe('Focus Management - On Close - Failure', () => {
    it('should dispatch focus restoration fail when element is disconnected', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      // Remove the opener button from DOM while dialog is open
      opener.remove();
      await nextFrame();

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus restoration fail event was dispatched
      expect(failSpy.called).to.equal(true);
      // Verify event contains the element reference
      const event = failSpy.lastCall.args[0];
      expect(event.detail).to.equal(opener);
    });

    it('should handle focus restoration when focused element is no longer in DOM', async () => {
      const container = await fixture(html`
        <div>
          <div id="button-container">
            <button id="temp-button">Temporary Button</button>
          </div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const tempButton = container.querySelector('#temp-button');
      const buttonContainer = container.querySelector('#button-container');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      tempButton.focus();

      dialog.show();
      await elementUpdated(dialog);

      // Remove the entire button container before closing
      buttonContainer.remove();
      await nextFrame();

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus restoration fail event was dispatched
      expect(failSpy.called).to.equal(true);
      // Verify the element is no longer connected
      expect(tempButton.isConnected).to.equal(false);
    });
  });

  describe('Focus Management - Lifecycle', () => {
    it('should restore focus when dialog disconnected while open', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      // Remove dialog from DOM while it's open (simulating conditional rendering)
      dialog.remove();
      await nextFrame();

      // Verify focus was restored to the opener button
      expect(document.activeElement).to.equal(opener);
    });

    it('should not attempt focus restoration if dialog disconnected while closed', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <button id="other">Other Button</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const otherButton = container.querySelector('#other');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Focus should be back on opener
      expect(document.activeElement).to.equal(opener);

      // Now focus something else and remove the dialog
      otherButton.focus();

      dialog.remove();
      await nextFrame();

      // Focus should remain on other button (no restoration attempted)
      expect(document.activeElement).to.equal(otherButton);
      // No additional focus restoration fail event
      expect(failSpy.called).to.equal(false);
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch CcDialogCloseEvent when dialog closes', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcDialogCloseEvent.TYPE);

      dialog.show();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify CcDialogCloseEvent was dispatched exactly once
      expect(closeSpy.callCount).to.equal(1);
      // Verify event type
      const event = closeSpy.lastCall.args[0];
      expect(event).to.be.instanceOf(CcDialogCloseEvent);
    });

    it('should dispatch CcDialogFocusRestorationFail with element reference', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcDialogFocusRestorationFail.TYPE);

      opener.focus();

      dialog.show();
      await elementUpdated(dialog);

      // Remove element from DOM
      opener.remove();
      await nextFrame();

      dialog.hide();
      await elementUpdated(dialog);

      // Verify event was dispatched
      expect(failSpy.called).to.equal(true);
      // Verify event contains the element reference in detail
      const event = failSpy.lastCall.args[0];
      expect(event).to.be.instanceOf(CcDialogFocusRestorationFail);
      expect(event.detail).to.equal(opener);
    });
  });

  describe('User Interactions', () => {
    it('should close dialog when Escape key is pressed', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcDialogCloseEvent.TYPE);

      dialog.show();
      await elementUpdated(dialog);
      expect(dialog.open).to.equal(true);

      // Press Escape key
      await sendKeys({ press: 'Escape' });
      await elementUpdated(dialog);
      await nextFrame();

      // Verify dialog closes
      expect(dialog.open).to.equal(false);
      // Verify CcDialogCloseEvent is dispatched
      expect(closeSpy.called).to.equal(true);
    });

    it('should close dialog when close button is clicked', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcDialogCloseEvent.TYPE);

      dialog.show();
      await elementUpdated(dialog);
      expect(dialog.open).to.equal(true);

      // Get close button and click it
      const closeButton = getCloseButton(dialog);
      closeButton.click();
      await elementUpdated(dialog);

      // Verify dialog closes
      expect(dialog.open).to.equal(false);
      // Verify CcDialogCloseEvent is dispatched
      expect(closeSpy.called).to.equal(true);
    });
  });
});
