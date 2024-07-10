import{s as e}from"./skeleton-68a3d018.js";import{s as t,x as r,i as o}from"./lit-element-98ed46d4.js";import{o as i}from"./class-map-1feb5cf7.js";import{l as s}from"./if-defined-cd9b1ec0.js";class a extends t{static get properties(){return{a11yName:{type:String,attribute:"a11y-name"},skeleton:{type:Boolean,reflect:!0},src:{type:String},_error:{type:Boolean,state:!0},_loaded:{type:Boolean,state:!0}}}constructor(){super(),this.a11yName=null,this.skeleton=!1,this.src=null,this._error=!1,this._loaded=!1}_onLoad(e){this._loaded=!0,this.skeleton=!1}_onError(e){this._error=!0,this.skeleton=!1}willUpdate(e){e.has("src")&&(this._error=!1,this._loaded=!1)}render(){const e=this.a11yName??"",t=null!=this.src&&!this._loaded&&!this._error,o=this.skeleton||t,a=null==this.src||this._error;return r`
      <div class="wrapper ${i({skeleton:o,loaded:this._loaded})}">
        <img src=${s(this.src??void 0)} @load=${this._onLoad} @error=${this._onError} alt=${e}>
        ${a?r`
            <!-- We use aria-hidden because we already have an alt value. -->
          <div class="error-msg" aria-hidden="true">${e}</div>
        `:""}
      </div>
    `}static get styles(){return[e,o`
        :host {
          display: inline-block;
          overflow: hidden;
        }

        .wrapper,
        img {
          width: 100%;
          height: 100%;
        }

        .wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wrapper.skeleton {
          background-color: #bbb;
        }

        .wrapper.text {
          background-color: var(--cc-color-bg-neutral, #eee);
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          object-fit: var(--cc-img-fit, cover);
          object-position: center center;
          opacity: 0;
          transition: opacity 150ms ease-in-out;
        }

        .wrapper.loaded img {
          opacity: 1;
        }

        .error-msg {
          overflow: hidden;
          padding: 0.3em;
          font-size: 0.85em;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `]}}window.customElements.define("cc-img",a);export{a as CcImg};
