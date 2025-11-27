import { html, render } from 'lit';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import '../cc-dialog/cc-dialog.js';
import './cc-dialog-confirmation-form.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-dialog-confirmation-form>',
  component: 'cc-dialog-confirmation-form',
};

/**
 * @typedef {import('./cc-dialog-confirmation-form.js').CcDialogConfirmationForm} CcDialogConfirmationForm
 * @typedef {import('../cc-dialog/cc-dialog.js').CcDialog} CcDialog
 */

const conf = {
  component: 'cc-dialog-confirmation-form',
  displayMode: 'flex-wrap',
};

/**
 * @param {HTMLElement} container
 * @returns {CcDialog|null}
 */
function getDialog(container) {
  return container.querySelector('cc-dialog');
}

export const defaultStory = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This is a simple confirmation dialog.</p>
          <cc-dialog-confirmation-form submit-label="Confirm" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const simpleConfirmation = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This is a simple confirmation with primary button.</p>
          <cc-dialog-confirmation-form submit-label="Confirm" submit-intent="primary" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const simpleConfirmationWithDanger = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Confirmation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This action cannot be undone.</p>
          <cc-dialog-confirmation-form submit-label="Delete" submit-intent="danger" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const simpleConfirmationWithCustomCancelLabel = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Confirmation with Custom Labels" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This confirmation uses a custom cancel button label.</p>
          <cc-dialog-confirmation-form
            submit-label="Continue"
            submit-intent="primary"
            cancel-label="Go back"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const confirmationWithInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">Type the application name to confirm deletion.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const confirmationWithInputAndAutofocus = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">The input field will be automatically focused when the dialog opens.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            autofocus-input
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const confirmationWithInputAndLongText = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application Permanently" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This demonstrates a confirmation with a very long text that must be typed.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete permanently"
            submit-intent="danger"
            confirm-input-label="Type the full name to confirm deletion"
            confirm-text-to-input="my-very-long-application-name-that-is-difficult-to-type"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waiting = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Waiting State" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This dialog shows the waiting state with disabled buttons and loading indicator.</p>
          <cc-dialog-confirmation-form
            submit-label="Confirm"
            submit-intent="primary"
            waiting
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const waitingWithInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Waiting State with Input" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This shows the waiting state with a confirmation input field.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            waiting
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
});

export const simulationsWithSubmit = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Interactive Simulation" @cc-dialog-close="${onClose}">
          <p style="margin: 0">Click confirm to see the waiting state transition automatically.</p>
          <cc-dialog-confirmation-form submit-label="Confirm" submit-intent="primary" @cc-dialog-confirm="${onConfirm}">
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
  simulations: [
    storyWait(
      2000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const component = /** @type {CcDialogConfirmationForm} */ (
          container.querySelector('cc-dialog-confirmation-form')
        );
        component.waiting = true;
      },
    ),
    storyWait(
      4000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const component = /** @type {CcDialogConfirmationForm} */ (
          container.querySelector('cc-dialog-confirmation-form')
        );
        component.waiting = false;
      },
    ),
  ],
});

export const errorWithEmptyInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This story demonstrates the error state when submitting an empty input.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
  /** @type {(component: HTMLElement) => void} */
  onUpdateComplete: (container) => {
    const form = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('form');
    form?.requestSubmit();
  },
});

export const errorWithMismatchedInput = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">This story demonstrates the error state when the input doesn't match the required text.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
  /** @type {(component: HTMLElement) => void} */
  onUpdateComplete: (container) => {
    const form = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('form');
    const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
    if (input) {
      input.value = 'wrong-app-name';
    }
    form?.requestSubmit();
  },
});

export const simulationsWithInputSuccess = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">Watch the simulation type the correct text and submit the form.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
  simulations: [
    storyWait(
      1000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'm';
        }
      },
    ),
    storyWait(
      1200,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'my';
        }
      },
    ),
    storyWait(
      1400,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'my-';
        }
      },
    ),
    storyWait(
      1600,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'my-a';
        }
      },
    ),
    storyWait(
      1800,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'my-ap';
        }
      },
    ),
    storyWait(
      2000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'my-app';
        }
      },
    ),
    storyWait(
      2500,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const form = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('form');
        form?.requestSubmit();
      },
    ),
    storyWait(
      2700,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const component = /** @type {CcDialogConfirmationForm} */ (
          container.querySelector('cc-dialog-confirmation-form')
        );
        component.waiting = true;
      },
    ),
    storyWait(
      4000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        getDialog(container).open = false;
        const component = /** @type {CcDialogConfirmationForm} */ (
          container.querySelector('cc-dialog-confirmation-form')
        );
        component.waiting = false;
        component.resetForm();
      },
    ),
  ],
});

export const simulationsWithInputError = makeStory(conf, {
  /** @param {HTMLElement} container */
  dom: (container) => {
    const onClose = () => {
      const output = container.querySelector('#close-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog closed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.resetForm();
    };
    const onConfirm = () => {
      const output = container.querySelector('#confirm-event-output');
      const timestamp = new Date().toLocaleTimeString();
      output.textContent = `Dialog confirmed at ${timestamp}`;
      const dialogConfirmForm = /** @type {CcDialogConfirmationForm} */ (
        container.querySelector('cc-dialog-confirmation-form')
      );
      dialogConfirmForm.waiting = true;
      setTimeout(() => {
        getDialog(container).open = false;
        dialogConfirmForm.waiting = false;
        dialogConfirmForm.resetForm();
      }, 1000);
    };
    render(
      html`
        <div style="display: flex; flex-direction: column; gap: 1em;">
          <cc-button @cc-click="${() => getDialog(container).show()}" primary>Open Dialog</cc-button>
          <div
            id="confirm-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Submit the form successfully to see the event output
          </div>
          <div
            id="close-event-output"
            style="padding: 1em; background: var(--cc-color-bg-neutral); border-radius: 0.25em;"
          >
            Close the dialog to see the event output
          </div>
        </div>
        <cc-dialog open heading="Delete Application" @cc-dialog-close="${onClose}">
          <p style="margin: 0">Watch the simulation type the wrong text and see the validation error.</p>
          <cc-dialog-confirmation-form
            submit-label="Delete"
            submit-intent="danger"
            confirm-input-label="Type the name to confirm"
            confirm-text-to-input="my-app"
            @cc-dialog-confirm="${onConfirm}"
          >
          </cc-dialog-confirmation-form>
        </cc-dialog>
      `,
      container,
    );
  },
  simulations: [
    storyWait(
      1000,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'w';
        }
      },
    ),
    storyWait(
      1200,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'wr';
        }
      },
    ),
    storyWait(
      1400,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'wro';
        }
      },
    ),
    storyWait(
      1600,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'wron';
        }
      },
    ),
    storyWait(
      1800,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const input = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('cc-input-text');
        if (input) {
          input.value = 'wrong';
        }
      },
    ),
    storyWait(
      2500,
      /** @param {HTMLElement[]} containers */
      ([container]) => {
        const form = container.querySelector('cc-dialog-confirmation-form')?.shadowRoot?.querySelector('form');
        form?.requestSubmit();
      },
    ),
  ],
});

