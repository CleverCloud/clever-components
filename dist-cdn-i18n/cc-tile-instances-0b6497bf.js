import"./cc-expand-a1ff031c.js";import"./cc-icon-f84255c7.js";import"./cc-loader-c9072fed.js";import{d as e,e as t}from"./cc-clever.icons-e2a98bd6.js";import{j as s}from"./cc-remix.icons-d7d44eac.js";import{t as n,i as a}from"./info-tiles-8286a15a.js";import{w as i}from"./waiting-69be40cf.js";import{s as c,x as o,i as r}from"./lit-element-98ed46d4.js";import{o as l}from"./class-map-1feb5cf7.js";function d(e,t,s,n){Array.from(e.querySelectorAll(t)).forEach((e=>e.animate(s,n)))}const p=[[{transform:"scale(1)"},{transform:"scale(0.9)"},{transform:"scale(1)"}],{duration:200,easing:"ease-in-out"}],u={running:e,deploying:t};class g extends c{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getStatusLabel(e){return"running"===e?"En ligne":"deploying"===e?"Déploiement":void 0}render(){return o`
      <div class="tile_title">${"Instances"}</div>

      ${"error"===this.state.type?o`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${s}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
            <p>${"Une erreur est survenue pendant le chargement des instances."}</p>
          </div>
        </div>
      `:""}

      ${"loading"===this.state.type?o`
        <div class="tile_body">
          <cc-loader></cc-loader>
        </div>
      `:""}

      ${"loaded"===this.state.type?this._renderLoaded(this.state.running,this.state.deploying):""}
    `}_renderLoaded(e,t){const s=e.map((e=>e.count)).reduce(((e,t)=>e+t),0),n=t.map((e=>e.count)).reduce(((e,t)=>e+t),0);return 0===s&&0===n?o`
        <div class="tile_message">${"Pas d'instance. L'application est arrêtée."}</div>
      `:(this._lastRunningCount!==s&&this.updateComplete.then((()=>{d(this.shadowRoot,".instances[data-type=running] .count-bubble",...p),this._lastRunningCount=s})),this._lastDeployingCount!==n&&this.updateComplete.then((()=>{d(this.shadowRoot,".instances[data-type=deploying] .count-bubble",...p),this._lastDeployingCount=n})),o`
      <div class="tile_body">
        <cc-expand>
          ${this._renderInstances(e,"running")}
          ${this._renderInstances(t,"deploying")}
        </cc-expand>
      </div>
    `)}_renderInstances(e,t){return e.length?o`
      <div class="instances ${l({"cc-waiting":"deploying"===t})}" data-type=${t}>
        <cc-icon class="instances_status-img ${t}" .icon=${u[t]}></cc-icon>
        <span class="instances_status">${this._getStatusLabel(t)}</span>
        ${e.map((({flavorName:e,count:t})=>o`
          <span class="size-label">${e}<span class="count-bubble">${t}</span></span>
        `))}
      </div>
    `:""}static get styles(){return[n,a,i,r`
        cc-expand {
          width: 100%;
        }

        .instances {
          display: flex;
          width: 100%;
          align-items: center;
        }

        .instances[data-type='running'] {
          --cc-icon-color: var(--color-legacy-green);
          --status-color: var(--color-legacy-green);
        }

        .instances[data-type='deploying'] {
          --cc-icon-color: var(--color-legacy-blue-icon);
          --status-color: var(--color-legacy-blue);
        }

        .instances_status-img {
          --cc-icon-size: 1.75em;
        }

        .instances_status {
          flex: 1 1 0;
          margin-left: 0.25em;
          color: var(--status-color, #000);
          font-size: 1.2em;
        }

        .size-label {
          position: relative;
          margin: var(--bubble-r);
        }

        .count-bubble {
          position: absolute;
          right: calc(var(--bubble-d) / -2);
          bottom: calc(var(--bubble-d) / -2);
          background-color: var(--status-color, #000);
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
      `]}}window.customElements.define("cc-tile-instances",g);export{g as CcTileInstances};
