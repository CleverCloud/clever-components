import"./cc-badge-e1a0f4b6.js";import"./cc-img-8b44c495.js";import"./cc-notice-9b1eec7a.js";import{t as e,u as r}from"./cc-remix.icons-d7d44eac.js";import{s as t}from"./skeleton-68a3d018.js";import{l as a}from"./cc-link-f2b8f554.js";import{s,x as i,i as n}from"./lit-element-98ed46d4.js";import{o as c}from"./class-map-1feb5cf7.js";class o extends s{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getInitials(e){return e.trim().split(" ").slice(0,2).map((e=>e[0].toUpperCase())).join("")}render(){return"error"===this.state.type?i`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations de l'organisation."}"></cc-notice>
      `:"loading"===this.state.type?this._renderHeader({name:"??????????????????????????",skeleton:!0}):"loaded"===this.state.type?this._renderHeader({name:this.state.name,avatar:this.state.avatar,cleverEnterprise:this.state.cleverEnterprise,emergencyNumber:this.state.emergencyNumber,skeleton:!1}):""}_renderHeader({name:t,avatar:a=null,cleverEnterprise:s=!1,emergencyNumber:n=null,skeleton:o=!1}){return i`
      <div class="wrapper">
        <div class="header-body">
          <p class="identity">
            ${this._renderAvatar(o,a,t)}
            <span class="name ${c({skeleton:o})}">${t}</span>
          </p>
          <div class="enterprise">
            <p class="enterprise-row">
              ${s?i`
                <cc-icon .icon=${e}></cc-icon>
                <span lang="en">Clever Cloud Enterprise</span>
              `:""}
            </p>
            ${null!=n?i`
              <p class="enterprise-row">
                <cc-icon .icon=${r}>${n}</cc-icon>
                <span>
                  ${"Numéro d'urgence :"}
                  <a class="cc-link" href="tel:${n}">${n}</a>
                </span>
              </p>
              `:""}
          </div>
        </div>
        <slot name="footer"></slot>
      </div>
    `}_renderAvatar(e,r,t){return e?i`
        <cc-img class="logo" skeleton></cc-img>
      `:null==r?i`
        <span class="initials" aria-hidden="true">
          <span>${this._getInitials(t)}</span>
        </span>
      `:i`
      <cc-img class="logo" src="${r}"></cc-img>
    `}static get styles(){return[a,t,n`
        :host {
          display: block;
        }

        p {
          margin: 0;
        }
        
        cc-notice {
          width: 100%;
        }

        .wrapper {
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .header-body {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          padding: 1em;
          gap: 1em;
        }

        .identity {
          display: flex;
          align-items: center;
          gap: 1em;
        }

        .logo,
        .initials {
          width: 3.25em;
          height: 3.25em;
          flex: 0 0 auto;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .initials {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--cc-color-bg-neutral);
        }

        .initials span {
          font-size: 0.85em;
        }

        .name {
          font-size: 1.3em;
          font-weight: bold;
        }

        .enterprise {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .enterprise-row {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .enterprise-row cc-icon {
          --cc-icon-color: var(--cc-color-text-primary-highlight);

          flex: 0 0 auto;
        }

        ::slotted([slot='footer']) {
          padding: 0.5em 1em;
          border-top: solid 1px var(--cc-color-border-neutral-weak);
          background-color: var(--cc-color-bg-neutral);
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-header-orga",o);export{o as CcHeaderOrga};
