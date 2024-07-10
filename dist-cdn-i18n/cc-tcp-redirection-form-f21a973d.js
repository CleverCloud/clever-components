import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-badge-e1a0f4b6.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import"./cc-tcp-redirection-bb5b951c.js";import{l as t}from"./cc-link-f2b8f554.js";import{s as c,x as i,i as r}from"./lit-element-98ed46d4.js";const o=[{type:"loading"},{type:"loading"}];class s extends c{static get properties(){return{context:{type:String},state:{type:Object}}}constructor(){super(),this.context="user",this.state={type:"loading"}}render(){const t="admin"===this.context?"close":"off";return i`
      <cc-block state="${t}">

        <div slot="title">
          ${"Redirections TCP"}
          ${this._renderRedirectionCountBadge()}
        </div>

        ${"user"===this.context?i`
          <div class="description">${e`
    <p>
      Une redirection TCP permet d'obtenir un accès au port <code>4040</code> de l'application.<br>
      Vous pouvez créer une redirection TCP par application sur chaque espace de nommage auquel vous avez accès.
    </p>
    <p>
      Un espace de nommage correspond à un groupe de frontaux : public, cleverapps.io, ou encore dédiés dans le cadre de Clever Cloud Premium.<br>
      Retrouvez plus de détails sur la <a href="https://www.clever-cloud.com/doc/administrate/tcp-redirections/">page de documentation des redirections TCP</a>.
    </p>
  `}</div>
        `:""}

        ${"error"===this.state.type?i`
            <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des redirections TCP."}"></cc-notice>
        `:""}

        ${"loading"===this.state.type?i`
          ${o.map((e=>i`
            <cc-tcp-redirection .state=${e}></cc-tcp-redirection>
          `))}
        `:""}

        ${"loaded"===this.state.type?i`
          ${this.state.redirections.map((e=>i`
            <cc-tcp-redirection .state=${e}></cc-tcp-redirection>
          `))}
          ${0===this.state.redirections.length?i`
            <div class="cc-block_empty-msg">${"Vous n'avez accès à aucun espace de nommage."}</div>
          `:""}
        `:""}

      </cc-block>
    `}_renderRedirectionCountBadge(){if("admin"===this.context&&"loaded"===this.state.type){const e=this.state.redirections.filter((({sourcePort:e})=>null!=e)).length;if(e>=1)return i`
          <cc-badge circle weight="strong">${e}</cc-badge>
        `}return""}static get styles(){return[t,r`
        :host {
          display: block;
        }

        cc-badge {
          margin-left: 0.5em;
          /* cc-block title changes the font-size to 1.2em, which makes our badge way too big */
          font-size: 0.8em;
          vertical-align: middle;
        }

        .description {
          line-height: 1.6;
        }

        .description p {
          margin: 0;
          margin-bottom: 1em;
        }

        .description code {
          padding: 0.15em 0.3em;
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
        }
      `]}}window.customElements.define("cc-tcp-redirection-form",s);export{s as CcTcpRedirectionForm};
