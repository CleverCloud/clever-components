import './cc-jenkins-info.js';
import '../cc-smart-container/cc-smart-container.js';
import { getAddon, getJenkinsUpdates } from '@clevercloud/client/esm/api/v4/addon-providers.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';

defineSmartComponent({
  selector: 'cc-jenkins-info',
  params: {
    apiConfig: { type: Object },
    addonId: { type: String },
  },
  onContextUpdate ({ component, context, updateComponent, signal }) {

    const { apiConfig, addonId } = context;

    updateComponent('state', { type: 'loading' });

    fetchJenkinsAddon({ apiConfig, signal, addonId })
      .then((jenkinsAddon) => {
        updateComponent('state', {
          type: 'loaded',
          jenkinsLink: jenkinsAddon.jenkinsLink,
          jenkinsManageLink: jenkinsAddon.jenkinsManageLink,
          versions: jenkinsAddon.versions,
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

function fetchJenkinsAddon ({ apiConfig, signal, addonId }) {
  return Promise
    .all([
      getAddon({ providerId: 'jenkins', addonId }).then(sendToApi({ apiConfig, signal })),
      getJenkinsUpdates({ addonId }).then(sendToApi({ apiConfig, signal })),
    ])
    .then(([addon, jenkinsUpdates]) => {
      return {
        jenkinsLink: `https://${addon.host}`,
        jenkinsManageLink: jenkinsUpdates.manageLink,
        versions: jenkinsUpdates.versions,
      };
    });
}
