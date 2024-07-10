import{V as e,W as t,Q as i,X as a,Y as s,Z as r}from"./cc-remix.icons-d7d44eac.js";import{R as n}from"./resize-controller-3aadf1c4.js";import{d as o}from"./events-4c8e3503.js";import"./cc-button-fafeef50.js";import"./cc-img-8b44c495.js";import"./cc-icon-f84255c7.js";import"./cc-badge-e1a0f4b6.js";import"./cc-notice-9b1eec7a.js";import"./cc-select-9160eb0c.js";import"./cc-stretch-e0e0d588.js";import{s as c,x as l,i as m}from"./lit-element-98ed46d4.js";import{e as d,n as h}from"./ref-948c5e44.js";import{o as p}from"./class-map-1feb5cf7.js";import{l as b}from"./if-defined-cd9b1ec0.js";const g=[350,580,740];class u extends c{static get properties(){return{authorisations:{type:Object},member:{type:Object},_newRole:{type:String,state:!0}}}constructor(){super(),this.authorisations={edit:!1,delete:!1},this.member={state:"loaded",id:"",email:"",role:"DEVELOPER",isMfaEnabled:!1,isCurrentUser:!1},this._deleteButtonRef=d(),this._newRole=null,this._roleRef=d(),this._resizeController=new n(this,{widthBreakpoints:g})}focusDeleteBtn(){this._deleteButtonRef.value.focus()}_getFirstBtnAccessibleName(){const e=this.member.name??this.member.email;return"editing"===this.member.state||"updating"===this.member.state?(({memberIdentity:e})=>`Annuler la modification du membre - ${e}`)({memberIdentity:e}):(({memberIdentity:e})=>`Modifier le membre - ${e}`)({memberIdentity:e})}_getSecondBtnAccessibleName(){const e=this.member.name??this.member.email;return"editing"===this.member.state||"updating"===this.member.state?(({memberIdentity:e})=>`Valider la modification du membre - ${e}`)({memberIdentity:e}):this.member.isCurrentUser?"Quitter l'organisation":(({memberIdentity:e})=>`Supprimer le membre - ${e}`)({memberIdentity:e})}_getRoleOptions(){return[{value:"ADMIN",label:"Admin"},{value:"DEVELOPER",label:"Développeur"},{value:"ACCOUNTING",label:"Comptable"},{value:"MANAGER",label:"Manager"}]}_getSecondBtnVisibleElementId(e){return e?"btn-content-validate":this.member.isCurrentUser?"btn-content-leave":"btn-content-delete"}_onDeleteMember(){const e=this.member.isCurrentUser?"leave":"delete";o(this,e,this.member)}_onRoleInput({detail:e}){this._newRole=e}async _onToggleEdit(){const e="loaded"===this.member.state?"editing":"loaded";this.member={...this.member,state:e},this._newRole=this.member.role,o(this,"toggle-editing",{memberId:this.member.id,newState:e}),"editing"===e&&(await this.updateComplete,this._roleRef.value.focus())}_onUpdateMember(){this._newRole!==this.member.role?o(this,"update",{...this.member,newRole:this._newRole}):this._onToggleEdit()}render(){const t="updating"===this.member.state||"deleting"===this.member.state,i=null!=this.member.name,a=this.member.error,s=this.authorisations.edit&&this.authorisations.delete;return l`
      <div class="wrapper ${p({"has-actions":s,"has-error":a})}">
        ${null==this.member.avatar?l`
          <cc-icon class="avatar ${p({waiting:t})}" .icon=${e}></cc-icon>
        `:l`
          <cc-img class="avatar ${p({waiting:t})}" src=${this.member.avatar}></cc-img>
        `}
        <div
            class="identity ${p({waiting:t})}"
            title="${b(this.member.jobTitle??void 0)}"
        >
          ${i||this.member.isCurrentUser?l`
            <p class="name">
              ${i?l`<strong>${this.member.name}</strong>`:""}
              ${this.member.isCurrentUser?l`
                <cc-badge>${"Votre compte"}</cc-badge>
              `:""}
            </p>
          `:""}
          <p class="email">${this.member.email}</p>
        </div>

        ${this._renderStatusArea()}

        ${s?this._renderActionBtns():""}

        <!-- 
          a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it.
          We have to add a conditional class to the wrapper when it does not contain any message to cancel the gap applied automatically within the grid. 
         -->
        <div class="error-wrapper ${p({"out-of-flow":!a})}" aria-live="polite" aria-atomic="true">
          ${a?l`
              <cc-notice 
                intent="danger" 
                heading="${"Vous êtes le dernier admin de l'organisation"}"
                message="${"Veuillez désigner un nouvel admin avant de pouvoir modifier votre rôle ou quitter l'organisation."}"
                no-icon>
                </cc-notice>
          `:""}
        </div>
      </div>
    `}_renderStatusArea(){const e="editing"===this.member.state||"updating"===this.member.state,a="updating"===this.member.state||"deleting"===this.member.state;return l`
      <cc-stretch
        class="status ${p({waiting:a})}"
        visible-element-id=${e?"status-editing":"status-readonly"}
      >
        <div id="status-readonly" class="status__role-mfa">
          <cc-stretch
            visible-element-id=${this.member.role}
          >
            ${this._getRoleOptions().map((e=>l`
              <cc-badge id="${e.value}" intent="info" weight="dimmed">${e.label}</cc-badge>
            `))}
          </cc-stretch>

          <cc-stretch
            visible-element-id=${this.member.isMfaEnabled?"badge-mfa-enabled":"badge-mfa-disabled"}
          >
            <cc-badge id="badge-mfa-enabled" intent="success" weight="outlined" .icon="${t}">
              ${"2FA activée"}
            </cc-badge>
            <cc-badge id="badge-mfa-disabled" intent="danger" weight="outlined" .icon="${i}">
              ${"2FA désactivée"}
            </cc-badge>
          </cc-stretch>
        </div>

        <cc-select
          id="status-editing"
          label="${"Rôle"}"
          .options=${this._getRoleOptions()}
          .value=${this._newRole??this.member.role}
          ?inline=${this._resizeController.width>350}
          ?disabled=${"updating"===this.member.state}
          @cc-select:input=${this._onRoleInput}
          ${h(this._roleRef)}
        >
        </cc-select>
      </cc-stretch>
    `}_renderActionBtns(){const e=this._resizeController.width>=740,i="updating"===this.member.state||"deleting"===this.member.state,n="editing"===this.member.state||"updating"===this.member.state,o=this.member.error,c=n?t:r;return l`
      
      <div class="actions">
        <cc-button
          ?primary=${!n}
          outlined
          .icon=${n?a:s}
          ?circle=${e}
          ?disabled=${i}
          ?hide-text=${e}
          a11y-name=${this._getFirstBtnAccessibleName()}
          @cc-button:click=${this._onToggleEdit}
        >
          <cc-stretch visible-element-id=${n?"btn-content-cancel":"btn-content-edit"}>
            <span id="btn-content-edit">${"Modifier"}</span>
            <span id="btn-content-cancel">${"Annuler"}</span>
          </cc-stretch>
        </cc-button>
        
        <cc-button
          ?danger=${!n}
          ?primary=${n}
          outlined
          .icon=${c}
          ?disabled=${o}
          ?circle=${e}
          ?hide-text=${e}
          ?waiting=${i}
          a11y-name=${this._getSecondBtnAccessibleName()}
          @cc-button:click=${n?this._onUpdateMember:this._onDeleteMember}
          ${h(this._deleteButtonRef)}
        >
          <cc-stretch visible-element-id=${this._getSecondBtnVisibleElementId(n)}>
            <span id="btn-content-leave">${"Quitter"}</span>
            <span id="btn-content-delete">${"Supprimer"}</span>
            <span id="btn-content-validate">${"Valider"}</span>
          </cc-stretch>
        </cc-button>
      </div>
    `}static get styles(){return[m`
        /* region big (>= 740) & global */

        :host {
          display: block;
        }

        .wrapper {
          display: grid;
          align-items: center;
          gap: 0.8em 1em;
        }

        :host([w-gte-740]) .wrapper {
          grid-template-areas: 'avatar identity status';
          grid-template-columns: max-content 1fr max-content;
        }

        :host([w-gte-740]) .wrapper.has-actions {
          grid-template-areas: 'avatar identity status actions';
          grid-template-columns: max-content 1fr max-content max-content;
        }

        :host([w-gte-740]) .wrapper.has-actions.has-error {
          grid-template-areas: 
            'avatar identity status actions'
            '. error error error';
        }

        :host(.editing) .actions cc-button {
          --cc-icon-size: 1.4em;
        }

        p {
          margin: 0;
        }

        .avatar {
          --cc-icon-color: #595959;

          width: 3em;
          height: 3em;
          clip-path: circle(50% at 50% 50%);
          grid-area: avatar;
        }

        .identity {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
          grid-area: identity;
          /* makes the email address wrap if needed */
          word-break: break-all;
        }
        
        .name {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .status {
          grid-area: status;
        }
        
        .status cc-badge {
          width: 100%;
          white-space: nowrap;
        }

        .actions {
          display: flex;
          min-width: 4em;
          justify-content: space-evenly;
          gap: 0.5em;
          grid-area: actions;
        }

        .status__role-mfa {
          display: flex;
          align-items: center;
          gap: 0.5em 1em;
        }

        .error-wrapper {
          display: flex;
          justify-content: end;
          /* always leave the first column containing only the avatar. */
          grid-area: error;
        }

        /* This is to cancel the grid gap when there is no error message. */

        .error-wrapper.out-of-flow {
          grid-area: avatar;
        }

        .waiting {
          opacity: var(--cc-opacity-when-disabled, 0.65);
        }
        /* endregion */

        /* region medium (< 740) */

        :host([w-lt-740]) .wrapper {
          grid-template-areas: 'avatar identity status';
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-740]) .wrapper.has-actions {
          grid-template-areas: 
            'avatar identity status'
            '. . actions';
        }

        :host([w-lt-740]) .wrapper.has-actions.has-error {
          grid-template-areas:
            'avatar identity status'
            '. . actions'
            '. error error';
        }

        :host([w-lt-740]) .status,
        :host([w-lt-740]) .actions {
          justify-self: end;
        }

        :host([w-lt-740]) .error {
          margin-top: 0.5em;
        }
        /* endregion */

        /* region small (< 580) */

        :host([w-lt-580]) .wrapper {
          grid-template-areas:
            'avatar identity'
            '. status';
          grid-template-columns: max-content 1fr;
        }

        :host([w-lt-580]) .wrapper.has-actions {
          grid-template-areas:
            'avatar identity'
            '. status'
            '. actions';
        }

        :host([w-lt-580]) .wrapper.has-actions.has-error {
          grid-template-areas:
            'avatar identity'
            '. status'
            '. actions'
            '. error';
        }
        
        :host([w-lt-580]) .status {
          justify-self: start;
        }

        :host([w-lt-580]) .actions {
          justify-self: start;
        }
        /* endregion */

        /* region tiny (< 350) */

        :host([w-lt-350]) .status,
        :host([w-lt-350]) cc-select {
          width: 100%;
        }

        :host([w-lt-350]) .actions {
          flex-direction: column;
          justify-self: stretch;
        }

        :host([w-lt-350]) .status__role-mfa {
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
        }
        /* endregion */
      `]}}window.customElements.define("cc-orga-member-card",u);export{u as CcOrgaMemberCard};
