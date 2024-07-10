import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-loader-c9072fed.js";import"./cc-notice-9b1eec7a.js";import"./cc-env-var-form-c46cede9.js";import{s as t,x as a,i as r}from"./lit-element-98ed46d4.js";class s extends t{static get properties(){return{appName:{type:String,attribute:"app-name"},state:{type:Object},type:{type:String}}}constructor(){super(),this.appName=null,this.state={type:"loading"},this.type=null}_getLoadingMessage(){const t={appName:this.appName};switch(this.type){case"addon":return(({appName:t})=>e`Chargement des variables exposées par les add-ons liés à <strong>${t}</strong>...`)(t);case"app":return(({appName:t})=>e`Chargement de la configuration publiée par les applications liées à <strong>${t}</strong>...`)(t);default:return""}}_getServiceHeading(e){switch(this.type){case"addon":return(({name:e})=>`Add-on : ${e}`)({name:e});case"app":return(({name:e})=>`Application : ${e}`)({name:e});default:return""}}_getServiceDescription(t){const a={serviceName:t,appName:this.appName};switch(this.type){case"addon":return(({serviceName:t,appName:a})=>e`Liste des variables exposées par l'add-on <strong>${t}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${a}</strong>.`)(a);case"app":return(({serviceName:t,appName:a})=>e`Configuration publiée par l'application <strong>${t}</strong>.<br>Ces variables seront injectées en tant que variables d'environnement dans l'application <strong>${a}</strong>.`)(a);default:return""}}_getEmptyMessage(){const t={appName:this.appName};switch(this.type){case"addon":return(({appName:t})=>e`Aucun add-on lié à <strong>${t}</strong>.`)(t);case"app":return(({appName:t})=>e`Aucune application liée à <strong>${t}</strong>.`)(t);default:return""}}_getErrorMessage(){const t={appName:this.appName};switch(this.type){case"addon":return(({appName:t})=>e`Une erreur est survenue pendant le chargement des add-ons liés à <strong>${t}</strong>.`)(t);case"app":return(({appName:t})=>e`Une erreur est survenue pendant le chargement des applications liées à <strong>${t}</strong>.`)(t);default:return""}}_getEnvVarFormState(e){return"loading"===e.type?{type:"loading"}:"error"===e.type?{type:"error"}:{type:"loaded",variables:e.variables,validationMode:"simple"}}render(){if("error"===this.state.type)return a`
        <div class="error">
          <cc-notice intent="warning" .message="${this._getErrorMessage()}"></cc-notice>
        </div>
      `;if("loading"===this.state.type)return a`
        <div class="loading">
          <cc-loader></cc-loader><span>${this._getLoadingMessage()}</span>
        </div>
      `;const e=this.state.servicesStates;return 0===e.length?a`
        <div class="empty-msg">${this._getEmptyMessage()}</div>
      `:a`
      <div class="service-list">
        ${e.map((e=>a`
            <cc-env-var-form readonly 
                             .state=${this._getEnvVarFormState(e)} 
                             heading=${this._getServiceHeading(e.name)}>
              ${this._getServiceDescription(e.name)}
            </cc-env-var-form>
          `))}
      </div>
    `}static get styles(){return[r`
        :host {
          display: block;
        }

        .loading,
        .empty-msg {
          box-sizing: border-box;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }
        
        .loading {
          display: flex;
        }

        cc-loader {
          width: 1.5em;
          height: 1.5em;
          margin-right: 1em;
        }

        .service-list {
          display: grid;
          grid-gap: 1em;
        }

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `]}}window.customElements.define("cc-env-var-linked-services",s);export{s as CcEnvVarLinkedServices};
