import{s as e}from"./i18n-sanitize-4edc4a2d.js";import{L as t}from"./lost-focus-controller-f4703b9a.js";import{d as i}from"./events-4c8e3503.js";import{f as s}from"./form-submit-directive-8fcbc4fa.js";import{V as r}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{l as a}from"./cc-link-f2b8f554.js";import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import{CcOrgaMemberCard as n}from"./cc-orga-member-card-1d101b76.js";import"./cc-notice-9b1eec7a.js";import"./cc-input-text-8d29ec56.js";import"./cc-loader-c9072fed.js";import"./cc-button-fafeef50.js";import"./cc-badge-e1a0f4b6.js";import"./cc-select-9160eb0c.js";import{s as o,x as m,i as l}from"./lit-element-98ed46d4.js";import{e as c,n as d}from"./ref-948c5e44.js";import{c as b}from"./repeat-92fcb4ec.js";import{o as u}from"./class-map-1feb5cf7.js";class h extends o{static get properties(){return{authorisations:{type:Object},inviteMemberFormState:{type:Object,attribute:!1},members:{type:Object}}}static get INIT_AUTHORISATIONS(){return{invite:!1,edit:!1,delete:!1}}constructor(){super(),this.authorisations=h.INIT_AUTHORISATIONS,this.inviteMemberFormState={type:"idle"},this.members={state:"loading"},this._inviteMemberFormRef=c(),this._memberListHeadingRef=c(),this._noResultMessageRef=c(),new t(this,"cc-orga-member-card",(({suggestedElement:e})=>{null==e&&null!=this._noResultMessageRef.value?this._noResultMessageRef.value.focus():null==e?this._memberListHeadingRef.value.focus():e instanceof n&&e.focusDeleteBtn()})),this._memberEmailValidator={validate:(e,t)=>("loaded"===this.members.state?this.members.value.map((e=>e.email)):[]).includes(e)?r.invalid("duplicate"):r.VALID},this._memberEmailErrorMessages={duplicate:"Cet utilisateur fait déjà partie des membres de votre organisation."}}resetInviteMemberForm(){this._inviteMemberFormRef.value?.reset()}isLastAdmin(e){const t="ADMIN"===e.role;return 1===this._getAdminList().length&&t}_getAdminList(){return"loaded"===this.members.state?this.members.value.filter((e=>"ADMIN"===e.role)):[]}_getRoleOptions(){return[{value:"ADMIN",label:"Admin"},{value:"DEVELOPER",label:"Développeur"},{value:"ACCOUNTING",label:"Comptable"},{value:"MANAGER",label:"Manager"}]}_getSortedFilteredMemberList(e,t,i){const s=t?.trim().toLowerCase();return e.filter((e=>{const t=""===s||e.name?.toLowerCase().includes(s)||e.email.toLowerCase().includes(s),r=!i||!e.isMfaEnabled;return t&&r})).sort(((e,t)=>e.isCurrentUser?-1:t.isCurrentUser?1:e.email.localeCompare(t.email,[],{sensitivity:"base"})))}_onFilterIdentity({detail:e}){"loaded"===this.members.state&&(this.members={...this.members,identityFilter:e})}_onFilterMfaDisabledOnly(){"loaded"===this.members.state&&(this.members={...this.members,mfaDisabledOnlyFilter:!this.members.mfaDisabledOnlyFilter})}_onInviteMember(e){"string"==typeof e.email&&"string"==typeof e.role&&i(this,"invite",{email:e.email,role:e.role})}_onLeaveFromCard({detail:e}){"loaded"===this.members.state&&this.isLastAdmin(e)?this.members={...this.members,value:this.members.value.map((t=>t.id===e.id?{...t,error:!0}:{...t}))}:i(this,"leave",e)}_onLeaveFromDangerZone(){if("loaded"===this.members.state){const e=this.members.value.find((e=>e.isCurrentUser));this.isLastAdmin(e)?this.members={...this.members,dangerZoneState:"error"}:i(this,"leave",e)}}_onUpdateFromCard({detail:e}){const t=e.isCurrentUser&&this.isLastAdmin(e);"loaded"===this.members.state&&t?this.members={...this.members,value:this.members.value.map((t=>t.id===e.id?{...t,error:!0}:{...t}))}:i(this,"update",e)}_onToggleCardEditing({detail:{memberId:e,newState:t}}){"loaded"===this.members.state&&(this.members={...this.members,value:this.members.value.map((i=>i.id===e?{...i,state:t}:{...i,state:"loaded"}))})}willUpdate(e){if(!e.has("members")||"loaded"!==this.members.state)return;const t=this._getAdminList(),i="error"===this.members.dangerZoneState;t.length>1&&(this.members={...this.members,value:this.members.value.map((e=>({...e,error:!1})))}),t.length>1&&i&&(this.members={...this.members,dangerZoneState:"idle"})}render(){return m`

      <cc-block>
        <div slot="title">${"Gestion des membres de l'organisation"}</div>
        
        ${this.authorisations.invite?this._renderInviteForm():""}
        
        <cc-block-section>
          <div slot="title" ${d(this._memberListHeadingRef)} tabindex="-1">
            ${"Membres"}
            ${"loaded"===this.members.state?m`
              <cc-badge class="member-count" weight="dimmed" intent="neutral" circle>${this.members.value.length}</cc-badge>
            `:""}
          </div>
  
          ${"loading"===this.members.state?m`
            <cc-loader></cc-loader>
          `:""}
  
          ${"loaded"===this.members.state?this._renderMemberList(this.members.value,this.members.identityFilter,this.members.mfaDisabledOnlyFilter):""}
  
          ${"error"===this.members.state?m`
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement de la liste des membres."}"></cc-notice>
          `:""}
        </cc-block-section>
        
        ${"loaded"===this.members.state?this._renderDangerZone(this.members):""}
      </cc-block>
    `}_renderInviteForm(){const t="inviting"===this.inviteMemberFormState.type;return m`
      <cc-block-section>
        <div slot="title">${"Inviter un membre"}</div>
        <p class="info">${e`Plus d'informations à propos des rôles sur la page <a href="https://www.clever-cloud.com/doc/account/organizations/#roles-and-privileges">Rôles et organisations (en anglais)</a>`}</p>
        
        <form class="invite-form" ${d(this._inviteMemberFormRef)} ${s(this._onInviteMember.bind(this))}>
          <cc-input-text
            name="email"
            label=${"Adresse e-mail"}
            required
            type="email"
            .customValidator=${this._memberEmailValidator}
            .customErrorMessages=${this._memberEmailErrorMessages}
            ?disabled=${t}
          >
            <p slot="help">${"nom@example.com"}</p>
          </cc-input-text>

          <cc-select
            name="role"
            label=${"Rôle"}
            .options=${this._getRoleOptions()}
            reset-value="DEVELOPER"
            value="DEVELOPER"
            required
            ?disabled=${t}
          >
          </cc-select>

          <div class="submit">
            <cc-button primary ?waiting=${t} type="submit">
              ${"Inviter"}
            </cc-button>
          </div>
        </form>
      </cc-block-section>
    `}_renderMemberList(e,t,i){const s=this._getSortedFilteredMemberList(e,t,i),r=0===s.length;return m`
      <div class="filters">
        <cc-input-text
          label=${"Filtrer par nom ou adresse e-mail"}
          .value=${t}
          @cc-input-text:input=${this._onFilterIdentity}
        ></cc-input-text>
        <label class="filters__mfa" for="filter-mfa">
          <input id="filter-mfa" type="checkbox" @change=${this._onFilterMfaDisabledOnly} .checked=${i}>
          ${"Comptes non sécurisés par 2FA"}
        </label>
      </div>

      <div class="member-list">
        ${b(s,(e=>e.id),(e=>m`
          <cc-orga-member-card
            class=${u({editing:"editing"===e.state})}
            .authorisations=${{edit:this.authorisations.edit,delete:this.authorisations.delete}}
            .member=${e}
            @cc-orga-member-card:leave=${this._onLeaveFromCard}
            @cc-orga-member-card:toggle-editing=${this._onToggleCardEditing}
            @cc-orga-member-card:update=${this._onUpdateFromCard}
          ></cc-orga-member-card>
        `))}

        ${r?m`
          <p class="no-result-error" ${d(this._noResultMessageRef)} tabindex="-1">
            ${"Aucun résultat ne correspond à vos critères de recherche."}
          </p>
        `:""}
      </div>
    `}_renderDangerZone(t){return m`
      <cc-block-section>
        <div slot="title" class="danger">${"Zone de danger"}</div>
        <div class="leave">
          <p class="leave__text">
            ${e`
    <p>Le départ d'une organisation ne nécessite pas de confirmation.</p>
    <p>Si vous changez d'avis après avoir quitté l'organisation, vous devrez demander à quelqu'un de vous y inviter à nouveau.</p>
  `}
          </p>
          <cc-button
              danger
              outlined
              @cc-button:click=${this._onLeaveFromDangerZone}
              ?disabled="${"error"===t.dangerZoneState}"
              ?waiting="${"leaving"===t.dangerZoneState}"
          >${"Quitter l'organisation"}</cc-button>
        </div>
        <!-- a11y: we need the live region to be present within the DOM from the start and insert content dynamically inside it. -->
        <div class="wrapper-leave-error" aria-live="polite" aria-atomic="true">
          ${"error"===t.dangerZoneState?m`
            <div>
                <cc-notice
                  intent="danger"
                  heading="${"Vous êtes le dernier admin de l'organisation"}"
                  message="${"Veuillez désigner un nouvel admin avant de pouvoir quitter l'organisation."}"
                  no-icon
                ></cc-notice>
            </div>
          `:""}
        </div>
      </cc-block-section>
    `}static get styles(){return[a,l`
        :host {
          display: block;
        }

        /* region invite form */

        .invite-form {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          gap: 1em 1.5em;
        }

        .info {
          margin: 0.5em 0;
          font-style: italic;
        }

        /* 100 is a weird value but this makes the input grow as much as possible 
        without pushing the select to a new line until the input width reaches 18em */

        .invite-form cc-input-text {
          flex: 100 1 18em;
        }

        .invite-form cc-select {
          flex: 1 1 max-content;
        }

        .submit {
          display: flex;
          width: 100%;
          justify-content: flex-end;
        }
        /* endregion */

        /* region member list  */

        .member-count {
          margin-left: 0.2em;
          font-size: 0.9em;
        }

        .member-list {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 1em;
          gap: 1em 2.5em;
        }

        .filters cc-input-text {
          flex: 0 1 25em;
        }
        
        .filters__mfa {
          display: flex;
          align-items: center;
          gap: 0.35em;
        }

        .filters__mfa input {
          width: 1.1em;
          height: 1.1em;
          margin: 0;
        }
        
        .no-result-error {
          font-style: italic;
        }

        cc-orga-member-card.editing {
          background-color: var(--cc-color-bg-neutral);
          /* box-shadow is used to make the background spread full width (cancel the parent padding) */
          box-shadow: 0 0 0 1em var(--cc-color-bg-neutral);
        }
        /* endregion */
        
        /* region leave section */

        .leave {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5em;
        }

        .leave p {
          margin: 0;
        }
        
        .leave__text {
          display: flex;
          flex: 1 1 21em;
          flex-direction: column;
          gap: 0.5em;
        }
        
        .leave cc-button {
          margin-left: auto;
        }

        .wrapper-leave-error {
          display: flex;
          justify-content: end;
        }
        /* endregion */
      `]}}window.customElements.define("cc-orga-member-list",h);export{h as CcOrgaMemberList};
