import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixCloseFill as iconClose } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcAddonVersionChangeEvent } from './cc-addon-info.events.js';

// TODO: duplicate pricing product translations
/** @type {Record<FormattedFeature['code'], () => string>} */
const FEATURES_I18N = {
  'connection-limit': () => i18n('cc-pricing-product.feature.connection-limit'),
  cpu: () => i18n('cc-pricing-product.feature.cpu'),
  databases: () => i18n('cc-pricing-product.feature.databases'),
  dedicated: () => i18n('cc-pricing-product.feature.dedicated'),
  'disk-size': () => i18n('cc-pricing-product.feature.disk-size'),
  gpu: () => i18n('cc-pricing-product.feature.gpu'),
  'has-logs': () => i18n('cc-pricing-product.feature.has-logs'),
  'has-metrics': () => i18n('cc-pricing-product.feature.has-metrics'),
  'is-migratable': () => i18n('cc-pricing-product.feature.is-migratable'),
  'max-db-size': () => i18n('cc-pricing-product.feature.max-db-size'),
  memory: () => i18n('cc-pricing-product.feature.memory'),
  version: () => i18n('cc-pricing-product.feature.version'),
};

/**
 * @typedef {import('./cc-addon-info.types.js').CcAddonInfoState} CcAddonInfoState
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateUpdateAvailable} AddonVersionStateUpdateAvailable
 * @typedef {import('./cc-addon-info.types.js').AddonVersionStateRequestingUpdate} AddonVersionStateRequestingUpdate
 * @typedef {import('../common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('../cc-select/cc-select.types.js').Option} Option
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
 * @typedef {import('lit/directives/ref.js').Ref<HTMLElement>} HTMLElementRef
 */

export class CcAddonInfo extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CcAddonInfoState} */
    this.state = { type: 'loading', creationDate: '2025-08-04 15:03:02' };

    /** @type {HTMLDialogElementRef} */
    this._versionDialogRef = createRef();

    /** @type {HTMLElementRef} */
    this._versionTextRef = createRef();

    new LostFocusController(this, 'dialog', () => {
      this._versionTextRef.value?.focus();
    });
  }

  /**
   * Returns the formatted value corresponding to a feature
   *
   * @param {FormattedFeature} feature - the feature to get the formatted value from
   * @return {string|Node|void} the formatted value for the given feature or the feature value itself if it does not require any formatting
   */
  _getFeatureValue(feature) {
    if (feature == null) {
      return '';
    }

    switch (feature.type) {
      case 'boolean':
        return i18n('cc-pricing-product.type.boolean', { boolean: feature.value === 'true' });
      case 'boolean-shared':
        return i18n('cc-pricing-product.type.boolean-shared', { shared: feature.value === 'shared' });
      case 'bytes':
        return feature.code === 'memory' && feature.value === '0'
          ? i18n('cc-pricing-product.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-product.type.bytes', { bytes: Number(feature.value) });
      case 'number':
        return feature.code === 'cpu' && feature.value === '0'
          ? i18n('cc-pricing-product.type.boolean-shared', { shared: true })
          : i18n('cc-pricing-product.type.number', { number: Number(feature.value) });
      case 'number-cpu-runtime':
        return i18n('cc-pricing-product.type.number-cpu-runtime', {
          /**
           * Narrowing the type would make the code less readable for no gain, improving the type to separate
           * `number-cpu-runtime` from other types makes the code a lot more complex for almost no type safety gain
           */
          // @ts-ignore
          cpu: feature.value.cpu,
          // @ts-ignore
          shared: feature.value.shared,
        });
      case 'string':
        return feature.value?.toString();
    }
  }

  _onVersionDialogOpen() {
    this._versionDialogRef.value?.showModal();
  }

  _onVersionDialogClose() {
    this._versionDialogRef.value?.close();
  }

  /** @param {{ version: string }} formData */
  _onVersionFormSubmit({ version }) {
    console.log(version);
    this.dispatchEvent(new CcAddonVersionChangeEvent(version));
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-addon-info.error')}"></cc-notice>`;
    }

    // TODO: when modal is closed because update was a success, focus div[tabindex="-1"] (maybe add a ref to simplify)
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-info.heading')}</div>
        <div slot="content" tabindex="-1" ${ref(this._versionTextRef)}>
          ${this.state.version != null
            ? html`
                <strong class="heading">${i18n('cc-addon-info.version.heading')}</strong>
                <div>
                  <p>${this.state.version.installed}</p>
                  ${this.state.version.stateType !== 'up-to-date'
                    ? html`
                        <cc-button primary outlined @cc-click="${this._onVersionDialogOpen}">
                          ${i18n('cc-addon-info.version.btn')}
                        </cc-button>
                        ${this._renderVersionDialog(this.state.version)}
                      `
                    : ''}
                </div>
              `
            : ''}
          ${this.state.plan != null
            ? html`
                <strong class="heading">${i18n('cc-addon-info.plan.heading')}</strong>
                <p>${this.state.plan}</p>
              `
            : ''}
          ${this.state.features != null && this.state.features.length > 0
            ? html`
                <strong class="heading">${i18n('cc-addon-info.feature.heading')}</strong>
                <dl>${this.state.features.map((feature) => this._renderFeature(feature))}</dl>
              `
            : ''}
        </div>
      </cc-block>
    `;
  }

  /** @param {AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate} addonVersionState */
  _renderVersionDialog({ stateType, available, installed, changelogLink }) {
    /** @type {Option[]} */
    const selectOptions = available.map((availableVersion) => ({
      label: availableVersion,
      value: availableVersion,
    }));

    return html`
      <dialog aria-labelledby="dialog-heading" ${ref(this._versionDialogRef)}>
        <button @click="${this._onVersionDialogClose}">
          <cc-icon .icon="${iconClose}"></cc-icon>
          <span class="visually-hidden">${i18n('cc-addon-info.version.dialog.close')}</span>
        </button>
        <div class="dialog-heading" id="dialog-heading">${i18n('cc-addon-info.version.dialog.heading')}</div>
        <div class="dialog-desc">${i18n('cc-addon-info.version.dialog.desc', { url: changelogLink })}</div>
        <form ${formSubmit(this._onVersionFormSubmit.bind(this))}>
          <div>
            <p>${i18n('cc-addon-info.version.dialog.select.desc', { currentVersion: installed })}</p>
            <cc-select
              .options="${selectOptions}"
              label="${i18n('cc-addon-info.version.dialog.select.label')}"
              .value="${selectOptions[0].value}"
              .resetValue="${selectOptions[0].value}"
              name="version"
              required
            >
              <p slot="help" class="visually-hidden">
                ${i18n('cc-addon-info.version.dialog.select.help', { currentVersion: installed })}
              </p>
            </cc-select>
          </div>
          <cc-button
            primary
            outlined
            type="reset"
            @cc-click="${this._onVersionDialogClose}"
            ?disabled="${stateType === 'requesting-update'}"
            >${i18n('cc-addon-info.version.dialog.btn.cancel')}</cc-button
          >
          <cc-button primary type="submit" ?waiting="${stateType === 'requesting-update'}"
            >${i18n('cc-addon-info.version.dialog.btn.submit')}</cc-button
          >
        </form>
      </dialog>
    `;
  }

  /** @param {FormattedFeature} */
  _renderFeature({ code, type, value }) {
    return html`
      <dt>${FEATURES_I18N[code]()}</dt>
      <dd>${this._getFeatureValue({ code, type, value })}</dd>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-info', CcAddonInfo);
