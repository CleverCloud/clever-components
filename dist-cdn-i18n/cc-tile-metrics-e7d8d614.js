import{f as e}from"./i18n-date-d99182e3.js";import{b as t}from"./i18n-number-a9c20d27.js";import{s as i}from"./i18n-sanitize-4edc4a2d.js";import{C as a,B as r,a as s,p as c,b as n,L as o,c as l,d}from"./chart.esm-50c173f4.js";import{m,n as p,i as h}from"./cc-clever.icons-e2a98bd6.js";import{k as g,n as u,j as f}from"./cc-remix.icons-d7d44eac.js";import{R as v}from"./resize-controller-3aadf1c4.js";import{i as b}from"./utils-aa566623.js";import{a as y}from"./accessibility-664b7197.js";import{t as _}from"./info-tiles-8286a15a.js";import{s as $}from"./skeleton-68a3d018.js";import{c as C,l as k}from"./cc-link-f2b8f554.js";import"./cc-button-fafeef50.js";import"./cc-icon-f84255c7.js";import{s as x,x as w,i as S}from"./lit-element-98ed46d4.js";import{e as j,n as L}from"./ref-948c5e44.js";import{o as z}from"./class-map-1feb5cf7.js";const P=({percent:e})=>t("fr",e);a.register(r,s,c,n,o,l,d);const D="#bbb",A=Array.from(new Array(24)).map(((e,t)=>({skeleton:!0,value:0,timestamp:Date.now()-864e5+3600*t})));class M extends x{static get properties(){return{metricsLink:{type:String},metricsState:{type:Object},grafanaLinkState:{type:Object},_docsPanelVisible:{type:Boolean,state:!0}}}constructor(){super(),this.metricsLink=null,this.metricsState={type:"loading"},this.grafanaLinkState={type:"loading"},this._docsPanelVisible=!1,this._cpuCtxRef=j(),this._memCtxRef=j(),new v(this,{callback:()=>this.updateComplete.then((()=>{this._cpuChart?.resize(),this._memChart?.resize()}))})}_createChart(e){return new a(e,{type:"bar",options:{responsive:!1,maintainAspectRatio:!1,radius:0,interaction:{intersect:!1},scales:{x:{display:!1,stacked:!0},y:{display:!1,beginAtZero:!0}},plugins:{legend:{display:!1},tooltip:{enabled:!1}}}})}_getChartData(e,t){const i=e.map((e=>e.timestamp)),a=e.map((e=>e.value)),r=Array.from(new Array(24)).map((e=>100));return{labels:i,datasets:[{fill:"origin",data:a,backgroundColor:e.map((({value:e})=>t?D:this._getColorChart(e)))},{fill:"origin",data:r}]}}_getColorChart(e){return e>80?"rgb(190, 52, 97)":e>20?"rgb(78, 100, 234)":"rgb(100, 146, 234)"}_getColorLegend(e){return e>80?"var(--cc-color-text-danger)":e>20?"var(--cc-color-text-primary-strong)":"var(--cc-color-text-primary)"}_getCurrentPanel(){return this._docsPanelVisible?"docs":"error"===this.metricsState.type?"error":"empty"===this.metricsState.type?"empty":"loading"===this.metricsState.type||"loaded"===this.metricsState.type?"chart":void 0}_onToggleDocs(){this._docsPanelVisible=!this._docsPanelVisible}firstUpdated(){this._cpuChart=this._createChart(this._cpuCtxRef.value),this._memChart=this._createChart(this._memCtxRef.value)}updated(e){e.has("metricsState")&&(this._cpuChart.data="loaded"===this.metricsState.type?this._getChartData(this.metricsState.metricsData.cpuMetrics,!1):this._getChartData(A,!0),this._cpuChart.update(),this._cpuChart.resize(),this._memChart.data="loaded"===this.metricsState.type?this._getChartData(this.metricsState.metricsData.memMetrics,!1):this._getChartData(A,!0),this._memChart.update(),this._memChart.resize())}render(){const e="loading"===this.metricsState.type,t="loaded"===this.metricsState.type?this.metricsState.metricsData.cpuMetrics.slice(-1)[0]?.value:0,a="loaded"===this.metricsState.type?this.metricsState.metricsData.memMetrics.slice(-1)[0]?.value:0,r="loaded"===this.metricsState.type?this._getColorLegend(t):D,s="loaded"===this.metricsState.type?this._getColorLegend(a):D,c="loaded"===this.grafanaLinkState.type?this.grafanaLinkState.link:null,n=this._getCurrentPanel();return w`
      <div class="tile_title">
        ${"Métriques serveur"}
        <div class="docs-buttons">
          ${"loaded"===this.grafanaLinkState.type?w`
            ${C(this.grafanaLinkState.link,w`
              <cc-icon class="icon--grafana" .icon=${m} a11y-name="${"Ouvrir Grafana"}"></cc-icon>
            `,!1,"Ouvrir Grafana")}
          `:""}
          <cc-button
            class="docs-toggle ${z({"icon--close":this._docsPanelVisible,"icon--info":!this._docsPanelVisible})}"
            .icon=${this._docsPanelVisible?g:p}
            hide-text
            @cc-button:click=${this._onToggleDocs}
          > ${this._docsPanelVisible?"Afficher le graphique":"Afficher plus d'informations à propos de ce graphique"}
          </cc-button>
        </div>
      </div>
      <div class="tile_body ${z({"tile--hidden":"chart"!==n})}">
        <div class="category" aria-hidden="true">
          <cc-icon size="lg" class="icon--cpu" .icon=${u}></cc-icon>
          <div class="chart-container-wrapper chart-cpu">
            <div class="chart-container ${z({skeleton:e})}">
              <canvas id="cpu_chart" ${L(this._cpuCtxRef)}></canvas>
            </div>
          </div>
          <div class="current-percentage percent-cpu ${z({skeleton:e,"skeleton-data-value":e})}" style="color: ${r}">${P({percent:t/100})}
          </div>
          <div class="legend-cpu">${"Utilisation CPU sur 24h"}</div>
        </div>
        <div class="category" aria-hidden="true">
          <cc-icon size="lg" class="icon--mem" .icon=${h}></cc-icon>
          <div class="chart-container-wrapper chart-mem">
            <div class="chart-container ${z({skeleton:e})}">
              <canvas id="mem_chart" ${L(this._memCtxRef)}></canvas>
            </div>
          </div>
          <div class="current-percentage percent-mem ${z({skeleton:e,"skeleton-data-value":e})}" style="color: ${s}">${P({percent:a/100})}
          </div>
          <div class="legend-mem">${"Utilisation RAM sur 24h"}</div>
        </div>
        ${"loaded"===this.metricsState.type?this._renderAccessibleTable(this.metricsState.metricsData):""}
      </div>

      <div class="tile_message ${z({"tile--hidden":"empty"!==n})}">${"Pas de métriques. L'application est arrêtée."}</div>

      <div class="tile_message ${z({"tile--hidden":"error"!==n})}">
        <div class="error-message">
          <cc-icon .icon="${f}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
          <p>${"Une erreur est survenue pendant le chargement des métriques."}</p>
        </div>
      </div>

      <div class="tile_docs ${z({"tile--hidden":"docs"!==n})}">
        ${i`<p>Métriques reçues durant les dernières 24 heures.</p>
    <p>Chaque barre représente une fenêtre de temps de <strong>1 heure</strong>.</p>
    <p>Le pourcentage affiché représente une moyenne sur la dernière heure.</p>`}
        <div class="docs-links">
          <p>${"Plus de métriques : "}</p>
          <ul>
            <li>
              ${C(c,"Grafana",e,"Ouvrir Grafana")}
            </li>
            ${b(this.metricsLink)?"":w`
              <li>
                ${C(this.metricsLink,"Métriques",!1,"Ouvrir Métriques")}
              </li>
            `}
          </ul>
        </div>
      </div>
    `}_renderAccessibleTable({cpuMetrics:t,memMetrics:i}){return w`
      <table class="visually-hidden">
        <caption>${"Métriques serveur"}</caption>
        <thead>
        <tr>
          <th lang="en">${"Timestamp"}</th>
          <th>${"Utilisation CPU sur 24h"}</th>
          <th>${"Utilisation RAM sur 24h"}</th>
        </tr>
        </thead>
        <tbody>
        ${t.map(((t,a)=>{const r=i[a];return w`
            <tr>
              <th>${(({timestamp:t})=>e("fr",t))({timestamp:t.timestamp})}</th>
              <td>${P({percent:t.value/100})}</td>
              <td>${P({percent:r.value/100})}</td>
            </tr>
          `}))}
        </tbody>
      </table>
    `}static get styles(){return[y,k,$,_,S`
        /* region header */

        .tile_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .tile_title .cc-link {
          display: flex;
          width: 1.75em;
          height: 1.75em;
          box-sizing: border-box;
          align-items: center;
          justify-content: center;
          /* TODO: Change variable when we have proper border token */
          border: 1px solid var(--cc-color-bg-strong);
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-shadow: rgb(255 255 255 / 0%) 0 0 0 0;
          transition: box-shadow 75ms ease-in-out 0s;
        }

        .tile_title .cc-link:hover {
          box-shadow: rgb(0 0 0 / 40%) 0 1px 3px;
        }

        .docs-buttons {
          display: flex;
          align-items: center;
          font-size: 0.8em;
          gap: 0.5em;
        }

        /* endregion */

        /* region chart */

        .chart-container-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          grid-area: chart-wrapper;
        }

        .chart-cpu {
          grid-area: chart-cpu;
        }

        .chart-mem {
          grid-area: chart-mem;
        }

        .chart-container {
          position: absolute;
          width: 100%;
          min-width: 0;
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
          margin: auto;
        }

        /* endregion */

        /* region tile-body */

        .tile_body {
          position: relative;
          min-height: 8.75em;
          align-items: center;
          gap: 0 1em;
          grid-template-areas: 
            'icon-cpu chart-cpu percent-cpu'
            '. legend-cpu .'
            'icon-mem chart-mem percent-mem'
            '. legend-mem .';
          grid-template-columns: min-content 1fr min-content;
          grid-template-rows: 1fr max-content 1fr max-content;
        }

        .percent-cpu {
          grid-area: percent-cpu;
        }

        .percent-mem {
          grid-area: percent-mem;
        }

        .skeleton-data-value {
          background-color: #bbb;
        }

        /*
          body, message and docs are placed in the same area (on top of each other)
          this way, we can just hide the docs
          and let the tile take at least the height of the docs text content
         */

        .tile_body,
        .tile_message,
        .tile_docs {
          grid-area: 2 / 1 / 3 / 2;
        }

        /* See above why we hide instead of display:none */

        .tile--hidden {
          visibility: hidden;
        }

        .category {
          display: contents;
        }

        .current-percentage {
          justify-self: end;
        }

        .legend-cpu,
        .legend-mem {
          align-self: center;
          margin-top: 0.5em;
          color: var(--cc-color-text-weak);
          font-size: 0.75em;
          font-style: italic;
          justify-self: center;
        }

        .legend-cpu {
          margin-bottom: 1.25em;
          grid-area: legend-cpu;
        }

        .legend-mem {
          grid-area: legend-mem;
        }

        .tile_docs {
          display: grid;
          align-content: center;
        }

        p {
          margin: 0;
        }

        .tile_docs ul {
          display: flex;
          padding: 0;
          margin: 0;
          gap: 0.5em;
          list-style: none;
        }

        .docs-links {
          display: flex;
          align-items: flex-end;
          margin-top: 0.5em;
          gap: 0.5em;
        }

        /* endregion */

        /* region icons */

        .icon--close {
          --cc-icon-size: 1.4em;
        }

        .icon--info {
          --cc-icon-color: var(--color-blue-60);
          --cc-icon-size: 1.25em;
        }

        .icon--grafana {
          --cc-icon-size: 1.25em;
        }

        .icon--cpu {
          grid-area: icon-cpu;

          --cc-icon-color: var(--cc-color-text-weak);
        }

        .icon--mem {
          grid-area: icon-mem;

          --cc-icon-color: var(--cc-color-text-weak);
        }
        
        /* endregion */
        
        /* region error */

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
        
        /* endregion */
      `]}}window.customElements.define("cc-tile-metrics",M);export{M as CcTileMetrics};
