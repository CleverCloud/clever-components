import{f as e,b as t}from"./i18n-date-d99182e3.js";import{s as a}from"./i18n-sanitize-4edc4a2d.js";import"./cc-img-8b44c495.js";import"./cc-input-text-8d29ec56.js";import"./cc-notice-9b1eec7a.js";import"./cc-zone-7636cf9c.js";import{f as i}from"./fake-strings-b70817e4.js";import{s}from"./skeleton-68a3d018.js";import{s as d,x as n,i as o}from"./lit-element-98ed46d4.js";import{l as r}from"./if-defined-cd9b1ec0.js";import{o as l}from"./class-map-1feb5cf7.js";const c={id:null,realId:null,name:i(20),provider:{name:null,logoUrl:null},plan:{name:i(10)},creationDate:new Date},p=i(5);class m extends d{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading",hasVersion:!0}}render(){const i="loaded"===this.state.type?this.state:c,s="loading"===this.state.type,d=(({date:e})=>t("fr",e))({date:i.creationDate}),o="loaded"===this.state.type?(({date:t})=>e("fr",t))({date:i.creationDate}):null,m="loaded"===this.state.type&&this.state.hasVersion?this.state.version:p,f="loaded"===this.state.type?{type:"loaded",...this.state.zone}:{type:"loading"};return"error"===this.state.type?n`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des informations de l'add-on."}"></cc-notice>
      `:n`
      <div class="wrapper">
        <div class="main">
          <cc-img 
            class="logo" 
            src="${r(i.provider.logoUrl)}"
            a11y-name="${i.provider.name}"
            title="${r(i.provider.name)}"
            skeleton
          ></cc-img>
          <div class="details">
            <div class="name"><span class="${l({skeleton:s})}">${i.name}</span></div>
            <div class="addon-id-inputs">
              <cc-input-text 
                label=${"Identifiant de l'add-on"} 
                hidden-label 
                readonly 
                clipboard 
                value="${r(i.id)}" 
                ?skeleton=${s}
              ></cc-input-text>
              <cc-input-text 
                label=${a`Identifiant alternatif de l'add-on (<span lang="en">real id</span>)`} 
                hidden-label 
                readonly 
                clipboard 
                value="${r(i.realId)}" 
                ?skeleton=${s}
              ></cc-input-text>
            </div>
          </div>

          <div class="description">
            <div class="description-item">
              <div class="description-label">${"Plan"}</div>
              <div class="${l({skeleton:s})}">${i.plan.name}</div>
            </div>
            ${this.state.hasVersion?n`
              <div class="description-item">
                <div class="description-label">${"Version"}</div>
                <div class="${l({skeleton:s})}">${m}</div>
              </div>
            `:""}
            <div class="description-item">
              <div class="description-label">${"Date de création"}</div>
              <div class="${l({skeleton:s})}" title="${r(o)}">${d}</div>
            </div>
          </div>
        </div>

        <div class="messages">
          <cc-zone .state=${f} mode="small-infra"></cc-zone>
        </div>
      </div>
    `}static get styles(){return[s,o`
        :host {
          --cc-gap: 1em;

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

        .logo {
          width: 3.25em;
          height: 3.25em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .details {
          flex: 1 1 11em;
        }

        .name,
        .description-label {
          margin-bottom: 0.35em;
        }

        .name {
          font-size: 1.1em;
          font-weight: bold;
        }

        .addon-id-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .description {
          display: flex;
          flex-wrap: wrap;
          align-self: center;
          gap: 1em;
        }

        .description-item {
          flex: 1 1 auto;
        }

        .description-label {
          font-weight: bold;
        }

        .messages {
          display: flex;
          box-sizing: border-box;
          flex-wrap: wrap;
          align-items: center;
          justify-content: end;
          padding: 0.7em 1.1em;
          background-color: var(--cc-color-bg-neutral);
          box-shadow: inset 0 6px 6px -6px rgb(0 0 0 / 40%);
          font-size: 0.9em;
          gap: 0.57em;
        }

        cc-zone {
          font-style: normal;
          white-space: nowrap;
        }

        [title] {
          cursor: help;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-header-addon",m);export{m as CcHeaderAddon};
