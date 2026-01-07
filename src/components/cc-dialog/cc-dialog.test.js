import { elementUpdated, fixture, nextFrame } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import * as hanbi from 'hanbi';
import { html } from 'lit';
import { describe, expect, it } from 'vitest';
import { addTranslations, setLanguage } from '../../lib/i18n/i18n.js';
import { findActiveElement } from '../../lib/shadow-dom-utils.js';
import { lang, translations } from '../../translations/translations.en.js';
import { CcCloseEvent, CcFocusRestorationFailEvent } from '../common.events.js';
import './cc-dialog.js';

addTranslations(lang, translations);
setLanguage(lang);

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
  describe('Opening dialog', () => {
    it('should open dialog when show() is called', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');

      expect(dialog.open).toBe(false);

      dialog.show();
      await elementUpdated(dialog);

      expect(dialog.open).toBe(true);
    });

    it('should open dialog when open is set to true', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const nativeDialog = dialog.shadowRoot.querySelector('dialog');
      dialog.open = true;
      await elementUpdated(dialog);

      expect(nativeDialog.open).toBe(true);
    });
  });

  describe('Closing Dialog', () => {
    it('should close dialog when hide() is called', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcCloseEvent.TYPE);

      expect(dialog.open).toBe(true);

      dialog.hide();
      await elementUpdated(dialog);

      expect(dialog.open).toBe(false);
      expect(closeSpy.called).toBe(true);
    });

    it('should dispatch CcCloseEvent when dialog closes', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcCloseEvent.TYPE);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify CcCloseEvent was dispatched exactly once
      expect(closeSpy.callCount).toBe(1);
      // Verify event type
      const event = closeSpy.lastCall.args[0];
      expect(event).toBeInstanceOf(CcCloseEvent);
    });

    it('should close dialog when close button is clicked', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcCloseEvent.TYPE);

      await elementUpdated(dialog);

      // Get close button and click it
      const closeButton = getCloseButton(dialog);
      closeButton.click();
      await elementUpdated(dialog);

      // Verify dialog closes
      expect(dialog.open).toBe(false);
      // Verify CcCloseEvent is dispatched
      expect(closeSpy.called).toBe(true);
    });

    it('should close dialog when Escape key is pressed', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcCloseEvent.TYPE);

      // Press Escape key
      await sendKeys({ press: 'Escape' });
      await elementUpdated(dialog);
      await nextFrame();

      // Verify dialog closes
      expect(dialog.open).toBe(false);
      // Verify CcCloseEvent is dispatched
      expect(closeSpy.called).toBe(true);
    });

    it('should close dialog when open is set to false', async () => {
      const container = await fixture(html`
        <div>
          <cc-dialog heading="Test Dialog" open>
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const dialog = container.querySelector('cc-dialog');
      const closeSpy = createEventSpy(dialog, CcCloseEvent.TYPE);

      dialog.open = false;
      await elementUpdated(dialog);

      // Verify dialog closes
      expect(dialog.open).toBe(false);
      // Verify CcCloseEvent is dispatched
      expect(closeSpy.called).toBe(true);
    });
  });

  describe('Focus Management - On Open', () => {
    it('should move focus to first focusable element', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');

      opener.focus();
      opener.click();
      await elementUpdated(dialog);
      const activeElement = findActiveElement();

      // Verify focus was restored to the opener button
      expect(activeElement).toBe(getCloseButton(dialog));
    });
  });

  describe('Focus Management - While Open', () => {
    it('should trap focus inside dialog (external elements become inert)', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">External Button</button>
          <cc-dialog heading="Test Dialog">
            <button id="internal-button">Internal Button</button>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      opener.focus();
      expect(findActiveElement()).toBe(opener);

      opener.click();
      await elementUpdated(dialog);

      // Try to focus the external button while dialog is open
      opener.focus();
      const activeElement = findActiveElement();

      // Verify focus did NOT move to external button (it should remain inside dialog)
      expect(activeElement).not.toBe(opener);
    });
  });

  describe('Focus Management - On Close - Success', () => {
    it('should restore focus on opener cross-shadowRoot', async () => {
      const container = await fixture(html`
        <div>
          <cc-button id="opener" @cc-click="${() => container.querySelector('cc-dialog').show()}">Open</cc-button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const ccButton = container.querySelector('cc-button');
      const nativeButton = ccButton.shadowRoot.querySelector('button');
      const dialog = container.querySelector('cc-dialog');

      ccButton.focus();
      expect(findActiveElement()).toBe(nativeButton);
      ccButton.click();

      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);
      const activeElement = findActiveElement();

      // Verify focus was restored to the nested button
      expect(activeElement).toBe(nativeButton);
    });

    it('should not trigger CcFocusRestorationFail event if opener is still connected', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcFocusRestorationFailEvent.TYPE);

      opener.focus();
      opener.click();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);

      // Verify no focus restoration fail event was dispatched
      expect(failSpy.called).toBe(false);
    });
  });

  describe('Focus Management - On Close - Failure', () => {
    it('should dispatch focus restoration fail when opener is disconnected', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcFocusRestorationFailEvent.TYPE);

      opener.focus();
      opener.click();
      await elementUpdated(dialog);

      // Remove the opener button from DOM while dialog is open
      opener.remove();
      await nextFrame();

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus restoration fail event was dispatched
      expect(failSpy.called).toBe(true);
    });

    it('should provide disconnected element in focus restoration fail event detail', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcFocusRestorationFailEvent.TYPE);

      opener.focus();
      opener.click();
      await elementUpdated(dialog);

      // Remove the opener button from DOM while dialog is open
      opener.remove();
      await nextFrame();

      dialog.hide();
      await elementUpdated(dialog);

      // Verify focus restoration fail event was dispatched with correct detail
      expect(failSpy.called).toBe(true);
      const event = failSpy.lastCall.args[0];
      expect(event).toBeInstanceOf(CcFocusRestorationFailEvent);
      expect(event.detail).toBe(opener);
    });
  });

  describe('Focus Management - Lifecycle', () => {
    it('should restore focus when dialog disconnected while open', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const dialog = container.querySelector('cc-dialog');

      opener.focus();
      opener.click();
      await elementUpdated(dialog);

      // Remove dialog from DOM while it's open (simulating conditional rendering)
      dialog.remove();
      await nextFrame();

      const activeElement = findActiveElement();
      // Verify focus was restored to the opener button
      expect(activeElement).toBe(opener);
    });

    it('should not attempt focus restoration if dialog disconnected while closed', async () => {
      const container = await fixture(html`
        <div>
          <button id="opener" @click="${() => container.querySelector('cc-dialog').show()}">Open Dialog</button>
          <button id="other">Other Button</button>
          <cc-dialog heading="Test Dialog">
            <p>Dialog content</p>
          </cc-dialog>
        </div>
      `);
      const opener = container.querySelector('#opener');
      const otherButton = container.querySelector('#other');
      const dialog = container.querySelector('cc-dialog');
      const failSpy = createEventSpy(dialog, CcFocusRestorationFailEvent.TYPE);

      opener.focus();
      opener.click();
      await elementUpdated(dialog);

      dialog.hide();
      await elementUpdated(dialog);
      // Focus should be back on opener
      expect(findActiveElement()).toBe(opener);

      // Now focus something else and remove the dialog
      otherButton.focus();

      // Focus should be on other button
      expect(findActiveElement()).toBe(otherButton);

      dialog.remove();
      await nextFrame();
      // Focus should remain on other button (no restoration attempted)
      expect(findActiveElement()).toBe(otherButton);
      // No additional focus restoration fail event
      expect(failSpy.called).toBe(false);
    });
  });
});
