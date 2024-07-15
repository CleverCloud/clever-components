import { getAllEnvVars } from '@clevercloud/client/esm/api/v2/addon.js';
import { defineSmartComponent } from '../../lib/define-smart-component.js';
import { sendToApi } from '../../lib/send-to-api.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-env-var-form.js';

defineSmartComponent({
  selector: 'cc-env-var-form[context="env-var-addon"]',
  params: {
    apiConfig: { type: Object },
    ownerId: { type: String },
    addonId: { type: String },
  },
  onContextUpdate({ context, updateComponent, signal }) {
    updateComponent('state', { type: 'loading' });

    const { apiConfig, ownerId, addonId } = context;

    fetchEnvVars({ apiConfig, signal, ownerId, addonId })
      .then((variables) => {
        updateComponent('state', { type: 'loaded', validationMode: 'simple', variables });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('state', { type: 'error' });
      });
  },
});

function fetchEnvVars({ apiConfig, signal, ownerId, addonId }) {
  return getAllEnvVars({ id: ownerId, addonId }).then(sendToApi({ apiConfig, signal }));
}
