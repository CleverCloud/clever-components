import"./cc-input-text-8d29ec56.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{s as e}from"./skeleton-68a3d018.js";import{s as t,x as r,i as s}from"./lit-element-98ed46d4.js";import{l as i}from"./if-defined-cd9b1ec0.js";class n extends t{static get properties(){return{credentials:{type:Array},error:{type:Boolean},image:{type:String},name:{type:String},toggleState:{type:Boolean,attribute:"toggle-state"},type:{type:String}}}constructor(){super(),this.credentials=null,this.error=!1,this.image=null,this.name=null,this.toggleState="off",this.type=null}_getDescription(e){switch(e){case"apm":return"Utilisez ces identifiants pour connecter une instance d'APM Server à votre cluster Elasticsearch.";case"elasticsearch":return"Utilisez ces identifiants pour vous connecter à votre cluster Elasticsearch.";case"kibana":return"Utilisez ces identifiants pour connecter une instance de Kibana à votre cluster Elasticsearch.";case"pulsar":return"Utilisez ces informations pour vous connecter à votre add-on Pulsar.";case"materia-kv":return"Utilisez ces informations pour vous connecter à votre add-on Materia KV.";default:return""}}_getFieldName(e){switch(e){case"auth-token":return"Token";case"host":return"Hôte";case"password":return"Mot de passe";case"url":return"URL";case"user":return"Utilisateur";case"port":return"Port";default:return""}}render(){return r`
      <cc-block image=${i(this.image??void 0)} state=${this.toggleState}>
        <div slot="title">${(({name:e})=>`Identifiants ${e}`)({name:this.name})}</div>

        ${this.error?"":r`
          <div>${this._getDescription(this.type)}</div>

          ${null!=this.credentials?r`
            <div class="credential-list">
              ${this.credentials.map((({type:e,secret:t,value:s})=>r`
                <cc-input-text readonly clipboard
                  ?secret=${t}
                  ?skeleton=${null==s}
                  value=${i(s)}
                  label=${this._getFieldName(e)}
                ></cc-input-text>
              `))}
            </div>
          `:""}
        `}

        ${this.error?r`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations de connexion."}"></cc-notice>
        `:""}
      </cc-block>
    `}static get styles(){return[e,s`
        :host {
          display: block;
        }

        .credential-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);

          flex: 1 1 18em;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-addon-credentials",n);export{n as CcAddonCredentials};
