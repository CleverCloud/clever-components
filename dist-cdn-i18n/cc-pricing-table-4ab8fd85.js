import{s as e,i as t,c as a,p as r}from"./i18n-bf531c19.js";import"./cc-button-0fc35634.js";import"./cc-img-ca15395c.js";import{L as s,d as i,h as n,a as c,c as l}from"./vendor-5e139a4e.js";import{w as d}from"./with-resize-observer-323d9e0d.js";const o=r("en","B"," "),u=()=>`Price (${t("en",1e3)} minutes)`,m=()=>e`Price (30&nbsp;days)`,p=({shared:e})=>""+(e?"Shared":"Dedicated"),h=new URL(new URL("assets/down-5b7898da.svg",import.meta.url).href,import.meta.url).href,g=new URL(new URL("assets/plus-b81295d1.svg",import.meta.url).href,import.meta.url).href,f=new URL(new URL("assets/up-a464b04f.svg",import.meta.url).href,import.meta.url).href,b={code:"EUR",changeRate:1},y={"connection-limit":()=>"Connection limit",cpu:()=>"vCPUs",databases:()=>"Databases","disk-size":()=>"Disk size",gpu:()=>"GPUs","has-logs":()=>"Logs","has-metrics":()=>"Metrics","max-db-size":()=>"Max DB size",memory:()=>"RAM",version:()=>"Version"},v=Object.keys(y),_=["bytes","number","number-cpu-runtime"],$=[{type:"day",digits:2},{type:"30-days",digits:2}];class P extends(d(s)){static get properties(){return{action:{type:String,reflect:!0},currency:{type:Object},features:{type:Array},plans:{type:Array},temporality:{type:Array},_features:{type:Array},_plans:{type:Array},_size:{type:String}}}constructor(){super(),this.action="add",this.currency=b,this._plans=[],this._features=[],this.temporality=$}onResize({width:e}){this._size=e}_getFeatureName(e){if(null!=e&&null!=y[e.code])return y[e.code]()}_getFeatureValue(a){if(null==a)return"";switch(a.type){case"boolean":return(({boolean:e})=>e?"Yes":"No")({boolean:"true"===a.value});case"boolean-shared":return p({boolean:"shared"===a.value});case"bytes":return"memory"===a.code&&"0"===a.value?p({shared:!0}):(({bytes:e})=>o(e,0,3))({bytes:Number(a.value)});case"number":return"cpu"===a.code&&"0"===a.value?p({shared:!0}):(({number:e})=>t("en",e))({number:Number(a.value)});case"number-cpu-runtime":return(({cpu:a,shared:r})=>r?e`<em title="Lower priority access to vCPU">${t("en",a)}<code>*</code></em>`:t("en",a))({cpu:a.value.cpu,shared:a.value.shared});case"string":return a.value}}_getPriceLabel(e){return"second"===e?"Price (second)":"minute"===e?"Price (minute)":"hour"===e?"Price (hour)":"1000-minutes"===e?u:"day"===e?"Price (day)":"30-days"===e?m:void 0}_getPrice(e,t){return"second"===e?t/60/60*this.currency.changeRate:"minute"===e?t/60*this.currency.changeRate:"hour"===e?t*this.currency.changeRate:"1000-minutes"===e?t/60*1e3*this.currency.changeRate:"day"===e?24*t*this.currency.changeRate:"30-days"===e?24*t*30*this.currency.changeRate:void 0}_getPriceValue(e,t,r){const s=this._getPrice(e,t);if(null!=s)return(({price:e,code:t,digits:r})=>a("en",e,{currency:t,minimumFractionDigits:r,maximumFractionDigits:r}))({price:s,code:this.currency.code,digits:r})}_onAddPlan(e){i(this,"add-plan",e)}_onToggleState(e){this._plans=this._plans.map((t=>t===e?{...t,state:"closed"===t.state?"opened":"closed"}:t))}update(e){e.has("plans")&&Array.isArray(this.plans)&&(this._plans=this.plans.map((e=>({...e,state:"closed"}))).sort(((e,t)=>e.price-t.price))),e.has("features")&&Array.isArray(this.features)&&(this._features=this.features.filter((e=>v.includes(e.code)))),super.update(e)}render(){return this._size>950?this._renderBigPlans():this._renderSmallPlans()}_renderSmallPlans(){const e=this.temporality??$;return n`<div class=container>${this._plans.map((t=>n`<div class=plan data-state=${t.state}>${"add"===this.action?n`<cc-button class=add-plan-btn image=${g} hide-text circle @cc-button:click=${()=>this._onAddPlan(t)}>Add</cc-button>`:""}<div class=plan-name>${t.name}</div><cc-button image=${"closed"===t.state?h:f} hide-text circle @cc-button:click=${()=>this._onToggleState(t)}></cc-button><div class=feature-list>${this._renderSmallPlanFeatures(t.features)}</div><div class=feature-list>${e.map((({type:e,digits:a})=>n`<div class=feature><div class=feature-name>${this._getPriceLabel(e)}</div><div class=feature-value>${this._getPriceValue(e,t.price,a)}</div></div>`))}</div></div>`))}</div>`}_renderSmallPlanFeatures(e){return this._features.map((t=>{const a=e.find((e=>t.code===e.code));return null==a?"":n`<div class=feature><div class=feature-name>${this._getFeatureName(a)}</div><div class=feature-value>${this._getFeatureValue(a)}</div></div>`}))}_renderBigPlans(){const e=this.temporality??$;return n`<table><tr>${"add"===this.action?n`<th class=btn-col></th>`:""}<th>Plan</th>${this._features.map((e=>n`<th class=${c({"number-align":_.includes(e.type)})}>${this._getFeatureName(e)}</th>`))} ${e.map((({type:e})=>n`<th class=number-align>${this._getPriceLabel(e)}</th>`))}</tr>${this._plans.map((t=>n`<tr>${"add"===this.action?n`<td class=btn-col><cc-button image=${g} hide-text circle @cc-button:click=${()=>this._onAddPlan(t)}></cc-button></td>`:""}<td>${t.name}</td>${this._renderBigPlanFeatures(t.features)} ${e.map((({type:e,digits:a})=>n`<td class=number-align>${this._getPriceValue(e,t.price,a)}</td>`))}</tr>`))}</table>`}_renderBigPlanFeatures(e){return this._features.map((t=>{const a=e.find((e=>t.code===e.code));return n`<td class=${c({"number-align":_.includes(t.type)})}>${this._getFeatureValue(a)}</td>`}))}static get styles(){return[l`:host{background-color:#fff;display:block}.number-align{text-align:right}em[title]{cursor:help;font-style:normal;position:relative}em[title] code{color:#00f;font-family:monospace;font-weight:700}table{border-collapse:collapse;border-spacing:0;width:100%}tr:nth-child(n+3){border-top:1px solid #e5e5e5}th{background-color:#f6f6fb;padding:1em .5em;text-align:left}th.btn-col{width:2em}td{padding:.5em;white-space:nowrap}td.btn-col{padding:.25em .5em}tr:hover td{background-color:#f5f5f5}table em[title] code{box-sizing:border-box;left:100%;padding:0 .15em;position:absolute}.plan{align-items:center;border-top:1px solid #e5e5e5;display:grid;grid-template-columns:min-content [main-start] 1fr [main-end] min-content;margin:0;padding:1em}:host([action=none]) .plan{grid-template-columns:[main-start] 1fr [main-end] min-content}.plan .add-plan-btn{margin-right:1em}.plan-name{font-size:1.2em;font-weight:700}.feature-list{grid-column:main-start/main-end}.feature-list:not(:last-child){margin-top:1em}.plan[data-state=closed] .feature-list{display:flex;flex-wrap:wrap}.feature{border-bottom:1px solid #e5e5e5;display:flex;justify-content:space-between;padding:.75em 0}.feature-list:last-child .feature:last-child{border:none}.plan[data-state=closed] .feature{border:none;line-height:1.5;padding:0;white-space:nowrap}.plan[data-state=closed] .feature:not(:last-child)::after{content:',';padding-right:.5em}.feature-name{font-style:italic;font-weight:700}.plan[data-state=closed] .feature-name::after{content:' :';padding-right:.25em}.plan[data-state=opened] .feature-value{margin-right:.5em}`]}}window.customElements.define("cc-pricing-table",P);export{P as CcPricingTable};
