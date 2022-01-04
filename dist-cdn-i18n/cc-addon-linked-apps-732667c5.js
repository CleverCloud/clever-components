import"./cc-flex-gap-4e6ab5ba.js";import"./cc-img-ca15395c.js";import"./cc-block-4351d64f.js";import"./cc-error-8d730ec3.js";import"./cc-zone-280ca68f.js";import{L as e,h as i,i as a,s as t,c as s}from"./vendor-5e139a4e.js";import{c,l as n}from"./cc-link-bb132771.js";const o=[{name:"??????????????????",link:"",instance:{variant:{}}},{name:"???????????????????????",link:"",instance:{variant:{}}},{name:"????????????????????",link:"",instance:{variant:{}}}];class r extends e{static get properties(){return{applications:{type:Array},error:{type:Boolean}}}constructor(){super(),this.error=!1}render(){const e=null==this.applications,t=e?o:this.applications,s=!this.error&&t.length>0,n=!this.error&&0===t.length;return i`<cc-block><div slot=title>Linked applications</div>${s?i`<div>Here's the list of applications linked to this add-on. The add-on exposes its environment variables to those linked applications.</div>${t.map((t=>i`<div class=application><cc-img class=logo ?skeleton=${e} src=${a(t.instance.variant.logo)} title=${a(t.instance.variant.name)}></cc-img><cc-flex-gap class=details><span class=name>${c(t.link,t.name,e)}</span><cc-zone mode=small .zone=${t.zone}></cc-zone></cc-flex-gap></div>`))}`:""} ${n?i`<div class=cc-block_empty-msg>No applications linked yet.</div>`:""} ${this.error?i`<cc-error>Something went wrong while loading linked applications.</cc-error>`:""}</cc-block>`}static get styles(){return[t,n,s`:host{display:block}.application{align-items:flex-start;display:flex;line-height:1.6rem}.logo{border-radius:.25rem;flex:0 0 auto;height:1.6rem;width:1.6rem}.details{--cc-align-items:center;--cc-gap:0.5rem;margin-left:.5rem}.name.skeleton{background-color:#bbb}[title]{cursor:help}`]}}window.customElements.define("cc-addon-linked-apps",r);export{r as CcAddonLinkedApps};
