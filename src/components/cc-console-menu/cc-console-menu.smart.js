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
    orgId: { type: String, optional: true },
  },
  /**
   * @param {OnContextUpdateArgs<CcAddonAdmin>} args
   */
  onContextUpdate({ component, context, onEvent, updateComponent, signal }) {
    const { apiConfig, ownerId, orgId } = context;
    const api = new Api({ apiConfig, signal });

    api.fetchSummary().then((summary) => {
      // Default to first org, or find matching org if orgId provided
      let selectedOrg = summary[0];

      if (orgId != null) {
        const foundOrg = summary.find((orga) => orga.id === orgId);
        if (foundOrg != null) {
          selectedOrg = foundOrg;
        }
      }

      const data = {
        orgas: summary.map((orga) => ({
          path: `/organisations/${orga.id}`,
          name: orga.name,
          selected: orga.id === selectedOrg.id,
        })),
        resources:
          selectedOrg != null
            ? [
                ...selectedOrg.applications.map((app) => ({
                  path: `/organisations/${selectedOrg.id}/applications/${app.id}`,
                  name: app.name,
                  id: app.id,
                })),
                ...selectedOrg.addons.map((addon) => ({
                  path: `/organisations/${selectedOrg.id}/addons/${addon.id}`,
                  name: addon.name,
                  id: addon.id,
                })),
              ]
            : [],
        settings: [
          { path: '/support', name: 'Support', icon: iconSupport },
          { path: '/platform-status', name: 'Platform Status', icon: iconPlatformStatus },
          { path: '/users/me/information', name: 'Profile', icon: iconProfile },
          { path: '/documentation', name: 'Documentation', icon: iconDoc },
          { path: '/logout', name: 'Logout', icon: iconLogout },
        ],
      };

      // component.logoUrl = cleverSvg;
      // component.name = 'Console - Clever Cloud';
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
        return summary.organisations;
      });
  }
}
