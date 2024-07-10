import{d as e}from"./events-4c8e3503.js";import{C as r,R as t}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{e as o,n as l}from"./ref-948c5e44.js";import{x as i,i as a}from"./lit-element-98ed46d4.js";import{o as s}from"./class-map-1feb5cf7.js";const n={get empty(){return"Veuillez sélectionner une valeur."}};class c extends r{static get properties(){return{...super.properties,disabled:{type:Boolean,reflect:!0},inline:{type:Boolean,reflect:!0},label:{type:String},options:{type:Array},placeholder:{type:String},required:{type:Boolean},resetValue:{type:String,attribute:"reset-value"},value:{type:String}}}static reactiveValidationProperties=["required","options"];constructor(){super(),this.disabled=!1,this.inline=!1,this.label=null,this.options=[],this.placeholder=null,this.required=!1,this.resetValue="",this.value=null,this._errorRef=o(),this._selectRef=o()}_getFormControlElement(){return this._selectRef.value}_getErrorElement(){return this._errorRef.value}_getErrorMessages(){return n}_getValidator(){return this.required?new t:null}_getReactiveValidationProperties(){return c.reactiveValidationProperties}focus(){this._selectRef.value?.focus()}_onSelectInput(r){this.value=r.target.value,e(this,"input",this.value)}updated(e){(e.has("value")||e.has("options"))&&(this.shadowRoot.querySelector("select").value=this.value),super.updated(e)}render(){const e=null!=this.errorMessage&&""!==this.errorMessage;return i`
      <label for="input-id">
        <span class="label-text">${this.label}</span>
        ${this.required?i`
          <span class="required">${"obligatoire"}</span>
        `:""}
      </label>
      <div class="select-wrapper ${s({disabled:this.disabled})}">
        <select
          id="input-id"
          class="${s({error:e})}"
          ?disabled=${this.disabled}
          aria-describedby="help-id error-id"
          @input=${this._onSelectInput}
          .value=${this.value}
          ${l(this._selectRef)}
        >
          ${null!=this.placeholder&&""!==this.placeholder?i`
            <option value="" ?disabled=${this.required}>${this.placeholder}</option>
          `:""}
          ${this.options.map((e=>i`
            <option value=${e.value}>${e.label}</option>
          `))}
        </select>
      </div>

      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${e?i`
        <p class="error-container" id="error-id" ${l(this._errorRef)}>
          ${this.errorMessage}
        </p>`:""}
    `}static get styles(){return[a`
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
          color: var(--cc-select-label-color, inherit);
          font-size: var(--cc-select-label-font-size, inherit);
          font-weight: var(--cc-select-label-font-weight, normal);
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

        /* RESET */

        select {
          width: 100%;
          padding: 0;
          border: none;
          margin: 0;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          background: none;
          color: inherit;
          cursor: inherit;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
        }

        select {
          height: 2em;
          box-sizing: border-box;
          padding: 0 3em 0 0.5em;
          border: 1px solid var(--cc-color-border-neutral-strong, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          grid-area: input;
        }

        select:hover {
          border-color: var(--cc-color-border-neutral-hovered, #777);
          cursor: pointer;
        }

        select:focus {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
        
        select.error {
          border-color: var(--cc-color-border-danger) !important;
        }
        
        select.error:focus {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .select-wrapper {
          position: relative;
          display: inline-flex;
          width: 100%;
          vertical-align: top;
        }

        .select-wrapper::after {
          position: absolute;
          top: 50%;
          right: 0.5em;
          width: 0.8em;
          height: 0.5em;
          background-color: var(--cc-color-bg-primary, #000);
          clip-path: polygon(100% 0%, 0 0%, 50% 100%);
          content: '';
          pointer-events: none;
          transform: translateY(-50%);
        }

        .disabled::after {
          background-color: hsl(0deg 0% 62%);
        }

        select[disabled] {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background: var(--cc-color-bg-neutral-disabled);
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }
      `]}}window.customElements.define("cc-select",c);export{c as CcSelect};
