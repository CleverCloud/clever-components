import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-block-025e5b2d.js";import"./cc-notice-9b1eec7a.js";import{g as e}from"./cc-remix.icons-d7d44eac.js";import{s}from"./skeleton-68a3d018.js";import{c as t,l as c}from"./cc-link-f2b8f554.js";import{s as i,x as a,i as r}from"./lit-element-98ed46d4.js";import{o as n}from"./class-map-1feb5cf7.js";const o=["elasticsearch","kibana","apm"];class l extends i{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading",links:[{type:"elasticsearch"},{type:"kibana"},{type:"apm"}]}}_getLinkText(e){switch(e){case"elasticsearch":return"Voir l'add-on Elasticsearch";case"kibana":return"Ouvrir Kibana";case"apm":return"Ouvrir APM"}}_getLogo(e){switch(e){case"elasticsearch":return"https://assets.clever-cloud.com/logos/elastic.svg";case"kibana":return"https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg";case"apm":return"https://assets.clever-cloud.com/logos/elasticsearch-apm.svg"}}_getSortedLinks(e){return e.sort(((e,s)=>o.indexOf(e.type)-o.indexOf(s.type)))}render(){const s="loading"===this.state.type;return"error"===this.state.type?a`<cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des liens des add-on liés à cette application."}"></cc-notice>`:a`
      <cc-block ribbon=${"Info"} no-head>
        <div class="info-text">${"Cet add-on fait partie de l'offre Suite Elastic. Vous pouvez retrouver la documentation ainsi que les différents services liés ci-dessous."}</div>

        <div class="link-list">
          ${t("https://www.clever-cloud.com/doc/addons/elastic/",a`
            <cc-icon size="lg" .icon=${e}></cc-icon>
            <span>${"Lire la documentation"}</span>
          `)}

          ${this._renderLinks(this.state.links,s)}
        </div>
      </cc-block>
    `}_renderLinks(e,s){return this._getSortedLinks(e).map((({href:e,type:c})=>t(e,a`
        <cc-img src="${this._getLogo(c)}"></cc-img>
        <span class="${n({skeleton:s})}">${this._getLinkText(c)}</span>
      `)))}static get styles(){return[s,c,r`
        :host {
          display: block;
        }

        .link-list {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
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
      `]}}window.customElements.define("cc-elasticsearch-info",l);export{l as CcElasticsearchInfo};
