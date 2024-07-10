import"./cc-icon-f84255c7.js";import"./cc-img-8b44c495.js";import"./cc-toggle-34554172.js";import{d as o}from"./events-4c8e3503.js";import{s as e,x as t,i as c}from"./lit-element-98ed46d4.js";class i extends e{static get properties(){return{enabled:{type:Boolean,reflect:!0},icon:{type:Object},logo:{type:String},title:{type:String}}}constructor(){super(),this.enabled=!1,this.icon=null,this.logo=null,this.title=null}_onToggleOption({detail:e}){this.enabled="ENABLED"===e,o(this,"input",this.enabled)}render(){const o=[{label:"Désactivé",value:"DISABLED"},{label:"Activé",value:"ENABLED"}];return t`
      ${null!=this.icon?t`
        <cc-icon class="icon" .icon=${this.icon}></cc-icon>
      `:""}
      ${null!=this.logo&&null==this.icon?t`
        <cc-img class="logo" src=${this.logo}></cc-img>
      `:""}
      <div class="option-main">
        <div class="option-name">${this.title}</div>
        <slot class="option-details"></slot>
        <cc-toggle .choices=${o} value=${this.enabled?"ENABLED":"DISABLED"} @cc-toggle:input=${this._onToggleOption}></cc-toggle>
      </div>
    `}static get styles(){return[c`
        :host {
          display: grid;
          padding: 1em;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-gap: 1em;
          grid-template-columns: min-content 1fr;
        }

        ::slotted(.option-warning) {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }

        .option-main {
          display: grid;
          grid-gap: 0.5em;
        }

        .option-name {
          min-height: 1.6em;
          font-weight: bold;
          line-height: 1.6;
        }

        :host(:not([enabled])) {
          border: 2px solid var(--cc-color-border-neutral-weak, #eee);
          background-color: var(--cc-color-bg-neutral);
        }

        :host([enabled]) {
          border: 2px solid var(--cc-color-bg-success, #000);
        }

        .logo {
          width: 1.6em;
          height: 1.6em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }
        
        .icon {
          --cc-icon-color: #012a51;
          --cc-icon-size: 28px;
        }

        cc-toggle {
          margin-top: 0.5em;
          justify-self: end;
        }

        :host([enabled]) cc-toggle {
          --cc-toggle-color: var(--cc-color-bg-success, #000);
        }

        .option-details {
          line-height: 1.5;
        }
      `]}}window.customElements.define("cc-addon-option",i);export{i as CcAddonOption};
