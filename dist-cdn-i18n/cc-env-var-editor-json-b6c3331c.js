import{s as e}from"./i18n-sanitize-4edc4a2d.js";import{E as t,a as s,b as a}from"./env-vars-57e1e34b.js";import{d as r}from"./events-4c8e3503.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import{l as n}from"./cc-link-f2b8f554.js";import{s as i,x as o,i as l}from"./lit-element-98ed46d4.js";const d=({name:t})=>e`attention, le nom <code>${t}</code> est déjà défini`,c=({name:t})=>e`Le nom <code>${t}</code> n'est pas valide`,m=({name:t})=>e`Le nom <code>${t}</code> n'est pas valide en mode strict`,p=({name:t})=>e`La variable <code>${t}</code> sera injecté sous forme de propriété Java et non en tant que variable d'environnement, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#environment-variables-rules-and-formats">plus de détails</a>`,v=[{name:"VARIABLE_ONE",value:""},{name:"VARIABLE_FOOBAR",value:""},{name:"VARIABLE_PORT",value:""}];class u extends i{static get properties(){return{disabled:{type:Boolean},readonly:{type:Boolean},state:{type:Object},_errors:{type:Array,state:!0},_formattedErrors:{type:Array,state:!0},_skeleton:{type:Boolean,state:!0},_variablesAsJson:{type:String,state:!0}}}constructor(){super(),this.disabled=!1,this.readonly=!1,this.state={type:"loading"},this._errors=[],this._skeleton=!1}_setErrors(e){this._errors=e.map((({type:e,name:s})=>e===t.INVALID_NAME?{msg:c({name:s}),isWarning:!1}:e===t.DUPLICATED_NAME?{msg:d({name:s}),isWarning:!1}:e===t.INVALID_JSON?{msg:"Le JSON entré est invalide.",isWarning:!1}:e===t.INVALID_JSON_FORMAT?{msg:"Le JSON entré est valide mais n'est pas au bon format. Le JSON doit être un tableau d'objets",isWarning:!1}:e===t.INVALID_JSON_ENTRY?{msg:'Le JSON entré est un tableau d\'objets JSON valide mais toutes les valeurs des propriétés doivent être de type string. Ex : \'[{ "name": "THE_NAME", "value": "the value" }]\'',isWarning:!1}:e===t.INVALID_NAME_STRICT?{msg:m({name:s}),isWarning:!1}:e===t.JAVA_INFO?{msg:p({name:s}),isWarning:!0}:{line:"?",msg:"Erreur inconnue"}))}_onInput({detail:e}){this._variablesAsJson=e;const{variables:a,errors:n}=s(e,{mode:this.state.validationMode});this._setErrors(n);n.some((({type:e})=>e===t.INVALID_JSON||e===t.INVALID_JSON_FORMAT))||r(this,"change",a)}willUpdate(e){if(e.has("state")){this._skeleton="loading"===this.state.type;const e=(this._skeleton?v:this.state.variables).filter((({isDeleted:e})=>!e));this._variablesAsJson=a(e),this._setErrors([])}}render(){return o`
      ${this.readonly?"":o`
          <div class="example">
            ${e`Format : <code>{ "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }</code> <br> Tableau d'objets respectant le format ci-dessus, <a href="https://www.clever-cloud.com/doc/develop/env-variables/#format">en savoir plus</a>.`}
          </div>
        `}
      <cc-input-text
        label=${'Edition des variables. Tableau d\'objets respectant le format : { "name": "NOM_DE_LA_VARIABLE", "value": "valeur de la variable" }.'}
        hidden-label
        multi
        clipboard
        value=${this._variablesAsJson}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        ?skeleton=${this._skeleton}
        @cc-input-text:input=${this._onInput}
      ></cc-input-text>

      ${this._errors.length>0?o`
        <div class="error-list">
          ${this._errors.map((({msg:e,isWarning:t})=>o`
            <cc-notice intent="${t?"info":"warning"}">
              <div slot="message">
                ${e}
              </div>
            </cc-notice>
          `))}
        </div>
      `:""}
    `}static get styles(){return[n,l`
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
      `]}}window.customElements.define("cc-env-var-editor-json",u);export{u as CcEnvVarEditorJson};
