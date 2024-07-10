import"./cc-addon-option-form-4a5ef3da.js";import{d as o}from"./events-4c8e3503.js";import{c as t}from"./cc-addon-encryption-at-rest-option-50e4e814.js";import{s as n,x as i,i as s}from"./lit-element-98ed46d4.js";class e extends n{static get properties(){return{options:{type:Array}}}constructor(){super(),this.options=[]}_onFormOptionsSubmit({detail:t}){o(this,"submit",t)}_getFormOptions(){return this.options.map((o=>"encryption"===o.name?t(o):null)).filter((o=>null!=o))}render(){const o=this._getFormOptions();return i`
      <cc-addon-option-form title="${"Options pour l'add-on MySQL"}" .options=${o} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${"Sélectionnez les options que vous souhaitez pour votre add-on MySQL."}</div>
      </cc-addon-option-form>
    `}static get styles(){return[s`
        :host {
          display: block;
        }
      `]}}window.customElements.define("cc-addon-mysql-options",e);export{e as CcAddonMysqlOptions};
