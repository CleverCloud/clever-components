import{f as e,a as t,p as r}from"./i18n-number-a9c20d27.js";import{s as i}from"./i18n-sanitize-4edc4a2d.js";import{w as a}from"./cc-remix.icons-d7d44eac.js";import{R as o}from"./resize-controller-3aadf1c4.js";import{d as n}from"./events-4c8e3503.js";import{a as c}from"./accessibility-664b7197.js";import"./cc-loader-c9072fed.js";import"./cc-notice-9b1eec7a.js";import"./cc-icon-f84255c7.js";import{s,x as d,i as l}from"./lit-element-98ed46d4.js";import{o as u}from"./class-map-1feb5cf7.js";const m="fr",p=r(m,"o"," "),h=({productName:e,size:t})=>`Ajouter ${e} - ${t} à l'estimation`,g=({shared:e})=>""+(e?"Partagé":"Dédié"),b={"connection-limit":()=>"Limite de connexions",cpu:()=>"vCPUs",databases:()=>"Bases de données",dedicated:()=>"Dédié","disk-size":()=>"Taille du disque",gpu:()=>"GPUs","has-logs":()=>"Logs","has-metrics":()=>"Métriques","is-migratable":()=>"Outil de migration","max-db-size":()=>"Taille BDD max",memory:()=>"RAM",version:()=>"Version"},f=Object.keys(b),v=["bytes","number","number-cpu-runtime"],y={code:"EUR",changeRate:1},$=[{type:"30-days",digits:2}];class P extends s{static get properties(){return{action:{type:String},currency:{type:Object},product:{type:Object},temporalities:{type:Array}}}constructor(){super(),this.action="add",this.currency=y,this.product={state:"loading"},this.temporalities=$,this._resizeController=new o(this)}_getFeatureName(e){return null==e?"":null!=b[e.code]?b[e.code]():null!=e.name?e.name:void 0}_getFeatureValue(e){if(null==e)return"";switch(e.type){case"boolean":return(({boolean:e})=>e?"Oui":"Non")({boolean:"true"===e.value});case"boolean-shared":return g({shared:"shared"===e.value});case"bytes":return"memory"===e.code&&"0"===e.value?g({shared:!0}):(({bytes:e})=>p(e,0,3))({bytes:Number(e.value)});case"number":return"cpu"===e.code&&"0"===e.value?g({shared:!0}):(({number:e})=>t(m,e))({number:Number(e.value)});case"number-cpu-runtime":return(({cpu:e,shared:r})=>r?i`<em title="Accès au vCPU moins prioritaire">${t(m,e)}<code>*</code></em>`:t(m,e))({cpu:e.value.cpu,shared:e.value.shared});case"string":return e.value}}_getPrice(e,t){return"second"===e?t/60/60*this.currency.changeRate:"minute"===e?t/60*this.currency.changeRate:"hour"===e?t*this.currency.changeRate:"1000-minutes"===e?t/60*1e3*this.currency.changeRate:"day"===e?24*t*this.currency.changeRate:"30-days"===e?24*t*30*this.currency.changeRate:void 0}_getPriceLabel(e){return"second"===e?"Prix/seconde":"minute"===e?"Prix/minute":"hour"===e?"Prix/heure":"1000-minutes"===e?`Prix (${t(m,1e3)} minutes)`:"day"===e?"Prix/jour":"30-days"===e?i`Prix/30&nbsp;jours`:void 0}_getPriceValue(t,r,i){const a=this._getPrice(t,r);if(null!=a)return(({price:t,code:r,digits:i})=>e(m,t,{currency:r,minimumFractionDigits:i,maximumFractionDigits:i}))({price:a,code:this.currency.code,digits:i})}_onAddPlan(e,t){n(this,"add-plan",{productName:e,...t})}render(){return d`

      ${"error"===this.product.state?d`
        <cc-notice intent="warning" message=${"Une erreur est survenue pendant le chargement des prix."}></cc-notice>
      `:""}
      ${"loading"===this.product.state?d`
        <cc-loader></cc-loader>
      `:""}
      ${"loaded"===this.product.state?this._renderProductPlans(this.product.name,this.product.plans,this.product.productFeatures):""}
    `}_renderProductPlans(e,t,r){const i=[...t].sort(((e,t)=>e.price-t.price)),a=r.filter((e=>f.includes(e.code)||null!=e.name));return this._resizeController.width>800?this._renderBigPlans(e,i,a):this._renderSmallPlans(e,i,a)}_renderBigPlans(e,t,r){const i=this.temporalities??$;return d`
      <table>
        <caption class="visually-hidden">${e}</caption>
        <thead>
          <tr>
            <th>${"Plan"}</th>
            ${r.map((e=>d`
              <th class=${u({"number-align":v.includes(e.type)})}>${this._getFeatureName(e)}</th>
            `))}
            ${i.map((({type:e})=>d`
              <th class="number-align">${this._getPriceLabel(e)}</th>
            `))}
            ${"add"===this.action?d`
              <th class="btn-col"></th>
            `:""}
          </tr>
        </thead>
        <tbody>
        ${t.map((t=>d`
          <tr>
            <td>${t.name}</td>
            ${this._renderBigPlanFeatures(t.features,r)}
            ${i.map((({type:e,digits:r})=>d`
              <td class="number-align">${this._getPriceValue(e,t.price,r)}</td>
            `))}
            ${"add"===this.action?d`
              <td class="btn-col">
                <button class="btn" @click="${()=>this._onAddPlan(e,t)}" title="${h({productName:e,size:t.name})}">
                  <cc-icon
                    .icon=${a}
                    a11y-name=${h({productName:e,size:t.name})}
                  ></cc-icon>
                </button>
              </td>
            `:""}
          </tr>
        `))}
        </tbody>
      </table>
    `}_renderBigPlanFeatures(e,t){return t.map((t=>{const r=e.find((e=>t.code===e.code));return d`
        <td class=${u({"number-align":v.includes(t.type)})}>${this._getFeatureValue(r)}</td>
      `}))}_renderSmallPlans(e,t,r){const i=this.temporalities??$;return d`
      <div>
        <div class="visually-hidden">${e}</div>
        ${t.map((t=>d`
          <div class="plan">

            <div class="plan-name">
              <span>${t.name}</span>
              ${"add"===this.action?d`
                <button class="btn" @click="${()=>this._onAddPlan(e,t)}" title="${h({productName:e,size:t.name})}">
                  <cc-icon
                    .icon=${a}
                    a11y-name=${h({productName:e,size:t.name})}
                  ></cc-icon>
                </button>
              `:""}
            </div>

            <dl class="feature-list">
              ${this._renderSmallPlanFeatures(t.features,r)}
              ${i.map((({type:e,digits:r})=>d`
                <div class="price-small">
                  <dt class="feature-name">${this._getPriceLabel(e)}</dt>
                  <dd class="feature-value">${this._getPriceValue(e,t.price,r)}</dd>
                </div>
              `))}
            </dl>
          </div>
        `))}
      </div>
    `}_renderSmallPlanFeatures(e,t){return t.map((t=>{const r=e.find((e=>t.code===e.code));return d`
        <div>
          <dt class="feature-name">${this._getFeatureName(r)}</dt>
          <dd class="feature-value">${this._getFeatureValue(r)}</dd>
        </div>
      `}))}static get styles(){return[c,l`
      :host {
        display: block;
      }

      button:focus {
        outline: var(--cc-focus-outline, #000);
        outline-offset: var(--cc-focus-outline-offset);
      }

      cc-loader {
        min-height: 20em;
      }

      cc-notice {
        max-width: max-content;
      }
        
      /* region pricing table */
      /* region COMMON */

      .number-align {
        text-align: right;
      }

      /* this selector applies to content coming from the translation files */

      em[title] {
        position: relative;
        cursor: help;
        font-style: normal;
      }

      /* this selector applies to content coming from the translation files. */    
  
      em[title] code {
        color: var(--cc-color-text-primary-highlight, blue);
        font-family: monospace;
        font-weight: bold;
      }
      
      .btn {
        display: grid;
        width: 1.5em;
        height: 1.5em;
        border: solid 1px var(--cc-color-border-neutral-strong, #eee);
        background-color: var(--cc-color-bg-default, #fff);
        color: var(--cc-color-text-weak, #333);
        cursor: pointer;
        font-size: 1.2em;
        line-height: 1.2em;
        place-content: center;
      }

      .btn:hover {
        --cc-icon-color: var(--cc-pricing-hovered-color);

        border-color: var(--cc-color-border-hovered);
      }

      /* endregion */

      /* region BIG */

      table {
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
      }

      /* Fix to prevent position absolute from breaking border collapse between thead and tbody */

      caption.visually-hidden {
        position: static;
      }

      tr {
        border-block: solid 1px var(--cc-color-border-neutral-weak, #eee);
      }

      th {
        padding: 2em 0.5em;
        color: var(--cc-color-text-weak, #333);
        font-weight: bold;
        text-align: left;
      }

      th.btn-col,
      td.btn-col {
        width: 2em;
      }

      td {
        padding: 1.5em 0.5em;
        color: var(--cc-color-text-default, #000);
        font-weight: 500;
        white-space: nowrap;
      }

      td.btn-col {
        padding: 0.25em 1em;
      }

      tr:hover td {
        background-color: var(--cc-color-bg-neutral-hovered, #f5f5f5);
      }

      .price-col {
        padding: 0;
      }

      table em[title] code {
        position: absolute;
        left: 100%;
        box-sizing: border-box;
        padding: 0 0.15em;
      }
      
      /* endregion */

      /* region SMALL */

      .plan {
        padding: 1em;
        border-bottom: 1px solid var(--cc-color-border-neutral-weak, #ddd);
        margin: 0;
      }

      .plan-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1em;
        font-size: 1.2em;
        font-weight: bold;
      }

      
      .feature-list {
        display: grid;
        gap: 1em;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      }

      dl,
      dd,
      dt {
        padding: 0;
        margin: 0;
      }

      dd {
        color: var(--cc-color-text-default, #000);
        font-weight: 500;
      }
      
      dt {
        color: var(--cc-color-text-weak);
        font-weight: 600;
      }
      /*  endregion */
      `]}}window.customElements.define("cc-pricing-product",P);export{P as CcPricingProduct};
