import { css, html, LitElement, render } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { enhanceStoriesNames } from '../stories/lib/story-names.js';
import { LostFocusController } from './lost-focus-controller.js';
import docsPage from './lost-focus-controller.md';
import '../components/cc-button/cc-button.js';

class MyList extends LitElement {
  static get properties () {
    return {
      items: { type: Array },
    };
  }

  constructor () {
    super();
    this.items = [];

    new LostFocusController(this, '.item', ({ suggestedElement }) => {
      suggestedElement?.querySelector('cc-button').focus();
    });
  }

  _onRemove (event) {
    const item = event.currentTarget.dataset.name;
    event.currentTarget.waiting = true;
    setTimeout(() => {
      this.items = this.items.filter((e) => e !== item);
    }, 2000);
  }

  focus () {
    this.shadowRoot.querySelector('cc-button').focus();
  }

  firstUpdated (_changedProperties) {
    setTimeout(() => this.focus());
  }

  render () {
    return repeat(this.items, (item) => item, (item) => {
      return html`
        <div class="item">
          <cc-button @cc-button:click=${this._onRemove} data-name="${item}">Remove</cc-button>
          <span>${item}</span>  
        </div>
      `;
    });
  }

  static get styles () {
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

export default {
  title: '🕹️ Controllers/LostFocusController',
  parameters: { docs: { page: docsPage.parameters.docs.page } },
};

export const defaultStory = () => {
  const storyDom = document.createElement('div');
  const items = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

  const onReset = () => {
    render(template, storyDom);
    setTimeout(() => storyDom.querySelector('my-list').focus(), 10);
  };

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
      <div class="title">Try deleting item and see the focus automatically placed on the next button</div>
      <my-list .items=${items}></my-list>
      <div class="title">Click the button below to reset the list items</div>
      <cc-button @cc-button:click=${onReset}>reset</cc-button>
    </div>
  `;

  render(template, storyDom);

  return storyDom;
};

enhanceStoriesNames({ defaultStory });
