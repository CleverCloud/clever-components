# LostFocusController

This Reactive controller helps detect a focus lost situation that can occur when the focused element is detached from the DOM.

* You provide a query selector which will select the elements for which you're tracking removal.
* You provide a callback that will be fired when one of these elements is removed from the DOM.
  The callback is fired only if the deleted element had focus (or one of its children had focus)
* The callback will suggest a new element to focus. It suggests the nearest element matching the same query selector.

## How it detects focus loss

The controller tracks focus loss in two ways:

1. **Direct removal detection**: When an element is removed and it (or one of its children) had focus at the time of removal. This is detected in the `hostUpdated` lifecycle method by:
   - Capturing the active element during `hostUpdate` (before the DOM updates)
   - After the update, comparing the current elements with the previous ones to find removed elements
   - Checking if any removed element was the focused element or contained the focused element
   - If so, triggering the callback with a suggested element to focus

2. **Dialog focus restoration failure**: When a `cc-dialog` component closes and fails to restore focus to the element that opened it. This happens when:
   - An element is deleted while a dialog is open (e.g., a delete confirmation dialog)
   - The dialog tries to restore focus to the opening element (the delete button), but it no longer exists in the DOM
   - The dialog dispatches a `cc-focus-restoration-fail` event containing the element it tried (and failed) to restore focus to
   - The controller listens for this event and checks if the failed element is part of a removed element matching the query selector
   - Even though the deleted element didn't have focus at the time of removal (the dialog did), this still represents a focus loss situation that needs to be handled

## Usage

* To use this controller, you have to instantiate it in the constructor of your `LitElement`.

Example:

```js
class MyElement extends LitElement {
  constructor () {
    super();
    new LostFocusController(this, 'query_selector_to_elements_you_track', () => {
      // react to focus loss
    });
  }
}
```

The `LostFocusController` constructor takes the following parameters:

1. the instance of your LitElement based component.
2. the query selector that will be used to track which item was removed.
3. the function that will be called when a focus lost is detected. This function is called with one object parameter made of:
  * `removedElement`: the element that has been removed from DOM.
  * `focusedElement`: the element that had focus just before removal (can be the `removedElement` itself or one of its children).
  * `index`: the index of the `removedElement` within the list of elements matching the query selector (before removal).
  * `suggestedElement`: the element that we suggest to gain focus. It may be `null` if the removed element was the last one matching the query selector.
4. (optional) an `additionalWaiter` function that returns a Promise. This function will be awaited in `hostUpdated` before checking for removed elements. This is useful when you need to wait for additional asynchronous operations (beyond `updateComplete`) to finish before the controller checks for focus loss.

## Examples

### Example 1: Direct removal with focus

The next example shows a list of items where each item is removable with a button.
Once an item is removed, we want to focus on the remove button of the next item.
The example below shows how to do that using the LostFocusController:

```javascript
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class ListOfElements extends LitElement {
  static get properties () {
    return {
      items: {type: Array},
    };
  }

  constructor () {
    super();
    /**
     * @type {{id: string, name: string}[]}
     */
    this.items = [];

    new LostFocusController(this, '.item', ({suggestedElement}) => {
      suggestedElement?.querySelector('button').focus();
    });
  }

  _onRemove (id) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  render () {
    return repeat(this.items, (item) => item.id, (item) => {
      return html`
        <div class="item">
          <button @click=${() => this._onRemove(item.id)}>Remove</button>
          <span>${item.name}</span>
        </div>
      `;
    });
  }
}
```

### Example 2: Removal via dialog confirmation

This example shows a more complex scenario where deletion happens after a dialog is closed:

```javascript
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class ListWithDialogConfirm extends LitElement {
  static get properties () {
    return {
      items: {type: Array},
      dialogOpen: {type: Boolean},
      itemToDelete: {type: String},
    };
  }

  constructor () {
    super();
    this.items = [];
    this.dialogOpen = false;
    this.itemToDelete = null;

    new LostFocusController(this, '.item', ({suggestedElement}) => {
      suggestedElement?.querySelector('button').focus();
    });
  }

  _onClickRemove (id) {
    this.itemToDelete = id;
    this.dialogOpen = true;
  }

  _onConfirmDelete () {
    this.items = this.items.filter((item) => item.id !== this.itemToDelete);
    this.itemToDelete = null;
    this.dialogOpen = false;
  }

  _onCancelDelete () {
    this.itemToDelete = null;
    this.dialogOpen = false;
  }

  render () {
    return html`
      ${repeat(this.items, (item) => item.id, (item) => html`
        <div class="item">
          <button @click=${() => this._onClickRemove(item.id)}>Remove</button>
          <span>${item.name}</span>
        </div>
      `)}

      <cc-dialog .open=${this.dialogOpen} heading="Confirm deletion">
        <p>Are you sure you want to delete this item?</p>
        <button @click=${this._onConfirmDelete}>Confirm</button>
        <button @click=${this._onCancelDelete}>Cancel</button>
      </cc-dialog>
    `;
  }
}
```

In this scenario:
- The user clicks a delete button, opening a confirmation dialog
- The focus is now inside the dialog
- When the user confirms, the item (including the delete button that opened the dialog) is removed from the DOM
- The `cc-dialog` tries to restore focus to the delete button but fails because it no longer exists
- The dialog dispatches a `cc-focus-restoration-fail` event
- The LostFocusController detects this event and handles the focus loss by focusing the suggested element
