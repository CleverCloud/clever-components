import"./cc-button-fafeef50.js";import"./cc-notice-9b1eec7a.js";import"./cc-icon-f84255c7.js";import"./cc-zone-7636cf9c.js";import{c as t,d as e,e as i,f as s,g as n,h as o,j as a}from"./cc-clever.icons-e2a98bd6.js";import{s as c}from"./cc-remix.icons-d7d44eac.js";import{d as r}from"./events-4c8e3503.js";import{s as l}from"./skeleton-68a3d018.js";import{w as d}from"./waiting-69be40cf.js";import{c as m,l as p}from"./cc-link-f2b8f554.js";import{s as u,x as g,i as b}from"./lit-element-98ed46d4.js";import{o as h}from"./class-map-1feb5cf7.js";import{l as f}from"./if-defined-cd9b1ec0.js";const $={git:t,running:e,starting:i},v={"restart-failed":s,restarting:n,"restarting-with-downtime":i,running:e,"start-failed":o,starting:i,stopped:c,unknown:a},_={name:"??????????????????????????",commit:"????????????????????????????????????????",variantLogo:null,variantName:null,status:"unknown"};class w extends u{static get properties(){return{state:{type:Object},disableButtons:{type:Boolean,attribute:"disable-buttons",reflect:!0},_lastUserAction:{type:String,state:!0}}}constructor(){super(),this.state={type:"loading"},this.disableButtons=!1,this._lastUserAction=null}_getCommitTitle(t,e){if(null!=e)return"git"===t?(({commit:t})=>`version du dépôt git (HEAD) : ${t}`)({commit:e}):"running"===t?(({commit:t})=>`version en ligne : ${t}`)({commit:e}):"starting"===t?(({commit:t})=>`version en cours de déploiement : ${t}`)({commit:e}):void 0}_getLastUserActionMsg(t){return"start"===t?"L'application va bientôt démarrer...":"restart"===t?"Un déploiement va bientôt commencer...":"cancel"===t?"Ce déploiement a été annulé.":"stop"===t?"L'application va s'arrêter...":void 0}_getStatusMsg(t){return"restart-failed"===t?"Votre application est disponible ! Le dernier déploiement a échoué,":"restarting"===t||"restarting-with-downtime"===t?"L'application redémarre...":"running"===t?"Votre application est disponible !":"start-failed"===t?"L'application est arrêtée. Le dernier déploiement a échoué,":"starting"===t?"L'application démarre...":"stopped"===t?"L'application est arrêtée.":"État inconnu, essayez de redémarrer l'application ou de contacter notre support si vous avez des questions."}_onCancel(){this._lastUserAction="cancel",r(this,"cancel")}_onRestart(t){this._lastUserAction="restart",r(this,"restart",t)}_onStart(t){this._lastUserAction="start",r(this,"start",t)}_onStop(){this._lastUserAction="stop",r(this,"stop")}willUpdate(t){t.has("state")&&"loading"===this.state.type&&(this._lastUserAction=null)}render(){if("error"===this.state.type)return g`<cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations de l'application."}"></cc-notice>`;const t="loading"===this.state.type,e="loaded"===this.state.type?{type:"loaded",...this.state.zone}:{type:"loading"},i="loaded"===this.state.type?this.state:_,s=["restarting","restarting-with-downtime","starting"].includes(i.status),n=["restart-failed","restarting","running"].includes(i.status);return g`
     <div class="wrapper">
       <div class="main">
         <div class="flavor-logo ${h({skeleton:t})}" title=${f(i.variantName)}>
           <!-- image has a presentation role => alt="" -->
           <img class="flavor-logo_img" src=${f(i.variantLogo)} alt="">
         </div>

         <div class="details">
           <div class="name"><span class=${h({skeleton:t})}>${i.name}</span></div>
           <div class="commits">
             ${this._renderCommit(i.commit,"git","loading"===this.state.type)}

             ${"loaded"===this.state.type&&n?this._renderCommit(i.runningCommit,"running",!1):""}

             ${"loaded"===this.state.type&&s?this._renderCommit(i.startingCommit,"starting",!1):""}
           </div>
         </div>

         <div class="buttons">
           ${this._renderActions(i.status,s,t)}
         </div>
       </div>

       <div class="messages ${h({"cc-waiting":s})}">
         ${this._renderFooter(i.status,i.lastDeploymentLogsUrl,t)}

         <cc-zone .state=${e} mode="small-infra"></cc-zone>
       </div>
     </div>
    `}_renderActions(t,e,i){const s=null!=this._lastUserAction||this.disableButtons,n=["start-failed","stopped","unknown"].includes(t),o=["start-failed","stopped"].includes(t),a=i||["restart-failed","running","unknown"].includes(t),c=this.disableButtons?"Vous n'êtes pas autorisé à réaliser ces actions":void 0;return g`
      ${o?g`
        <cc-button title=${f(c)} ?disabled=${s} @cc-button:click=${()=>this._onStart("normal")}>
          ${"Démarrer"}
        </cc-button>
        <cc-button title=${f(c)} ?disabled=${s} @cc-button:click=${()=>this._onStart("rebuild")}>
          ${"Re-build et démarrer"}
        </cc-button>
        <cc-button title=${f(c)} ?disabled=${s} @cc-button:click=${()=>this._onStart("last-commit")}>
          ${"Démarrer le dernier commit poussé"}
        </cc-button>
      `:""}

      ${a?g`
        <cc-button title=${f(c)} ?skeleton=${i} ?disabled=${s} @cc-button:click=${()=>this._onRestart("normal")}>
          ${"Redémarrer"}
        </cc-button>
        <cc-button title=${f(c)} ?skeleton=${i} ?disabled=${s} @cc-button:click=${()=>this._onRestart("rebuild")}>
          ${"Re-build et redémarrer"}
        </cc-button>
        <cc-button title=${f(c)} ?skeleton=${i} ?disabled=${s} @cc-button:click=${()=>this._onRestart("last-commit")}>
          ${"Redémarrer le dernier commit poussé"}
        </cc-button>
      `:""}

      ${e?g`
        <cc-button warning outlined title=${f(c)} ?disabled=${s} @cc-button:click=${this._onCancel}>
          ${"Annuler le déploiement"}
        </cc-button>
      `:""}

      <cc-button danger outlined delay="3"
        title=${f(c)}
        ?skeleton=${i}
        ?disabled=${s||n}
        @cc-button:click=${this._onStop}
      >${"Arrêter l'application"}</cc-button>
    `}_renderCommit(t,e,i){return null==t&&"git"!==e?"":g`
      <span
        class="commit ${h({"cc-waiting":"starting"===e})}"
        title=${f(i?void 0:this._getCommitTitle(e,t))}
        data-type=${e}
      >
        <cc-icon class="commit_img ${e}" .icon=${$[e]}></cc-icon>
        ${null!=t?g`
          <!-- Keep this on one line to ease copy/paste -->
          <span class=${h({skeleton:i})}>${t.slice(0,8)}<span class="commit_rest">${t.slice(8)}</span></span>
        `:""}
        ${null==t?g`
          <span>${"pas encore de commit"}</span>
        `:""}
      </span>
    `}_renderFooter(t,e,i){const s="start"!==this._lastUserAction&&"stop"!==this._lastUserAction,n=["restart-failed","restarting","restarting-with-downtime","starting","start-failed"].includes(t);return g`
      ${s?g`
        <cc-icon class="status-icon ${t}" size="lg" .icon=${v[t]}></cc-icon>
        <span class=${h({skeleton:i})}>
          ${this._getStatusMsg(t)}
        </span>
        ${n?m(e,"voir les logs"):""}
      `:""}
      ${null!=this._lastUserAction?g`
        ${this._getLastUserActionMsg(this._lastUserAction)}
      `:""}

      <span class="spacer"></span>
    `}static get styles(){return[l,p,d,b`
        :host {
          display: block;
        }

        .wrapper {
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .main {
          display: flex;
          flex-wrap: wrap;
          padding: 1em;
          gap: 1em;
        }

        .flavor-logo {
          overflow: hidden;
          width: 3.25em;
          height: 3.25em;
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .flavor-logo_img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .skeleton .flavor-logo_img {
          opacity: 0;
        }

        .details {
          display: flex;
          flex: 1 1 max-content;
          flex-direction: column;
          justify-content: space-between;
        }

        .commits {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .commit {
          display: flex;
          align-items: center;
        }

        .commit_img {
          margin-right: 0.2em;
        }

        .commit_img.git {
          --cc-icon-color: #555;
          --cc-icon-size: 1.3em;
        }

        .commit_img.running {
          --cc-icon-color: var(--color-legacy-green);
          --cc-icon-size: 1.25em;
        }

        .commit_img.starting {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        /* We hide the right part of the commit this way so this can be part of a copy/paste */

        .commit_rest {
          font-size: 0;
        }

        .buttons {
          display: flex;
          flex-wrap: wrap;
          align-self: center;
          gap: 1em;
        }

        cc-button {
          min-width: 0;
          flex: 1 1 auto;
        }

        :host([disable-buttons]) cc-button {
          cursor: not-allowed;
        }

        .messages {
          display: flex;
          box-sizing: border-box;
          flex-wrap: wrap;
          align-items: center;
          padding: 0.5em 1.1em;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          font-size: 0.9em;
          font-style: italic;
          gap: 0.57em;
        }

        .status-icon {
          font-size: unset;
          margin-block: 0;
          margin-inline-end: 0;
        }

        .status-icon.restarting-with-downtime {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        .status-icon.running {
          --cc-icon-color: var(--color-legacy-green);
          --cc-icon-size: 1.25em;
        }

        .status-icon.start-failed {
          --cc-icon-color: var(--color-legacy-red);
          --cc-icon-size: 1.25em;
        }

        .status-icon.starting {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --cc-icon-size: 1.25em;
        }

        .status-icon.stopped {
          --cc-icon-color: #ddd;
        }

        .status-icon.unknown {
          --cc-icon-color: #ddd;
        }

        .spacer {
          flex: 1 1 0;
        }

        cc-zone {
          font-style: normal;
          white-space: nowrap;
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-header-app",w);export{w as CcHeaderApp};
