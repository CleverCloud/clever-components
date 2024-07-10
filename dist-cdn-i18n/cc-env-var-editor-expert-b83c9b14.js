import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import{E as t,p as s,t as a}from"./env-vars-57e1e34b.js";import{d as i}from"./events-4c8e3503.js";import{l as r}from"./cc-link-f2b8f554.js";import{s as n,x as o,i as l}from"./lit-element-98ed46d4.js";const d=({name:t})=>e`attention, le nom <code>${t}</code> est déjà défini`,c=({name:t})=>e`Le nom <code>${t}</code> n'est pas valide`,m=({name:t})=>e`Le nom <code>${t}</code> n'est pas valide en mode strict`,p=({name:t})=>e`La variable <code>${t}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">plus de détails</a>`,v=[{name:"VARIABLE_ONE",value:""},{name:"VARIABLE_FOOBAR",value:""},{name:"VARIABLE_PORT",value:""}];class u extends n{static get properties(){return{disabled:{type:Boolean},readonly:{type:Boolean},state:{type:Object},_errors:{type:Array,state:!0},_skeleton:{type:Boolean,state:!0},_variablesAsText:{type:Array,state:!0}}}constructor(){super(),this.disabled=!1,this.readonly=!1,this.state={type:"loading"},this._errors=[],this._skeleton=!1,this._variablesAsText=""}_setErrors(s){this._errors=s.map((({type:s,name:a,pos:i})=>s===t.INVALID_NAME?{line:i.line,msg:c({name:a}),isWarning:!1}:s===t.DUPLICATED_NAME?{line:i.line,msg:d({name:a}),isWarning:!1}:s===t.INVALID_LINE?{line:i.line,msg:e`cette ligne est invalide, le format correct est : <code>NOM="VALEUR"</code>`,isWarning:!1}:s===t.INVALID_VALUE?{line:i.line,msg:e`la valeur est invalide, si vous utilisez des guillements, vous devez les échapper comme ceci : <code>\\"</code> ou alors mettre toute la valeur entre guillemets.`,isWarning:!1}:s===t.INVALID_NAME_STRICT?{line:i.line,msg:m({name:a}),isWarning:!1}:s===t.JAVA_INFO?{line:i.line,msg:p({name:a}),isWarning:!0}:{line:"?",msg:"Erreur inconnue"}))}_onInput({detail:e}){this._variablesAsText=e;const{variables:t,errors:a}=s(e,{mode:this.state.validationMode});this._setErrors(a),i(this,"change",t)}willUpdate(e){if(e.has("state")){this._skeleton="loading"===this.state.type;const e=(this._skeleton?v:this.state.variables).filter((({isDeleted:e})=>!e));this._variablesAsText=a(e),this._setErrors([])}}render(){return o`

      ${this.readonly?"":o`
          <div class="example">
            ${e`Format : <code>NOM_DE_LA_VARIABLE="valeur de la variable"</code> <br> Chaque variable doit être séparée par des sauts de ligne, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">en savoir plus</a>.`}
          </div>
        `}
      <cc-input-text
        label=${'Edition des variables. Format : NOM_DE_LA_VARIABLE="valeur de la variable". Chaque variable doit être séparée par des sauts de ligne.'}
        hidden-label
        multi
        clipboard
        value=${this._variablesAsText}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length>0?o`
        <div class="error-list">
          ${this._errors.map((({line:e,msg:t,isWarning:s})=>o`
            <cc-notice intent="${s?"info":"warning"}">
                <div slot="message">
                  <strong>${"ligne"} ${e}:</strong> ${t}
                </div>
            </cc-notice>
          `))}
        </div>
      `:""}
    `}static get styles(){return[r,l`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        .error-list {
          display: grid;
          margin-top: 1em;
          grid-gap: 0.75em;
        }

        .example {
          padding-bottom: 1em;
          line-height: 1.5;
        }

        /* i18n error message may contain <code> tags */

        cc-notice code,
        .example code {
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral, #eee);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace, monospace);
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `]}}window.customElements.define("cc-env-var-editor-expert",u);export{u as CcEnvVarEditorExpert};
