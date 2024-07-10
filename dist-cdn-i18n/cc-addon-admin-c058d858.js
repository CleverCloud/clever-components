import"./cc-input-text-8d29ec56.js";import"./cc-loader-c9072fed.js";import"./cc-block-section-3a3736ca.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{d as t}from"./events-4c8e3503.js";import{s as e,x as n,i}from"./lit-element-98ed46d4.js";class s extends e{static get properties(){return{noDangerZoneBackupText:{type:Boolean,attribute:"no-danger-zone-backup-text"},noDangerZoneVmText:{type:Boolean,attribute:"no-danger-zone-vm-text"},state:{type:Object},_name:{type:String,state:!0},_tags:{type:Array,state:!0}}}constructor(){super(),this.noDangerZoneBackupText=!1,this.noDangerZoneVmText=!1,this.state={type:"loading"},this._name=null,this._tags=null}_onDeleteSubmit(){t(this,"delete-addon")}_onNameInput({detail:t}){this._name=t}_onNameSubmit(){t(this,"update-name",{name:this._name})}_onTagsInput({detail:t}){this._tags=t}_onTagsSubmit(){t(this,"update-tags",{tags:this._tags})}willUpdate(t){t.has("state")&&"name"in this.state&&(this._name=this.state.name),t.has("state")&&"tags"in this.state&&(this._tags=this.state.tags)}render(){return n`
      <cc-block>
        <div slot="title">${"Administration de l'add-on"}</div>

        ${"error"===this.state.type?n`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations de l'add-on."}"></cc-notice>
        `:""}

        ${"error"!==this.state.type?this._renderContent(this.state):""}
      </cc-block>
    `}_renderContent(t){const e="loading"===t.type,i="updatingTags"===t.type||"updatingName"===t.type||"deleting"===t.type,s="loading"===t.type||i,a=!this.noDangerZoneBackupText,o=!this.noDangerZoneVmText;return n`
      <cc-block-section>
        <div slot="title">${"Nom"}</div>
        <div slot="info"></div>
        <div class="one-line-form">
          <cc-input-text
            label="${"Nom de l'add-on"}"
            ?skeleton=${e}
            ?disabled=${s}
            .value=${this._name}
            @cc-input-text:input=${this._onNameInput}
            @cc-input-text:requestimplicitsubmit=${this._onNameSubmit}
          ></cc-input-text>
          <cc-button 
            primary 
            ?skeleton=${e} 
            ?disabled=${s} 
            ?waiting=${"updatingName"===t.type}
            @cc-button:click=${this._onNameSubmit}
          >${"Mettre à jour le nom"}</cc-button>
        </div>
      </cc-block-section>

      <cc-block-section>
        <div slot="title">${"Tags"}</div>
        <div slot="info">${"Les tags vous permettent de classer vos applications et add-ons afin de les catégoriser"}</div>
        <div class="one-line-form">
          <cc-input-text
            label="${"Tags de l'add-on"}"
            ?skeleton=${e}
            ?disabled=${s}
            .tags=${this._tags}
            placeholder="${"Pas de tags définis"}"
            @cc-input-text:tags=${this._onTagsInput}
            @cc-input-text:requestimplicitsubmit=${this._onTagsSubmit}
          ></cc-input-text>
          <cc-button 
            primary
            ?skeleton=${e}
            ?disabled=${s}
            ?waiting=${"updatingTags"===t.type}
            @cc-button:click=${this._onTagsSubmit}
          >${"Mettre à jour les tags"}</cc-button>
        </div>
      </cc-block-section>

      <cc-block-section>
        <div slot="title" class="danger">${"Zone de danger"}</div>
        <div slot="info" class="danger-desc">
          <p>${"Supprimer cet add-on le rend immédiatement indisponible."}</p>
          ${o?n`<p>${"La machine virtuelle sera arrêtée sous 24 heures."}</p>`:""}
          ${a?n`<p>${"Les sauvegardes sont gardées suivant la politique de rétention."}</p>`:""}
        </div>
        <div>
          <cc-button
            danger 
            ?skeleton=${e} 
            ?disabled=${s} 
            ?waiting=${"deleting"===t.type}
            @cc-button:click=${this._onDeleteSubmit}
          >${"Supprimer l'add-on"}</cc-button>
        </div>
      </cc-block-section>
      `}static get styles(){return[i`
        :host {
          display: block;
        }

        .one-line-form {
          display: flex;
        }

        .one-line-form cc-input-text {
          flex: 1 1 10em;
          margin-right: 0.5em;
        }

        .one-line-form cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        .danger-desc p {
          margin: 0;
        }
      `]}}window.customElements.define("cc-addon-admin",s);export{s as CcAddonAdmin};
