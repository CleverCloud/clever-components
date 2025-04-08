import { defineSmartComponent } from '../../lib/smart/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-token-api-creation-form.js';

/**
 * @typedef {import('./cc-token-api-creation-form.js').CcTokenApiCreationForm} CcTokenApiCreationForm
 * @typedef {import('../../lib/send-to-api.types.js').ApiConfig} ApiConfig
 * @typedef {import('../../lib/smart/smart-component.types.js').OnContextUpdateArgs<CcTokenApiCreationForm>} OnContextUpdateArgs
 */

defineSmartComponent({
  selector: 'cc-token-api-creation-form',
  params: {
    apiConfig: { type: Object },
  },
  /** @param {OnContextUpdateArgs} args */
  onContextUpdate({ container, component, context, onEvent, updateComponent, signal }) {
    const { apiConfig } = context;
  },
});
