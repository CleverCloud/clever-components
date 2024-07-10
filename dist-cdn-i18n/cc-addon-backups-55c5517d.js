import{f as e,a as t,b as s}from"./i18n-date-d99182e3.js";import{s as r}from"./i18n-sanitize-4edc4a2d.js";import"./cc-button-fafeef50.js";import"./cc-input-text-8d29ec56.js";import"./cc-block-section-3a3736ca.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{l as a,k as n}from"./cc-remix.icons-d7d44eac.js";import{f as o}from"./fake-strings-b70817e4.js";import{s as c}from"./skeleton-68a3d018.js";import{c as i,l as d}from"./cc-link-f2b8f554.js";import"./cc-icon-f84255c7.js";import{s as l,x as u,i as p}from"./lit-element-98ed46d4.js";import{o as v}from"./class-map-1feb5cf7.js";const m="fr",g={createdAt:new Date,expiresAt:new Date,url:"",deleteCommand:"skeleton"},h={providerId:"skeleton",backups:[g,g,g,g,g]};class b extends l{static get properties(){return{state:{type:Object},_overlayType:{type:String,state:!0},_selectedBackup:{type:Object,state:!0}}}constructor(){super(),this.state={type:"loading"},this._overlayTriggeringButton=null,this._overlayType=null,this._selectedBackup=null}_displaySectionWithService(e){return"es-addon"===e}_getBackupLink(e){switch(e){case"es-addon":return"ouvrir dans Kibana";case"es-addon-old":return"ouvrir dans Elasticsearch";case"postgresql-addon":case"mysql-addon":case"mongodb-addon":case"redis-addon":case"jenkins":return"télécharger";case"skeleton":return o(18)}}_getBackupText({createdAt:a,expiresAt:n}){return null!=n?(({createdAt:a,expiresAt:n})=>r`Sauvegarde du <strong title="${e(m,a)}">${t(m,a)}</strong> (expire le <strong>${s(m,n)}</strong>)`)({createdAt:a,expiresAt:n}):(({createdAt:s})=>r`Sauvegarde du <strong title="${e(m,s)}">${t(m,s)}</strong> (expire après la durée de rétention définie)`)({createdAt:a})}_getDescription(e){switch(e){case"es-addon":return"Les sauvegardes sont gérées par Elasticsearch lui-même. Vous pouvez définir la rétention ainsi que la périodicité des sauvegardes dans l'interface de Kibana.";case"es-addon-old":return"Les sauvegardes sont gérées par Elasticsearch lui-même. La version de votre Elasticsearch ne permet pas de définir de politique de rétention. La suppression d'une sauvegarde se fait manuellement avec l'API d'Elasticsearch.";case"postgresql-addon":return r`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://www.postgresql.org/docs/current/app-pgdump.html">pg_dump</a>.`;case"mysql-addon":return r`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html">mysqldump</a>.`;case"mongodb-addon":return r`Les sauvegardes sont réalisées en utilisant l'outil <a href="https://docs.mongodb.com/v4.0/reference/program/mongodump/">mongodump</a>.`;case"redis-addon":return"Les sauvegardes sont réalisées en archivant les données contenues dans Redis.";case"jenkins":return"Les sauvegardes sont réalisées en archivant les données contenues dans Jenkins."}}_getManualDeleteDescription(e){switch(e){case"es-addon":case"es-addon-old":return(({href:e})=>r`Vous pouvez supprimer cette sauvegarde manuellement grâce à l'outil <a href="${e}">cURL</a> en exécutant cette commande :`)();default:return o(70)}}_getManualRestoreDescription(e){switch(e){case"es-addon":case"es-addon-old":return r`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://curl.se/docs/">cURL</a> en exécutant cette commande :`;case"postgresql-addon":return r`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://www.postgresql.org/docs/current/app-pgrestore.html">pg_restore</a> en exécutant cette commande :`;case"mysql-addon":return r`Vous pouvez restaurer cette sauvegarde manuellement grâce à la CLI <a href="https://dev.mysql.com/doc/refman/8.0/en/mysql.html">mysql</a> en exécutant cette commande :`;case"mongodb-addon":return r`Vous pouvez restaurer cette sauvegarde manuellement grâce à l'outil <a href="https://docs.mongodb.com/v4.0/reference/program/mongorestore/">mongorestore</a> en exécutant cette commande :`;case"redis-addon":return"La restauration de backups Redis doit passer par notre support. Veuillez créer un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous.";case"jenkins":return"La restauration de backups Jenkins doit passer par notre support. Veuillez créer un ticket en indiquant l'ID de votre add-on ainsi que la date du backup à restaurer et nous le ferons pour vous.";default:return o(70)}}_getRestoreWithServiceDescription(e,t){return"es-addon"===e?(({href:e})=>r`Vous pouvez restaurer cette sauvegarde avec Kibana en vous rendant sur le <a href="${e}">dépôt de sauvegardes</a>.`)({href:t}):o(80)}_getRestoreWithServiceTitle(e){return"es-addon"===e?"Restauration avec Kibana":o(20)}_onCloseOverlay(){this._overlayType=null,this._selectedBackup=null,this.updateComplete.then((()=>{this._overlayTriggeringButton.focus(),this._overlayTriggeringButton=null}))}_onOpenOverlay(e,t){return s=>{this._overlayType=e,this._selectedBackup=t,this._overlayTriggeringButton=s.target,this.updateComplete.then((()=>{this.shadowRoot.querySelector(".overlay cc-button").focus()}))}}render(){return u`
      <cc-block>
        <div slot="title">${"Sauvegardes"}</div>

        ${"error"===this.state.type?u`
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des sauvegardes."}"></cc-notice>
        `:""}

        ${"loading"===this.state.type?this._renderLoading(this.state):""}

        ${"loaded"===this.state.type?this._renderLoaded(this.state):""}
      </cc-block>
    `}_renderLoading(e){return u`
      <div>
        <span class="skeleton">
          ${o(150)}
        </span>
      </div>
      ${this._renderBackups(e)}
    `}_renderLoaded(e){const t=e.backups.length>0;return u`
      <div>${this._getDescription(e.providerId)}</div>

      ${t?"":u`
        <div class="cc-block_empty-msg">${"Il n'y a aucune sauvegarde pour l'instant."}</div>
      `}

      ${t?this._renderBackups(e):""}

      ${"restore"===this._overlayType?this._renderRestoreOverlay(e.providerId,e.passwordForCommand):""}

      ${"delete"===this._overlayType?this._renderDeleteOverlay(e.providerId,e.passwordForCommand):""}
    `}_renderBackups(e){const t="loading"===e.type,s="loading"===e.type||null!=this._overlayType,r="loaded"===e.type?e:h;return u`
      <div class="backup-list">
          ${r.backups.map((e=>u`
            <div class="backup">
              <span class="backup-icon"><cc-icon .icon=${a} size="lg"></cc-icon></span>
              <span class="backup-text">
                <span class="backup-text-details ${v({skeleton:t})}">${this._getBackupText(e)}</span>
                <br>
                ${i(null==this._overlayType?e.url:null,this._getBackupLink(r.providerId),t)}
                <cc-button 
                  link 
                  ?disabled=${s} 
                  ?skeleton=${t} 
                  @cc-button:click=${this._onOpenOverlay("restore",e)}
                >
                  ${"restaurer..."}
                </cc-button>
                ${null!=e.deleteCommand?u`
                  <cc-button 
                    link 
                    ?disabled=${s} 
                    ?skeleton=${t} 
                    @cc-button:click=${this._onOpenOverlay("delete",e)}
                  >
                    ${"supprimer..."}
                  </cc-button>
                `:""}
              </span>
            </div>
          `))}
      </div>
  `}_renderRestoreOverlay(s,a){return u`
      <!-- The restore and delete overlays are quite similar but's it's easier to read with a big if and some copy/paste than 8 ifs -->
      <div slot="overlay">
        <cc-block class="overlay">
          <div slot="title">${(({createdAt:s})=>r`Restaurer la sauvegarde du <strong title="${e(m,s)}">${t(m,s)}</strong>`)(this._selectedBackup)}</div>
          <cc-button
            class="overlay-close-btn"
            slot="button"
            .icon=${n}
            hide-text
            outlined
            primary
            @cc-button:click=${this._onCloseOverlay}
          >${"Fermer ce panneau"}</cc-button>

          ${this._displaySectionWithService(s)?u`
            <cc-block-section>
              <div slot="title">${this._getRestoreWithServiceTitle(s)}</div>
              <div>${this._getRestoreWithServiceDescription(s,this._selectedBackup.url)}</div>
            </cc-block-section>
          `:""}

          <cc-block-section>
            <div slot="title">${"Restauration manuelle"}</div>
            <div>${this._getManualRestoreDescription(s)}</div>
            ${null!=this._selectedBackup.restoreCommand?u`
              <cc-input-text readonly clipboard value="${this._selectedBackup.restoreCommand}"></cc-input-text>
              <div>${"Cette commande vous demandera votre mot de passe, le voici :"}</div>
              <cc-input-text readonly clipboard secret value=${a}></cc-input-text>
            `:""}
          </cc-block-section>
        </cc-block>
      </div>
    `}_renderDeleteOverlay(s,a){return u`
      <div slot="overlay">
        <cc-block class="overlay">
          <div slot="title">${(({createdAt:s})=>r`Supprimer la sauvegarde du <strong title="${e(m,s)}">${t(m,s)}</strong>`)(this._selectedBackup)}</div>
          <cc-button
            class="overlay-close-btn"
            slot="button"
            .icon=${n}
            hide-text
            outlined
            primary
            @cc-button:click=${this._onCloseOverlay}
          >${"Fermer ce panneau"}</cc-button>

          ${this._displaySectionWithService(s)?u`
            <cc-block-section>
              <div slot="title">${"Suppression avec Kibana"}</div>
              <div>${(({href:e})=>r`Vous pouvez supprimer cette sauvegarde avec Kibana en vous rendant sur le <a href="${e}">dépôt de sauvegardes</a>.`)({href:this._selectedBackup.url})}</div>
            </cc-block-section>
          `:""}

          <cc-block-section>
            <div slot="title">${"Suppression manuelle"}</div>
            <div>${this._getManualDeleteDescription(s)}</div>
            <cc-input-text readonly clipboard value="${this._selectedBackup.deleteCommand}"></cc-input-text>
            <div>${"Cette commande vous demandera votre mot de passe, le voici :"}</div>
            <cc-input-text readonly clipboard secret value=${a}></cc-input-text>
          </cc-block-section>
        </cc-block>
      </div>
    `}static get styles(){return[c,d,p`
        :host {
          display: grid;
          grid-gap: 1em;
          line-height: 1.5;
        }

        .backup-list {
          display: grid;
          grid-gap: 1.5em;
        }

        .backup {
          display: flex;
          line-height: 1.5em;
        }

        .backup-icon,
        .backup-text {
          margin-right: 0.5em;
        }

        .backup-icon {
          --cc-icon-color: #012a51;
        }

        .backup-text {
          color: var(--cc-color-text-weak);
        }

        .backup-text-details:not(.skeleton) strong {
          color: var(--cc-color-text-strongest, #000);
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }

        .overlay {
          position: fixed;
          max-width: 50em;
          margin: 2em;
          box-shadow: 0 0 1em rgb(0 0 0 / 40%);
        }

        .overlay-close-btn {
          --cc-icon-size: 1.4em;
        }

        .cc-link,
        cc-button[link] {
          margin-right: 0.5em;
          vertical-align: baseline;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `]}}window.customElements.define("cc-addon-backups",b);export{b as CcAddonBackups};
