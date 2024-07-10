import"./cc-icon-f84255c7.js";import{d as e}from"./events-4c8e3503.js";import{s as t}from"./skeleton-68a3d018.js";import{l as i}from"./cc-link-f2b8f554.js";import{s as o,x as r,i as s}from"./lit-element-98ed46d4.js";import{l as n}from"./if-defined-cd9b1ec0.js";import{o as a}from"./class-map-1feb5cf7.js";class l extends o{static get properties(){return{a11yExpanded:{type:Boolean,attribute:"a11y-expanded",reflect:!0},a11yName:{type:String,attribute:"a11y-name"},a11yPressed:{type:Boolean,attribute:"a11y-pressed",reflect:!0},circle:{type:Boolean},danger:{type:Boolean},delay:{type:Number},disabled:{type:Boolean,reflect:!0},hideText:{type:Boolean,attribute:"hide-text"},icon:{type:Object},image:{type:String},link:{type:Boolean,reflect:!0},outlined:{type:Boolean},primary:{type:Boolean},skeleton:{type:Boolean},success:{type:Boolean},type:{type:String},waiting:{type:Boolean,reflect:!0},warning:{type:Boolean},_cancelMode:{type:Boolean,state:!0}}}static get formAssociated(){return!0}constructor(){super(),this.a11yExpanded=null,this.a11yName=null,this.a11yPressed=null,this.circle=!1,this.danger=!1,this.delay=null,this.disabled=!1,this.link=!1,this.hideText=!1,this.icon=null,this.image=null,this.outlined=!1,this.primary=!1,this.skeleton=!1,this.success=!1,this.type="button",this.waiting=!1,this.warning=!1,this._cancelMode=!1,this._internals=this.attachInternals()}focus(){this.shadowRoot.querySelector("button").focus()}_cancelClick(){clearTimeout(this._timeoutId),this._cancelMode=!1}_getAriaLabel(){return null!=this.a11yName?this.a11yName.trim()??"":!this.hideText||null==this.image&&null==this.icon?void 0:this.textContent?.trim()??""}_getTitle(){return null!=this.a11yName?this.a11yName.trim()??"":!this.hideText||null==this.image&&null==this.icon?void 0:this.textContent.trim()??""}_onClick(t){if(t.stopPropagation(),!(this.disabled||this.skeleton||this.waiting))return null==this.delay||0===this.delay||this.link?("submit"===this.type&&this._internals.form?.requestSubmit(),"reset"===this.type&&this._internals.form?.reset(),void e(this,"click")):void(this._cancelMode?this._cancelClick():(this._cancelMode=!0,this._timeoutId=setTimeout((()=>{"submit"===this.type&&this._internals.form?.requestSubmit(),"reset"===this.type&&this._internals.form?.reset(),e(this,"click"),this._cancelMode=!1}),1e3*this.delay)))}willUpdate(e){e.has("disabled")&&!0===this.disabled&&this._cancelClick()}render(){const e=null==this.delay||this.link?null:this.delay,t=this.waiting,i=this.primary&&!this.success&&!this.warning&&!this.danger&&!this.link,o=!this.primary&&this.success&&!this.warning&&!this.danger&&!this.link,s=!this.primary&&!this.success&&this.warning&&!this.danger&&!this.link,l=!this.primary&&!this.success&&!this.warning&&this.danger&&!this.link,c=!(i||o||s||l||this.link),d=null!=this.image||null!=this.icon,h={primary:i,success:o,warning:s,danger:l,simple:c,outlined:(this.outlined||c)&&!this.link,skeleton:this.skeleton,"img-only":d&&this.hideText,"txt-only":!d,btn:!this.link,"cc-link":this.link,circle:this.circle&&this.hideText&&d},p=this.skeleton?-1:null;return r`
      <button
        type="${this.type}"
        tabindex="${n(p)}"
        class=${a(h)}
        aria-disabled="${this.disabled||this.skeleton||this.waiting}"
        @click=${this._onClick}
        title="${n(this._getTitle())}"
        aria-label="${n(this._getAriaLabel())}"
        aria-expanded="${n(this.a11yExpanded??void 0)}"
        aria-pressed="${n(this.a11yPressed??void 0)}"
      >
        <!--
          When delay mechanism is set, we need a cancel label.
          We don't want the button width to change when the user clicks and toggles between normal and cancel mode.
          That's why (see CSS) we put both labels in a grid, in the same cell and hide (visibility:hidden) the one we don't want.
          This way, when delay is set, the button has a min width of the largest label (normal or cancel).
        -->
        <div class="text-wrapper ${a({"cancel-mode":this._cancelMode})}">
          ${null!=this.image?r`
            <img src=${this.image} alt="">
          `:""}
          ${null!=this.icon?r`
            <cc-icon .icon="${this.icon}"></cc-icon>
          `:""}
          <div class="text-normal">
            <slot></slot>
          </div>
          ${null!=e?r`
            <div class="text-cancel">${"Cliquez pour annuler"}</div>
          `:""}
        </div>
        ${null!=e?r`
          <progress class="delay ${a({active:this._cancelMode})}" style="--delay: ${e}s"></progress>
        `:""}
        ${t&&!h.circle?r`
          <progress class="waiting"></progress>
        `:""}
        ${t&&h.circle?r`
          <svg class="circle-loader" viewBox="25 25 50 50" stroke-width="4" aria-hidden="true">
            <circle fill="none" cx="50" cy="50" r="15" />
          </svg>
        `:""}
      </button>
    `}static get styles(){return[t,i,s`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: inline-block;
          box-sizing: border-box;
          vertical-align: middle;
        }

        /* RESET */

        button {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: unset;
          font-family: inherit;
          font-size: unset;
        }

        /* BASE */

        .btn {
          /* used to absolutely position the <progress> */
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 2em;
          padding: 0 0.5em;
          border: 1px solid #000;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-button-border-radius, 0.15em);
          cursor: pointer;
          font-weight: var(--cc-button-font-weight, bold);
          text-transform: var(--cc-button-text-transform, uppercase);
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* COLORS */

        .simple {
          --btn-color: var(--cc-color-text-primary-strongest);
        }

        .primary {
          --btn-color: var(--cc-color-bg-primary);
        }

        .success {
          --btn-color: var(--cc-color-bg-success);
        }

        .warning {
          --btn-color: var(--cc-color-bg-warning);
        }

        .danger {
          --btn-color: var(--cc-color-bg-danger);
        }

        /* MODES */

        .btn {
          border-color: var(--btn-color);
          background-color: var(--btn-color);
          color: var(--cc-color-text-inverted);
        }

        .outlined {
          background-color: var(--cc-color-bg-default, #fff);
          color: var(--btn-color);
        }

        .circle {
          border-radius: 50%;
        }

        /* special case: we want to keep simple buttons subtle */

        .simple {
          border-color: var(--color-grey-medium);
        }

        .img-only {
          width: 1.75em;
          height: 1.75em;
          min-height: 0;
          padding: 0;
        }

        /* STATES */

        .btn:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .btn:not([aria-disabled='true']):hover {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }

        .btn:not([aria-disabled='true']):active {
          box-shadow: none;
          outline: 0;
        }

        button[aria-disabled='true'] {
          cursor: inherit;
          opacity: 0.5;
        }

        .skeleton {
          border-color: #777;
          background-color: #bbb;
          color: transparent;
        }

        .skeleton cc-icon,
        .skeleton img {
          visibility: hidden;
        }

        /* TRANSITIONS */

        .btn {
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
          transition: box-shadow 75ms ease-in-out;
        }

        /* Grid to place image + text and superpose "cancel mode text" */

        .text-wrapper {
          display: grid;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          gap: 0.5em;
          grid-template-columns: min-content 1fr;
        }

        .txt-only .text-wrapper {
          gap: 0;
          grid-template-columns: auto;
        }

        .img-only .text-wrapper {
          gap: 0;
          grid-template-columns: min-content;
        }

        img {
          display: block;
          width: 1.25em;
          height: 1.25em;
        }

        .img-only .text-normal {
          display: none;
        }

        cc-icon,
        img,
        .text-normal,
        .text-cancel {
          grid-row: 1 / 2;
        }

        .text-normal,
        .text-cancel {
          /* Setting font-size here is easier than on .btn because of how "em" works */
          font-size: 0.85em;
        }

        cc-icon,
        img {
          grid-column: 1 / 2;
        }

        .text-normal {
          grid-column: -1 / -2;
        }

        .text-cancel {
          grid-column: 1 / -1;
        }

        .text-wrapper.cancel-mode cc-icon,
        .text-wrapper.cancel-mode img,
        .text-wrapper.cancel-mode .text-normal,
        .text-wrapper:not(.cancel-mode) .text-cancel {
          visibility: hidden;
        }

        /* progress bar for delay, see https://css-tricks.com/html5-progress-element */

        progress,
        progress::-webkit-progress-bar {
          background-color: #fff;
        }

        .outlined progress,
        .outlined progress::-webkit-progress-bar {
          background-color: var(--btn-color);
        }

        .cc-link progress,
        .cc-link progress::-webkit-progress-bar {
          background-color: var(--cc-color-bg-strong);
        }

        progress::-webkit-progress-value,
        progress::-moz-progress-bar {
          background-color: transparent;
        }

        progress.delay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 0.2em;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        progress.delay.active {
          width: 100%;
          transition: width var(--delay) linear;
        }

        @keyframes waiting {

          from {
            left: -52%;
          }

          to {
            left: 52%;
          }
        }

        progress.waiting {
          --width: 25%;

          position: absolute;
          bottom: 0;
          width: var(--width);
          height: 0.2em;
          border: none;
          margin-left: calc(50% - calc(var(--width) / 2));
          animation: 1s ease-in-out 0s infinite alternate waiting;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        /* circle waiting mode - keyframes */
        @keyframes rotate {

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes stretch {

          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }

          50% {
            stroke-dasharray: 90, 200;
            stroke-dashoffset: -35px;
          }

          100% {
            stroke-dashoffset: -124px;
          }
        }

        /* circle waiting mode - partial opacity */

        :host([waiting]) button.circle {
          opacity: 1;
        }

        :host([waiting]) button.circle .text-wrapper cc-icon,
        :host([waiting]) button.circle .text-wrapper img {
          opacity: 0.25;
        }

        /* circle waiting mode - core animation */

        .circle-loader {
          --bcw-speed: 2s;

          position: absolute;
          animation: rotate var(--bcw-speed) linear infinite;
          inset: 0;
          transform-origin: center;
          vertical-align: middle;
        }

        .circle-loader circle {
          animation: stretch calc(var(--bcw-speed) * 0.75) ease-in-out infinite;
          stroke: currentcolor;
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
          stroke-linecap: round;
        }

        /* We can do this because we set a visible focus state */

        button::-moz-focus-inner {
          border: 0;
        }

        /* button that looks like a cc-link */

        .cc-link {
          --btn-color: var(--color-text-strong);

          position: relative;
          overflow: hidden;
          min-height: 2em;
          cursor: pointer;
          text-decoration: underline;
        }

        .cc-link .text-normal {
          font-size: 1em;
        }

        .cc-link.skeleton:hover {
          color: transparent;
        }
      `]}}window.customElements.define("cc-button",l);export{l as CcButton};
