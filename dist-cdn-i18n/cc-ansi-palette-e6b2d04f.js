import{a as t}from"./i18n-number-a9c20d27.js";import"./cc-input-text-8d29ec56.js";import"./cc-icon-f84255c7.js";import{p as e,q as r}from"./cc-remix.icons-d7d44eac.js";import{a as o}from"./ansi-palette-style-b61eb317.js";import{s as i,x as n,i as c}from"./lit-element-98ed46d4.js";import{o as l}from"./class-map-1feb5cf7.js";function s(t){const e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);if(null==e)throw new Error(`The color "${t}" is not in hex format`);return{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}}function a(t){return.2126*p(t.r)+.7152*p(t.g)+.0722*p(t.b)}function d(t,e){return(t+.05)/(e+.05)}function p(t){const e=t/255;return e<=.03928?e/12.92:Math.pow((e+.055)/1.055,2.4)}const u=["red","green","yellow","blue","magenta","cyan"];function m(t){const e=s(t.background),r=function(t){const e=[...u,t?"white":"black"];return[...e,...e.map((t=>`bright-${t}`))]}(a(e)<.5);const o=r.length;let i=0,n=0;const c={};return r.forEach((r=>{const o=function(t,e){const r=a(t),o=a(e);return r>o?d(r,o):d(o,r)}(e,s(t[r])),l=o>=4.5;l&&n++,i+=o,c[r]={ratio:o,compliant:l}})),{totalColors:o,compliantColors:n,contrastAvg:i/o,contrasts:c}}const g=["red","green","yellow","blue","magenta","cyan"];class f extends i{static get properties(){return{name:{type:String},palette:{type:Object}}}constructor(){super(),this.name="",this.palette=null,this._style="",this._analysis=null}willUpdate(t){t.has("palette")&&(this._style=o(this.palette).replaceAll(";",";\n").slice(0,-1),this._analysis=m(this.palette))}render(){return null==this.palette?"":n`
      <div class="main" style="${this._style}">
        <div class="top">
          <div class="title">${this.name}</div>
          <div class="title--right">${(({foreground:t,background:e})=>`Texte : ${t}, Fond: ${e}`)({foreground:this.palette.foreground,background:this.palette.background})}</div>
        </div>
        <div class="hover">${(({color:t})=>`Survol : ${t}`)({color:this.palette["background-hover"]})}</div>
        <div class="selected">${(({color:t})=>`Sélection: ${t}`)({color:this.palette["background-selected"]})}</div>

        <div class="colors-grid">
          ${g.map((t=>this.renderColorGridLine(t)))}
        </div>
      </div>

      <cc-input-text 
        readonly 
        multi
        clipboard
        .value=${this._style}
      ></cc-input-text>
    `}renderColorGridLine(t){const e=`bright-${t}`;return n`
      <div class="color color--left">
        ${this.renderColor(t)}
      </div>
      ${this.renderSquare(t)}
      ${this.renderSquare(e)}
      <div class="color color--right">
        ${this.renderColor(e)}
      </div>
    `}renderSquare(t){return n`<div class="square" style="background-color: var(--cc-color-ansi-${t});"></div>`}renderColor(o){const i=this.palette[o],c=this._analysis.contrasts[o],s=c.compliant?e:r,a=c.compliant?"Couleur qui respecte le RGAA":"Couleur qui ne respecte pas le RGAA";return n`
      <span style="color: var(--cc-color-ansi-${o});">AaBbMmYyZz</span>
      <span>${i}</span>
      <div class="ratio ${l({compliant:c.compliant,"not-compliant":!c.compliant})}">
        <cc-icon .icon=${s} size="lg" a11y-name="${a}"></cc-icon>
        ${(({ratio:e})=>t("fr",e,{minimumFractionDigits:2,maximumFractionDigits:2}).padStart(5,"0"))({ratio:c.ratio})}  
      </div>
    `}static get styles(){return[c`
        :host {
          display: block;
          font-family: var(--cc-ff-monospace, monospace);
        }
        
        .top {
          display: flex;
        }

        .top,
        .hover,
        .selected {
          padding: 0.2em;
        }

        .title {
          flex: 1;
          font-weight: bold;
        }

        .title--right {
          flex-shrink: 0;
        }

        .hover {
          background-color: var(--cc-color-ansi-background-hover);
        }

        .selected {
          background-color: var(--cc-color-ansi-background-selected);
        }
        
        .colors-grid {
          display: grid;
          align-items: center;
          padding-top: 1em;
          padding-bottom: 1em;
          grid-column-gap: 0.5em;
          grid-template-columns: 1fr min-content min-content 1fr;
        }
        
        .color-line {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .palette-squares {
          display: inline-flex;
        }

        .palette-colors {
          display: flex;
        }

        .square {
          width: 3em;
          height: 3em;
        }

        .color {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 1em;
        }

        .color--left {
          justify-self: end;
        }
        
        .color--right {
          justify-self: start;
        }
        
        .ratio {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.3em;
        }

        .compliant {
          color: var(--cc-color-text-success, green);
        }

        .not-compliant {
          color: var(--cc-color-text-danger, red);
        }

        cc-input-text {
          overflow: auto;
          max-height: 200px;
          margin-top: 1em;
        }
      `]}}window.customElements.define("cc-ansi-palette",f);export{f as CcAnsiPaletteComponent};
