import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import{a3 as t,a4 as s}from"./cc-remix.icons-d7d44eac.js";import{d as o}from"./events-4c8e3503.js";import"./cc-loader-c9072fed.js";import{s as a}from"./skeleton-68a3d018.js";import{w as c}from"./waiting-69be40cf.js";import{s as i,x as n,i as r}from"./lit-element-98ed46d4.js";import{o as d}from"./class-map-1feb5cf7.js";const l={namespace:"default",isPrivate:!1};class p extends i{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}_getButtonText(e){return null!=e?"Supprimer":"Créer"}_getHelpText(t,s){return null!=s?(({namespace:t,sourcePort:s})=>e`Cette application a une redirection du port <code>${s}</code> vers le port <code>4040</code> dans l'espace de nommage <strong>${t}</strong>.`)({namespace:t,sourcePort:s}):(({namespace:t})=>e`Vous pouvez créer une redirection dans l'espace de nommage <strong>${t}</strong>.`)({namespace:t})}_getHelpTextAddendum(t,s){if(s)return"Cet espace de nommage vous est dédié.";switch(t){case"default":return e`Cet espace de nommage est utilisé par tous les noms de domaine personnalisés (p. ex. <em>mon-application.fr</em>).`;case"cleverapps":return e`Cet espace de nommage est utilisé par tous les noms de domaine <em>cleverapps.io</em> (p. ex. <em>mon-application.cleverapps.io</em>).`;default:return null}}_isStateLoadedOrWaiting(e){return"loaded"===e.type||"waiting"===e.type}_onCreate(){if(this._isStateLoadedOrWaiting(this.state)){const{namespace:e}=this.state;o(this,"create",{namespace:e})}}_onDelete(){if(this._isStateLoadedOrWaiting(this.state)){const{namespace:e,sourcePort:t}=this.state;o(this,"delete",{namespace:e,sourcePort:t})}}render(){const e="loading"===this.state.type,{namespace:o,sourcePort:a,isPrivate:c}="loading"===this.state.type?l:this.state,i=null!=a,r=this._getHelpTextAddendum(o,c);return n`
      <div class="wrapper">

        ${e?n`
          <div class="icon skeleton"></div>
        `:""}

        ${"loaded"===this.state.type?n`
          <div class="icon">
            ${i?n`<cc-icon .icon=${t} class="on"></cc-icon>`:n`<cc-icon .icon=${s} class="off"></cc-icon>`}
          </div>
        `:""}

        ${"waiting"===this.state.type?n`
          <div class="icon">
            <cc-loader></cc-loader>
          </div>
        `:""}

        <div class="text-button ${d({"cc-waiting":e})}">
          <div class="text-wrapper">
            <span class="text ${d({skeleton:e})}">${this._getHelpText(o,a)}</span>
            ${null!=r?n`
              <br>
              <span class="text-addendum ${d({skeleton:e})}">${r}</span>
            `:""}
          </div>

          <cc-button
            outlined
            ?skeleton=${e}
            ?waiting=${"waiting"===this.state.type}
            ?danger=${i}
            delay=${i?3:0}
            ?primary=${!i}
            @cc-button:click=${i?this._onDelete:this._onCreate}
          >
            ${this._getButtonText(a)}
          </cc-button>
        </div>
      </div>
    `}static get styles(){return[a,c,r`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8em;
        }

        .icon {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
        }

        .icon cc-icon {
          width: 100%;
          height: 100%;
        }

        .icon cc-icon.off {
          --cc-icon-color: #999;
        }

        .icon cc-icon.on {
          --cc-icon-color: var(--cc-color-bg-success);
        }
        
        .icon cc-loader {
          --cc-loader-color: #999;
        }

        .text-button {
          display: flex;
          flex: 1 1 0;
          flex-wrap: wrap;
          gap: 1em;
        }

        .text-wrapper {
          flex: 1 1 30em;
          line-height: 1.6em;
        }

        .text strong {
          white-space: nowrap;
        }

        .text:not(.skeleton) code {
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
        }

        .text-addendum:not(.skeleton) {
          color: var(--cc-color-text-weak);
        }

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-tcp-redirection",p);export{p as CcTcpRedirection};
