import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-button-fafeef50.js";import"./cc-badge-e1a0f4b6.js";import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import{a1 as t,Z as s,a2 as o}from"./cc-remix.icons-d7d44eac.js";import{L as i}from"./lost-focus-controller-f4703b9a.js";import{d as a}from"./events-4c8e3503.js";import{f as r}from"./fake-strings-b70817e4.js";import{a as c,V as n}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{f as l}from"./form-submit-directive-8fcbc4fa.js";import{s as d}from"./utils-aa566623.js";import{s as m}from"./skeleton-68a3d018.js";import{s as p,x as u,i as y}from"./lit-element-98ed46d4.js";import{e as b,n as k}from"./ref-948c5e44.js";import{c as g}from"./repeat-92fcb4ec.js";import{o as f}from"./class-map-1feb5cf7.js";const h=[{state:"idle",name:r(15),fingerprint:r(32)}];class v{validate(e,t){return e.toLowerCase().match(" private ")?n.invalid("private-key"):n.VALID}}class $ extends p{static get properties(){return{createKeyFormState:{type:Object,attribute:!1},keyData:{type:Object,attribute:"key-data"}}}constructor(){super(),this.createKeyFormState={type:"idle"},this.keyData={state:"loading"},this._createFormRef=b(),new i(this,".key--personal",(({suggestedElement:e})=>{c(this.shadowRoot,null==e?"#personal-keys-empty-msg":"cc-button")})),new i(this,".key--github",(({suggestedElement:e})=>{c(this.shadowRoot,null==e?"#github-keys-empty-msg":"cc-button")})),this._nameErrorMessages={empty:()=>"Veuillez saisir un nom pour votre clé SSH"},this._keyValidator=new v,this._keyErrorMessages={empty:()=>"Veuillez saisir la valeur de votre clé publique","private-key":()=>e`Format incorrect&nbsp;: avez-vous saisi votre clé privée au lieu de votre clé publique&nbsp;?`}}resetCreateKeyForm(){this._createFormRef.value?.reset()}_onCreateKey(e){if("string"==typeof e.name&&"string"==typeof e.publicKey){const t={name:e.name,publicKey:e.publicKey};a(this,"create",t)}}_onDeleteKey(e){const{state:t,...s}=e;a(this,"delete",s)}_onImportKey(e){const{state:t,...s}=e;a(this,"import",s)}render(){return u`
      <cc-block>
        <div slot="title">${"Clés SSH"}</div>

        <!-- creation form -->
        <cc-block-section>
          <div slot="title">${"Ajouter une nouvelle clé"}</div>
          <div slot="info">${e`<p>Vous devez associer une clé SSH à votre compte si vous désirez déployer via Git. Utilisez ce formulaire à cet effet.</p><p>Vous pouvez créer une clé SSH avec la commande suivante&nbsp;:</p><code>ssh-keygen -t ed25519 -C "my-email@example.com"</code><p>La clé publique générée est sauvegardée dans le fichier "*.pub".</p>`}</div>

          ${this._renderCreateSshKeyForm()}
        </cc-block-section>

        <!-- personal keys -->
        <cc-block-section>
          <div slot="title">
            <span>${"Vos clés"}</span>
            ${"loaded"===this.keyData.state&&this.keyData.personalKeys.length>2?u`
              <cc-badge circle>${this.keyData.personalKeys.length}</cc-badge>
            `:""}
          </div>
          <div slot="info">${e`<p>Voici la liste des clés SSH associées à votre compte.</p><p>Si vous souhaitez vérifier qu'une clé est déjà associée, vous pouvez lister les empreintes de vos clés locales avec la commande suivante&nbsp;:</p><code>ssh-add -l -E sha256</code>`}</div>

          ${"loading"===this.keyData.state?u`
            ${this._renderKeyList("skeleton",h)}
          `:""}

          ${"loaded"===this.keyData.state?u`
            ${0===this.keyData.personalKeys.length?u`
              <p class="info-msg" id="personal-keys-empty-msg" tabindex="-1">${"Il n'y a aucune clé SSH associée à votre compte."}</p>
            `:""}
            ${this._renderKeyList("personal",this.keyData.personalKeys)}
          `:""}

          ${"error"===this.keyData.state?u`
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement de vos clés."}"></cc-notice>
          `:""}
        </cc-block-section>

        <!-- GitHub keys -->
        <cc-block-section>
          <div slot="title">
            <span>${"Clés GitHub"}</span>
            ${"loaded"===this.keyData.state&&this.keyData.isGithubLinked&&this.keyData.githubKeys.length>2?u`
              <cc-badge circle>${this.keyData.githubKeys.length}</cc-badge>
            `:""}
          </div>
          <div slot="info">${e`<p>Voici les clés provenant de votre compte GitHub. Vous pouvez les importer pour les associer à votre compte Clever Cloud.</p>`}</div>

          ${"loading"===this.keyData.state?u`
            ${this._renderKeyList("skeleton",h)}
          `:""}

          ${"loaded"!==this.keyData.state||this.keyData.isGithubLinked?"":u`
            <p class="info-msg">${e`Il n'y a pas de compte GitHub lié à votre compte Clever Cloud. Vous pouvez lier vos comptes depuis votre <a href="./information">profil</a>`}</p>
          `}

          ${"loaded"===this.keyData.state&&this.keyData.isGithubLinked?u`
            ${0===this.keyData.githubKeys.length?u`
              <p class="info-msg" id="github-keys-empty-msg" tabindex="-1">${"Il n'y a aucune clé SSH disponible à l'import depuis votre compte GitHub."}</p>
            `:""}
            ${this._renderKeyList("github",this.keyData.githubKeys)}
          `:""}

          ${"error"===this.keyData.state?u`
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement de vos clés."}"></cc-notice>
          `:""}
        </cc-block-section>

        <!-- documentation link -->
        <cc-block-section>
          <div class="align-end">
            ${e`Pour plus d'aide, vous pouvez consulter notre <a href="https://www.clever-cloud.com/doc/admin-console/ssh-keys/">documentation (en anglais)</a>.`}
          </div>
        </cc-block-section>
      </cc-block>
    `}_renderCreateSshKeyForm(){const e="creating"===this.createKeyFormState.type;return u`
      <form class="create-form" ${k(this._createFormRef)} ${l(this._onCreateKey.bind(this))}>
        <cc-input-text
          name="name"
          ?disabled=${e}
          class="create-form__name"
          label=${"Nom"}
          required
          .customErrorMessages=${this._nameErrorMessages}
        >
        </cc-input-text>
        <cc-input-text
          name="publicKey"
          ?disabled=${e}
          class="create-form__public-key"
          label=${"Clé publique"}
          required
          .customErrorMessages=${this._keyErrorMessages}
          .customValidator=${this._keyValidator}
        >
        </cc-input-text>
        <div class="create-form__footer">
          <cc-button
            class="create-form__add-btn"
            primary
            type="submit"
            ?waiting=${e}
          >
            ${"Ajouter la clé"}
          </cc-button>
        </div>
      </form>
    `}_renderKeyList(e,i){const a=[...i].sort(d("name")),c="skeleton"===e;return u`
      <div class="key-list">

        ${g(a,(e=>e.name),(i=>{const a=i.name,n=!c&&"idle"!==i.state;return u`
            <div class="key ${f({"key--personal":"personal"===e,"key--github":"github"===e,"key--skeleton":c,"is-disabled":n})}">
              <div class="key__icon">
                <cc-icon .icon="${t}" size="lg" ?skeleton=${c}></cc-icon>
              </div>
              <div class="key__name">
                <span class=${f({skeleton:c})}>${a}</span>
              </div>
              <div class="key__form">
                <div class="key__fingerprint ${f({skeleton:c})}">${i.fingerprint}</div>

                ${"personal"===e?u`
                  <cc-button
                    @cc-button:click=${()=>this._onDeleteKey(i)}
                    a11y-name="${(({name:e})=>`Supprimer votre clé SSH personnelle - ${e}`)({name:a})}"
                    class="key__button key__button--personal"
                    .icon="${s}"
                    ?disabled=${n}
                    danger
                    outlined
                    ?waiting=${n}>
                    ${"Supprimer"}
                  </cc-button>
                `:""}

                ${"github"===e?u`
                  <cc-button
                    @cc-button:click=${()=>this._onImportKey(i)}
                    a11y-name="${(({name:e})=>`Importer la clé SSH GitHub - ${e}`)({name:a})}"
                    class="key__button key__button--github"
                    .icon="${o}"
                    ?disabled=${n}
                    ?waiting=${n}>
                    ${"Importer"}
                  </cc-button>
                `:""}

                ${"skeleton"===e?u`
                  <cc-button
                    class="key__button key__button--skeleton"
                    .icon="${o}"
                    skeleton
                  >
                    ${r(10)}
                  </cc-button>
                `:""}

              </div>
            </div>
          `}))}
      </div>
    `}static get styles(){return[m,y`
        /* region global */

        :host {
          --skeleton-color: #bbb;

          display: block;
        }
        /* endregion */

        /* region creation form */

        .create-form {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }
        
        .create-form__public-key {
          --cc-input-font-family: var(--cc-ff-monospace);
        }

        .create-form__footer {
          margin-inline-start: auto;
        }
        /* endregion */

        /* region key list */

        .key-list {
          display: flex;
          flex-direction: column;
          gap: 2.5em;
        }
        /* endregion */

        /* region key item */

        .key {
          display: grid;
          gap: 0.5em 0.75em;
          grid-template-areas: 
            'key-icon key-name'
            '. key-form';
          grid-template-columns: min-content 1fr;
        }

        .key.is-disabled {
          cursor: default;
          opacity: var(--cc-opacity-when-disabled);
        }

        .key__icon {
          grid-area: key-icon;
        }

        .key__name {
          align-self: flex-end;
          font-size: 1.125em;
          font-weight: bold;
          grid-area: key-name;
          word-break: break-word;
        }

        .key__form {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          gap: 1em;
          grid-area: key-form;
        }

        /* TODO tokenize border & border-color */

        .key__fingerprint {
          flex-basis: min(100%, 21.25em);
          flex-grow: 1;
          padding: 0.5em 0.75em;
          background-color: var(--cc-color-bg-neutral);
          border-inline-start: 5px solid #a6a6a6;
          border-radius: 0.125em;
          font-family: var(--cc-ff-monospace);
          line-height: 1.5;
          word-break: break-word;
        }

        .key__button--personal {
          --cc-icon-size: 18px;
        }

        .key__button--github {
          --cc-icon-size: 20px;
        }

        .key__button--skeleton {
          --cc-icon-size: 20px;
        }
        /* endregion */

        /* region misc */
        /* TODO tokenize border & border-color */

        [slot='info'] code {
          display: inline-block;
          padding: 0.25em 0.75em;
          border: 1px solid var(--cc-color-border-neutral-weak, #eee);
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          font-size: 0.9em;
          line-height: 2;
          white-space: pre-wrap;
          word-break: break-all;
        }

        .key--skeleton .skeleton {
          background-color: var(--skeleton-color);
        }

        .info-msg {
          margin-top: 1em;
          margin-bottom: 0;
          color: var(--cc-color-text-weak);
          font-style: italic;
          line-height: 1.5;
        }

        .align-end {
          text-align: end;
        }
        /* endregion */
      `]}}window.customElements.define("cc-ssh-key-list",$);export{$ as CcSshKeyList};
