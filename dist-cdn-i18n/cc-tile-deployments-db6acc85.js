import"./cc-datetime-relative-cd85326a.js";import"./cc-icon-f84255c7.js";import{j as e}from"./cc-remix.icons-d7d44eac.js";import{t}from"./info-tiles-8286a15a.js";import{s}from"./skeleton-68a3d018.js";import{c as a,l as r}from"./cc-link-f2b8f554.js";import{s as i,x as n,i as o}from"./lit-element-98ed46d4.js";import{o as c}from"./class-map-1feb5cf7.js";const l=[{state:"???????",date:"??????????"},{state:"??????",date:"???????????"}];class d extends i{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getStateLabel(e,t){return"OK"===e?"UNDEPLOY"===t?"Arrêté":"Démarré":"FAIL"===e?"Échoué":"CANCELLED"===e?"Annulé":e}render(){return n`
      <div class="tile_title">${"Derniers déploiements"}</div>
      ${this._renderTileContent()}
    `}_renderTileContent(){if("error"===this.state.type)return n`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${e}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
            <p>${"Une erreur est survenue pendant le chargement des déploiements."}</p>
          </div>
        </div>
      `;const t="loading"===this.state.type,s=t?l:this.state.deploymentsInfo;return s.length>0?n`
      <div class="tile_body">
        <!-- We don't really need to repeat and key by -->
        ${s.map((e=>n`
          <div class="state" data-state=${e.state}>
            <span class=${c({skeleton:t})}>${this._getStateLabel(e.state,e.action)}</span>
          </div>
          <div class="date">
            ${t?n`
                <span class="skeleton">${e.date}</span>
              `:""}
            ${t?"":n`
                <cc-datetime-relative datetime=${e.date}></cc-datetime-relative>
              `}
          </div>
          <div>
            ${a(e.logsUrl,"logs",t)}
          </div>
        `))}
      </div>
    `:n`
        <div class="tile_message">${"Pas encore de déploiement."}</div>
      `}static get styles(){return[t,s,r,o`
        .tile_body {
          align-items: start;
          justify-content: space-between;
          grid-gap: 1em;
          grid-template-columns: auto auto auto;
        }

        .state {
          font-weight: bold;
        }

        .state[data-state='CANCELLED'] {
          color: var(--cc-color-text-warning);
        }

        .state[data-state='FAIL'] {
          color: var(--cc-color-text-danger);
        }

        .state[data-state='OK'] {
          color: var(--cc-color-text-success);
        }

        [title] {
          cursor: help;
        }

        .skeleton {
          background-color: #bbb;
        }

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `]}}window.customElements.define("cc-tile-deployments",d);export{d as CcTileDeployments};
