import"./cc-button-fafeef50.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import{v as e}from"./env-vars-57e1e34b.js";import{d as t}from"./events-4c8e3503.js";import{l as a}from"./cc-link-f2b8f554.js";import{s as i,x as n,i as s}from"./lit-element-98ed46d4.js";function r(e,t){const a=function(e){try{return r._translations[r._lang][e]}catch(e){return null}}(e);return null==a?(console.warn(`Unknown translation [${r._lang}] "${e}"`),r.MISSING_TEXT):"function"==typeof a?a(t):a}r.MISSING_TEXT="🤬🤬🤬🤬🤬",r._translations={};class c extends i{static get properties(){return{disabled:{type:Boolean},validationMode:{type:String,attribute:"validation-mode"},variablesNames:{type:Array,attribute:"variables-names"},_variableName:{type:String,state:!0},_variableValue:{type:String,state:!0}}}constructor(){super(),this.disabled=!1,this.validationMode="simple",this.variablesNames=[],this._variableName="",this._variableValue=""}reset(){this._variableName="",this._variableValue=""}_onNameInput({detail:e}){this._variableName=e}_onValueInput({detail:e}){this._variableValue=e}_onSubmit(){t(this,"create",{name:this._variableName,value:this._variableValue}),this.reset(),this.shadowRoot.querySelector("cc-input-text.name").focus()}_onRequestSubmit(e,t){e.stopPropagation(),t||this._onSubmit()}render(){const t=!e(this._variableName,"simple"),a=!e(this._variableName,"strict"),i=this.variablesNames.includes(this._variableName),s="strict"===this.validationMode?a||i:t||i;return n`
      <div class="inline-form">
        <cc-input-text
          label=${"Nom de la variable"}
          class="name"
          name="name"
          value=${this._variableName}
          ?disabled=${this.disabled}
          @cc-input-text:input=${this._onNameInput}
          @cc-input-text:requestimplicitsubmit=${e=>this._onRequestSubmit(e,s)}
        ></cc-input-text>

        <div class="input-btn">

          <cc-input-text
            label=${"Valeur de la variable"}
            class="value"
            name="value"
            value=${this._variableValue}
            multi
            ?disabled=${this.disabled}
            @cc-input-text:input=${this._onValueInput}
            @cc-input-text:requestimplicitsubmit=${e=>this._onRequestSubmit(e,s)}
          ></cc-input-text>

          <cc-button
            primary
            ?disabled=${s||this.disabled}
            @cc-button:click=${this._onSubmit}
          >${"Ajouter"}
          </cc-button>
        </div>
      </div>
      
      ${a&&"strict"===this.validationMode&&""!==this._variableName?n`
        <cc-notice intent="warning">
          <div slot="message">
            ${r("cc-env-var-create.errors.invalid-name",{name:this._variableName})}
          </div>
        </cc-notice>
      `:""}
      ${a&&t&&"strict"!==this.validationMode&&""!==this._variableName?n`
        <cc-notice intent="warning">
          <div slot="message">
            ${r("cc-env-var-create.errors.invalid-name",{name:this._variableName})}
          </div>
        </cc-notice>
      `:""}
      ${a&&!t&&"strict"!==this.validationMode&&""!==this._variableName?n`
        <cc-notice intent="info">
          <div slot="message">
            ${r("cc-env-var-create.info.java-prop",{name:this._variableName})}
          </div>
        </cc-notice>
      `:""}

      ${i?n`
        <cc-notice intent="warning">
          <div slot="message">
            ${r("cc-env-var-create.errors.already-defined-name",{name:this._variableName})}
          </div>
        </cc-notice>
      `:""}

    `}static get styles(){return[a,s`
        :host {
          display: block;
        }
        
        .inline-form {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .name {
          flex: 1 1 15em;
        }

        .input-btn {
          display: flex;
          flex: 2 1 27em;
          flex-wrap: wrap;
          gap: 1em 0.5em;
        }

        .value {
          /* 100 seems weird but it is necessary */
          /* it helps to have a button that almost does not grow except when it wraps on its own line */
          flex: 100 1 20em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }

        cc-button {
          flex: 1 1 6em;
          align-self: flex-start;
          margin-top: auto;
          white-space: nowrap;
        }

        cc-notice {
          margin-top: 1em;
        }

        /* i18n error message may contain <code> tags */

        cc-notice code {
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral, #eee);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace, monospace);
        }
      `]}}window.customElements.define("cc-env-var-create",c);export{c as CcEnvVarCreate};
