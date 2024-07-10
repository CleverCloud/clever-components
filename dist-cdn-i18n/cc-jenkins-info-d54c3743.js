import"./cc-block-025e5b2d.js";import"./cc-block-section-3a3736ca.js";import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-notice-9b1eec7a.js";import{g as e}from"./cc-remix.icons-d7d44eac.js";import{s}from"./skeleton-68a3d018.js";import{c as i,l as t}from"./cc-link-f2b8f554.js";import{s as n,x as c,i as o}from"./lit-element-98ed46d4.js";import{o as r}from"./class-map-1feb5cf7.js";class a extends n{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){if("error"===this.state.type)return c`<cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations liées à cet add-on."}"></cc-notice>`;const s="loading"===this.state.type,t="loaded"===this.state.type?this.state.jenkinsLink:null,n="loaded"===this.state.type?this.state.jenkinsManageLink:null,o="loaded"===this.state.type?this.state.versions:{},a=o.current!==o.available;return c`

      <cc-block ribbon=${"Info"} no-head>
          <div class="info-text">${"Cet add-on fait partie de l'offre Jenkins. Vous pouvez retrouver la documentation ainsi que différentes informations ci-dessous."}</div>

          <cc-block-section>
            <div slot="title">${"Accéder à Jenkins"}</div>
            <div slot="info">${"Accédez à Jenkins de manière authentifiée via le SSO (Single Sign-On) Clever Cloud. Les différents membres de l'organisation peuvent accéder au service Jenkins."}</div>
            <div class="one-line-form">
              ${i(t,c`
                <cc-img src="${"https://assets.clever-cloud.com/logos/jenkins.svg"}"></cc-img><span class="${r({skeleton:s})}">${"Accéder à Jenkins"}</span>
              `)}
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${"Documentation"}</div>
            <div slot="info">${"Notre documentation peut vous accompagner pour commencer à utiliser Jenkins ainsi qu'à créer des jobs qui s'exécutent dans des runners Docker sur Clever Cloud."}</div>
            <div class="one-line-form">
              ${i("https://www.clever-cloud.com/doc/deploy/addon/jenkins/",c`
                <cc-icon size="lg" .icon=${e}></cc-icon><span>${"Consulter la documentation"}</span>
              `)}
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${"Mises à jour"}</div>
            <div slot="info">${"Jenkins et ses plugins reçoivent régulièrement des mises à jour. Vous pouvez mettre à jour automatiquement votre instance ainsi que ses plugins à travers l'interface Jenkins."}</div>
            <div class="one-line-form">
              ${i(n,c`
                <cc-icon size="lg" .icon=${e}></cc-icon>
                <span class="${r({skeleton:s})}">
                  ${a?(({version:e})=>`La version ${e} de Jenkins est disponible !`)({version:o.available}):"Votre version de Jenkins est à jour."}
                </span>
              `)}
            </div>
          </cc-block-section>
      </cc-block>
    `}static get styles(){return[t,s,o`
        :host {
          --cc-gap: 1em;

          display: block;
        }

        .cc-link {
          display: flex;
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

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-jenkins-info",a);export{a as CcJenkinsInfo};
