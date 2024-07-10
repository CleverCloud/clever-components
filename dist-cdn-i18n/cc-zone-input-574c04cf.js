import"./cc-zone-7636cf9c.js";import"./cc-map-fc276436.js";import"./cc-notice-9b1eec7a.js";import"./cc-map-marker-server-5eb94bc5.js";import{R as e}from"./resize-controller-3aadf1c4.js";import{s as t}from"./dom-ad431943.js";import{d as s}from"./events-4c8e3503.js";import{P as o,s as r}from"./zone-ff1564f2.js";import{s as a,x as i,i as n}from"./lit-element-98ed46d4.js";import{e as c,n as l}from"./ref-948c5e44.js";import{c as d}from"./repeat-92fcb4ec.js";import{o as p}from"./class-map-1feb5cf7.js";const h=new Array(6).fill(),m=[600];class u extends a{static get properties(){return{selected:{type:String},state:{type:Object},_hovered:{type:String,state:!0},_legend:{type:String,state:!0},_points:{type:Array,state:!0},_sortedZones:{type:Array,state:!0}}}constructor(){super(),this.selected=null,this.state={type:"loading"},this._ccMapRef=c(),this._hovered=null,this._legend="",this._points=[],this._sortedZones=null,new e(this,{widthBreakpoints:m})}_getState(e){return this.selected===e?"selected":this._hovered===e?"hovered":"default"}_getZIndexOffset(e){return this.selected===e?200:this._hovered===e?250:0}_onListHover(e){this._hovered=e,this._updatePoints(),this._panMap()}_onMarkerHover(e){const t=e?.detail?.name;this._hovered=t,this._updatePoints(),this._scrollChildIntoParent(this._hovered||this.selected)}_onSelect(e){this.selected=e,s(this,"input",this.selected)}_panMap(){clearTimeout(this._panMapTimeout),this._panMapTimeout=setTimeout((()=>{if(null!=this._hovered){const e=this._sortedZones.find((e=>e.name===this._hovered));this._ccMapRef.value?.panInside(e.lat,e.lon)}else if(null!=this.selected){const e=this._sortedZones.find((e=>e.name===this.selected));this._ccMapRef.value?.panInside(e.lat,e.lon)}}),200)}_scrollChildIntoParent(e){const s=this.shadowRoot.querySelector(".zone-list-wrapper"),o=this.shadowRoot.querySelector(`input[id=${e}]`);t(s,o)}_updatePoints(){Array.isArray(this._sortedZones)&&(this._points=this._sortedZones.filter((e=>!e.tags.includes(o))).map((e=>({name:e.name,lat:e.lat,lon:e.lon,marker:{tag:"cc-map-marker-server",state:this._getState(e.name),keyboard:!1},tooltip:{tag:"cc-zone",state:{type:"loaded",...e},mode:"small"},zIndexOffset:this._getZIndexOffset(e.name)}))),this._legend=this._sortedZones.some((e=>e.tags.includes(o)))?"Les zones privées n'apparaissent pas sur la carte.":"")}updated(e){e.has("selected")&&"error"!==this.state.type&&(this._updatePoints(),this._scrollChildIntoParent(this.selected),this._panMap()),e.has("state")&&"loaded"===this.state.type&&this._updatePoints(),super.updated(e)}willUpdate(e){e.has("state")&&"loaded"===this.state.type&&(this._sortedZones=r(this.state.zones))}render(){const e="loading"===this.state.type,t="loaded"===this.state.type?this._sortedZones:h;return"error"===this.state.type?i`
        <cc-notice intent="warning" message="${"Une erreur est survenue pendant le chargement des zones."}"></cc-notice>
      `:i`
      <div class="wrapper">
        <cc-map
          view-zoom="1"
          center-lat="35"
          .points=${this._points}
          ?loading=${e}
          @cc-map:marker-click=${({detail:e})=>this._onSelect(e.name)}
          @cc-map:marker-enter=${this._onMarkerHover}
          @cc-map:marker-leave=${()=>this._onMarkerHover()}
          ${l(this._ccMapRef)}
        >${this._legend}
        </cc-map>
        <div class="zone-list-wrapper">
          <div class="zone-list">
            ${d(t,(e=>e?.name??""),(t=>this._renderZoneInput(t,e)))}
          </div>
        </div>
      </div>
    `}_renderZoneInput(e,t){return t?i`
        <div class="zone">
          <div class="label">
            <cc-zone></cc-zone>
          </div>
        </div>
      `:i`
      <div class="zone-choice">
        <input
          type="radio"
          name="zone"
          .value=${e.name}
          id=${e.name}
          .checked=${e.name===this.selected}
          @change=${()=>this._onSelect(e.name)}
        >
        <label
          for=${e.name}
          class="label ${p({hovered:e.name===this._hovered})}"
          @mouseenter=${()=>this._onListHover(e.name)}
          @mouseleave=${()=>this._onListHover()}
        >
          <cc-zone .state=${{type:"loaded",...e}}></cc-zone>
        </label>
      </div>
    `}static get styles(){return[n`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          overflow: hidden;
          height: 100%;
          box-sizing: border-box;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-map,
        .zone-list-wrapper {
          flex-grow: 1;
        }

        cc-map {
          width: 100%;
          height: 100%;
          flex-basis: 0;
          border-right: 1px solid var(--cc-color-border-neutral, #aaa);
        }

        :host([w-lt-600]) cc-map {
          display: none;
        }

        .zone-list-wrapper {
          overflow: auto;
          height: 100%;
          box-sizing: border-box;
        }

        :host([w-gte-600]) .zone-list-wrapper {
          max-width: 24em;
          flex-basis: 24em;
        }

        .zone-list {
          margin: 0.5em;
        }

        .zone-list:not(:hover):focus-within {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .zone-choice {
          display: grid;
          overflow: hidden;
        }

        input,
        .label {
          grid-area: 1 / 1 / 2 / 2;
        }

        input {
          display: block;
          box-sizing: border-box;
          border: 0;
          margin: -0.5em;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }

        .label {
          display: block;
          box-sizing: border-box;
          padding: 0.5em;
          border: 2px solid var(--bd-color, transparent);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        label {
          cursor: pointer;
        }

        input:checked + .label {
          --bd-color: var(--cc-color-bg-primary-highlight, #000);
        }

        label.hovered,
        input:hover + .label {
          background: var(--cc-color-bg-neutral, #f9f9f9);
        }

        cc-zone {
          width: 100%;
        }
      `]}}window.customElements.define("cc-zone-input",u);export{u as CcZoneInput};
