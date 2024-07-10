import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-loader-c9072fed.js";import"./cc-notice-9b1eec7a.js";import{g as t}from"./cc-remix.icons-d7d44eac.js";import{d as a}from"./events-4c8e3503.js";import{c as s,l as i}from"./cc-link-f2b8f554.js";import{s as n,x as r,i as o}from"./lit-element-98ed46d4.js";class c extends n{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getDashboards(){return[{title:"Aperçu du tableau de bord d'organisation",url:"https://assets.clever-cloud.com/grafana/screens/home.png",description:e`Ce tableau de bord comprend plusieurs graphiques pour une organisation Clever Cloud. <br> Il fournit un graphique résumant le nombre d'<strong>applications (runtimes) et d'add-ons déployés</strong>. Il contient également le nombre de services <strong>par type</strong> ou <strong>par plan (flavor)</strong>. <br> Le <strong>graphique d'état</strong> affiche un état pour tous les déploiements effectués durant la plage de temps de Grafana. <br> Et enfin, il est possible de récupérerer des <strong>liens globaux et spécifiques</strong> (triés par nombre de requêtes) pour accéder au tableau de bord d'une application (runtime) ou d'un add-on.`,alt:"Capture d'écran d'un tableau de bord d'organisation dans Grafana"},{title:"Aperçu du tableau de bord d'application (runtime)",url:"https://assets.clever-cloud.com/grafana/screens/runtime.png",description:e`Ce tableau de bord comprend un <strong>panneau de présentation</strong> pour obtenir des informations rapides sur une application, ainsi que plusieurs panneaux présentant leurs métriques système. <br> Il fournit un graphique reprenant l'état <strong>du processeur, de la mémoire, des disques et du réseau</strong>. <br> Pour chaque groupe de métriques, le panneau contient des graphes d'utilisation, des jauges ou encore un indicateur de remplissage (basé sur le résultat d'une prédiction linéaire effectuée sur les données de l'intervalle de temps fixé dans Grafana). Cet indicateur donne la durée attendue avant que les métriques ne dépassent 90%.`,alt:"Capture d'écran d'un tableau de bord d'application (runtime) dans Grafana"},{title:"Aperçu du tableau de bord d'add-on",url:"https://assets.clever-cloud.com/grafana/screens/addon.png",description:e`Ce tableau de bord comprend plusieurs graphiques à propos d'un add-on. <br> Il fournit d'abord un panneau de présentation contenant les métriques système telles que <strong> le processeur, la mémoire, les disques et le réseau</strong>. <br> Pour les add-ons <strong>MySQL, PostgreSQL, MongoDB et Redis</strong>, un second panneau présente la base de données et des informations comme <strong>le nombre de connexions, de requêtes ou de transactions, d'erreurs ou de blocages ou encore d'opérations "tuples"<strong>.`,alt:"Capture d'écran d'un tableau de bord d'add-on dans Grafana"}]}_onEnableSubmit(){a(this,"enable")}_onResetSubmit(){a(this,"reset")}_onDisableSubmit(){a(this,"disable")}render(){const e="loaded"===this.state.type&&("enabling"===this.state.info.action||"disabling"===this.state.info.action),a="error"===this.state.type||"loaded"===this.state.type&&null!=this.state.info.action,i="loaded"===this.state.type&&"disabled"===this.state.info.status,n="loaded"===this.state.type&&"enabled"===this.state.info.status,o="loaded"===this.state.type&&"enabled"===this.state.info.status&&"resetting"===this.state.info.action;return r`
      <cc-block>

        <div slot="title">${"Métriques dans Grafana"}</div>

        ${e?r`
          <cc-loader slot="overlay"></cc-loader>
        `:""}

        <cc-block-section>
          <div slot="title">${"Documentation"}</div>
          <div slot="info">${"Ce service est utilisé pour visualiser nos métriques. Vous pouvez trouver la documentation et les détails de ces métriques ici."}</div>
          <div>
            ${s("https://www.clever-cloud.com/doc/administrate/metrics/overview/",r`
              <cc-icon size="lg" .icon=${t}></cc-icon>
              <span>${"Lire la documentation"}</span>
            `)}
          </div>
        </cc-block-section>

        ${"loading"===this.state.type?r`
          <cc-block-section>
            <div slot="title">${"Grafana"}</div>
            <div>
              <cc-loader></cc-loader>
            </div>
          </cc-block-section>
        `:""}

        ${"error"===this.state.type?r`
          <cc-block-section>
            <div slot="title">${"Grafana"}</div>
            <cc-notice intent="warning" message="${"Une erreur s'est produite lors du chargement de l'état du Grafana."}"></cc-notice>
          </cc-block-section>
        `:""}

        ${i?r`
          <cc-block-section>
            <div slot="title">${"Activer Grafana"}</div>
            <div slot="info">
              <p>${"L'activation de Grafana créera et fournira les accès à une organisation Grafana."}</p>
            </div>
            <div>
              <cc-button success ?disabled=${a} @cc-button:click=${this._onEnableSubmit}>
                ${"Activer Grafana"}
              </cc-button>
            </div>
          </cc-block-section>
        `:""}

        ${n?r`
          <cc-block-section>
            <div slot="title">${"Grafana"}</div>
            <div slot="info">
              <p>${"Lien vers le Grafana qui contient les tableaux de bord des métriques Clever Cloud."}</p>
            </div>
            ${null==this.state.info.link?r`
              <cc-notice intent="warning" message="${"Une erreur s'est produite lors du chargement du lien du Grafana."}"></cc-notice>
            `:r`
              <div>
                ${s(this.state.info.link,r`
                  <cc-img src="${"https://assets.clever-cloud.com/logos/grafana.svg"}"></cc-img><span>${"Ouvrir Grafana"}</span>
                `)}
              </div>
            `}
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${"Réinitialiser tous les tableaux de bord"}</div>
            <div slot="info">${"Réinitialisez tous les tableaux de bord Clever Cloud à leur état initial."}</div>
            <div>
              <cc-button primary ?disabled=${a} ?waiting=${o} @cc-button:click=${this._onResetSubmit}>
                ${"Réinitialiser tous les tableaux de bord"}
              </cc-button>
            </div>
          </cc-block-section>
        `:""}

        ${e?"":r`
          ${this._getDashboards().map((e=>r`
            <cc-block-section>
              <div slot="title">${e.title}</div>
              <div slot="info">${e.description}</div>
              <div>
                ${s(e.url,r`
                  <img class="dashboard-screenshot" src="${e.url}" alt="${e.alt}">
                `)}
              </div>
            </cc-block-section>
          `))}
        `}

        ${n?r`
          <cc-block-section>
            <div slot="title">${"Désactiver Grafana"}</div>
            <div slot="info">${"Désactiver Grafana supprimera et mettra fin aux accès à l'organisation du Grafana. Vous pourrez toujours recréer une nouvelle organisation Grafana."}</div>
            <div>
              <cc-button danger delay="3" ?disabled=${a} @cc-button:click=${this._onDisableSubmit}>
                ${"Désactiver Grafana"}
              </cc-button>
            </div>
          </cc-block-section>
        `:""}

      </cc-block>
    `}static get styles(){return[i,o`
        :host {
          display: block;
        }

        cc-img {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
          margin-right: 0.5em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        .cc-link {
          display: inline-flex;
          align-items: center;
        }

        .dashboard-screenshot {
          width: 100%;
          max-width: 50em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        p {
          margin: 0;
        }

        br {
          display: block;
          margin: 0.5em 0;
        }
      `]}}window.customElements.define("cc-grafana-info",c);export{c as CcGrafanaInfo};
