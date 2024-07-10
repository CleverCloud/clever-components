import{f as e,p as t}from"./i18n-number-a9c20d27.js";import{s}from"./i18n-sanitize-4edc4a2d.js";import"./cc-addon-option-form-4a5ef3da.js";import{j as o}from"./cc-remix.icons-d7d44eac.js";import{d as i}from"./events-4c8e3503.js";import{c as n}from"./cc-addon-encryption-at-rest-option-50e4e814.js";import{s as a,x as r,i as c}from"./lit-element-98ed46d4.js";const l="fr",p=t(l,"o"," ");function d(e){return[`CPUs : ${e.cpus}`+(e.microservice?" (partagé)":""),e.gpus>0?`GPUs : ${e.gpus}`:"",`RAM : ${p(1024*e.mem*1024)}`].filter((e=>e)).join("\n")}class u extends a{static get properties(){return{options:{type:Array,attribute:"options"}}}constructor(){super(),this.options=[]}_onFormOptionsSubmit({detail:e}){i(this,"submit",e)}_getApmOption({enabled:t,flavor:i}){const n=r`
      <div class="option-details">${s`Elastic APM est un serveur de monitoring de performance applicative pour la Suite Elastic. Déployer cette option permet d'envoyer automatiquement les métriques de toute application liée à cette instance d'add-on Elasticsearch, en supposant que vous utilisez bien l'agent Elastic APM dans les dépendances de vos applications. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/apm/get-started/current/overview.html">la documentation officielle de APM server</a>.`}</div>
      <div class="option-warning">
        <cc-icon .icon="${o}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
        <p>
          ${"Si vous activez cette option, nous allons déployer et gérer pour vous un APM server, ce qui entraînera des coûts supplémentaires."}
          ${null!=i?r`
            ${(t=>s`Par défaut, l'app sera démarrée sur une <strong title="${d(t)}">instance ${t.name}</strong> qui coûte environ <strong>${e(l,t.monthlyCost)} par mois</strong>. `)(i)}
          `:""}
        </p>
      </div>
    `;return{title:"APM",logo:"https://assets.clever-cloud.com/logos/elasticsearch-apm.svg",description:n,enabled:t,name:"apm"}}_getKibanaOption({enabled:t,flavor:i}){const n=r`
      <div class="option-details">${s`Kibana est l'interface d'administration de la Suite Elastic. Kibana vous permet de visualiser vos données Elasticsearch et de naviguer dans la Suite Elastic. Vous voulez effectuer le suivi de la charge de travail liée à la recherche ou comprendre le flux des requêtes dans vos applications ? Kibana est là pour ça. Retrouvez plus de détails dans <a href="https://www.elastic.co/guide/en/kibana/master/index.html">la documentation officielle de Kibana</a>.`}</div>
      <div class="option-warning">
        <cc-icon .icon="${o}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
        <p>
          ${"Si vous activez cette option, nous allons déployer et gérer pour vous un Kibana, ce qui entraînera des coûts supplémentaires."}
          ${null!=i?r`
            ${(t=>s`Par défaut, l'app sera démarrée sur une <strong title="${d(t)}">instance ${t.name}</strong> qui coûte environ <strong>${e(l,t.monthlyCost)} par mois</strong>.`)(i)}
          `:""}
        </p>
      </div>
    `;return{title:"Kibana",logo:"https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg",description:n,enabled:t,name:"kibana"}}_getFormOptions(){return this.options.map((e=>{switch(e.name){case"apm":return this._getApmOption(e);case"kibana":return this._getKibanaOption(e);case"encryption":return n(e);default:return null}})).filter((e=>null!=e))}render(){const e=this._getFormOptions();return r`
      <cc-addon-option-form title="${"Options pour la Suite Elastic"}" .options=${e} @cc-addon-option-form:submit="${this._onFormOptionsSubmit}">
        <div slot="description">${s`Cet add-on fait partie de l'offre Suite Elastic qui inclue deux options. Ces options sont déployées comme des applications et seront gérées et mises à jour par Clever Cloud. Elles apparaîtront donc comme des applications habituelles que vous pouvez arrêter, supprimer, scaler comme n'importe quelle autre application. <strong>Activer ces options augmentera votre consommation de crédits.</strong>`}</div>
      </cc-addon-option-form>
    `}static get styles(){return[c`
        :host {
          display: block;
        }
      `]}}window.customElements.define("cc-addon-elasticsearch-options",u);export{u as CcAddonElasticsearchOptions};
