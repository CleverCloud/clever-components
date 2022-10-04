# LostFocusController

This Reactive controller helps detect a focus lost situation that can occur when the focused element is detached from the DOM.

* You provide a query selector which will select the elements for which you're tracking removal.
* You provide a callback that will be fired when one of these elements is removed from the DOM. 
  The callback is fired only if the deleted element had focus (or one of its children had focus)
* The callback will suggest a new element to focus. It suggests the nearest element matching the same query selector.

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

## Full example

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
