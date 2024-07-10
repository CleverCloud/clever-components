import"./cc-img-8b44c495.js";import{s as t}from"./skeleton-68a3d018.js";import{s as e,x as a,i as s}from"./lit-element-98ed46d4.js";import{l}from"./if-defined-cd9b1ec0.js";import{o}from"./class-map-1feb5cf7.js";const r=({code:t,name:e})=>function(t,e,a){try{return new Intl.DisplayNames([t],{type:"region"}).of(e.toUpperCase())}catch(t){return a}}("fr",t,e);const i={name:"name",country:"????????????",countryCode:null,lon:0,lat:0,city:"??????????",tags:["????????","????????????"]};class n extends e{static get properties(){return{mode:{type:String,reflect:!0},state:{type:Object}}}constructor(){super(),this.mode="default",this.state={type:"loading"}}static getText(t){const{title:e,subtitle:a,infra:s}=n._getTextParts(t),l=[e,a].filter((t=>null!=t)).join(", ");return null!=s?`${l} (${s})`:l}static _getTextParts(t){if(t.tags.includes("scope:private")&&null!=t.displayName)return{title:t.displayName};const e=t.tags.find((t=>t.startsWith("infra:"))),a=e?.split(":")[1]??null;return{title:t.city,subtitle:r({code:t.countryCode,name:t.country}),infra:a}}render(){const t="loading"===this.state.type,e="loaded"===this.state.type?this.state:i,{title:s,subtitle:r,infra:c}=n._getTextParts(e);return a`
      <cc-img
        class="flag"
        ?skeleton=${t}
        src=${l((m=e.countryCode,null!=m?`https://assets.clever-cloud.com/flags/${m.toLowerCase()}.svg`:m))}
        a11y-name=${l(e.countryCode)}
      ></cc-img>
      <div class="wrapper-details-logo">
        <div class="wrapper-details">
          <div class="details">
            <span class="title ${o({skeleton:t})}">${s}</span>
            <span class="subtitle ${o({skeleton:t})}">${r}</span>
          </div>
          ${null!=c?a`
            <cc-img class="infra-logo ${o({skeleton:t})}" src=${d=c,null!=d?`https://assets.clever-cloud.com/infra/${d}.svg`:d} a11y-name=${c}></cc-img>
          `:""}
        </div>
        <div class="tag-list">
          ${e.tags.map((e=>this._renderTag(e,t)))}
        </div>
      </div>
    `;var d,m}_renderTag(t,e){if(t.includes(":")){const[s,l]=t.split(":");return a`
        <span class="tag ${o({skeleton:e})}">
          <span class="tag__category">${s}:</span>
          <span>${l}</span>
        </span>
      `}return a`
      <span class="tag ${o({skeleton:e})}">${t}</span>
    `}static get styles(){return[t,s`
        :host {
          --lh: 1.5em;

          display: flex;
        }

        :host([mode='small']),
        :host([mode='small-infra']) {
          --lh: 1em;
        }

        .flag {
          display: inline-block;
          width: 2em;
          height: var(--lh);
          margin-right: 1em;
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-shadow: 0 0 3px rgb(0 0 0 / 40%);
        }

        :host([mode='small']) .flag,
        :host([mode='small-infra']) .flag {
          width: 1.33em;
          margin-right: 0.5em;
        }

        .wrapper-details-logo {
          min-height: var(--lh);
          flex: 1 1 0;
        }

        .wrapper-details {
          display: flex;
        }

        .details {
          flex: 1 1 0;
          align-self: center;
          line-height: var(--lh);
        }

        :host([mode='small']) .title,
        :host([mode='small']) .subtitle,
        :host([mode='small-infra']) .title,
        :host([mode='small-infra']) .subtitle {
          font-size: 0.8em;
        }

        .title {
          font-weight: bold;
        }

        .subtitle {
          color: var(--cc-zone-subtitle-color, var(--cc-color-text-weak));
        }

        .infra-logo {
          --cc-img-fit: contain;

          width: 4em;
          height: var(--lh);
          margin-left: 0.5em;
        }

        :host([mode='small']) .tag-list,
        :host([mode='small']) .infra-logo,
        :host([mode='small-infra']) .tag-list {
          display: none;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.1em;
          gap: 0.5em;
        }

        .tag {
          display: flex;
          box-sizing: border-box;
          padding: var(--cc-zone-tag-padding, 0.1em 0.3em);
          border: 1px solid var(--cc-zone-tag-bdcolor, transparent);
          background-color: var(--cc-zone-tag-bgcolor, var(--cc-color-bg-soft, #eee));
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-zone-tag-textcolor, var(--cc-color-text-default, #000));
          font-family: var(--cc-zone-tag-font-family, var(--cc-ff-monospace));
          font-size: 0.8em;
          line-height: 1.5;
        }

        .tag__category {
          font-weight: var(--cc-zone-tag-category-font-weight, normal);
        }

        .skeleton {
          color: transparent !important;
        }

        .skeleton:not(.tag) {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-zone",n);export{n as CcZone};
