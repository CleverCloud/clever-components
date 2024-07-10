import{s as e}from"./skeleton-68a3d018.js";import"./cc-icon-f84255c7.js";import{s as t,x as c,i as o}from"./lit-element-98ed46d4.js";import{o as n}from"./class-map-1feb5cf7.js";import{l as r}from"./if-defined-cd9b1ec0.js";class i extends t{static get properties(){return{circle:{type:Boolean},icon:{type:Object},iconA11yName:{type:String,attribute:"icon-a11y-name"},intent:{type:String},skeleton:{type:Boolean},weight:{type:String}}}constructor(){super(),this.circle=!1,this.icon=null,this.iconA11yName=null,this.intent="neutral",this.skeleton=!1,this.weight="dimmed"}render(){const e={dimmed:null==this.weight||"dimmed"===this.weight,strong:"strong"===this.weight,outlined:"outlined"===this.weight,neutral:null==this.intent||"neutral"===this.intent,info:"info"===this.intent,success:"success"===this.intent,warning:"warning"===this.intent,danger:"danger"===this.intent,skeleton:this.skeleton,circle:this.circle};return c`
      <span class="cc-badge ${n(e)}">
        ${null!=this.icon?c`
          <cc-icon .icon=${this.icon} a11y-name=${r(this.iconA11yName)}></cc-icon>
        `:""}
        <span>
          <slot></slot>
        </span>
      </span>
    `}static get styles(){return[e,o`
        :host {
          display: inline-block;
        }

        .cc-badge {
          display: flex;
          align-items: center;
          justify-content: var(--cc-badge-justify-content, center);
          padding: 0.2em 0.8em;
          border-radius: 1em;
          font-size: 0.8em;
          gap: 0.3em;
        }

        /* skeleton is more important */

        .skeleton {
          border: 0.06em solid #bbb !important;
          background-color: #bbb !important;
          color: transparent !important;
        }

        .skeleton.outlined {
          border: 0.06em solid #777 !important;
        }

        .skeleton cc-icon {
          visibility: hidden !important;
        }

        .circle {
          width: 1.5em;
          height: 1.5em;
          min-height: unset;
          justify-content: center;
          padding: 0;
          border-radius: 50%;
          font-size: 1em;
        }

        .dimmed {
          border: 0.06em solid var(--accent-color, #ccc);
          background-color: var(--accent-color, #ccc);
        }

        .strong {
          border: 0.06em solid var(--accent-color, #777);
          background-color: var(--accent-color, #777);
          color: var(--cc-color-text-inverted, #fff);
        }

        .outlined {
          /* roughly 1px. We want the border to scale with the font size so that outlined
          badges still stand out as they should when font-size is increased. */
          border: 0.06em solid var(--accent-color, #777);
          background-color: transparent;
          color: var(--accent-color, #777);
        }

        .info {
          --accent-color: var(--cc-color-bg-primary);
        }

        .info.dimmed {
          --accent-color: var(--cc-color-bg-primary-weak);
        }

        .success {
          --accent-color: var(--cc-color-bg-success);
        }

        .success.dimmed {
          --accent-color: var(--cc-color-bg-success-weak);
        }

        .danger {
          --accent-color: var(--cc-color-bg-danger);
        }

        .danger.dimmed {
          --accent-color: var(--cc-color-bg-danger-weak);
        }

        .warning {
          --accent-color: var(--cc-color-bg-warning);
        }

        .warning.dimmed {
          --accent-color: var(--cc-color-bg-warning-weak);
        }

        .neutral {
          --accent-color: var(--cc-color-bg-strong);
        }

        .neutral.dimmed {
          --accent-color: var(--cc-color-bg-neutral-alt);
        }

        img {
          width: 1em;
          height: 1em;
        }
      `]}}window.customElements.define("cc-badge",i);export{i as CcBadge};
