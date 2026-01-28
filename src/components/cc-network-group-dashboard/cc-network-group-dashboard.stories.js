import { makeStory } from '../../stories/lib/make-story.js';
import { networkGroupDashboard } from '../../stories/fixtures/network-groups.js';
import './cc-network-group-dashboard.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Network Group/<cc-network-group-dashboard>',
  component: 'cc-network-group-dashboard',
};

const conf = {
  component: 'cc-network-group-dashboard',
};

/**
 * @import { CcNetworkGroupDashboard } from './cc-network-group-dashboard.js'
 * @import { CcInputText } from '../cc-input-text/cc-input-text.js'
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupDashboard>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        ...networkGroupDashboard,
      },
    },
  ],
});

export const deleting = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupDashboard>[]} */
  items: [
    {
      state: {
        type: 'deleting',
        ...networkGroupDashboard,
      },
    },
  ],
  /** @param {CcNetworkGroupDashboard} component */
  onUpdateComplete: (component) => {
    const ccButton = component.shadowRoot.querySelector('cc-button[danger]');
    const deleteButton = ccButton.shadowRoot.querySelector('button');
    const dialogConfrimForm = component.shadowRoot.querySelector('cc-dialog-confirm-form');
    /** @type {CcInputText} */
    const confirmInputText = dialogConfrimForm.shadowRoot.querySelector('cc-input-text');
    confirmInputText.value = networkGroupDashboard.name;
    deleteButton.click();
  },
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupDashboard>[]} */
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcNetworkGroupDashboard>[]} */
  items: [{ state: { type: 'error' } }],
});
