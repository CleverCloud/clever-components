import { html, render } from 'lit';
import '../components/cc-button/cc-button.js';
import '../components/cc-dialog/cc-dialog.js';
import '../stories/fixtures/my-list-with-dialog.js';
import '../stories/fixtures/my-list.js';
import docStoryModule from './lost-focus-controller.md';

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
