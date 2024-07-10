import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-button-fafeef50.js";import"./cc-expand-a1ff031c.js";import"./cc-loader-c9072fed.js";import"./cc-toggle-34554172.js";import"./cc-notice-9b1eec7a.js";import"./cc-env-var-editor-expert-b83c9b14.js";import"./cc-env-var-editor-json-b6c3331c.js";import"./cc-env-var-editor-simple-eb40d72e.js";import{d as t}from"./events-4c8e3503.js";import{l as i}from"./cc-link-f2b8f554.js";import{s as a,x as s,i as n}from"./lit-element-98ed46d4.js";import{o}from"./class-map-1feb5cf7.js";class r extends a{static get properties(){return{addonName:{type:String,attribute:"addon-name"},appName:{type:String,attribute:"app-name"},context:{type:String,reflect:!0},heading:{type:String,reflect:!0},readonly:{type:Boolean,reflect:!0},restartApp:{type:Boolean,attribute:"restart-app"},state:{type:Object},_editorsState:{type:Object,state:!0},_mode:{type:String,state:!0},_isPristine:{type:Boolean,state:!0}}}constructor(){super(),this.addonName="?",this.appName="?",this.context=null,this.heading=null,this.readonly=!1,this.restartApp=!1,this.state={type:"loading"},this._editorsState={type:"loading"},this._currentVariables=null,this._mode="SIMPLE",this._isPristine=!0}_getModes(){return[{label:"Simple",value:"SIMPLE"},{label:"Expert",value:"EXPERT"},{label:"JSON",value:"JSON"}]}_getHeading(){return null!=this.heading?this.heading:"env-var"===this.context||"env-var-simple"===this.context||"env-var-addon"===this.context?"Variables d'environnement":"exposed-config"===this.context?"Configuration publiée":"config-provider"===this.context?"Variables":void 0}_getDescription(){return"env-var"===this.context?(({appName:t})=>e`Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${t}</strong>. <a href="https://doc.clever-cloud.com/admin-console/environment-variables/">En savoir plus</a>`)({appName:this.appName}):"exposed-config"===this.context?(({appName:t})=>e`Configuration publiée pour les applications dépendantes. <a href="https://www.clever-cloud.com/doc/admin-console/service-dependencies/">En savoir plus</a><br>Ces variables ne seront pas injectées dans l'application <strong>${t}</strong>, elles seront injectées en tant que variables d'environnement dans les applications qui ont <strong>${t}</strong> dans leurs services liés.`)({appName:this.appName}):"config-provider"===this.context?(({addonName:t})=>e`Configuration publiée pour les applications dépendantes. <a href="https://www.clever-cloud.com/doc/deploy/addon/config-provider/">En savoir plus</a><br>Ces seront injectées en tant que variables d'environnement dans les applications qui ont l'add-on <strong>${t}</strong> dans leurs services liés.<br>À chaque fois que vous mettez à jour les changements, toutes les applications dépendantes seront redémarrées automatiquement.`)({addonName:this.addonName}):void 0}_onChange({detail:e}){const t=this._initVariables.filter((t=>{const i=e.find((e=>e.name===t.name));return(null==i||i.isDeleted)&&!t.isNew})).map((e=>({...e,isDeleted:!0}))),i=e.filter((e=>null==this._initVariables.find((t=>t.name===e.name)))).map((e=>({...e,isNew:!0}))),a=e.filter((e=>{const a=t.find((t=>t.name===e.name)),s=i.find((t=>t.name===e.name));return!a&&!s})).map((e=>{const t=this._initVariables.find((t=>t.name===e.name)).value!==e.value;return{...e,isEdited:t}})),s=[...t,...i,...a];this._isPristine=!s.some((({isDeleted:e,isNew:t,isEdited:i})=>e||t||i)),this._currentVariables=s.sort(((e,t)=>e.name.localeCompare(t.name))),"SIMPLE"===this._mode&&(this._editorsState={type:"loaded",validationMode:this.state.validationMode,variables:this._currentVariables})}_onToggleMode({detail:e}){this._mode=e,this._editorsState={type:"loaded",validationMode:this.state.validationMode,variables:this._currentVariables}}_resetForm(e){if(this._initVariables=e,this._isPristine=!0,null==e)this._currentVariables=null,this._editorsState={type:"loaded",validationMode:this.state.validationMode,variables:[]};else{const t=[...e].sort(((e,t)=>e.name.localeCompare(t.name)));this._currentVariables=t,this._editorsState={type:"loaded",validationMode:this.state.validationMode,variables:t}}}_onUpdateForm(){const e=this._currentVariables.filter((({isDeleted:e})=>!e)).map((({name:e,value:t})=>({name:e,value:t})));t(this,"submit",e)}_onRequestSubmit(e,t){e.stopPropagation(),t||this._onUpdateForm()}willUpdate(e){e.has("context")&&"env-var-addon"===this.context&&(this.readonly=!0),e.has("state")&&"loaded"===this.state.type&&this._resetForm(this.state.variables)}render(){const e=this._getHeading(),i=this._getDescription();if("error"===this.state.type)return s`
        <div class="header">
          ${null!=e?s`
            <div class="heading">${e}</div>
          `:""}
        </div>
        <slot class="description">${i}</slot>
        <div class="overlay-container">
          <div class="error-container">
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des variables."}"></cc-notice>
          </div>
        </div>
      `;const a="loading"===this.state.type,n="saving"===this.state.type,r=n||a,l=null==this._currentVariables||this._isPristine||r,c=n;return s`
      <div class="header">

        ${null!=e?s`
          <div class="heading">${e}</div>
        `:""}

        <cc-toggle
          class="mode-switcher ${o({"has-overlay":c})}"
          value=${this._mode}
          .choices=${this._getModes()}
          ?disabled=${r}
          @cc-toggle:input=${this._onToggleMode}
        ></cc-toggle>
      </div>

      <slot class="description">${i}</slot>

      <div class="overlay-container">

        <cc-expand class=${o({"has-overlay":c})}>
          <cc-env-var-editor-simple
            ?hidden=${"SIMPLE"!==this._mode}
            .state=${this._editorsState}
            ?disabled=${r}
            ?readonly=${this.readonly}
            @cc-env-var-editor-simple:change=${this._onChange}
            @cc-input-text:requestimplicitsubmit=${e=>this._onRequestSubmit(e,l)}
          ></cc-env-var-editor-simple>

          <cc-env-var-editor-expert
            ?hidden=${"EXPERT"!==this._mode}
            .state=${this._editorsState}
            ?disabled=${r}
            ?readonly=${this.readonly}
            @cc-env-var-editor-expert:change=${this._onChange}
            @cc-input-text:requestimplicitsubmit=${e=>this._onRequestSubmit(e,l)}
          ></cc-env-var-editor-expert>

          <cc-env-var-editor-json
            ?hidden=${"JSON"!==this._mode}
            .state=${this._editorsState}
            ?disabled=${r}
            ?readonly=${this.readonly}
            @cc-env-var-editor-json:change=${this._onChange}
            @cc-input-text:requestimplicitsubmit=${e=>this._onRequestSubmit(e,l)}
          ></cc-env-var-editor-json>
        </cc-expand>

        ${n?s`
          <cc-loader class="saving-loader"></cc-loader>
        `:""}
      </div>

      ${this.readonly?"":s`
        <div class="button-bar">

          <cc-button @cc-button:click=${()=>this._resetForm(this._initVariables)}>${"Annuler les changements"}</cc-button>

          <div class="spacer"></div>

          ${this.restartApp?s`
            <cc-button @cc-button:click=${()=>t(this,"restart-app")}>${"Redémarrer l'app pour appliquer les changements"}</cc-button>
          `:""}

          <cc-button success ?disabled=${l} @cc-button:click=${this._onUpdateForm}>${"Mettre à jour les changements"}</cc-button>
        </div>
      `}
    `}static get styles(){return[i,n`
        :host {
          display: block;
          padding: 0.5em 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .header {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: center;
          gap: 0.5em;
          margin-block: 0.5em;
        }

        .heading {
          flex: 1 1 0;
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
        }

        .description {
          display: block;
          margin-bottom: 0.5em;
          color: var(--cc-color-text-weak);
          font-style: italic;
          line-height: 1.5;
        }

        .has-overlay {
          --cc-skeleton-state: paused;

          filter: blur(0.3em);
        }

        .overlay-container {
          position: relative;
        }

        cc-expand {
          padding: 0.5em 1em;
          /* We need to spread so the focus rings can be visible even with cc-expand default overflow:hidden */
          /* It also allows cc-env-var-create to span through the whole width of the cc-block in simple mode */
          margin-inline: -1em;
        }

        .saving-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .button-bar {
          display: flex;
          flex-wrap: wrap;
          margin-top: 1em;
          margin-bottom: 0.5em;
          gap: 1em;
        }

        .spacer {
          flex: 1 1 0;
        }
        
        .error-container {
          padding-bottom: 0.5em;
        }
      `]}}window.customElements.define("cc-env-var-form",r);export{r as CcEnvVarForm};
