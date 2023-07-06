import '../../components/cc-icon/cc-icon.js';
import { html } from 'lit';
import {
  iconRemixAlertFill as iconAlert,
  iconRemixShieldKeyholeFill as iconEncryptionAtRest,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';

const PRICE_PERCENT = 0.10;

export const ccAddonEncryptionAtRestOption = ({ enabled, price }) => {
  const description = html`
    <div class="option-details">${i18n('cc-addon-encryption-at-rest-option.description')}</div>
    <div class="option-warning">
        <cc-icon .icon="${iconAlert}" accessible-name="${i18n('cc-addon-encryption-at-rest-option.error.icon-a11y-name')}" class="icon-warning"></cc-icon>
        <p>${i18n('cc-addon-encryption-at-rest-option.warning', { percent: PRICE_PERCENT, price })}</p>
    </div>
  `;

  return {
    title: i18n('cc-addon-encryption-at-rest-option.title'),
    icon: iconEncryptionAtRest,
    description,
    enabled,
    name: 'encryption',
  };
};
