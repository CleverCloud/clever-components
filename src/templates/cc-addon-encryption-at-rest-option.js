import '../molecules/cc-error.js';
import { html } from 'lit-element';
import { i18n } from '../lib/i18n.js';

const encryptionAtRestSvg = new URL('../assets/encryption-at-rest.svg', import.meta.url).href;

const PRICE_PERCENT = 0.10;

export const ccAddonEncryptionAtRestOption = (documentationLink, { enabled, price }) => {
  const description = html`
    <div class="option-details">${i18n('cc-addon-encryption-at-rest-option.description', { documentationLink })}</div>
    <cc-error class="option-warning">
      ${i18n('cc-addon-encryption-at-rest-option.warning', { percent: PRICE_PERCENT, price })}
    </cc-error>
  `;

  return {
    title: i18n('cc-addon-encryption-at-rest-option.title'),
    logo: encryptionAtRestSvg,
    description,
    enabled,
    name: 'encryption',
  };
};
