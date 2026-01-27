import { html, render } from 'lit';
import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-button/cc-button.js';
import './cc-drawer.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Atoms/<cc-drawer>',
  component: 'cc-drawer',
};

/**
 * @import { CcDrawer } from './cc-drawer.js'
 */

const conf = {
  component: 'cc-drawer',
};

export const defaultStory = makeStory(conf, {
  dom: /** @param {HTMLElement} container */ (container) => {
    function _onClick() {
      /** @type {CcDrawer} */
      const drawer = container.querySelector('cc-drawer');
      drawer.show();
    }

    function refresh() {
      render(
        html`
          <cc-button @cc-click=${_onClick}>Open drawer</cc-button>
          <cc-drawer heading="Hello world!" open>
            <b>You can close this drawer with either</b>
            <ul>
              <li>clicking on the close button</li>
              <li>clicking outside the drawer</li>
              <li>typing <code>Esc</code> key</li>
            </ul>
          </cc-drawer>
        `,
        container,
      );
    }

    refresh();
  },
});
