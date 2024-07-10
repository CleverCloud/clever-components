import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-block-section-3a3736ca.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{g as o}from"./cc-remix.icons-d7d44eac.js";import{s as t}from"./skeleton-68a3d018.js";import{c as s,l as n}from"./cc-link-f2b8f554.js";import{s as c,x as i,i as r}from"./lit-element-98ed46d4.js";import{o as a}from"./class-map-1feb5cf7.js";const d={matomoUrl:null,phpUrl:null,mysqlUrl:null,redisUrl:null};class l extends c{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){const t="loading"===this.state.type,{matomoUrl:s,phpUrl:n,mysqlUrl:c,redisUrl:r}="loaded"===this.state.type?this.state:d;return"error"===this.state.type?i`<cc-notice intent="warning" message="${"An error occured while fetching the information about this add-on."}"></cc-notice>`:i`
      <cc-block ribbon=${"Info"} no-head>
          <div class="info-text">${"Cet add-on Matomo inclut toutes les dépendances nécessaires à son bon fonctionnement."}</div>

          <cc-block-section>
            <div slot="title">${"Accéder à Matomo"}</div>
            <div slot="info">${"Vous pouvez accéder à votre Matomo en utilisant votre compte Clever Cloud. Tous les membres de l'organisation peuvent également accéder au service grâce à leur propre compte."}</div>
            <div>${this._renderImageLink("https://assets.clever-cloud.com/logos/matomo.svg",s,"Accéder à Matomo",t)}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${"Documentation"}</div>
            <div slot="info">${"Consultez notre documentation pour en apprendre plus sur l'utilisation ou la configuration de votre Matomo et de ses dépendances."}</div>
            <div>${this._renderIconLink(o,"https://www.clever-cloud.com/doc/deploy/addon/matomo/","Accéder à la documentation")}</div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${"À propos"}</div>
            <div slot="info">${e`
    <p>L'add-on Matomo inclut des dépendances indispensables à son bon fonctionnement. Il est accompagné d'une application <strong>PHP</strong>, d'un add-on <strong>MySQL</strong> et d'un add-on <strong>Redis</strong>.</p>
    <p>Ces dépendances sont affichées dans votre organisation comme n'importe quelle autre application ou add-on. Vous pouvez les configurer comme bon vous semble. Vous pouvez modifier le domaine de l'application PHP ou encore migrer le MySQL vers un plus gros plan.</p>
    <p>Cet add-on est gratuit, mais ses dépendances sont facturées en fonction de leur consommation.</p>
  `}</div>
            <div class="application-list">
              ${this._renderImageLink("https://assets.clever-cloud.com/logos/php.svg",n,"Accéder à l'application PHP",t)}
              ${this._renderImageLink("https://assets.clever-cloud.com/logos/mysql.svg",c,"Accéder à l'add-on MySQL",t)}
              ${this._renderImageLink("https://assets.clever-cloud.com/logos/redis.svg",r,"Accéder à l'add-on Redis",t)}
            </div>
          </cc-block-section>
      </cc-block>
    `}_renderImageLink(e,o,t,n){return i`
      <div>
        ${s(o,i`
          <cc-img src=${e}></cc-img>
          <span class="${a({skeleton:n})}">${t}</span>
        `)}
      </div>
    `}_renderIconLink(e,o,t){return i`
      <div>
        ${s(o,i`
          <cc-icon size="lg" .icon=${e}></cc-icon>
          <span>${t}</span>
        `)}
      </div>
    `}static get styles(){return[t,n,r`
        :host {
          --cc-gap: 1em;

          display: block;
        }

        [slot='info'] p:first-child {
          margin-top: 0;
        }

        [slot='info'] p:last-child {
          margin-bottom: 0;
        }

        .cc-link {
          display: inline-flex;
          align-items: center;
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

        .application-list > * {
          margin-bottom: 0.5em;
        }
      `]}}window.customElements.define("cc-matomo-info",l);export{l as CcMatomoInfo};
