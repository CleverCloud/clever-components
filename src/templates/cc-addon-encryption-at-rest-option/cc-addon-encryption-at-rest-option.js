import '../../components/cc-error/cc-error.js';
import { html } from 'lit';
import { iconRemixShieldKeyholeFill as iconEncryptionAtRest } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';

const PRICE_PERCENT = 0.10;

export const ccAddonEncryptionAtRestOption = ({ enabled, price }) => {
  const description = html`
    <div class="option-details">${i18n('cc-addon-encryption-at-rest-option.description')}</div>
    <cc-error class="option-warning">
      ${i18n('cc-addon-encryption-at-rest-option.warning', { percent: PRICE_PERCENT, price })}
    </cc-error>
  `;

  return {
    title: i18n('cc-addon-encryption-at-rest-option.title'),
    icon: iconEncryptionAtRest,
    description,
    enabled,
    name: 'encryption',
  };
};
