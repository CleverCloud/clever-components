import"./cc-env-var-create-60a0b3d7.js";import"./cc-env-var-input-3a5e9139.js";import{d as e}from"./events-4c8e3503.js";import{s as a,x as t,i}from"./lit-element-98ed46d4.js";import{c as s}from"./repeat-92fcb4ec.js";const n=[{name:"VARIABLE_ONE",value:""},{name:"VARIABLE_FOOBAR",value:""},{name:"VARIABLE_PORT",value:""}];class r extends a{static get properties(){return{disabled:{type:Boolean},readonly:{type:Boolean},state:{type:Object}}}constructor(){super(),this.disabled=!1,this.readonly=!1,this.state={type:"loading"}}_changeVariables(a){this.state={...this.state,variables:a},e(this,"change",a)}_onCreate({detail:e}){this._changeVariables([...this.state.variables,e])}_onInput({detail:e}){this._changeVariables(this.state.variables.map((a=>a.name===e.name?{...a,value:e.value}:a)))}_onDelete({detail:e}){this._changeVariables(this.state.variables.filter((a=>a.name!==e.name||!a.isNew)).map((a=>a.name===e.name?{...a,isDeleted:!0}:a)))}_onKeep({detail:e}){this._changeVariables(this.state.variables.map((a=>a.name===e.name?{...a,isDeleted:!1}:a)))}render(){const e="loading"===this.state.type,a=e?n:this.state.variables,i=a.map((({name:e})=>e));return t`

      ${this.readonly?"":t`
        <cc-env-var-create
          ?disabled=${e||this.disabled}
          .validationMode=${this.state.validationMode}
          .variablesNames=${i}
          @cc-env-var-create:create=${this._onCreate}
        ></cc-env-var-create>
      `}

      <div class="message" ?hidden=${0!==a.length}>
        ${"Il n'y a pas de variable."}
      </div>

      ${s(a,(({name:e})=>e),(({name:a,value:i,isNew:s,isEdited:n,isDeleted:r})=>t`
        <cc-env-var-input
          name=${a}
          value=${i}
          ?new=${s}
          ?edited=${n}
          ?deleted=${r}
          ?skeleton=${e}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @cc-env-var-input:input=${this._onInput}
          @cc-env-var-input:delete=${this._onDelete}
          @cc-env-var-input:keep=${this._onKeep}
        ></cc-env-var-input>
      `))}
    `}static get styles(){return i`
      :host {
        display: grid;
        grid-gap: 0.5em;
      }

      :host([hidden]) {
        display: none;
      }

      /* 
        Negative margin + padding to make the background-color span through the full width of the cc-block,
        despite the cc-block padding 
      */

      cc-env-var-create {
        padding: 1em;
        margin-bottom: 0.5em;
        background-color: var(--cc-color-bg-neutral);
        margin-inline: -1em;
      }

      .message {
        margin: 0.2em;
        color: var(--cc-color-text-weak);
        font-style: italic;
      }
    `}}window.customElements.define("cc-env-var-editor-simple",r);export{r as CcEnvVarEditorSimple};
