import{a as t,f as e,c as i}from"./i18n-number-a9c20d27.js";import{p as n}from"./i18n-string-3f556d8d.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import"./cc-input-number-efbfffbb.js";import"./cc-toggle-34554172.js";import"./cc-notice-9b1eec7a.js";import"./cc-loader-c9072fed.js";import{k as r,l as s}from"./cc-clever.icons-e2a98bd6.js";import{o as a,$ as c,a0 as o,w as l,B as d}from"./cc-remix.icons-d7d44eac.js";import{R as u}from"./resize-controller-3aadf1c4.js";import{d as p}from"./events-4c8e3503.js";import{s as m,x as g,i as v}from"./lit-element-98ed46d4.js";import{o as h}from"./class-map-1feb5cf7.js";const b="fr",y=n(b),f=i(b,"o"," ");function _(t){return f(t).split(" ")[1]}const $=({bytes:t})=>f(t),x=({bytes:t})=>_(t),w=({price:t,code:i})=>`${e(b,t,{currency:i})}`;class S{constructor(t=[]){this._state={},t.forEach((({type:t,intervals:e,progressive:i=!1,secability:n=1})=>{this._state[t]={intervals:e,progressive:i,secability:n,quantity:0}}))}getQuantity(t){return this._state[t].quantity}setQuantity(t,e){isNaN(e)||(this._state[t].quantity=e)}getMaxInterval(t){const{intervals:e,quantity:i}=this._state[t];return e?.find((({minRange:t,maxRange:e})=>i>=t&&i<(e??1/0)))??null}getIntervalPrice(t,e){const i=this._state[t].intervals?.[e]??null;if(null==i)return 0;const n=this._state[t].progressive,r=this._state[t].secability,{price:s}=i,a=this._state[t].quantity,c=Math.ceil(a/r)*r;if(n){const{minRange:t,maxRange:e}=i;return s*function(t,e,i){const n=0===t?0:t-1,r=0===t?i-1:i-t;return Math.max(0,Math.min(e-n,r))}(t,c,e??1/0)}return i===this.getMaxInterval(t)?s*c:0}getSectionPrice(t){return(this._state[t].intervals??[]).map(((e,i)=>this.getIntervalPrice(t,i))).reduce(((t,e)=>t+e),0)}getTotalPrice(){return Object.keys(this._state).map((t=>this.getSectionPrice(t))).reduce(((t,e)=>t+e),0)}}const j={code:"EUR",changeRate:1},T={storage:a,"inbound-traffic":r,"outbound-traffic":s,"private-users":c,"public-users":c};class I extends m{static get properties(){return{action:{type:String},currency:{type:Object},product:{type:Object}}}constructor(){super(),this.action="add",this.currency=j,this.product={state:"loading"},this._simulator=new S,this._sectionStates={},this._resizeController=new u(this)}_getTitle(t){switch(t){case"storage":return"Stockage :";case"inbound-traffic":return"Trafic entrant :";case"outbound-traffic":return"Trafic sortant :";case"private-users":return"Utilisateurs privés :";case"public-users":return"Utilisateurs publics :";case"total":return"Total estimé (30 jours) :"}}_getLabel(t){switch(t){case"storage":return"stockage";case"inbound-traffic":return"trafic entrant";case"outbound-traffic":return"trafic sortant";case"private-users":return"utilisateurs privés";case"public-users":return"utilisateurs publics"}}_getCurrencyValue(t){return{price:t*this.currency.changeRate,code:this.currency.code}}_getMaxRange(t,e){return null==e?"∞":this._isTypeBytes(t)?$({bytes:e}):e}_getMinRange(t,e){return this._isTypeBytes(t)?$({bytes:e}):e}_getIntervalPrice(t,i){return 0===i?"GRATUIT":this._isTypeBytes(t)?(({price:t,code:i})=>`${e(b,t,{minimumFractionDigits:3,maximumFractionDigits:3,currency:i})} / ${_(1e9)} (30 jours)`)(this._getCurrencyValue(1e9*i)):(({userCount:t,price:i,code:n})=>{const r=y(t,"utilisateur");return`${e(b,i*t,{currency:n})} / ${t} ${r} (30 jours)`})({...this._getCurrencyValue(i),userCount:this.product.sections.find((e=>e.type===t)).secability??1})}_getUnits(){return[{label:x({bytes:1e6}),value:"1000000"},{label:x({bytes:1e9}),value:"1000000000"},{label:x({bytes:1e12}),value:"1000000000000"}]}_isTypeBytes(t){return["storage","inbound-traffic","outbound-traffic"].includes(t)}_updateSimulatorQuantity(t){const e=this._sectionStates[t].quantity,i=this._isTypeBytes(t)?parseInt(this._sectionStates[t].unitValue):1;this._simulator.setQuantity(t,e*i)}_onAddPlan(){const e=(this.product?.sections??[]).map((({type:e})=>`${this._getTitle(e)} ${this._isTypeBytes(e)?$({bytes:this._simulator.getQuantity(e)}):(({number:e})=>t(b,e))({number:this._simulator.getQuantity(e)})}`)).join(", "),i={productName:this.product.name,name:e,price:this._simulator.getTotalPrice()/720};p(this,"cc-pricing-product:add-plan",i)}_onInputValue(t,e){this._sectionStates[t].quantity=isNaN(e)?0:e,this._updateSimulatorQuantity(t),this.requestUpdate()}_onToggleUnit(t,e){this._sectionStates[t].unitValue=e,this._updateSimulatorQuantity(t),this.requestUpdate()}_onToggleState(t){this._sectionStates[t].isClosed=!this._sectionStates[t].isClosed,this.requestUpdate()}willUpdate(t){t.has("product")&&Array.isArray(this.product.sections)&&(this._sectionStates={},this.product.sections.forEach((({type:t})=>{this._sectionStates[t]={isClosed:!0,quantity:0,unitValue:this._getUnits()[0].value}})),this._simulator=new S(this.product.sections))}render(){return g`
      ${"error"===this.product.state?g`
        <cc-notice intent="warning" message=${"Une erreur est survenue pendant le chargement des prix."}></cc-notice>
      `:""}

      ${"loading"===this.product.state?g`
        <cc-loader></cc-loader>
      `:""}

      ${"loaded"===this.product.state?this._renderLoaded(this.product.sections):""}
    `}_renderLoaded(t){const{width:e}=this._resizeController,i={"body--big":e>600,"body--small":e<=600},n=t.some((({intervals:t})=>null==t)),r=t.map((({type:t})=>this._simulator.getQuantity(t))).every((t=>0===t));return g`
      <div class="body ${h(i)}">
        ${t.map((t=>this._renderSection(t)))}
  
        <div class="section">
          <div class="section-header">
            <cc-icon class="section-icon sum-icon" .icon=${o} size="lg"></cc-icon>
            <div class="section-title section-title--total">
              <div class="section-title-text">${this._getTitle("total")}</div>
              <div class="section-title-price">${w(this._getCurrencyValue(this._simulator.getTotalPrice()))}</div>
            </div>
          </div>
        </div>
        <hr class="${h({last:"none"===this.action})}">
  
        ${"add"===this.action?g`
          <div class="button-bar">
            <cc-button
              .icon=${l}
              ?disabled=${n||r}
              @cc-button:click=${this._onAddPlan}
            >
              ${"Ajouter"}
            </cc-button>
          </div>
        `:""}
      </div>
    `}_renderSection(t){const e=t.intervals,i=t.progressive,n=t.type,r=T[n],{isClosed:s,quantity:a,unitValue:c}=this._sectionStates[n],o=this._simulator.getSectionPrice(n),l=this._simulator.getMaxInterval(n);return g`
      <div class="section ${h({"section--closed":s})}">

        <div class="section-header">
          <cc-icon class="section-icon" .icon=${r}></cc-icon>
          <div class="section-title">${this._getTitle(n)}</div>
        </div>

        <div class="input-wrapper">
          ${this._renderInput({type:n,quantity:a,unitValue:c})}
        </div>

        <button
          aria-controls=${t.type}
          aria-expanded=${!1===this._sectionStates[n].isClosed}
          class="section-toggle-btn"
          @click=${()=>this._onToggleState(n)}
        >
          <span>${"Afficher plus de details"}</span>
          <cc-icon class="expand-icon" .icon=${d}></cc-icon>
        </button>
        
        <div id=${t.type} class="interval-list">
          ${this._renderIntervalList({type:n,progressive:i,intervals:e,maxInterval:l})}
        </div>

        <div class="section-title section-title--subtotal">
          <div class="section-title-text">${"Sous-total (30 jours) :"}</div>
          <div class="section-title-price">
            ${w(this._getCurrencyValue(o))}
          </div>
        </div>
      </div>
      <hr>
    `}_renderInput({type:t,quantity:e,unitValue:i}){return this._isTypeBytes(t)?g`
        <cc-input-number
          label=${(({bytes:t})=>`Taille (en ${_(t)})`)({bytes:i})}
          class="input-quantity"
          value=${e}
          min="0"
          @cc-input-number:input=${e=>this._onInputValue(t,e.detail)}
        ></cc-input-number>
        <cc-toggle
          legend=${"Unité"}
          class="input-unit"
          value=${i}
          .choices=${this._getUnits()}
          @cc-toggle:input=${e=>this._onToggleUnit(t,e.detail)}
        ></cc-toggle>
      `:g`
        <cc-input-number
          label=${"Quantité"}
          class="input-quantity"
          value=${e}
          min="0"
          @cc-input-number:input=${e=>this._onInputValue(t,e.detail)}
        ></cc-input-number>
      `}_renderIntervalList({type:t,progressive:e,intervals:i,maxInterval:n}){return i.map(((r,s)=>{const a=i.indexOf(n),c=r===n||e&&s<=a,o=this._getMinRange(t,r.minRange),l=this._getMaxRange(t,r.maxRange),d=this._getIntervalPrice(t,r.price),u=this._simulator.getIntervalPrice(t,s),p=w(this._getCurrencyValue(u));return g`
        <div class="interval-line ${h({progressive:e,highlighted:c})}">
          <div class="interval interval-min">
            ${o}
          </div>
          <div class="interval interval-min-sign">&le;</div>
          <div class="interval interval-label"> ${this._getLabel(t)}</div>
          <div class="interval interval-max-sign">&lt;</div>
          <div class="interval interval-max">${l}</div>
          <div class="interval-price ${h({"interval-price--free":0===r.price})}">
            ${d}
          </div>
          <div class="estimated-price">${p}</div>
        </div>
      `}))}static get styles(){return[v`
        :host {
          display: block;
          color: var(--cc-color-text-default, #000);
        }

        /* region COMMON */
        
        cc-notice {
          max-width: max-content;
        }

        cc-loader {
          min-height: 20em;
        }

        .body {
          display: grid;
          overflow: visible;
          align-items: center;
          white-space: nowrap;
        }

        /* 
          these elements could be removed but they help the readability of the whole template
          in source code and browser devtools
        */

        .section,
        .section-header,
        .interval-line {
          display: contents;
        }

        hr {
          width: 100%;
          border-width: 1px 0 0;
          border-style: solid;
          border-color: var(--cc-color-border-neutral-weak, #e5e5e5);
          margin: 1em 0;
          grid-column: 1 / -1;
        }

        hr.last {
          margin-bottom: 0;
        }

        .section-icon {
          --cc-icon-color: var(--cc-color-text-primary, #000);
          --cc-icon-size: 1em;
          
          align-self: center;
          margin-right: 1em;
          grid-column: section-icon / span 1;
        }
        
        .section-icon.sum-icon {
          --cc-icon-size: 1.25em;
        }

        .section-title {
          display: flex;
          align-self: center;
          justify-content: space-between;
          font-weight: bold;
          grid-column: title / title--end;
        }

        .section-title.section-title--subtotal,
        .section-title.section-title--total {
          grid-column: title / title-total--end;
        }

        .section-title.section-title--subtotal {
          margin-top: 0.5em;
        }

        .section-title.section-title--subtotal .section-title-text {
          font-weight: normal;
        }

        .section-title-price {
          margin-left: 1em;
        }

        .input-wrapper {
          display: flex;
          width: 100%;
          align-items: end;
          margin: 1em 0;
          grid-column: input-wrapper / input-wrapper--end;
        }

        .input-quantity {
          min-width: 10ch;
          flex: 1 1 0;
        }

        .input-unit {
          --cc-toggle-text-transform: capitalize;

          margin-left: 0.5em;
        }

        .interval-list {
          display: contents;
        }

        .interval-line {
          --bdrs: var(--cc-border-radius-default, 0.25em);
        }

        .interval,
        .interval-price,
        .estimated-price {
          align-self: stretch;
          padding-top: 0.5em;
          padding-left: 0.5em;
          margin: 0.1em 0;
        }

        .interval {
          padding-right: 0.5em;
          padding-bottom: 0.5em;
        }

        .interval-line.highlighted:not(.progressive) .interval {
          background-color: var(--cc-color-bg-soft, #e5e5e5);
        }

        .interval-min,
        .interval-max,
        .interval-price {
          text-align: right;
        }

        .interval-min {
          border-radius: var(--bdrs) 0 0 var(--bdrs);
          grid-column: interval-min / span 1;
        }

        .interval-label {
          text-align: center;
        }

        .interval-price {
          align-self: center;
          color: var(--cc-color-text-weak, #333);
          font-style: italic;
          grid-column: interval-price / interval-price--end;
          padding-block: 0;
        }

        .interval-max {
          border-radius: 0 var(--bdrs) var(--bdrs) 0;
        }

        .estimated-price {
          font-weight: bold;
          text-align: right;
        }

        .interval-line:not(.highlighted) .estimated-price {
          visibility: hidden;
        }

        .button-bar {
          margin-bottom: 1em;
          grid-column: start / end;
        }

        /* endregion */

        /* region BIG */

        .body--big {
          grid-template-columns: 
            [start section-icon] 1.5em
            [title input-wrapper interval-min] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max] min-content
            [interval-price input-wrapper--end] min-content
            [estimated-price interval-price--end] min-content
            [title--end title-total--end] 1fr
            [end] 0;
        }

        .body--big .section-title--subtotal {
          display: none;
        }

        .body--big .section-toggle-btn {
          display: none;
        }

        .body--big .interval-label {
          text-align: center;
        }

        .body--big .interval-price {
          margin-left: 2em;
        }

        .body--big .estimated-price {
          margin-left: 2em;
          grid-column: estimated-price / span 1;
        }

        /* endregion */

        /* region SMALL */

        .body--small {
          grid-template-columns:
            [start section-icon] 1.5em
            [title input-wrapper interval-min interval-price] min-content
            [interval-min-sign] min-content
            [interval-label] min-content
            [interval-max-sign] min-content
            [interval-max toggle-btn title--end] min-content
            [input-wrapper--end interval-price--end title-total--end] 1fr
            [end];
        }

        .body--small .section--closed .interval,
        .body--small .section--closed .interval-price {
          height: 0;
          padding-top: 0;
          padding-bottom: 0;
          margin-top: 0;
          margin-bottom: 0;
          visibility: hidden;
        }

        .body--small .interval-price {
          margin-bottom: 1.5em;
        }

        .body--small .estimated-price {
          display: none;
        }
        
        .body--small .input-wrapper {
          margin-bottom: 0.5em;
        }
        
        .section-toggle-btn {
          display: flex;
          align-items: center;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--cc-color-text-primary-highlight, blue);
          font-size: 1em;
          grid-column: input-wrapper / -1;
          margin-block: 0.5em;
        }

        .section-toggle-btn:hover {
          color: var(--cc-pricing-hovered-color, purple);
        }

        .expand-icon {
          --cc-icon-color: var(--cc-color-text-default, #000);
          --cc-icon-size: 1.5em;
          
          transform: rotate(0deg);
          transition: transform 0.2s ease;
        }

        .section:not(.section--closed) .expand-icon {
          transform: rotate(180deg);
          transition: transform 0.2s ease;
        }
        /* endregion */
      `]}}window.customElements.define("cc-pricing-product-consumption",I);export{I as CcPricingProductConsumption};
