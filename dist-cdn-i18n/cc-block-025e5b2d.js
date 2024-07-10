import"./cc-button-fafeef50.js";import"./cc-expand-a1ff031c.js";import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import{d as e,e as t}from"./cc-remix.icons-d7d44eac.js";import{s as o,x as i,i as r}from"./lit-element-98ed46d4.js";import{o as a}from"./class-map-1feb5cf7.js";class s extends o{static get properties(){return{icon:{type:Object},image:{type:String},noHead:{type:Boolean,attribute:"no-head",reflect:!0},ribbon:{type:String,reflect:!0},state:{type:String,reflect:!0},_overlay:{type:Boolean,state:!0}}}constructor(){super(),this.icon=null,this.image=null,this.noHead=!1,this.ribbon=null,this.state="off",this._overlay=!1}_clickToggle(){"close"===this.state?this.state="open":"open"===this.state&&(this.state="close")}render(){const o="open"===this.state||"close"===this.state,r="close"!==this.state;return i`

      ${null!=this.ribbon&&""!==this.ribbon?i`
        <div class="info-ribbon">${this.ribbon}</div>
      `:""}
      
      ${this.noHead?"":i`
        <div class="head" @click=${this._clickToggle}>
          ${null!=this.image&&null==this.icon?i`
            <cc-img src="${this.image}"></cc-img>
          `:""}
          ${null!=this.icon?i`
            <cc-icon size="lg" .icon=${this.icon}></cc-icon>
          `:""}
          <slot name="title"></slot>
          ${o?i`
            <cc-button
              class="toggle_button"
              .icon=${r?e:t}
              hide-text
              outlined
              primary
              @cc-button:click=${this._clickToggle}
            >${r?"Fermer":"Ouvrir"}
            </cc-button>
          `:""}
          <slot name="button"></slot>
        </div>
      `}

      <cc-expand class="main-wrapper ${a({"main-wrapper--overlay":this._overlay})}">
        ${!o||r?i`
          <div class="main">
            <slot></slot>
          </div>
        `:""}
      </cc-expand>

      <slot name="overlay"></slot>
    `}firstUpdated(){const e=this.shadowRoot.querySelector('slot[name="overlay"]');e.addEventListener("slotchange",(t=>{const o=this._overlay;this._overlay=e.assignedNodes().length>0,this.requestUpdate("_overlay",o)}))}static get styles(){return[r`
        :host {
          position: relative;
          display: grid;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .head {
          display: flex;
          align-items: center;
          padding: 1em;
          color: var(--cc-color-text-primary-strongest);
        }

        :host([ribbon]) .head {
          padding-left: 3.5em;
        }

        :host([state='open']) .head:hover,
        :host([state='close']) .head:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
          cursor: pointer;
        }

        cc-img {
          width: 1.5em;
          height: 1.5em;
          align-self: flex-start;
          margin-right: 1em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-icon {
          align-self: flex-start;
          margin-right: 1em;
        }
        
        .toggle_button {
          --cc-icon-size: 1.5em;
        }

        ::slotted([slot='title']) {
          flex: 1 1 0;
          font-size: 1.2em;
          font-weight: bold;
        }

        .info-ribbon {
          --height: 1.5em;
          --width: 8em;
          --r: -45deg;
          --translate: 1.6em;

          position: absolute;
          z-index: 2;
          top: calc(var(--height) / -2);
          left: calc(var(--width) / -2);
          width: var(--width);
          height: var(--height);
          background: var(--cc-color-bg-strong);
          color: white;
          font-size: 0.9em;
          font-weight: bold;
          line-height: var(--height);
          text-align: center;
          transform: rotate(var(--r)) translateY(var(--translate));
        }

        .main {
          display: grid;
          padding: 0.5em 1em 1em;
          grid-gap: 1em;
        }

        :host([no-head]) .main {
          padding: 1em;
        }

        .main-wrapper--overlay {
          filter: blur(0.3em);
          opacity: 0.35;
        }

        /* superpose main and overlay */

        .main-wrapper,
        ::slotted([slot='overlay']) {
          grid-area: 2 / 1 / auto / auto;
        }

        :host([ribbon]) .main-wrapper {
          padding-left: 2.5em;
        }

        ::slotted([slot='overlay']) {
          /* we have a few z-index:2 on atoms */
          z-index: 10;
          display: grid;
          align-content: center;
          justify-items: center;
        }

        ::slotted(.cc-block_empty-msg) {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `]}}window.customElements.define("cc-block",s);export{s as CcBlock};
