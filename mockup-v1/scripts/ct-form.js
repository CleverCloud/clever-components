import { LitElement, html, css } from 'lit';
import { PULSAR_ADDON_RAW } from '../api/addon-pulsar.js';
import { getRawProductFromProduct } from '../api/api-helpers.js';
import { ES_ADDON_RAW } from '../api/es-addon.js';
import { JENKINS_ADDON_RAW } from '../api/jenkins.js';
import { MONGODB_ADDON_RAW } from '../api/mongodb-addon.js';
import { MYSQL_ADDON_RAW } from '../api/mysql-addon.js';
import { POSTGRESQL_ADDON_RAW } from '../api/postgresql-addon.js';
import { REDIS_ADDON_RAW } from '../api/redis-addon.js';
import { API_ZONES_RAW } from '../api/zones.js';
import { PREFERRED_PLAN_SLUG, PREFERRED_ZONE } from './preferred-items.js';
import './ct-addon-options.js';
import './ct-dedicated-build.js';
import './ct-label-with-icon.js';
import './ct-product-name.js';
import './ct-product-tags.js';
import './ct-plan-cellar.js';
import './ct-plan-configurator.js';
import './ct-plan-config-provider.js';
import './ct-plan-fs-bucket.js';
import './ct-plan-matomo.js';
import './ct-plan-pulsar.js';
import './ct-scalability.js';
import './ct-zone-picker.js';

const ADDON_RAW_API = {
  'addon-pulsar': PULSAR_ADDON_RAW,
  'es-addon': ES_ADDON_RAW,
  jenkins: JENKINS_ADDON_RAW,
  'mongodb-addon': MONGODB_ADDON_RAW,
  'mysql-addon': MYSQL_ADDON_RAW,
  'postgresql-addon': POSTGRESQL_ADDON_RAW,
  'redis-addon': REDIS_ADDON_RAW,
};

const SPECIAL_ADDONS = ['addon-matomo', 'addon-pulsar', 'cellar-addon', 'config-provider', 'fs-bucket'];

const DEFAULT_ZONES = API_ZONES_RAW.map((zone) => zone.name);

export class CtForm extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
      _rawProduct: { type: Object, state: true },
      _currentPlanZones: { type: Array, state: true },
      _pulsarVersion: { type: String, state: true },
    };
  };

  willUpdate (_changedProperties) {
    if (_changedProperties.has('product')) {
      this._rawProduct = getRawProductFromProduct(this.product);

      if (SPECIAL_ADDONS.includes(this.product.id) || this.product.type === 'app') {
        this._currentPlanZones = [...this._rawProduct?.plans[0]?.zones ?? DEFAULT_ZONES];
      }

      if (this.product.id === 'addon-pulsar') {
        const rawAddonApi = ADDON_RAW_API[this.product.id];
        if (rawAddonApi.clusters?.length > 0) {
          const firstCluster = rawAddonApi.clusters[0];
          this._pulsarVersion = firstCluster.version;
        }
      }
    }
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('ct-plan-configurator:selected', this._onPlanConfiguratorSelected);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('ct-plan-configurator:selected', this._onPlanConfiguratorSelected);
  }

  _onPlanConfiguratorSelected (e) {
    this._currentPlanZones = [...e.detail.zones];
  }

  _getVersions () {
    const rawAddonApi = ADDON_RAW_API[this.product.id];
    if (rawAddonApi?.dedicated == null || rawAddonApi.defaultDedicatedVersion == null) {
      return null;
    }
    return {
      default: rawAddonApi.defaultDedicatedVersion,
      versions: Object.keys(rawAddonApi.dedicated).map((version) => {
        return {
          value: version,
          label: version,
        };
      }).sort((a, b) => b.label.localeCompare(a.label)),
    };
  }

  _renderPlan () {
    if (this.product.id === 'fs-bucket') {
      return html`<ct-plan-fs-bucket></ct-plan-fs-bucket>`;
    }
    else if (this.product.id === 'addon-matomo') {
      return html`<ct-plan-matomo></ct-plan-matomo>`;
    }
    else if (this.product.id === 'addon-pulsar') {
      return html`<ct-plan-pulsar version="${this._pulsarVersion}"></ct-plan-pulsar>`;
    }
    else if (this.product.id === 'cellar-addon') {
      return html`<ct-plan-cellar></ct-plan-cellar>`;
    }
    else if (this.product.id === 'config-provider') {
      return html`<ct-plan-config-provider></ct-plan-config-provider>`;
    }

    return html`
      <ct-plan-configurator
        .plans="${this._rawProduct.plans}"
        .product="${this.product}"
        current-plan-slug="${PREFERRED_PLAN_SLUG}"
      ></ct-plan-configurator>
    `;
  }

  render () {
    const isAddon = this.product.type === 'addon';
    const isApp = this.product.type === 'app';
    return html`
      <ct-product-name></ct-product-name>
      <ct-product-tags></ct-product-tags>
      ${
        isAddon
        ? this._renderPlan()
        : ``
      }
      ${
        isApp
        ? html`
            <ct-scalability .product="${this.product}"></ct-scalability>
            <ct-dedicated-build .product="${this.product}"></ct-dedicated-build>
          `
        : ``
      }
      <ct-zone-picker
        .zones=${API_ZONES_RAW}
        .whitelist="${this._currentPlanZones}"
        current-zone="${PREFERRED_ZONE}"
      ></ct-zone-picker>
      ${
        isAddon && this.product.details.options != null && this.product.details.options.length > 0
          ? html`
            <ct-addon-options
              .options="${this.product.details.options}"
              .versions="${this._getVersions()}"
            ></ct-addon-options>
          `
          : ``
      }
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          --ct-form-label--font-family: "Source Sans 3";
          --ct-form-label--font-size: 1.625em;
          --ct-form-label--font-weight: 500;
          --ct-form-input--font-size: 1.25em;
          
          display: flex;
          flex-direction: column;
          row-gap: 2.5em;
        }
      `,
    ];
  }
}

customElements.define('ct-form', CtForm);
