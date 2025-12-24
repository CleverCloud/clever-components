import { makeStory } from '../../stories/lib/make-story.js';
import './cc-console-menu.js';

import {
  iconRemixBook_2Line as iconDoc,
  iconRemixLogoutBoxRLine as iconLogout,
  iconRemixCheckLine as iconPlatformStatus,
  iconRemixSettings_3Line as iconProfile,
  iconRemixMessage_2Line as iconSupport,
} from '../../assets/cc-remix.icons.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Menu/<cc-console-menu>',
  component: 'cc-console-menu',
};

const conf = {
  component: 'cc-console-menu',
};

/**
 * @import { CcAddonAdmin } from './cc-console-menu.js'
 * @import { AddonAdminStateLoaded, AddonAdminStateLoading, AddonAdminStateError, AddonAdminStateUpdatingName, AddonAdminStateUpdatingTags, AddonAdminStateDeleting } from './cc-addon-admin.types.js'
 */

const addon = {
  id: 'addon_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  name: 'Awesome addon (PROD)',
  tags: ['foo:bar', 'simple-tag'],
};

const cleverSvg = new URL('../../assets/clever-logo.svg', import.meta.url);

export const defaultStory = makeStory(conf, {
  items: [
    {
      logoUrl: cleverSvg,
      name: 'My Awesome Console',
      orgas: [
        { path: '/orga1', name: 'Orga 1', icon: null },
        { path: '/orga2', name: 'Orga 2', icon: null },
      ],
      resources: [
        { path: '/app1', name: 'My Node app', icon: null },
        { path: '/addon1', name: 'My awesome MySQL', icon: null },
      ],
      settings: [
        { path: '/support', name: 'Support', icon: iconSupport },
        { path: '/platform-status', name: 'Platform Status', icon: iconPlatformStatus },
        { path: '/profile', name: 'Profile', icon: iconProfile },
        { path: '/documentation', name: 'Documentation', icon: iconDoc },
        { path: '/logout', name: 'Logout', icon: iconLogout },
      ],
    },
  ],
});
