import{s as e}from"./i18n-sanitize-4edc4a2d.js";import{a as s,b as t}from"./cc-clever.icons-e2a98bd6.js";import{h as i,f as a,r}from"./cc-remix.icons-d7d44eac.js";import{L as o}from"./lost-focus-controller-f4703b9a.js";import{d as n}from"./events-4c8e3503.js";import{f as d}from"./fake-strings-b70817e4.js";import{f as c,a as l}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{f as m}from"./form-submit-directive-8fcbc4fa.js";import{s as p}from"./utils-aa566623.js";import{s as u}from"./skeleton-68a3d018.js";import"./cc-badge-e1a0f4b6.js";import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import{s as f,x as b,i as g}from"./lit-element-98ed46d4.js";import{e as h,n as $}from"./ref-948c5e44.js";import{o as v}from"./class-map-1feb5cf7.js";class y{constructor(e,s,t){this._host=e,this._host.addController(this),this._formRef=s,this._getErrors=t}hostUpdated(){const e=this._getErrors();null!=e&&Object.values(e).some((e=>null!=e))&&this._host.updateComplete.then((()=>{c(this._formRef.value)}))}}const _={state:"idle",address:d(35),verified:!1},j=[];class k extends f{static get properties(){return{addEmailFormState:{type:Object,attribute:!1},emails:{type:Object}}}constructor(){super(),this.addEmailFormState={type:"idle"},this.emails={state:"loading"},this._addressInputRef=h(),this._formRef=h(),new o(this,".secondary",(({suggestedElement:e})=>{l(e,".delete-button",(()=>{this._addressInputRef.value.focus()}))})),new y(this,this._formRef,(()=>this.addEmailFormState.errors))}resetAddEmailForm(){this._formRef.value?.reset()}_getVerifiedTagLabel(e){return b`<span>${e?"Vérifiée":"Non vérifiée"}</span>`}_onSendConfirmationEmail(){"loaded"===this.emails.state&&n(this,"send-confirmation-email",this.emails.value.primaryAddress.address)}_onDelete(e){n(this,"delete",e)}_onMarkAsPrimary(e){n(this,"mark-as-primary",e)}_onAddFormSubmit(e){this.addEmailFormState={...this.addEmailFormState,errors:null},n(this,"add",e.address)}_getErrorMessage(s){switch(s){case"invalid":return e`Format d'adresse e-mail invalide.<br>Exemple: john.doe@example.com.`;case"already-defined":return"Cette adresse e-mail vous appartient déjà";case"used":return"Cette adresse e-mail ne vous appartient pas"}}render(){return b`
      <cc-block>
        <div slot="title">${"Adresses e-mail"}</div>

        ${"loading"===this.emails.state?b`
          ${this._renderPrimarySection(_,!0)}
          ${this._renderSecondarySection(j)}
        `:""}

        ${"loaded"===this.emails.state?b`
          ${this._renderPrimarySection(this.emails.value.primaryAddress)}
          ${this._renderSecondarySection(this.emails.value.secondaryAddresses)}
        `:""}

        ${"error"===this.emails.state?b`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des adresses e-mail."}"></cc-notice>
        `:""}
      </cc-block>
    `}_renderPrimarySection(e,t=!1){const r=e.address,o=e.verified,n=!t&&!o,d=o?"success":"danger",c=o?i:a;return b`
      <cc-block-section>
        <div slot="title">${"Adresse e-mail principale"}</div>
        <div slot="info">${"Cette adresse est celle utilisée pour la création de votre compte. Toutes les notifications sont envoyées à cette adresse."}</div>

        <div class="address-line primary">
          <div class="address">
            <cc-icon class="icon--auto" .icon=${s} size="lg"></cc-icon>
            <span class="${v({skeleton:t})}">${r}</span>
          </div>
          <cc-badge
            intent="${d}"
            weight="outlined"
            ?skeleton="${t}"
            .icon="${c}"
          >${this._getVerifiedTagLabel(e.verified)}
          </cc-badge>
        </div>
        ${n?b`
          <cc-button
            @cc-button:click=${this._onSendConfirmationEmail}
            ?waiting=${"sending-confirmation-email"===e.state}
            link
          >
            ${"Envoyer un nouvel e-mail de confirmation"}
          </cc-button>
        `:""}
      </cc-block-section>
    `}_renderSecondarySection(e){const s=[...e].sort(p("address")),i=s.some((e=>"marking-as-primary"===e.state));return b`
      <cc-block-section>
        <div slot="title">${"Adresses e-mail secondaires"}</div>
        <div slot="info">${"Contrairement à l'adresse principale, ces adresses e-mail ne reçoivent aucune notification. Vous pouvez également être invité dans une organisation avec l'une de vos adresses e-mail secondaires."}</div>

        <ul class="secondary-addresses">
          ${s.map((e=>{const s="marking-as-primary"===e.state||"deleting"===e.state;return b`
              <li class="address-line secondary">
                <div class="address ${v({loading:s})}">
                  <cc-icon class="icon--auto" .icon=${t} size="lg"></cc-icon>
                  <span>${e.address}</span>
                </div>
                <div class="buttons">
                  <cc-button
                    @cc-button:click=${()=>this._onMarkAsPrimary(e.address)}
                    ?waiting="${"marking-as-primary"===e.state}"
                    ?disabled="${i||s}"
                    a11y-name="${(({address:e})=>`Définir comme primaire - ${e}`)({address:e.address})}"
                  >
                    ${"Définir comme primaire"}
                  </cc-button>
                  <cc-button
                    class="delete-button"
                    danger
                    outlined
                    .icon=${r}
                    @cc-button:click=${()=>this._onDelete(e.address)}
                    ?waiting="${"deleting"===e.state}"
                    ?disabled="${s}"
                    a11y-name="${(({address:e})=>`Supprimer - ${e}`)({address:e.address})}"
                  >
                    ${"Supprimer"}
                  </cc-button>
                </div>
              </li>
            `}))}
        </ul>

        ${this._renderAddEmailForm()}
      </cc-block-section>
    `}_renderAddEmailForm(){const e="adding"===this.addEmailFormState.type;return b`
      <form ${$(this._formRef)} ${m(this._onAddFormSubmit.bind(this))}>
        <cc-input-text
          label="${"Adresse e-mail"}"
          name="address"
          type="email"
          required
          ?disabled=${e}
          .errorMessage=${this._getErrorMessage(this.addEmailFormState.errors?.email)}
          ${$(this._addressInputRef)}
        >
          <p slot="help">
            ${"nom@example.com"}
          </p>
        </cc-input-text>
        <cc-button
          primary
          ?waiting=${e}
          type="submit"
        >
          ${"Ajouter l'adresse"}
        </cc-button>
      </form>
    `}static get styles(){return[u,g`
        :host {
          display: block;
        }

        .secondary-addresses {
          padding: 0;
          margin: 0;
        }

        /* region address-line */

        .address-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        .address-line.secondary {
          margin-bottom: 0.8em;
        }

        .address {
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .address.loading {
          opacity: var(--cc-opacity-when-disabled);
        }

        .address-line.secondary .address {
          flex: 1 1 0;
        }

        .address span {
          word-break: break-all;
        }

        .address-line.secondary .address span {
          min-width: 15em;
        }

        /* endregion */

        .buttons {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1em;
        }

        /* region FORM */

        form {
          display: flex;
          flex-wrap: wrap;
          align-items: start;
          justify-content: flex-end;
          gap: 0 1em;
        }

        form > cc-input-text {
          flex: 1 1 19em;
        }

        form > cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }

        /* endregion */

        .skeleton {
          background-color: #bbb;
          color: transparent !important;
        }

        .icon--auto {
          flex: auto 0 0;
        }
      `]}}window.customElements.define("cc-email-list",k);export{k as CcEmailList};
