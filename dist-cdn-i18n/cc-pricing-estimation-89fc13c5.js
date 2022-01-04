import{c as t,s as e}from"./i18n-bf531c19.js";import"./cc-button-0fc35634.js";import"./cc-error-8d730ec3.js";import"./cc-input-number-5a04b6b3.js";import{L as n,d as a,h as i,c}from"./vendor-5e139a4e.js";import{w as r}from"./with-resize-observer-323d9e0d.js";import{c as s}from"./cc-link-bb132771.js";const o=({price:e,code:n})=>`${t("en",e,{currency:n})}`,l=()=>e`Price (30&nbsp;days)`,d=new URL(new URL("assets/delete-0802f1f7.svg",import.meta.url).href,import.meta.url).href,p={code:"EUR",changeRate:1};class u extends(r(n)){static get properties(){return{currency:{type:Object},selectedPlans:{type:Array,attribute:"selected-plans"},totalPrice:{type:Number,attribute:"total-price"},_size:{type:String}}}constructor(){super(),this.breakpoints={width:[600]},this.currency=p,this.totalPrice=0}onResize({width:t}){this._size=t}_getTotalPrices(t){const e=24*t.price;return{totalPriceDailyWithCode:{price:e*t.quantity*this.currency.changeRate,code:this.currency.code},totalPriceMonthlyWithCode:{price:30*e*t.quantity*this.currency.changeRate,code:this.currency.code}}}_onChangeQuantity(t,e){a(this,"change-quantity",{...t,quantity:e})}_onDeletePlan(t){a(this,"delete-plan",t)}render(){return i`${this._size>950?this._renderBigEstimation():this._renderSmallEstimation()}<div class=recap part=recap><div class=recap-text>Estimated Cost (30 days)</div><div class=recap-total>${o({price:this.totalPrice*this.currency.changeRate,code:this.currency.code})}</div><div class=recap-contact>${s("https://www.clever-cloud.com/en/contact-sales","Contact Sales")}</div><div class=recap-signup>${s("https://api.clever-cloud.com/v2/sessions/signup","Sign Up")}</div></div>`}_renderBigEstimation(){return i`<div part=selected-plans><table><tr><th class=btn-col></th><th>Product</th><th>Plan:</th><th>Quantity</th><th class=number-align>Price (daily)</th><th class=number-align>${l}</th></tr>${this._renderBigSelectedPlans()}</table></div>`}_renderBigSelectedPlans(){const t=this.selectedPlans??[];return 0===t.length?i`<tr><td colspan=6 class=empty-text>Add some products to create your pricing estimation.</td></tr>`:t.map((t=>{const{totalPriceDailyWithCode:e,totalPriceMonthlyWithCode:n}=this._getTotalPrices(t);return i`<tr><td class=btn-col><cc-button danger outlined image=${d} hide-text circle @cc-button:click=${()=>this._onDeletePlan(t)}>Delete product</cc-button></td><td>${t.productName}</td><td>${t.name}</td><td><cc-input-number class=input-number value=${t.quantity} min=0 controls @cc-input-number:input=${e=>this._onChangeQuantity(t,e.detail)}></cc-input-number></td><td class=number-align>${o(e)}</td><td class=number-align>${o(n)}</td></tr>`}))}_renderSmallEstimation(){return i`<div class=container part=selected-plans>${this._renderSmallSelectedPlans()}</div>`}_renderSmallSelectedPlans(){const e=this.selectedPlans??[];return 0===e.length?i`<div class=empty-text>Add some products to create your pricing estimation.</div>`:e.map((e=>{const{totalPriceDailyWithCode:n,totalPriceMonthlyWithCode:a}=this._getTotalPrices(e);return i`<div class=plan><cc-button class=delete-btn danger outlined image=${d} hide-text circle @cc-button:click=${()=>this._onDeletePlan(e)}>Delete product</cc-button><div class=product-name>${e.productName}</div><cc-input-number class=input-number value=${e.quantity} min=0 controls @cc-input-number:input=${t=>this._onChangeQuantity(e,t.detail)}></cc-input-number><div class=plan-name><span class=plan-name-label>Plan:</span> <span class=plan-name-text>${e.name}</span></div><div class=feature-list><div class=feature><div class=feature-name>Price (daily)</div><div class=feature-value>${(({price:e,code:n,digits:a})=>t("en",e,{currency:n,minimumFractionDigits:a,maximumFractionDigits:a}))(n)}</div></div><div class=feature><div class=feature-name>${l}</div><div class=feature-value>${o(a)}</div></div></div></div>`}))}static get styles(){return[c`:host{display:block}.input-number{--cc-input-number-align:center;width:13ch}.empty-text{font-style:italic;padding:1em 0;text-align:center}.recap{align-items:center;background-color:#3a3771;border-radius:.2em;color:#fff;display:grid;gap:1em;justify-items:center;padding:2em;white-space:nowrap}.recap-text{grid-area:text}.recap-total{font-weight:700;grid-area:total}.recap-contact{grid-area:contact}.recap-signup{grid-area:signup}.cc-link{border-radius:.2em;cursor:pointer;display:inline-block;font-weight:700;text-decoration:none}.cc-link:focus{box-shadow:0 0 0 .2em #cbdcf6;outline:0}.cc-link::-moz-focus-inner{border:0}.recap-contact .cc-link{background-color:#fff;color:#3a3871}.recap-contact .cc-link:hover{background-color:rgba(255,255,255,.9)}.recap-signup .cc-link{background-color:transparent;border:1px solid #ccc;color:#fff}.recap-signup .cc-link:hover{background-color:rgba(255,255,255,.1)}.number-align{text-align:right}table{border-collapse:collapse;border-spacing:0;width:100%}tr:nth-child(n+3){border-top:1px solid #e5e5e5}th{background-color:#f6f6fb;padding:1em .5em;text-align:left}td{padding:.5em;white-space:nowrap}tr:hover td{background-color:#f5f5f5}td.btn-col{padding:.25em .5em}:host([w-gte-600]) .recap{grid-template-areas:"text contact signup" "total contact signup";grid-template-columns:1fr min-content min-content}:host([w-gte-600]) .recap-text,:host([w-gte-600]) .recap-total{justify-self:start}:host([w-gte-600]) .recap-total{font-size:2em}:host([w-gte-600]) .cc-link{padding:.75em 1em}.plan{align-items:center;border-top:1px solid #e5e5e5;display:grid;gap:0 1em;grid-template-columns:min-content [main-start] 1fr min-content [main-end];margin:0;padding:1em}.product-name{font-size:1.2em;font-weight:700}.plan-name{grid-column:main-start/main-end;margin-top:1em}.plan-name-label{font-style:italic;font-weight:700}.feature-list{display:flex;flex-wrap:wrap;grid-column:main-start/main-end;margin-top:.5em}.feature{display:flex;justify-content:space-between;line-height:1.5}.feature:not(:last-child)::after{content:',';padding-right:.5em}.feature-name{font-style:italic;font-weight:700;white-space:nowrap}.feature-name::after{content:' :';padding-right:.25em}:host([w-lt-600]) .recap{grid-template-areas:"text total" "contact signup";grid-template-columns:min-content min-content;justify-content:center}:host([w-lt-600]) .recap-total{font-size:1.5em}:host([w-lt-600]) .cc-link{padding:.75em 1em}`]}}window.customElements.define("cc-pricing-estimation",u);export{u as CcPricingEstimation};
