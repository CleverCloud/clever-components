import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixCloseFill as iconClose,
  iconRemixInformationFill as iconInfo,
  iconRemixSettings_3Line as iconUpdate,
} from '../../assets/cc-remix.icons.js';
import { hasSlottedChildren } from '../../directives/has-slotted-children.js';
import { fakeString } from '../../lib/fake-strings.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcAddonVersionChangeEvent } from './cc-addon-info.events.js';

/** @type {Record<FormattedFeature['code'], () => string>} */
const FEATURES_I18N = {
  'connection-limit': () => i18n('cc-addon-info.feature.connection-limit'),
  cpu: () => i18n('cc-addon-info.feature.cpu'),
  databases: () => i18n('cc-addon-info.feature.databases'),
  dedicated: () => i18n('cc-addon-info.feature.dedicated'),
  'disk-size': () => i18n('cc-addon-info.feature.disk-size'),
  gpu: () => i18n('cc-addon-info.feature.gpu'),
  'has-logs': () => i18n('cc-addon-info.feature.has-logs'),
  'has-metrics': () => i18n('cc-addon-info.feature.has-metrics'),
  'is-migratable': () => i18n('cc-addon-info.feature.is-migratable'),
  'max-db-size': () => i18n('cc-addon-info.feature.max-db-size'),
  memory: () => i18n('cc-addon-info.feature.memory'),
  version: () => i18n('cc-addon-info.feature.version'),
};

/** @type {Partial<CcAddonInfoStateLoaded>} */
const SKELETON_ADDON_INFO = {
  version: {
    installed: fakeString(4),
    available: [],
    changelogLink: fakeString(20),
  },
  plan: fakeString(4),
  features: [
    {
      code: fakeString(5),
      type: 'number',
      value: fakeString(1),
    },
  ],
  creationDate: '2023-01-15T10:30:00Z',
  openGrafanaLink: fakeString(20),
  openScalabilityLink: fakeString(20),
  linkedServices: [
    {
      type: 'app',
      name: fakeString(10),
      logoUrl: '',
      link: fakeString(20),
    },
  ],
};

const GRAFANA_LOGO_URL = 'https://assets.clever-cloud.com/logos/grafana.svg';

/**
 * @typedef {import('./cc-addon-info.types.js').CcAddonInfoState} CcAddonInfoState
 * @typedef {import('./cc-addon-info.types.js').CcAddonInfoStateLoaded} CcAddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonVersion} AddonVersion
 * @typedef {import('../common.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('../cc-select/cc-select.types.js').Option} Option
 * @typedef {import('lit/directives/ref.js').Ref<HTMLDialogElement>} HTMLDialogElementRef
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
    this.state = {
      type: 'loading',
      version: {
        installed: '',
        available: [],
        changelogLink: '',
      },
      plan: '',
      features: [],
      creationDate: '',
      openGrafanaLink: '',
      openScalabilityLink: '',
      linkedServices: [],
    };

    /** @type {HTMLDialogElementRef} */
    this._versionDialogRef = createRef();
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
        return i18n('cc-addon-info.type.boolean', { boolean: feature.value === 'true' });
      case 'boolean-shared':
        return i18n('cc-addon-info.type.boolean-shared', { shared: feature.value === 'shared' });
      case 'bytes':
        return feature.code === 'memory' && feature.value === '0'
          ? i18n('cc-addon-info.type.boolean-shared', { shared: true })
          : i18n('cc-addon-info.type.bytes', { bytes: Number(feature.value) });
      case 'number':
        return feature.code === 'cpu' && feature.value === '0'
          ? i18n('cc-addon-info.type.boolean-shared', { shared: true })
          : i18n('cc-addon-info.type.number', { number: Number(feature.value) });
      case 'number-cpu-runtime':
        return i18n('cc-addon-info.type.number-cpu-runtime', {
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
        return feature.value.toString();
    }
  }

  _onVersionDialogOpen() {
    this._versionDialogRef.value.showModal();
  }

  _onVersionDialogClose() {
    this._versionDialogRef.value.close();
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

    const skeleton = this.state.type === 'loading';
    const addonInfo = this.state.type === 'loaded' ? this.state : SKELETON_ADDON_INFO;

    // TODO: when modal is closed because update was a success, focus div[tabindex="-1"] (maybe add a ref to simplify)
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-info.heading')}</div>
        <div slot="content" class="main">
          ${addonInfo.version != null
            ? html`
                <strong class="heading">${i18n('cc-addon-info.version.heading')}</strong>
                <div class="value version__content" tabindex="-1">
                  <p class="${classMap({ skeleton })}">${addonInfo.version.installed}</p>
                  ${addonInfo.version.available.length > 0
                    ? html`
                        <cc-button primary outlined @cc-click="${this._onVersionDialogOpen}">
                          <cc-icon .icon="${iconUpdate}"></cc-icon>
                          ${i18n('cc-addon-info.version.btn')}
                        </cc-button>
                        ${this._renderVersionDialog(addonInfo.version)}
                      `
                    : ''}
                </div>
              `
            : ''}
          ${addonInfo.plan != null
            ? html`
                <strong class="heading">${i18n('cc-addon-info.plan.heading')}</strong>
                <p class="value plan__content ${classMap({ skeleton })}">${addonInfo.plan}</p>
              `
            : ''}
          ${addonInfo.features != null && addonInfo.features.length > 0
            ? html`
                <strong class="heading">${i18n('cc-addon-info.feature.heading')}</strong>
                <dl class="value features__content ${classMap({ skeleton })}">
                  ${addonInfo.features.map((feature) => this._renderFeature(feature))}
                </dl>
              `
            : ''}
          <strong class="heading">${i18n('cc-addon-info.creation-date.heading')}</strong>
          <p class="value ${classMap({ skeleton })}">
            ${i18n('cc-addon-info.creation-date.human-friendly-date', { date: addonInfo.creationDate })}
          </p>

          ${addonInfo.openGrafanaLink != null
            ? html`
                <strong class="heading">Grafana</strong>
                <cc-link
                  class="value"
                  href="${addonInfo.openGrafanaLink}"
                  image="${GRAFANA_LOGO_URL}"
                  ?skeleton=${skeleton}
                  >${i18n('cc-addon-info.grafana.link')}
                </cc-link>
              `
            : ''}
          ${addonInfo.openScalabilityLink != null
            ? html`
                <strong class="heading">${i18n('cc-addon-info.scalability-link.heading')}</strong>
                <cc-link
                  class="value"
                  href="${addonInfo.openScalabilityLink}"
                  .icon="${iconUpdate}"
                  ?skeleton=${skeleton}
                  >${i18n('cc-addon-info.scalability.link')}
                </cc-link>
              `
            : ''}

          <!-- <slot name="billing-heading"></slot>
          <slot name="billing-description"></slot>-->

          <div class="billing__container" ${hasSlottedChildren()}>
            <div class="billing__header">
              <strong class="heading">${i18n('cc-addon-info.billing.heading')}</strong>
            </div>
            <div class="value ${classMap({ skeleton })}">
              <slot name="billing"></slot>
            </div>
          </div>

          ${addonInfo.linkedServices != null && addonInfo.linkedServices.length > 0
            ? html`
                <strong class="heading">${i18n('cc-addon-info.linked-services.heading')}</strong>
                <div class="value linked-services__content ${classMap({ skeleton })}">
                  <ul>
                    ${addonInfo.linkedServices.map((service) => {
                      return html`
                        <li class="linked-service__li ${classMap({ skeleton })}">
                          <cc-img
                            src="${service.logoUrl}"
                            a11y-name="${service.name}"
                            title="${service.name}"
                            ?skeleton=${skeleton}
                          ></cc-img>
                          <cc-link href="${service.link}" ?skeleton=${skeleton}>${service.name}</cc-link>
                        </li>
                      `;
                    })}
                  </ul>
                  <slot name="linked-services"></slot>
                </div>
              `
            : ''}
        </div>
        <div slot="footer-right">
          <cc-link href="" .icon="${iconInfo}"> ${i18n('cc-addon-info.documentation.text')}</cc-link>
        </div>
      </cc-block>
    `;
  }

  /** @param {AddonVersion} addonVersion */
  _renderVersionDialog({ available, installed, changelogLink }) {
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
          <cc-button primary outlined type="reset" @cc-click="${this._onVersionDialogClose}"
            >${i18n('cc-addon-info.version.dialog.btn.cancel')}</cc-button
          >
          <cc-button primary type="submit">${i18n('cc-addon-info.version.dialog.btn.submit')}</cc-button>
        </form>
      </dialog>
    `;
  }

  /** @param {FormattedFeature} param */
  _renderFeature({ code, type, value }) {
    return html`
      <dt>${FEATURES_I18N[code]()}</dt>
      <dd>${this._getFeatureValue({ code, type, value })}</dd>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      skeletonStyles,
      css`
        :host {
          display: block;
        }

        .main {
          display: grid;
          gap: 2em 0;
          grid-template-columns: repeat(3, 1fr);
        }

        p,
        dl,
        dt,
        dd {
          margin: 0;
        }

        .heading {
          grid-column: 1;
        }

        .value {
          grid-column: 2 / 4;
        }

        .version__content {
          align-items: center;
          display: flex;
          gap: 1em;
        }

        .plan__content {
          border: solid 1px #c9c9c9;
          border-radius: 0.2em;
          font-weight: bold;
          padding: 0.12em 0.4em;
          width: fit-content;
        }

        .features__content {
          display: flex;
        }

        .billing__container {
          display: none;
        }

        .billing__container[billing-is-slotted] {
          display: flex;
          grid-column: 1 / 4;
        }

        // TODO : change fixed width
        .billing__header {
          width: 32.5em;
        }

        ::slotted(p) {
          margin: 0;
        }

        .linked-services__content {
          display: flex;
          flex-direction: column;
          gap: 0.75em;
        }

        .linked-services__content ul {
          display: flex;
          gap: 1.5em;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .linked-service__li {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .linked-service__li cc-img {
          border-radius: 0.19em;
          height: 1.5em;
          width: 1.5em;
        }

        /* .billing-section[billing-is-slotted] .billing-header {
          display: block;
        } */

        .skeleton {
          background-color: #bbb;
          border-color: #777;
          color: transparent;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-info', CcAddonInfo);
