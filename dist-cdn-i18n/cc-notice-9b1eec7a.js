import{f as e,g as o,h as t,j as r,k as n}from"./cc-remix.icons-d7d44eac.js";import{d as c}from"./events-4c8e3503.js";import"./cc-icon-f84255c7.js";import{s as i,x as s,i as a}from"./lit-element-98ed46d4.js";import{o as l}from"./class-map-1feb5cf7.js";class d extends i{static get properties(){return{closeable:{type:Boolean},heading:{type:String},intent:{type:String,reflect:!0},message:{type:String},noIcon:{type:Boolean,attribute:"no-icon"}}}constructor(){super(),this.closeable=!1,this.heading=null,this.intent="info",this.message=null,this.noIcon=!1}_getIcon(){return"danger"===this.intent?e:"info"===this.intent?o:"success"===this.intent?t:"warning"===this.intent?r:void 0}_getIconAlt(){return"danger"===this.intent?"Erreur":"info"===this.intent?"Information":"success"===this.intent?"Succès":"warning"===this.intent?"Avertissement":void 0}_onCloseButtonClick(){c(this,"dismiss")}render(){const e={"no-icon":null!=this.heading&&this.noIcon,"no-heading":null==this.heading&&!this.noIcon,"message-only":null==this.heading&&this.noIcon,closeable:this.closeable};return s`
      <div class="wrapper ${l(e)}">
        ${this.noIcon?"":s`
          <slot name="icon">
            <cc-icon .icon="${this._getIcon()}" a11y-name="${this._getIconAlt()}" class="notice-icon"></cc-icon>
          </slot>
        `}
        ${null!=this.heading?s`
          <div class="heading">
            ${this.heading}
          </div>
        `:""}
        <div class="message-container">
          <slot name="message">
            <p>${this.message}</p>
          </slot>
        </div>
        ${this.closeable?s`
            <button class="close-button"
              @click=${this._onCloseButtonClick}
              title="${"Fermer cette notification"}">
              <cc-icon size="lg" .icon="${n}" a11y-name="${"Fermer cette notice"}"></cc-icon>
            </button>
        `:""}
      </div>
    `}static get styles(){return[a`
        :host {
          display: block;
        }

        .wrapper {
          position: relative;
          display: grid;
          align-items: center;
          padding: 0.75em;
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.5em;
          grid-template-areas: 
            'icon heading'
            '.    message';
          grid-template-columns: auto 1fr;
          grid-template-rows: auto auto;
          line-height: 1.4;
        }

        :host([intent='success']) .wrapper {
          --cc-icon-color: var(--cc-color-text-success);
          
          border: 1px solid var(--cc-color-border-success-weak);
          background-color: var(--cc-color-bg-success-weaker);
        }

        :host([intent='warning']) .wrapper {
          --cc-icon-color: var(--cc-color-text-warning);

          border: 1px solid var(--cc-color-border-warning-weak);
          background-color: var(--cc-color-bg-warning-weaker);
        }

        :host([intent='info']) .wrapper {
          --cc-icon-color: var(--cc-color-text-primary);

          border: 1px solid var(--cc-color-border-primary-weak);
          background-color: var(--cc-color-bg-primary-weaker);
        }

        :host([intent='danger']) .wrapper {
          --cc-icon-color: var(--cc-color-text-danger);

          border: 1px solid var(--cc-color-border-danger-weak);
          background-color: var(--cc-color-bg-danger-weaker);
        }

        .wrapper.closeable {
          padding-right: 2em;
        }
        
        .wrapper.no-icon {
          grid-template-areas:
            'heading'
            'message';
        }
        
        .wrapper.no-heading {
          grid-template-areas: 'icon message';
          grid-template-columns: auto 1fr;
          grid-template-rows: auto;
        }
        
        .wrapper.message-only {
          grid-template-areas: 'message';
          grid-template-columns: auto;
          grid-template-rows: auto;
        }

        .heading {
          font-weight: bold;
          grid-area: heading;
        }
        
        .message-container {
          grid-area: message;
        }
        
        .message-container p {
          margin: 0;
        }

        .notice-icon {
          width: 1.5em;
          height: 1.5em;
          grid-area: icon;
        }

        .close-button {
          --cc-icon-color: var(--cc-color-text-weak);
        
          position: absolute;
          top: 0.5em;
          right: 0.5em;
          width: auto;
          height: auto;
          padding: 0;
          border: none;
          background-color: transparent;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
        }
        
        :host([intent='success']) .close-button:hover {
          background-color: var(--cc-color-bg-success-hovered);
        }
        
        :host([intent='warning']) .close-button:hover {
          background-color: var(--cc-color-bg-warning-hovered);
        }
        
        :host([intent='info']) .close-button:hover {
          background-color: var(--cc-color-bg-primary-hovered);
        }
        
        :host([intent='danger']) .close-button:hover {
          background-color: var(--cc-color-bg-danger-hovered);
        }
        
        .close-button:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .close-button img {
          display: block;
          width: 1em;
          height: 1em;
        }
      `]}}window.customElements.define("cc-notice",d);export{d as CcNotice};
