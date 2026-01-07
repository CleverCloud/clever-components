import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixInformationFill as iconInfo,
  iconRemixSettings_3Line as iconUpdate,
} from '../../assets/cc-remix.icons.js';
import { hasSlottedChildren } from '../../directives/has-slotted-children.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcAddonVersionChangeEvent } from './cc-addon-info.events.js';

/** @type {Record<FormattedFeature['code'], () => string>} */
const FEATURES_I18N = {
  plan: () => i18n('cc-addon-info.specification.plan'),
  'connection-limit': () => i18n('cc-addon-info.specification.connection-limit'),
  cpu: () => i18n('cc-addon-info.specification.cpu'),
  databases: () => i18n('cc-addon-info.specification.databases'),
  dedicated: () => i18n('cc-addon-info.specification.dedicated'),
  'disk-size': () => i18n('cc-addon-info.specification.disk-size'),
  'encryption-at-rest': () => i18n('cc-addon-info.encryption.heading'),
  gpu: () => i18n('cc-addon-info.specification.gpu'),
  'has-logs': () => i18n('cc-addon-info.specification.has-logs'),
  'has-metrics': () => i18n('cc-addon-info.specification.has-metrics'),
  'is-migratable': () => i18n('cc-addon-info.specification.is-migratable'),
  'max-db-size': () => i18n('cc-addon-info.specification.max-db-size'),
  memory: () => i18n('cc-addon-info.specification.memory'),
  version: () => i18n('cc-addon-info.specification.version'),
  users: () => i18n('cc-addon-info.specification.users'),
  'data-exploration': () => i18n('cc-addon-info.specification.data-exploration'),
  'db-analysis': () => i18n('cc-addon-info.specification.db-analysis'),
};

const GRAFANA_LOGO_URL = getAssetUrl('/logos/grafana.svg');

/**
 * @import { AddonInfoState, AddonVersionStateUpdateAvailable, AddonVersionStateRequestingUpdate, LinkedService } from './cc-addon-info.types.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 * @import { FormattedFeature } from '../common.types.js'
 * @import { Ref } from 'lit/directives/ref.js'
 * @import { PropertyValues } from 'lit'
 */

/**
 * A component to display detailed info about an add-on.
 *
 * @cssdisplay block
 *
 * @slot billing - A customised text regarding the billing.
 * @slot linked-services - A customised text regarding the linked services.
 */
export class CcAddonInfo extends LitElement {
  static get properties() {
    return {
      docLink: { type: Object, attribute: 'doc-link' },
      state: { type: Object },
      _isVersionDialogOpen: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {{ text: string; href: string; }} */
    this.docLink = null;

    /** @type {AddonInfoState} Sets the state of the component*/
    this.state = { type: 'loading', creationDate: '2025-08-04 15:03:02' };

    /** @type {boolean} */
    this._isVersionDialogOpen = false;

    /** @type {Ref<HTMLDialogElement>} */
    this._versionDialogRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._versionTextRef = createRef();

    /** @type {Ref<HTMLFormElement>} */
    this._versionFormRef = createRef();
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
        return feature.value?.toString();
    }
  }

  /**
   * Returns the complete linked service name with the 'app' or 'addon' mention
   *
   * @param {LinkedService} service
   * @param {boolean} skeleton
   * @return {string|Node}
   * @private
   */
  _getServiceType(service, skeleton) {
    if (skeleton) {
      return fakeString(15);
    }

    switch (service.type) {
      case 'app':
        return i18n('cc-addon-info.service.name.app', { name: service.name });
      case 'addon':
        return i18n('cc-addon-info.service.name.addon', { name: service.name });
      default:
        return fakeString(15);
    }
  }

  /** @param {{ version: string }} formData */
  _onUpdateVersionRequested({ version }) {
    this.dispatchEvent(new CcAddonVersionChangeEvent(version));
  }

  _onVersionDialogOpen() {
    this._isVersionDialogOpen = true;
  }

  _onVersionDialogClose() {
    this._isVersionDialogOpen = false;
  }

  /** @param {PropertyValues<CcAddonInfo>} changedProperties */
  updated(changedProperties) {
    // when a version has been updated, we need to close the dialog & reset the form
    const previousState = changedProperties.get('state');
    const wasRequestingUpdate =
      previousState?.type === 'loaded' && previousState?.version?.stateType === 'requesting-update';
    const isNotRequestingUpdate = this.state.type === 'loaded' && this.state.version?.stateType !== 'requesting-update';
    if (wasRequestingUpdate && isNotRequestingUpdate) {
      this._isVersionDialogOpen = false;
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-addon-info.error')}"></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-info.heading')}</div>
        <div slot="content" class="main">
          ${this.state.version != null
            ? html`
                <div class="section" tabindex="-1" ${ref(this._versionTextRef)}>
                  <strong class="heading">${i18n('cc-addon-info.version.heading')}</strong>
                  <div class="value version__content">
                    <p class="version__content__version ${classMap({ skeleton })}">${this.state.version.installed}</p>
                    ${this.state.version.stateType !== 'up-to-date'
                      ? html`
                          <cc-button
                            primary
                            outlined
                            ?waiting="${this.state.version.stateType === 'requesting-update'}"
                            @cc-click="${this._onVersionDialogOpen}"
                            .icon="${iconUpdate}"
                          >
                            ${i18n('cc-addon-info.version.btn')}
                          </cc-button>
                          ${this._isVersionDialogOpen ? this._renderVersionDialog(this.state.version) : ''}
                        `
                      : ''}
                  </div>
                </div>
              `
            : ''}
          ${this.state.plan != null
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.plan.heading')}</strong>
                  <div class="value">
                    <p class="data-decoration ${classMap({ skeleton })}">${this.state.plan}</p>
                  </div>
                </div>
              `
            : ''}
          ${this.state.specifications != null && this.state.specifications.length > 0
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.specification.heading')}</strong>
                  <dl class="value features__content">
                    ${this.state.specifications.map((feature) => this._renderSpecification(feature, skeleton))}
                  </dl>
                </div>
              `
            : ''}
          ${this.state.encryption != null
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.encryption.heading')}</strong>
                  <div class="value">
                    <p class="${classMap({ skeleton })}">
                      ${i18n('cc-addon-info.type.boolean', { boolean: this.state.encryption })}
                    </p>
                  </div>
                </div>
              `
            : ''}

          <div class="section">
            <strong class="heading">${i18n('cc-addon-info.creation-date.heading')}</strong>
            <div class="value">
              <p class="${classMap({ skeleton })}">
                ${i18n('cc-addon-info.creation-date.human-friendly-date', { date: this.state.creationDate })}
              </p>
            </div>
          </div>

          ${this.state.role != null
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.role.heading')}</strong>
                  <div class="value">
                    <p class="${classMap({ skeleton })}">${this.state.role}</p>
                  </div>
                </div>
              `
            : ''}
          ${this.state.openGrafanaLink != null
            ? html`
                <div class="section">
                  <strong class="heading">Grafana</strong>
                  <cc-link
                    class="value"
                    href="${this.state.openGrafanaLink}"
                    image="${GRAFANA_LOGO_URL}"
                    ?skeleton=${skeleton}
                    >${i18n('cc-addon-info.grafana.link')}
                  </cc-link>
                </div>
              `
            : ''}
          ${this.state.openScalabilityLink != null
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.scalability-link.heading')}</strong>
                  <cc-link
                    class="value"
                    href="${this.state.openScalabilityLink}"
                    .icon="${iconUpdate}"
                    ?skeleton=${skeleton}
                    >${i18n('cc-addon-info.scalability.link')}
                  </cc-link>
                </div>
              `
            : ''}

          <div class="section section--billing" ${hasSlottedChildren()}>
            <strong class="heading">${i18n('cc-addon-info.billing.heading')}</strong>
            <div class="value">
              <slot name="billing"></slot>
            </div>
          </div>

          ${this.state.linkedServices != null && this.state.linkedServices.length > 0
            ? html`
                <div class="section">
                  <strong class="heading">${i18n('cc-addon-info.resources.heading')}</strong>
                  <div class="value linked-services__content">
                    <ul>
                      ${this.state.linkedServices.map((service) => {
                        return html`
                          <li class="linked-service__li">
                            <cc-img
                              src="${ifDefined(skeleton ? undefined : service.logoUrl)}"
                              ?skeleton=${skeleton}
                            ></cc-img>
                            <cc-link href="${service.link}" ?skeleton=${skeleton}
                              >${this._getServiceType(service, skeleton)}
                            </cc-link>
                          </li>
                        `;
                      })}
                    </ul>
                    <slot name="linked-services"></slot>
                  </div>
                </div>
              `
            : ''}
        </div>
        ${this.docLink != null
          ? html`
              <div slot="footer-right">
                <cc-link href="${this.docLink.href}" .icon="${iconInfo}">${this.docLink.text}</cc-link>
              </div>
            `
          : ''}
      </cc-block>
    `;
  }

  /** @param {AddonVersionStateUpdateAvailable | AddonVersionStateRequestingUpdate} addonVersionState */
  _renderVersionDialog({ stateType, available, installed, changelogLink, latest }) {
    /** @type {Option[]} */
    const selectOptions = available.map((availableVersion) => ({
      label: availableVersion,
      value: availableVersion,
    }));
    const isRequestingUpdate = stateType === 'requesting-update';

    return html`
      <cc-dialog
        heading="${i18n('cc-addon-info.version.dialog.heading')}"
        open
        @cc-close="${this._onVersionDialogClose}"
        @cc-focus-restoration-fail="${() => this._versionTextRef.value?.focus()}"
      >
        <div class="dialog-desc">${i18n('cc-addon-info.version.dialog.desc', { url: changelogLink })}</div>
        <form ${formSubmit(this._onUpdateVersionRequested.bind(this))} ${ref(this._versionFormRef)}>
          <div class="dialog-form">
            <p class="dialog-form__version-from">
              <strong>${i18n('cc-addon-info.version.dialog.select.desc')}</strong>
              <span>${installed}</span>
            </p>
            <cc-select
              class="dialog-form__select"
              .options="${selectOptions}"
              .label="${i18n('cc-addon-info.version.dialog.select.label')}"
              .value="${latest}"
              .resetValue="${latest}"
              name="version"
              inline
              ?disabled="${isRequestingUpdate}"
            >
              <p slot="help" class="visually-hidden">
                ${i18n('cc-addon-info.version.dialog.select.help', { currentVersion: installed })}
              </p>
            </cc-select>
          </div>
          <cc-dialog-confirm-actions
            submit-label="${i18n('cc-addon-info.version.dialog.btn.submit')}"
            ?waiting="${isRequestingUpdate}"
            @cc-confirm="${() => this._versionFormRef.value.requestSubmit()}"
          ></cc-dialog-confirm-actions>
        </form>
      </cc-dialog>
    `;
  }

  /**
   * @param {FormattedFeature} param
   * @param {boolean} skeleton
   **/
  _renderSpecification({ code, type, value }, skeleton) {
    return html`
      <div class="features__content__item">
        <dt class="features__content__item__label ${classMap({ skeleton })}">${FEATURES_I18N[code]()}</dt>
        <dd class="features__content__item__value data-decoration ${classMap({ skeleton })}">
          ${this._getFeatureValue({ code, type, value })}
        </dd>
      </div>
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
          display: flex;
          flex-direction: column;
        }

        p,
        dl,
        dt,
        dd {
          margin: 0;
        }

        .section {
          align-items: flex-start;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          padding-block: 1em;
        }

        .section:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .section:not(:first-child) {
          border-top: solid 1px var(--cc-color-border-neutral-weak);
        }

        .section.section--billing:not([billing-is-slotted]) {
          display: none;
        }

        .heading {
          flex: 1 1 33%;
          font-weight: bold;
          max-width: 21em;
        }

        .value {
          align-items: center;
          display: flex;
          flex: 1 1 21em;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .version__content {
          align-items: center;
          display: flex;
          gap: 1em;
        }

        .version__content__version {
          display: inline;
        }

        .data-decoration {
          border: solid 1px var(--cc-color-border-neutral, #bfbfbf);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-weight: bold;
          padding: 0.12em 0.4em;
        }

        .billing__container {
          display: none;
        }

        slot[name='linked-services'] {
          font-size: 0.9em;
        }

        ::slotted(p) {
          margin: 0;
        }

        .linked-services__content {
          gap: 0.75em;
        }

        .linked-services__content ul {
          column-gap: 1.5em;
          display: flex;
          flex-wrap: wrap;
          list-style: none;
          margin: 0;
          padding: 0;
          row-gap: 0.5em;
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

        .features__content {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75em 1.5em;
        }

        .features__content__item {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .dialog-desc {
          margin-bottom: 1.25em;
        }

        .dialog-form {
          align-items: baseline;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em 1em;
        }

        .dialog-form__version-from {
          display: flex;
          gap: 1em;
        }

        .dialog-form cc-select {
          column-gap: 1em;
          flex: 1 1 auto;
        }

        .skeleton {
          background-color: #bbb;
          color: transparent;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-info', CcAddonInfo);
