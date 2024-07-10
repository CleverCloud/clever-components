import{a as e,b as t}from"./i18n-number-a9c20d27.js";import{s}from"./i18n-sanitize-4edc4a2d.js";import{p as i}from"./i18n-string-3f556d8d.js";import"./cc-button-fafeef50.js";import{C as o,A as a,D as r,k as n,p as c}from"./chart.esm-50c173f4.js";import{n as d}from"./cc-clever.icons-e2a98bd6.js";import{k as l,j as h}from"./cc-remix.icons-d7d44eac.js";import{t as p}from"./info-tiles-8286a15a.js";import{s as u}from"./skeleton-68a3d018.js";import{l as m}from"./cc-link-f2b8f554.js";import{B as g,A as f,s as b,x as y,i as _}from"./lit-element-98ed46d4.js";import{e as v,i as w}from"./directive-de55b00a.js";import{n as k,m as j,s as x,r as T,a as C}from"./directive-helpers-34e7fc26.js";import{o as P}from"./class-map-1feb5cf7.js";const R="fr",$=i(R),N=v(class extends w{constructor(e){super(e),this.tt=new WeakMap}render(e){return[e]}update(e,[t]){if(k(this.et)&&(!k(t)||this.et.strings!==t.strings)){const t=j(e).pop();let s=this.tt.get(this.et.strings);if(void 0===s){const e=document.createDocumentFragment();s=g(f,e),s.setConnected(!1),this.tt.set(this.et.strings,s)}x(s,[t]),T(s,void 0,t)}if(k(t)){if(!k(this.et)||this.et.strings!==t.strings){const s=this.tt.get(t.strings);if(void 0!==s){const t=j(s).pop();C(e),T(e,void 0,t),x(e,[t])}}this.et=t}else this.et=void 0;return this.render(t)}});var E={100:"Continue",101:"Switching Protocols",102:"Processing",103:"Early Hints",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",208:"Already Reported",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",307:"Temporary Redirect",308:"Permanent Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Payload Too Large",414:"URI Too Long",415:"Unsupported Media Type",416:"Range Not Satisfiable",417:"Expectation Failed",418:"I'm a Teapot",421:"Misdirected Request",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",425:"Too Early",426:"Upgrade Required",428:"Precondition Required",429:"Too Many Requests",431:"Request Header Fields Too Large",451:"Unavailable For Legal Reasons",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",508:"Loop Detected",509:"Bandwidth Limit Exceeded",510:"Not Extended",511:"Network Authentication Required"},q=A;function L(e){if(!Object.prototype.hasOwnProperty.call(A.message,e))throw new Error("invalid status code: "+e);return A.message[e]}function A(e){if("number"==typeof e)return L(e);if("string"!=typeof e)throw new TypeError("code must be a number or string");var t=parseInt(e,10);return isNaN(t)?function(e){var t=e.toLowerCase();if(!Object.prototype.hasOwnProperty.call(A.code,t))throw new Error('invalid status message: "'+e+'"');return A.code[t]}(e):L(t)}A.message=E,A.code=function(e){var t={};return Object.keys(e).forEach((function(s){var i=e[s],o=Number(s);t[i.toLowerCase()]=o})),t}(E),A.codes=function(e){return Object.keys(e).map((function(e){return Number(e)}))}(E),A.redirect={300:!0,301:!0,302:!0,303:!0,305:!0,307:!0,308:!0},A.empty={204:!0,205:!0,304:!0},A.retry={502:!0,503:!0,504:!0};var I=q;o.register(a,r,n,c);const O={1:"#bbb",2:"#30ab61",3:"#365bd3",4:"#ff9f40",5:"#cf3942"},M={200:1};class S extends b{static get properties(){return{state:{type:Object},_docs:{type:Boolean,state:!0},_empty:{type:Boolean,state:!0},_skeleton:{type:Boolean,state:!0}}}constructor(){super(),this.state={type:"loading"},this._docs=!1,this._empty=!1,this._skeleton=!1}_onToggleDocs(){this._docs=!this._docs}firstUpdated(s){"error"!==this.state.type&&(this._ctx=this.renderRoot.getElementById("chart"),this._chart=new o(this._ctx,{type:"doughnut",options:{responsive:!0,maintainAspectRatio:!1,plugins:{datalabels:{display:!1},legend:{onClick:function(e,t){this.chart.data.labels.forEach(((s,i)=>{const o=s===t.text;(function(e,t){return Number(e)^Number(t)})(e.native.shiftKey,o)&&this.chart.toggleDataVisibility(i)})),this.chart.update()},onHover:e=>{this._ctx.style.cursor="pointer"},onLeave:e=>{this._ctx.style.cursor=null},position:"right",labels:{fontFamily:"monospace",usePointStyle:!0,filter:(e,t)=>e.text!==t.labels[e.index-1]}},tooltip:{backgroundColor:"#000",displayColors:!1,callbacks:{title:([e])=>{const t=this._labels[e.dataIndex];return`HTTP ${t}: ${I.message[t]}`},label:s=>{const i=s.dataset.data,o=i.reduce(((e,t)=>e+t),0),a=i[s.dataIndex];return(({value:s,percent:i})=>{const o=$(s,"requête");return`${e(R,s)} ${o} (${t(R,i)})`})({value:a,percent:a/o})}}}},animation:{duration:0}}}))}updated(e){if(e.has("state")){if("error"===this.state.type)return;this._skeleton="loading"===this.state.type;const e=this._skeleton?M:this.state.statusCodes;this._empty=0===Object.keys(e).length,this._labels=Object.keys(e),this._chartLabels=this._skeleton?this._labels.map((()=>"???")):this._labels.map((e=>e[0]+"xx")),this._data=Object.values(e),this._backgroundColor=this._skeleton?this._labels.map((()=>"#bbb")):this._labels.map((e=>O[e[0]])),this.updateComplete.then((()=>{this._chart.options.animation.duration=this._skeleton?0:300,this._chart.options.plugins.tooltip.enabled=!this._skeleton,this._chart.data={labels:this._chartLabels,datasets:[{data:this._data,backgroundColor:this._backgroundColor}]},this._chart.update()}))}super.updated(e)}render(){const e="error"===this.state.type,t=!e&&!this._empty&&!this._docs,i=e&&!this._docs,o=this._empty&&!this._docs,a=this._docs;return y`
      <div class="tile_title tile_title--image">
        ${"Codes de réponses HTTP"}
        <cc-button
          class="docs-toggle ${a?"close":"info"}"
          .icon=${a?l:d}
          hide-text
          outlined
          primary
          @cc-button:click=${this._onToggleDocs}
        >${this._docs?"Afficher le graphe":"À propos de ce graphe..."}
        </cc-button>
      </div>

      ${N(t?y`
        <div class="tile_body">
          <!-- https://www.chartjs.org/docs/latest/general/responsive.html -->
          <div class="chart-container ${P({skeleton:this._skeleton})}">
            <canvas id="chart"></canvas>
          </div>
        </div>
      `:"")}

      ${o?y`
        <div class="tile_message">${"Il n'y a pas de données à afficher pour l'instant."}</div>
      `:""}

      ${i?y`
        <div class="tile_message">
          <div class="error-message">
            <cc-icon .icon="${h}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
            <p>${"Une erreur est survenue pendant le chargement des codes de réponses HTTP."}</p>
          </div>
        </div>
      `:""}

      <div class="tile_docs ${P({"tile_docs--hidden":!a})}">
        <p>${"Répartition des codes de réponses HTTP envoyés durant les dernières 24 heures. Cliquez sur les éléments de légende pour cacher/montrer certaines catégories de codes."}</p>
        <p>${s`<a href="https://developer.mozilla.org/fr/docs/Web/HTTP/Status">Codes de réponses HTTP (MDN)</a>`}</p>
      </div>
    `}static get styles(){return[p,u,m,_`
        .tile_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .docs-toggle {
          margin: 0 0 0 1em;
          font-size: 0.8em;
        }

        .docs-toggle.close {
          --cc-icon-size: 1.5em;
        }

        .docs-toggle.info {
          --cc-icon-size: 1.25em;
        }

        .tile_body {
          position: relative;
        }

        .chart-container {
          position: absolute;
          width: 100%;
          min-width: 0;
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
        }

        /*
          body, message and docs are placed in the same area (on top of each other)
          this way, we can just hide the docs
          and let the tile take at least the height of the docs text content
         */

        .tile_body,
        .tile_message,
        .tile_docs {
          grid-area: 2 / 1 / 2 / 1;
        }

        .tile_docs {
          align-self: center;
          font-size: 0.9em;
          font-style: italic;
        }

        /* See above why we hide instead of display:none */

        .tile_docs.tile_docs--hidden {
          visibility: hidden;
        }

        .tile_docs_link {
          color: var(--cc-color-text-highlight);
          text-decoration: underline;
        }

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
      `]}}window.customElements.define("cc-tile-status-codes",S);export{S as CcTileStatusCodes};
