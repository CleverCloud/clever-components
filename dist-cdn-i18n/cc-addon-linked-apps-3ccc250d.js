import"./cc-img-8b44c495.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import"./cc-zone-7636cf9c.js";import{s as e}from"./skeleton-68a3d018.js";import{c as t,l as i}from"./cc-link-f2b8f554.js";import{s as n,x as s,i as l}from"./lit-element-98ed46d4.js";import{l as a}from"./if-defined-cd9b1ec0.js";const o=[{name:"??????????????????",link:null,variantName:null,variantLogoUrl:null,zone:null},{name:"???????????????????????",link:null,variantName:null,variantLogoUrl:null,zone:null},{name:"????????????????????",link:null,variantName:null,variantLogoUrl:null,zone:null}];class r extends n{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getEmptyContent(){return s`
      <div>${"Ci-dessous la liste des applications liées à l'add-on. L'add-on expose ses variables d'environnement aux applications qui lui sont liées."}</div>
      <div class="cc-block_empty-msg">${"Aucune application liée pour l'instant."}</div>
    `}_getErrorContent(){return s`
      <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des applications liées."}"></cc-notice>
    `}_getZoneState(e,t){return e?{type:"loading"}:{type:"loaded",...t}}render(){if("error"===this.state.type)return this._renderView(this._getErrorContent());const e="loading"===this.state.type,i="loaded"===this.state.type?this.state.linkedApplications:o;if(!(i.length>0))return this._renderView(this._getEmptyContent());const n=s`
      <div>${"Ci-dessous la liste des applications liées à l'add-on. L'add-on expose ses variables d'environnement aux applications qui lui sont liées."}</div>

      ${i.map((i=>s`
        <div class="application">
          <cc-img class="logo"
            ?skeleton=${e}
            src=${a(i.variantLogoUrl)}
            title="${a(i.variantName)}"
          ></cc-img>
          <div class="details">
            <span class="name">${t(i.link,i.name,e)}</span>
            <cc-zone mode="small" .state="${this._getZoneState(e,i.zone)}"></cc-zone>
          </div>
        </div>
      `))}
    `;return this._renderView(n)}_renderView(e){return s`
      <cc-block>
        <div slot="title">${"Applications liées"}</div>
        ${e}
      </cc-block>
    `}static get styles(){return[i,e,l`
        :host {
          display: block;
        }

        .application {
          display: flex;
          align-items: flex-start;
          line-height: 1.6em;
        }

        .logo {
          width: 1.6em;
          height: 1.6em;
          flex: 0 0 auto;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .details {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          margin-left: 0.5em;
          gap: 0.5em;
        }

        /* SKELETON */

        .name.skeleton {
          background-color: #bbb;
        }

        [title] {
          cursor: help;
        }
      `]}}window.customElements.define("cc-addon-linked-apps",r);export{r as CcAddonLinkedApps};
