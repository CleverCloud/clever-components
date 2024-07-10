import{a as e}from"./i18n-number-a9c20d27.js";import{s as t}from"./i18n-sanitize-4edc4a2d.js";import{B as o}from"./cc-remix.icons-d7d44eac.js";import{d as c}from"./events-4c8e3503.js";import{s as r}from"./shoelace-4c774a46.js";import{f as s}from"./utils-aa566623.js";import{s as i}from"./zone-ff1564f2.js";import{s as a}from"./skeleton-68a3d018.js";import{CcZone as l}from"./cc-zone-7636cf9c.js";import"./cc-icon-f84255c7.js";import"./cc-notice-9b1eec7a.js";import{s as n,x as d,i as p}from"./lit-element-98ed46d4.js";import{o as u}from"./class-map-1feb5cf7.js";import{l as m}from"./if-defined-cd9b1ec0.js";const f={code:"EUR",changeRate:1},h={type:"30-days",digits:2};class b extends n{static get properties(){return{currencies:{type:Array},selectedCurrency:{type:Object,attribute:"selected-currency"},selectedTemporality:{type:Object,attribute:"selected-temporality"},selectedZoneId:{type:String,attribute:"selected-zone-id"},state:{type:Object},temporalities:{type:Array}}}constructor(){super(),this.currencies=[f],this.selectedCurrency=f,this.selectedTemporality=h,this.selectedZoneId=null,this.temporalities=[h],this.state={type:"loading"}}_getPriceLabel(o){switch(o){case"second":return"Prix/seconde";case"minute":return"Prix/minute";case"hour":return"Prix/heure";case"1000-minutes":return`Prix (${e("fr",1e3)} minutes)`;case"day":return"Prix/jour";case"30-days":return t`Prix/30&nbsp;jours`}}_onCurrencyChange(e){const t=this.currencies.find((t=>t.code===e.target.value));c(this,"change-currency",t)}_onTemporalityChange(e){const t=this.temporalities.find((t=>t.type===e.target.value));c(this,"change-temporality",t)}_onZoneChange(e){const t=e.target.value;c(this,"change-zone",t)}render(){const e="loaded"===this.state.type?i(this.state.zones):[],t="loading"===this.state.type;return"error"===this.state.type?d`<cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des filtres liés à la tarification."}"></cc-notice>`:d`
      <div class="main">

        <sl-select
          label="${"Temporalité"}"
          class="temporality-select"
          value=${this.selectedTemporality.type}
          @sl-change=${this._onTemporalityChange}
        >
          ${this.temporalities.map((e=>d`
            <sl-option value=${e.type}>${this._getPriceLabel(e.type)}</sl-option>
          `))}
          <cc-icon slot="expand-icon" .icon=${o}></cc-icon>
        </sl-select>

        <sl-select
          label="${"Devise"}"
          class="currency-select"
          value=${this.selectedCurrency?.code}
          @sl-change=${this._onCurrencyChange}
        >
          ${this.currencies.map((e=>d`
            <sl-option value=${e.code}>${s(e.code)} ${e.code}</sl-option>
          `))}
          <cc-icon slot="expand-icon" .icon=${o}></cc-icon>
        </sl-select>

        <sl-select
          label="${"Zone"}"
          class="zone-select ${u({skeleton:t})}"
          hoist
          value=${m(this.selectedZoneId??void 0)}
          ?disabled=${t}
          @sl-change=${this._onZoneChange}
        >
          ${e.map((e=>d`
            <sl-option class="zone-item" value=${e.name}>
              ${l.getText(e)}
              <cc-zone slot="prefix" .state=${{type:"loaded",...e}}></cc-zone>
            </sl-option>
          `))}
          <cc-icon slot="expand-icon" .icon=${o}></cc-icon>
        </sl-select>
      </div>
    `}static get styles(){return[r,a,p`
        :host {
          display: block;
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        sl-select {
          --cc-icon-size: 1.4em;
          --sl-input-background-color: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #eee);
          --sl-input-background-color-hover: var(--cc-color-bg-default, #fff);
          --sl-input-background-color-focus: var(--cc-color-bg-default, #fff);
          --sl-input-border-color: var(--cc-color-border-neutral-weak, #aaa);
          --sl-input-border-color-disabled: var(--cc-color-border-disabled, #eee);
          --sl-input-border-color-focus: var(--cc-color-border-focused, #777);
          --sl-input-border-radius-medium: var(--cc-border-radius-default, 0.25em);
          --sl-input-color: var(--cc-color-text-default, #000);
          --sl-input-color-hover: var(--cc-pricing-hovered-color, #000);
          --sl-input-font-family: initial;
          --sl-input-height-medium: 2.865em;
          --sl-input-label-color: var(--cc-color-text-default, #000);

          flex: 1 1 10.5em;
          animation: none;
        }

        sl-select::part(form-control-input):focus-within {
          outline: var(--cc-focus-outline, #000);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        sl-select::part(form-control-label) {
          /* same value as out own inputs */
          padding-bottom: 0.35em;
        }

        sl-select::part(display-input) {
          font-family: inherit;
          font-weight: bold;
        }
        
        sl-select::part(combobox) {
          padding: 0.75rem 0.875rem;
        }

        sl-select::part(combobox):hover {
          --cc-icon-color: var(--cc-pricing-hovered-color);

          border: 1px solid var(--cc-color-border-hovered, #777);
        }

        sl-option::part(base) {
          background-color: transparent;
          color: var(--cc-color-text-default, #000);
        }

        sl-option::part(base):hover,
        sl-option:focus-within {
          background-color: var(--cc-color-bg-neutral-hovered, #eee);
        }
        
        sl-option::part(checked-icon) {
          width: 0.7em;
          height: 0.7em;
          margin-right: 0.5em;
        }

        /* region Zone select */

        sl-select.skeleton::part(base) {
          --sl-input-background-color-disabled: var(--cc-color-bg-neutral-disabled, #bbb);
        }
        
        .zone-select {
          flex: 2 1 auto;
        }
        
        /* The label is not used in the list display
        It's only used for the current selected value */

        sl-option.zone-item::part(label) {
          display: none;
        }

        /* Expand the cc-zone to the whole width */

        sl-option.zone-item::part(prefix) {
          display: block;
          flex: 1 1 0;
        }

        sl-option.zone-item::part(base) {
          --cc-zone-tag-category-font-weight: 600;
          --cc-zone-tag-padding: 0;
          --cc-zone-tag-bgcolor: transparent;
          --cc-zone-tag-textcolor: var(--cc-color-text-weak, #333);

          padding: 1em 0.5em;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak, transparent);
        }
        
        sl-option.zone-item::part(checked-icon) {
          align-self: flex-start;
          margin-top: 0.3em;
        }
        /* endregion */
      `]}}window.customElements.define("cc-pricing-header",b);export{b as CcPricingHeader};
