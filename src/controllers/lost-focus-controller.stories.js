import { css, html, LitElement, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '../components/cc-button/cc-button.js';
import '../components/cc-dialog/cc-dialog.js';
import { LostFocusController } from './lost-focus-controller.js';
import docStoryModule from './lost-focus-controller.md';

// eslint-disable-next-line wc/file-name-matches-element
class MyList extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
    };
  }

  constructor() {
    super();
    this.items = [];

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      suggestedElement?.querySelector('cc-button').focus();
    });
  }

  _onRemove(event) {
    const item = event.currentTarget.dataset.name;
    event.currentTarget.waiting = true;
    setTimeout(() => {
      this.items = this.items.filter((e) => e !== item);
    }, 2000);
  }

  focus() {
    this.shadowRoot.querySelector('cc-button').focus();
  }

  firstUpdated(_changedProperties) {
    setTimeout(() => this.focus());
  }

  render() {
    return repeat(
      this.items,
      (item) => item,
      (item) => {
        return html`
          <div class="item">
            <cc-button @cc-click=${this._onRemove} data-name="${item}">Remove</cc-button>
            <span>${item}</span>
          </div>
        `;
      },
    );
  }

  static get styles() {
    return [
      // language=CSS
      css`
        div {
          margin-bottom: 0.2em;
        }
      `,
    ];
  }
}
window.customElements.define('my-list', MyList);

// eslint-disable-next-line wc/file-name-matches-element
class MyListWithDialog extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
      dialogOpen: { type: Boolean },
      itemToDelete: { type: String },
    };
  }

  constructor() {
    super();
    this.items = [];
    this.dialogOpen = false;
    this.itemToDelete = null;

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      suggestedElement?.querySelector('cc-button').focus();
    });
  }

  _onClickRemove(event) {
    const item = event.currentTarget.dataset.name;
    this.itemToDelete = item;
    this.dialogOpen = true;
  }

  _onConfirmDelete() {
    this.items = this.items.filter((e) => e !== this.itemToDelete);
    this.itemToDelete = null;
    this.dialogOpen = false;
  }

  _onCancelDelete() {
    this.itemToDelete = null;
    this.dialogOpen = false;
  }

  focus() {
    this.shadowRoot.querySelector('cc-button').focus();
  }

  firstUpdated(_changedProperties) {
    setTimeout(() => this.focus());
  }

  render() {
    return html`
      ${repeat(
        this.items,
        (item) => item,
        (item) => {
          return html`
            <div class="item">
              <cc-button @cc-click=${this._onClickRemove} data-name="${item}">Remove</cc-button>
              <span>${item}</span>
            </div>
          `;
        },
      )}

      <cc-dialog .open=${this.dialogOpen} heading="Confirm deletion">
        <p>Are you sure you want to delete "${this.itemToDelete}"?</p>
        <div class="dialog-buttons">
          <cc-button @cc-click=${this._onConfirmDelete} .primary=${true}>Confirm</cc-button>
          <cc-button @cc-click=${this._onCancelDelete}>Cancel</cc-button>
        </div>
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        div.item {
          margin-bottom: 0.2em;
        }

        .dialog-buttons {
          display: flex;
          gap: 0.5em;
          justify-content: flex-end;
          margin-top: 1em;
        }
      `,
    ];
  }
}
window.customElements.define('my-list-with-dialog', MyListWithDialog);

export default {
  title: '🕹️ Controllers/LostFocusController',
  tags: ['autodocs'],
  parameters: {
    docs: docStoryModule.parameters.docs,
  },
};

export const defaultStory = () => {
  const storyDom = document.createElement('div');
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

  const onReset = () => {
    render(template, storyDom);
    setTimeout(() => storyDom.querySelector('my-list').focus(), 10);
  };

  /* eslint-disable lit/prefer-static-styles */
  const template = html`
    <style>
      .main {
        margin: 1em;
      }
      cc-button {
        margin-top: 0.3em;
      }
    </style>
    <div class="main">
      <div class="title">Try deleting an item and see the focus automatically placed on the next button</div>
      <my-list .items=${items}></my-list>
      <div class="title">Click the button below to reset the list items</div>
      <cc-button @cc-click=${onReset}>reset</cc-button>
    </div>
  `;
  /* eslint-enable lit/prefer-static-styles */

  render(template, storyDom);

  return storyDom;
};

export const withDialog = () => {
  const storyDom = document.createElement('div');
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

  const onReset = () => {
    render(template, storyDom);
    setTimeout(() => storyDom.querySelector('my-list-with-dialog').focus(), 10);
  };

  /* eslint-disable lit/prefer-static-styles */
  const template = html`
    <style>
      .main {
        margin: 1em;
      }
      cc-button {
        margin-top: 0.3em;
      }
    </style>
    <div class="main">
      <div class="title">
        This demonstrates focus restoration when deletion happens via a dialog confirmation.
        <br />
        When you confirm deletion:
        <ul>
          <li>The dialog tries to restore focus to the delete button that opened it</li>
          <li>But that button no longer exists (it was deleted)</li>
          <li>The dialog dispatches a focus-restoration-fail event</li>
          <li>The LostFocusController handles this and focuses the next item's button</li>
        </ul>
      </div>
      <my-list-with-dialog .items=${items}></my-list-with-dialog>
      <div class="title">Click the button below to reset the list items</div>
      <cc-button @cc-click=${onReset}>reset</cc-button>
    </div>
  `;
  /* eslint-enable lit/prefer-static-styles */

  render(template, storyDom);

  return storyDom;
};
