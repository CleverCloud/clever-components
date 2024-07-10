import{a as e,f as t,p as a}from"./i18n-number-a9c20d27.js";import{s as r}from"./i18n-sanitize-4edc4a2d.js";import{p as o}from"./i18n-string-3f556d8d.js";import{B as n,v as i,w as s,_ as l}from"./cc-remix.icons-d7d44eac.js";import{L as c}from"./lost-focus-controller-f4703b9a.js";import{d}from"./events-4c8e3503.js";import{s as p}from"./shoelace-4c774a46.js";import{f as u}from"./utils-aa566623.js";import{a as g}from"./accessibility-664b7197.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import"./cc-badge-e1a0f4b6.js";import{s as m,x as _,i as h}from"./lit-element-98ed46d4.js";import{e as f,n as b}from"./ref-948c5e44.js";import{o as y}from"./class-map-1feb5cf7.js";const v="fr",$=o(v),x=a(v,"o"," "),w=({productCount:e})=>$(e,"produit"),P=({productName:e,planName:t})=>`Remove ${e} - ${t}`,N=({productName:e,planName:t})=>`Réduire la quantité - ${e} (${t})`,T=({productName:e,planName:t})=>`Augmenter la quantité - ${e} (${t})`,C=({price:e,code:a,digits:r})=>t(v,e,{currency:a,minimumFractionDigits:r,maximumFractionDigits:r}),j=({shared:e})=>""+(e?"Partagé":"Dédié"),k={"connection-limit":()=>r`Limite de connexions&nbsp;: `,cpu:()=>r`vCPUs&nbsp;: `,databases:()=>r`Bases de données&nbsp;: `,"disk-size":()=>r`Taille du disque&nbsp;: `,gpu:()=>r`GPUs&nbsp;: `,"has-logs":()=>r`Logs&nbsp;: `,"has-metrics":()=>r`Métriques&nbsp;: `,"max-db-size":()=>r`Taille BDD max&nbsp;: `,memory:()=>r`RAM&nbsp;: `,version:()=>r`Version&nbsp;: `},q=Object.keys(k),z={code:"EUR",changeRate:1},R={type:"30-days",digits:2};class E extends m{static get properties(){return{currencies:{type:Array},isToggleEnabled:{type:Boolean,attribute:"is-toggle-enabled"},selectedCurrency:{type:Object,attribute:"selected-currency"},selectedPlans:{type:Array,attribute:"selected-plans"},selectedTemporality:{type:Object,attribute:"selected-temporality"},temporalities:{type:Array},_isCollapsed:{type:Boolean,state:!0}}}constructor(){super(),this.currencies=[z],this.isToggleEnabled=!1,this.selectedCurrency=z,this.selectedPlans=[],this.selectedTemporality=R,this.temporalities=[R],this._isCollapsed=!1,this._totalRef=f(),new c(this,".plan",(({suggestedElement:e})=>{null!=e?e.querySelector(".plan__toggle__header").focus():this._totalRef.value?.focus()}))}_getEstimatedPriceLabel(t){return"second"===t?"estimé/seconde":"minute"===t?"estimé/minute":"hour"===t?"estimé/heure":"1000-minutes"===t?`estimé (${e(v,1e3)} minutes)`:"day"===t?"estimé/jour":"30-days"===t?r`estimé/30&nbsp;jours`:void 0}_getFeatureName(e){return null==e?"":null!=k[e.code]?k[e.code]():null!=e.name?(({featureName:e})=>r`${e}&nbsp;: `)({featureName:e.name}):void 0}_getFeatureValue(t){if(null==t)return"";switch(t.type){case"boolean":return(({boolean:e})=>e?"Oui":"Non")({boolean:"true"===t.value});case"boolean-shared":return j({boolean:"shared"===t.value});case"bytes":return"memory"===t.code&&"0"===t.value?j({shared:!0}):(({bytes:e})=>x(e,0,3))({bytes:Number(t.value)});case"number":return"cpu"===t.code&&"0"===t.value?j({shared:!0}):(({number:t})=>e(v,t))({number:Number(t.value)});case"number-cpu-runtime":return(({cpu:t,shared:a})=>a?r`<em title="Accès au vCPU moins prioritaire">${e(v,t)}<code>*</code></em>`:e(v,t))({cpu:t.value.cpu,shared:t.value.shared});case"string":return t.value}}_getProductCount(){return this.selectedPlans.reduce(((e,t)=>e+t.quantity),0)}_getPrice(e,t){return"second"===e?t/60/60*this.selectedCurrency.changeRate:"minute"===e?t/60*this.selectedCurrency.changeRate:"hour"===e?t*this.selectedCurrency.changeRate:"1000-minutes"===e?t/60*1e3*this.selectedCurrency.changeRate:"day"===e?24*t*this.selectedCurrency.changeRate:"30-days"===e?24*t*30*this.selectedCurrency.changeRate:void 0}_getPriceLabel(t){return"second"===t?"Prix/seconde":"minute"===t?"Prix/minute":"hour"===t?"Prix/heure":"1000-minutes"===t?`Prix (${e(v,1e3)} minutes)`:"day"===t?"Prix/jour":"30-days"===t?r`Prix/30&nbsp;jours`:void 0}_getPriceValue(e,t,a){const r=this._getPrice(e,t);if(null!=r)return C({price:r,code:this.selectedCurrency.code,digits:a})}_getTotalPlanPrice(e){return this._getPrice(this.selectedTemporality.type,e.price)*e.quantity}_getTotalPrice(){return this.selectedPlans?.map((e=>this._getTotalPlanPrice(e))).reduce(((e,t)=>e+t),0)}_onCurrencyChange(e){const t=this.currencies.find((t=>t.code===e.target.value));d(this,"change-currency",t)}_onDecreaseQuantity(e){const t=e.quantity-1;t>0?d(this,"change-quantity",{...e,quantity:t}):d(this,"delete-plan",e)}_onDeletePlan(e){d(this,"delete-plan",e)}_onIncreaseQuantity(e){const t=e.quantity+1;d(this,"change-quantity",{...e,quantity:t})}_onTemporalityChange(e){const t=this.temporalities.find((t=>t.type===e.target.value));d(this,"change-temporality",t)}_onToggle(){this._isCollapsed=!this._isCollapsed}willUpdate(e){e.has("isToggleEnabled")&&!0===this.isToggleEnabled&&(this._isCollapsed=!0)}render(){const e=this._getTotalPrice();return _`
      ${this.isToggleEnabled?this._renderHeaderWithToggle(e):this._renderHeaderWithoutToggle()}
      
      <div class="content ${y({"content--hidden":this.isToggleEnabled&&this._isCollapsed})}">
        
        ${this.selectedPlans.map((e=>this._renderSelectedPlan(e)))}
        
        <p class="content__total" tabindex="-1" ${b(this._totalRef)}>
          <strong>
            <span class="visually-hidden">
              ${"Total : "}
            </span>
            ${C({price:e,code:this.selectedCurrency.code,digits:this.selectedTemporality.digits})}
          </strong>
          <span>${"HT"}</span>
          <span class="content__total__estimated">${this._getEstimatedPriceLabel(this.selectedTemporality.type)}</span>
        </p>

        ${this._renderSelectForm()}

        <slot name="footer"></slot>
      </div>
    `}_renderHeaderWithToggle(e){const t=this._getProductCount();return _`
      <div class="header header--toggle">
        <strong class="header__heading">${"Ma sélection"}</strong>
        <span class="header__badge">
          ${t}
          <span class="visually-hidden">${w({productCount:t})}</span>
        </span>
        <p class="header__total ${y({"header__total--hidden":!this._isCollapsed})}">
          <strong>
            ${C({price:e,code:this.selectedCurrency.code,digits:this.selectedTemporality.digits})}
          </strong> 
          <span>${"HT"}</span>
        </p>
        <button class="header__toggle-btn" @click="${this._onToggle}">
          ${this._isCollapsed?"Afficher":"Masquer"}
        </button>
      </div>
    `}_renderHeaderWithoutToggle(){const e=this._getProductCount();return _`
      <div class="header">
        <strong class="header__heading">${"Ma sélection"}</strong>
        <span class="header__badge">
          ${e}
          <span class="visually-hidden">${w({productCount:e})}</span>
        </span>
      </div>
    `}_renderSelectedPlan(e){const t=this._getTotalPlanPrice(e),a=Array.isArray(e.features);return _`
      <div class="plan">
        <details class="plan__toggle">
          <summary class="plan__toggle__header">
            <span class="plan__toggle__header__name">
              ${e.productName}
              <span class="plan__toggle__header__name__plan"> &ndash; ${e.name}</span>
            </span>

            <span class="plan__toggle__header__total"> 
              ${C({price:t,code:this.selectedCurrency.code,digits:this.selectedTemporality.digits})}
            </span>

            <span class="plan__toggle__header__expand">
              <cc-icon .icon=${n}></cc-icon>
            </span>
          </summary>
          ${a?_`
            <dl class="plan__features">
              ${e.features?.filter((e=>q.includes(e.code)||null!=e.name))?.map((e=>_`
                    <div class="plan__features__feature">
                      <dt>${this._getFeatureName(e)}</dt>
                      <dd>${this._getFeatureValue(e)}</dd>
                    </div>
                  `))}
            </dl>
          `:""}
          <div class="plan__price">
            <span>
              <span class="visually-hidden">${"Prix unitaire : "}</span>
              ${this._getPriceValue(this.selectedTemporality.type,e.price,this.selectedTemporality.digits)}
            </span>
            <div class="plan__price__quantity">
              <button
                @click="${()=>this._onDecreaseQuantity(e)}"
                title="${N({productName:e.productName,planName:e.name})}"
              >
                <cc-icon
                  .icon=${i}
                  a11y-name=${N({productName:e.productName,planName:e.name})}
                ></cc-icon>
              </button>
              <strong class="plan__price__quantity__counter" aria-live="polite" aria-atomic="true">
                <span class="visually-hidden">${"Quantité: "}</span>
                ${e.quantity}
              </strong>
              <button
                @click="${()=>this._onIncreaseQuantity(e)}"
                title="${T({productName:e.productName,planName:e.name})}"
              >
                <cc-icon
                  .icon=${s}
                  a11y-name=${T({productName:e.productName,planName:e.name})}
                ></cc-icon>
              </button>
            </div>
            <strong class="plan__price__total" aria-live="polite" aria-atomic="true">
              <span class="visually-hidden">
                ${(({productName:e,planName:t})=>`Total pour ${e} ${t}`)({productName:e.productName,planName:e.name})}
              </span>
              ${C({price:t,code:this.selectedCurrency.code,digits:this.selectedTemporality.digits})}
            </strong>
          </div>
        </details>
        <button
          class="plan__delete"
          title="${P({productName:e.productName,planName:e.name})}"
          @click="${()=>this._onDeletePlan(e)}"
        >
          <cc-icon
            .icon=${l}
            a11y-name="${P({productName:e.productName,planName:e.name})}"
          ></cc-icon>
        </button>
      </div>
    `}_renderSelectForm(){return _`
      <div class="form">
        <sl-select
          label="${"Temporalité"}"
          class="temporality-select"
          hoist
          placement="top"
          value=${this.selectedTemporality?.type}
          @sl-change=${this._onTemporalityChange}
        >
          ${this.temporalities.map((e=>_`
            <sl-option value=${e.type}>${this._getPriceLabel(e.type)}</sl-option>
          `))}
          <cc-icon slot="expand-icon" .icon=${n} size="xl"></cc-icon>
        </sl-select>

        <sl-select
          label="${"Devise"}"
          class="currency-select"
          hoist
          placement="top"
          value=${this.selectedCurrency?.code}
          @sl-change=${this._onCurrencyChange}
        >
          ${this.currencies.map((e=>_`
            <sl-option value=${e.code}>${u(e.code)}  ${e.code}</sl-option>
          `))}
          <cc-icon slot="expand-icon" .icon=${n} size="xl"></cc-icon>
        </sl-select>
      </div>
    `}static get styles(){return[g,p,h`
        :host {
          display: block;
          padding: 2em;
        }

        button {
          border: none;
          background: transparent;
        }

        sl-select::part(form-control-input):focus-within,
        summary:focus-visible,
        button:focus {
          outline: var(--cc-focus-outline, #000);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        /* region header */

        .header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          color: var(--cc-color-text-default, #000);
        }
              
        .header--toggle {
          display: grid;
          align-items: center;
          gap: 0 0.5em;
          grid-template-areas: 
            'heading counter btn'
            'total total total';
          grid-template-columns: auto 1fr auto;
          line-height: 1.5;
        }
              
        .header__heading {
          font-size: 1.3em;
          font-weight: bold;
          grid-area: heading;
        }
              
        .header__badge {
          display: inline-flex;
          width: max-content;
          min-width: 1.7em;
          height: 1.7em;
          align-items: center;
          justify-content: center;
          background: var(--cc-pricing-estimation-counter-bg, var(--cc-color-bg-strong, #000));
          border-radius: 50%;
          color: var(--cc-pricing-estimation-counter-color, var(--cc-color-text-inverted, #fff));
          font-size: 0.9em;
          font-weight: bold;
          grid-area: counter;
        }

        .header__toggle-btn {
          color: var(--cc-color-text-primary-highlight, blue);
          cursor: pointer;
          font-size: 1em;
          font-weight: 500;
          grid-area: btn;
          justify-self: flex-end;
          text-decoration: none;
        }

        .header__toggle-btn:hover {
          color: var(--cc-pricing-hovered-color, purple);
        }

        .header__total {
          margin: 0;
          font-size: 1.1em;
          grid-area: total;
        }

        .header__total--hidden {
          display: none;
        }

        .header__total strong {
          font-weight: bold;
        }

        /* endregion */

        /* region content */
              
        .content {
          margin-top: 1em;
        }

        .content--hidden {
          display: none;
        }

        /* region plan section */

        .plan {
          display: grid;
          align-items: center;
          border-bottom: solid 1px var(--cc-color-border-neutral-weak, #eee);
          column-gap: 0.5em;
          grid-template-areas: 
            'plan-header plan-delete'
            'plan-features plan-features'
            'plan-price plan-price';
          grid-template-columns: 1fr auto;
          padding-block: 1em;
        }

        .plan__toggle {
          display: contents;
        }

        .plan__delete {
          --cc-icon-color: var(--cc-color-text-danger);
          --cc-icon-size: 1.2em;

          width: 1.5em;
          height: 1.5em;
          padding: 0;
          cursor: pointer;
          grid-area: plan-delete;
          transition: transform 0.2s ease-in;
        }

        .plan__delete:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color, purple);
        }

        .plan__toggle__header {
          display: grid;
          box-sizing: border-box;
          align-items: center;
          cursor: pointer;
          gap: 0.5em;
          grid-area: plan-header;
          grid-template-columns: auto 1fr auto;
          /* Remove the summary icon */
          list-style: none;
        }

        /* Remove the summary icon on WebKit */

        .plan__toggle__header::-webkit-details-marker {
          display: none;
        }

        .plan__toggle__header__name {
          font-weight: 600;
        }

        .plan__toggle__header__name__plan {
          font-weight: normal;
        }

        .plan__toggle__header__total {
          font-weight: 600;
          justify-self: flex-end;
        }

        .plan__toggle[open] .plan__toggle__header__total {
          visibility: hidden;
        }

        .plan__toggle__header__expand {
          --cc-icon-size: 1.5em;

          box-sizing: border-box;
          transition: transform 0.2s ease-in;
        }

        .plan__toggle[open] .plan__toggle__header__expand {
          transform: rotate(-180deg);
        }

        .plan__toggle__header .plan__toggle__header__expand cc-icon {
          transition: transform 0.2s ease-in;
        }

        .plan__toggle__header:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color, purple);

          color: var(--cc-pricing-hovered-color, purple);
        }

        dl,
        dt,
        dd {
          padding: 0;
          margin: 0;
        }

        .plan__features {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1em;
          color: var(--cc-color-text-weak, #333);
          font-size: 0.9em;
          gap: 0 0.5em;
          grid-area: plan-features;
          line-height: 1.5;
        }

        .plan__features__feature {
          display: flex;
          gap: 0.2em;
        }

        .plan__features__feature dt {
          font-weight: 600;
        }
            
        .plan__features__feature:not(:last-child) dd::after {
          content: ',';
        }

        .plan__price {
          display: grid;
          align-items: center;
          justify-content: space-between;
          margin-top: 1em;
          color: var(--cc-color-text-default, #000);
          gap: 0.5em 0.2em;
          grid-area: plan-price;
          grid-template-columns: 1fr auto 1fr;
        }

        .plan__price__quantity {
          display: flex;
          align-items: center;
          gap: 0.1em;
        }

        .plan__price__quantity__counter {
          min-width: 2em;
          font-weight: bold;
          text-align: center;
        }

        .plan__price__quantity button {
          display: grid;
          width: 1.3em;
          height: 1.3em;
          padding: 0;
          border: 1px solid var(--cc-color-border-neutral-strong);
          background-color: var(--cc-color-bg-default, #000);
          color: var(--cc-color-text-default, #000);
          font-size: 1em;
          place-content: center;
        }

        .plan__price__quantity button:hover {
          --cc-icon-color: var(--cc-pricing-hovered-color);

          border-color: var(--cc-color-border-hovered);
        }

        .plan__price__total {
          font-weight: bold;
          justify-self: flex-end;
        }

        /* endregion */
              
        /* region content total */

        .content__total {
          text-align: right;
        }
              
        .content__total strong {
          color: var(--cc-color-text-default, #000);
          font-size: 1.3em;
          font-weight: 600;
        }
              
        .content__total__estimated {
          display: block;
          color: var(--cc-color-text-weak, #333);
        }

        /* endregion */
            
        /* endregion */

        /* region select form */

        .form {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        /* region cc-pricing-header styles */

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

        /* endregion */

        /* endregion */
      `]}}window.customElements.define("cc-pricing-estimation",E);export{E as CcPricingEstimation};
