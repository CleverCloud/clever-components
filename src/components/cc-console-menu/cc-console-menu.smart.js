import { getSummary } from '@clevercloud/client/esm/api/v2/user.js';
import {
  iconRemixBook_2Line as iconDoc,
  iconRemixLogoutBoxRLine as iconLogout,
  iconRemixCheckLine as iconPlatformStatus,
  iconRemixSettings_3Line as iconProfile,
  iconRemixMessage_2Line as iconSupport,
} from '../../assets/cc-remix.icons.js';
import { sendToApi } from '../../lib/send-to-api.js';
import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-console-menu.js';

const cleverSvg = new URL('../../assets/clever-logo.svg', import.meta.url);

/**
 * @import { ApiConfig } from '../../lib/send-to-api.types.js'
 * @import { OnContextUpdateArgs } from '../../lib/smart/smart-component.types.js'
 */

defineSmartComponent({
  selector: 'cc-console-menu',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonAdmin>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId } = context;
    const api = new Api({ apiConfig, signal });

    console.log(ownerId);

    const foo = ownerId;

    api.fetchSummary().then((summary) => {
      const data = {
        orgas: [...summary.map((orga) => ({ path: `/organisations/${orga.id}`, name: `${orga.name}` }))],
        resources: [
          ...summary[1].applications.map((app) => ({
            path: `/organisations/${summary[0].id}/applications/${app.id}`,
            name: `${app.name}`,
          })),
          ...summary[1].addons.map((addon) => ({
            path: `/organisations/${summary[0].id}/addons/${addon.id}`,
            name: `${addon.name}`,
          })),
        ],
        settings: [
          { path: '/support', name: 'Support', icon: iconSupport },
          { path: '/platform-status', name: 'Platform Status', icon: iconPlatformStatus },
          { path: '/profile', name: 'Profile', icon: iconProfile },
          { path: '/documentation', name: 'Documentation', icon: iconDoc },
          { path: '/logout', name: 'Logout', icon: iconLogout },
        ],
      };

      console.log('hello');
      component.logoUrl = cleverSvg;
      component.name = 'Console - Clever Cloud';
      component.resources = data.resources;
      component.orgas = data.orgas;
      component.settings = data.settings;
    });
  },
});

class Api {
  /**
   * @param {object} params
   * @param {ApiConfig} params.apiConfig
   * @param {AbortSignal} params.signal
   */
  constructor({ apiConfig, signal }) {
    this._apiConfig = apiConfig;
    this._signal = signal;
  }

  fetchSummary() {
    // @ts-ignore
    return getSummary()
      .then(sendToApi({ apiConfig: this._apiConfig, signal: this._signal }))
      .then((summary) => {
        console.log('done');
        return summary.organisations;
      });
  }
}
