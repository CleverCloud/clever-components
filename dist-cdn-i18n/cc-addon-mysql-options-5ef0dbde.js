import"./cc-addon-option-form-da879069.js";import"./cc-error-8d730ec3.js";import{L as o,d as t,h as n,c as s}from"./vendor-5e139a4e.js";import{c as r}from"./cc-addon-encryption-at-rest-option-06b7f6fe.js";class i extends o{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=[]}_onFormOptionsSubmit({detail:o}){t(this,"submit",o)}_getFormOptions(){return this.options.map((o=>{switch(o.name){case"encryption":return r(o);default:return null}})).filter((o=>null!=o))}render(){const o=this._getFormOptions();return n`<cc-addon-option-form title=Options for the MySQL add-on .options=${o} @cc-addon-option-form:submit=${this._onFormOptionsSubmit}><div slot=description>Choose the options you want for your MySQL add-on.</div></cc-addon-option-form>`}static get styles(){return[s`:host{display:block}`]}}window.customElements.define("cc-addon-mysql-options",i);export{i as CcAddonMysqlOptions};
