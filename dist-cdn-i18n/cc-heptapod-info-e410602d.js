import{f as e,p as t}from"./i18n-number-a9c20d27.js";import{s as i}from"./i18n-sanitize-4edc4a2d.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{s}from"./skeleton-68a3d018.js";import{c as r,l as a}from"./cc-link-f2b8f554.js";import{s as c,x as o,i as d}from"./lit-element-98ed46d4.js";import{o as l}from"./class-map-1feb5cf7.js";const p=t("fr","o"," "),n={privateActiveUsers:15,publicActiveUsers:120,storage:698980762,price:17.5};class v extends c{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){return o`
      <cc-block>
        <div slot="title">Heptapod</div>
        <div class="header">
          <img class="header-logo" src=${"https://assets.clever-cloud.com/logos/heptapod.svg"} alt="heptapod logo" title="heptapod logo">
          <div class="header-content">
            <div>Heptapod</div>
            <div>${r("https://heptapod.host","https://heptapod.host")}</div>
          </div>
        </div>
        <div class="description">
          ${i`Cette instance Heptapod héberge des dépôts Mercurial. Plus d'informations sur <a href="https://about.heptapod.host">https://about.heptapod.host</a>.`}
        </div>

        ${"error"===this.state.type?o`
          <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations d'utilisation."}"></cc-notice>
        `:""}

        ${"not-used"===this.state.type?o`
          <div class="no-statistics">${"Vous n'utilisez pas ce service Heptapod."}</div>
        `:""}

        ${"loading"===this.state.type?this._renderStatistics(n,!0):""}

        ${"loaded"===this.state.type?this._renderStatistics(this.state.statistics,!1):""}
      </cc-block>
    `}_renderStatistics(t,i){return o`
      <div class="pricing">
        <div class="pricing-item">
          <div class="pricing-item-value ${l({skeleton:i})}">${t.privateActiveUsers}</div>
          <div>${"Utilisateurs privés"}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${l({skeleton:i})}">${t.publicActiveUsers}</div>
          <div>${"Utilisateurs publics"}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${l({skeleton:i})}">${(({storage:e})=>p(e,1))(t)}</div>
          <div>${"Stockage utilisé"}</div>
        </div>
        <div class="pricing-item">
          <div class="pricing-item-value ${l({skeleton:i})}">${(({price:t})=>`${e("fr",t)} / mois`)(t)}</div>
          <div>${"Prix estimé"}</div>
        </div>
      </div>
    `}static get styles(){return[s,a,d`
        :host {
          display: block;
        }

        .header,
        .description,
        .pricing {
          line-height: 1.5;
        }

        .header {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em 1em;
        }

        .header-logo {
          width: 3.25em;
          height: 3.25em;
        }

        .header-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .pricing {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .pricing-item {
          flex: 1 1 auto;
          color: var(--cc-color-text-weak);
          text-align: center;
        }

        .pricing-item-value {
          display: inline-block;
          color: var(--cc-color-text-primary-highlight);
          font-weight: bold;
        }

        .no-statistics {
          margin: 0.2em;
          color: var(--cc-color-text-weak);
          font-style: italic;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
          color: transparent;
        }
      `]}}window.customElements.define("cc-heptapod-info",v);export{v as CcHeptapodInfo};
