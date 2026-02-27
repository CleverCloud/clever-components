import { makeStory } from '../../stories/lib/make-story.js';
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

const networkGroupDashboard = {
  id: 'ng_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
  name: 'My Network Group',
  description: 'This is my network group used for internal services communication.',
  subnet: '10.0.0.0/16',
  lastIp: '10.0.0.1/24',
  numberOfMembers: 4,
  numberOfPeers: 16,
};

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

export const waitingWithDeleting = makeStory(conf, {
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
