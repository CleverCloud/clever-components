import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-toggle-34554172.js";import"./cc-map-marker-dot-4e1974e3.js";import"./cc-map-fc276436.js";import{d as t}from"./events-4c8e3503.js";import{s as o,x as a,i as r}from"./lit-element-98ed46d4.js";class i extends o{static get properties(){return{appName:{type:String,attribute:"app-name"},availableModes:{type:Array,attribute:"available-modes"},centerLat:{type:Number,attribute:"center-lat"},centerLon:{type:Number,attribute:"center-lon"},error:{type:Boolean,reflect:!0},heatmapPoints:{type:Array,attribute:"heatmap-points"},loading:{type:Boolean,reflect:!0},mode:{type:String},orgaName:{type:String,attribute:"orga-name"},viewZoom:{type:Number,attribute:"view-zoom"},_points:{type:Array,state:!0}}}constructor(){super(),this.appName=null,this.availableModes=["points","heatmap"],this.centerLat=48.9,this.centerLon=2.4,this.error=!1,this.heatmapPoints=null,this.loading=!1,this.mode="points",this.orgaName=null,this.viewZoom=2,this._points=[],this._pointsByCoords={}}addPoints(e,t={}){const{spreadDuration:o=!1}=t,a=!1!==o?Math.floor(o/e.length):0;e.forEach(((e,t)=>{setTimeout((()=>this._addPoint(e)),a*t)}))}_addPoint({lat:e,lon:t,count:o=1,delay:a=1e3,tooltip:r}){const i=[e,t].join(","),s={lat:e,lon:t,count:o,tooltip:r};null==this._pointsByCoords[i]&&(this._pointsByCoords[i]=[]),this._pointsByCoords[i].push(s),this._updatePoints(),setTimeout((()=>{this._pointsByCoords[i]=this._pointsByCoords[i].filter((e=>e!==s)),0===this._pointsByCoords[i].length&&delete this._pointsByCoords[i],this._updatePoints()}),a)}_updatePoints(){this._points=Object.entries(this._pointsByCoords).map((([e,t])=>{const{lat:o,lon:a}=t[0],r=t.map((e=>e.count)).reduce(((e,t)=>e+t),0),i=t.filter((e=>null!=e.tooltip&&""!==e.tooltip)).map((e=>e.tooltip)),s=Array.from(new Set(i));s.length>=3&&(s.length=3,s[2]=s[2]+"...");return{lat:o,lon:a,marker:{tag:"cc-map-marker-dot",count:r},tooltip:s.length>0?s.join("<br>"):null}}))}_getModes(){const e=[{label:"En direct",value:"points"},{label:"Dernières 24h",value:"heatmap"}];return this.availableModes.map((t=>e.find((({value:e})=>e===t)))).filter((e=>null!=e))}_getLegend(){return"points"===this.mode?null==this.appName?(({orgaName:t})=>e`Carte temps réel des requêtes HTTP reçues par toutes les applications de <strong>${t}</strong>.`)({orgaName:this.orgaName}):(({appName:t})=>e`Carte temps réel des requêtes HTTP reçues par l'application <strong>${t}</strong>.`)({appName:this.appName}):null==this.appName?(({orgaName:t})=>e`Carte de chaleur des requêtes HTTP reçues par les applications de <strong>${t}</strong> durant les dernières 24 heures.`)({orgaName:this.orgaName}):(({appName:t})=>e`Carte de chaleur des requêtes HTTP reçues par l'application <strong>${t}</strong> durant les dernières 24 heures.`)({appName:this.appName})}render(){const e=this._getModes();return a`
      ${e.length>1?a`
        <cc-toggle
          .choices=${e}
          value=${this.mode}
          @cc-toggle:input=${this._onModeChange}
        ></cc-toggle>
      `:""}
      <cc-map
        center-lat=${this.centerLat}
        center-lon=${this.centerLon}
        view-zoom=${this.viewZoom}
        mode=${this.mode}
        ?loading=${this.loading}
        ?error=${this.error}
        .heatmapPoints=${this.heatmapPoints}
        .points=${this._points}
      >${this._getLegend()}
      </cc-map>
    `}_onModeChange({detail:e}){this.mode=e,t(this,"mode",this.mode)}static get styles(){return r`
      :host {
        position: relative;
        display: block;
        overflow: hidden;
        width: 20em;
        height: 15em;
        border: 1px solid var(--cc-color-border-neutral, #aaa);
        background-color: var(--cc-color-bg-default, #fff);
        border-radius: var(--cc-border-radius-default, 0.25em);
      }

      cc-toggle {
        position: absolute;
        z-index: 2;
        top: 0.5em;
        left: 0.5em;
      }

      cc-map {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      cc-map[view-zoom='1'] {
        --cc-map-marker-dot-size: 6px;
      }

      cc-map[view-zoom='2'] {
        --cc-map-marker-dot-size: 8px;
      }

      cc-map[view-zoom='3'] {
        --cc-map-marker-dot-size: 10px;
      }

      cc-map[view-zoom='4'] {
        --cc-map-marker-dot-size: 12px;
      }

      cc-map[view-zoom='5'] {
        --cc-map-marker-dot-size: 14px;
      }

      cc-map[view-zoom='6'] {
        --cc-map-marker-dot-size: 16px;
      }
    `}}window.customElements.define("cc-logsmap",i);export{i as CcLogsMap};
