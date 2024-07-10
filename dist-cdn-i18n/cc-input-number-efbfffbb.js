import{v as e,w as t}from"./cc-remix.icons-d7d44eac.js";import{d as i}from"./events-4c8e3503.js";import{C as r,c as o,R as n,N as s}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{a}from"./accessibility-664b7197.js";import{s as l}from"./skeleton-68a3d018.js";import"./cc-icon-f84255c7.js";import{e as c,n as u}from"./ref-948c5e44.js";import{x as d,i as p}from"./lit-element-98ed46d4.js";import{o as b}from"./class-map-1feb5cf7.js";class m extends r{static get properties(){return{...super.properties,controls:{type:Boolean},disabled:{type:Boolean,reflect:!0},inline:{type:Boolean,reflect:!0},label:{type:String},hiddenLabel:{type:Boolean,attribute:"hidden-label"},max:{type:Number},min:{type:Number},readonly:{type:Boolean,reflect:!0},required:{type:Boolean},resetValue:{type:Number,attribute:"reset-value"},skeleton:{type:Boolean,reflect:!0},step:{type:Number},value:{type:Number}}}static reactiveValidationProperties=["required","min","max"];constructor(){super(),this.controls=!1,this.disabled=!1,this.inline=!1,this.label=null,this.hiddenLabel=!1,this.max=null,this.min=null,this.readonly=!1,this.required=!1,this.resetValue=null,this.skeleton=!1,this.step=null,this.value=null,this._errorRef=c(),this._inputRef=c(),this._errorMessages={empty:()=>"Veuillez saisir une valeur.",badType:()=>"Veuillez saisir un nombre.",rangeUnderflow:()=>(({min:e})=>`Veuillez saisir un nombre inférieur à ${e}.`)({min:this.min}),rangeOverflow:()=>(({max:e})=>`Veuillez saisir un nombre supérieur à ${e}.`)({max:this.max})}}focus(){this._inputRef.value.focus()}_getFormControlElement(){return this._inputRef.value}_getErrorElement(){return this._errorRef.value}_getErrorMessages(){return this._errorMessages}_getValidator(){return o([this.required?new n:null,new s({min:this.min,max:this.max})])}_getFormControlData(){return this._inputRef.value.value}_getReactiveValidationProperties(){return m.reactiveValidationProperties}_onInput(e){this.value=e.target.valueAsNumber,i(this,"input",this.value)}_onFocus(e){this.readonly&&e.target.select()}_onKeyEvent(e){"keydown"!==e.type&&"keypress"!==e.type||e.stopPropagation(),"keydown"===e.type&&13===e.keyCode&&(e.preventDefault(),this._internals.form?.requestSubmit(),i(this,"requestimplicitsubmit")),this.readonly||"keypress"!==e.type||13!==e.keyCode||(this._internals.form?.requestSubmit(),i(this,"requestimplicitsubmit"))}_onDecrement(){this._inputRef.value.stepDown(),this.value=this._inputRef.value.valueAsNumber,i(this,"input",this.value)}_onIncrement(){this._inputRef.value.stepUp(),this.value=this._inputRef.value.valueAsNumber,i(this,"input",this.value)}render(){const i=null!=this.value?this.value:0,r=this.controls&&!this.skeleton,o=this.value<=this.min&&null!=this.min,n=this.value>=this.max&&null!=this.max,s=null!=this.errorMessage&&""!==this.errorMessage;return d`

      ${null!=this.label?d`
        <label class=${b({"visually-hidden":this.hiddenLabel})} for="input-id">
          <span class="label-text">${this.label}</span>
          ${this.required?d`
            <span class="required">${"obligatoire"}</span>
          `:""}
        </label>
      `:""}

      <div class="meta-input">
        ${r?d`
          <button class="btn" @click=${this._onDecrement} ?disabled=${this.disabled||this.readonly||o}>
            <cc-icon class="btn-img" .icon=${e} a11y-name="${"décrémenter"}" size="lg"></cc-icon>
          </button>
        `:""}
        <div class="wrapper ${b({skeleton:this.skeleton})}">

          <input
            id="input-id"
            type="number"
            class="input ${b({error:s})}"
            ?disabled=${this.disabled||this.skeleton}
            ?readonly=${this.readonly}
            min=${this.min??""}
            max=${this.max??""}
            step=${this.step??""}
            .value=${i}
            spellcheck="false"
            aria-describedby="help-id error-id"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
            ${u(this._inputRef)}
          >
          <div class="ring"></div>
        </div>
        ${r?d`
          <button class="btn" @click=${this._onIncrement} ?disabled=${this.disabled||this.readonly||n}>
            <cc-icon class="btn-img" .icon=${t} a11y-name="${"incrémenter"}" size="lg"></cc-icon>
          </button>
        `:""}
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${s?d`
        <p class="error-container" id="error-id" ${u(this._errorRef)}>
          ${this.errorMessage}
        </p>`:""}
    `}static get styles(){return[a,l,p`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: inline-block;
        }

        /* region Common to cc-input-* & cc-select */

        :host([inline]) {
          display: inline-grid;
          align-items: baseline;
          gap: 0 1em;
          grid-auto-rows: min-content;
          grid-template-areas:
            'label input'
            'label help'
            'label error';
          grid-template-columns: auto 1fr;
        }

        .help-container {
          grid-area: help;
        }

        .error-container {
          grid-area: error;
        }

        label {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding-bottom: 0.35em;
          cursor: pointer;
          gap: 2em;
          line-height: 1.25em;
        }

        label .label-text {
          color: var(--cc-input-label-color, inherit);
          font-size: var(--cc-input-label-font-size, inherit);
          font-weight: var(--cc-input-label-font-weight, normal);
        }

        :host([inline]) label {
          flex-direction: column;
          padding: 0;
          gap: 0;
          grid-area: label;
          line-height: normal;
        }

        .required {
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
          font-variant: small-caps;
        }

        :host([inline]) .required {
          font-size: 0.8em;
        }

        slot[name='help']::slotted(*) {
          margin: 0.3em 0 0;
          color: var(--cc-color-text-weak);
          font-size: 0.9em;
        }

        .error-container {
          margin: 0.5em 0 0;
          color: var(--cc-color-text-danger);
        }
        /* endregion */

        .meta-input {
          /* link to position:absolute of .ring */
          position: relative;
          display: inline-flex;
          overflow: visible;
          width: 100%;
          height: max-content;
          box-sizing: border-box;
          grid-area: input;
          vertical-align: top;
        }

        .wrapper {
          display: grid;
          overflow: hidden;
          min-width: 0;
          flex: 1 1 0;
          /* see input to know why 0.15em */
          padding: 0.15em 0.5em;
        }

        /* RESET */

        input {
          display: block;
          width: 100%;
          box-sizing: border-box;
          padding: 0;
          border: 1px solid #000;
          margin: 0;
          /* remove Safari box shadow */
          -webkit-appearance: none;
          background: none;
          color: inherit;
          font-family: inherit;
          font-size: unset;
          resize: none;
        }

        /* remove spinner firefox */

        input[type='number'] {
          -moz-appearance: textfield;
        }

        /* remove spinner safari */

        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }

        /* BASE */

        input {
          z-index: 2;
          overflow: hidden;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          height: 2em;
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          line-height: 2em;
          text-align: var(--cc-input-number-align, left);
        }

        /* STATES */

        input:focus,
        input:active {
          outline: 0;
        }

        input[disabled] {
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }

        button[disabled] {
          opacity: 0.5;
          pointer-events: none;
        }

        /* We use this empty .ring element to decorate the input with background, border, box-shadows... */

        .ring {
          position: absolute;
          z-index: 0;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          background: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
        }

        input:focus + .ring {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input.error + .ring {
          border-color: var(--cc-color-border-danger) !important;
        }

        input.error:focus + .ring {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        input:hover + .ring {
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .skeleton input {
          color: transparent;
        }

        /* RESET */

        .btn {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: transparent;
          font-family: inherit;
          font-size: unset;
        }

        .btn {
          z-index: 2;
          width: 1.6em;
          height: 1.6em;
          flex-shrink: 0;
          margin: 0.2em;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
        }

        .btn:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .btn:active,
        .btn:hover {
          box-shadow: none;
          outline: 0;
        }

        .btn:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }

        .btn:active {
          background-color: var(--cc-color-bg-neutral-active);
        }

        /* We can do this because we set a visible focus state */

        .btn::-moz-focus-inner {
          border: 0;
        }

        .btn-img {
          --cc-icon-color: var(--cc-input-btn-icons-color, #595959);
          
          box-sizing: border-box;
          padding: 15%;
        }

        .btn-img:hover {
          --cc-icon-color: var(--cc-color-text-primary);
        }
      `]}}window.customElements.define("cc-input-number",m);export{m as CcInputNumber};
