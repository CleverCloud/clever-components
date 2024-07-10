import{D as e}from"./date-formatter-ef4a9186.js";import{p as t,a as r,i,s as a,c as n}from"./date-utils-dfe14e4f.js";import{d as o}from"./events-4c8e3503.js";import{C as s,c as l,R as u,d,V as c}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{i as p}from"./utils-aa566623.js";import{a as h}from"./accessibility-664b7197.js";import{s as m}from"./skeleton-68a3d018.js";import{T as f,A as v,x as b,i as g}from"./lit-element-98ed46d4.js";import{e as y,i as _,t as w}from"./directive-de55b00a.js";import{e as x,s as S}from"./directive-helpers-34e7fc26.js";import{e as k,n as D}from"./ref-948c5e44.js";import{o as E}from"./class-map-1feb5cf7.js";const z=y(class extends _{constructor(e){if(super(e),e.type!==w.PROPERTY&&e.type!==w.ATTRIBUTE&&e.type!==w.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!x(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===f||t===v)return t;const r=e.element,i=e.name;if(e.type===w.PROPERTY){if(t===r[i])return f}else if(e.type===w.BOOLEAN_ATTRIBUTE){if(!!t===r.hasAttribute(i))return f}else if(e.type===w.ATTRIBUTE&&r.getAttribute(i)===t+"")return f;return S(e),t}}),$=["Y","Y","Y","Y","Y","M","M","M","D","D","D","H","H","H","m","m","m","s","s","s"];function T(e){return i(e)?e:r(e)}function V(e){return{type:"valid",value:e.toISOString(),date:e}}class R extends s{static get properties(){return{...super.properties,disabled:{type:Boolean,reflect:!0},hiddenLabel:{type:Boolean,attribute:"hidden-label"},inline:{type:Boolean,reflect:!0},label:{type:String},max:{type:String},min:{type:String},readonly:{type:Boolean,reflect:!0},required:{type:Boolean},resetValue:{type:String,attribute:"reset-value"},skeleton:{type:Boolean,reflect:!0},timezone:{type:String},value:{type:String},_valueState:{type:Object,state:!0}}}static reactiveValidationProperties=["required","min","max","timezone"];constructor(){super(),this.disabled=!1,this.hiddenLabel=!1,this.inline=!1,this.label=null,this.max=null,this.min=null,this.readonly=!1,this.required=!1,this.resetValue="",this.skeleton=!1,this.timezone="UTC",this.value=null,this._errorRef=k(),this._inputRef=k(),this._dateFormatter=this._resolveDateFormatter(),this._maxDate=null,this._minDate=null,this._valueState={type:"empty"},this._errorMessages={empty:()=>"Veuillez saisir une valeur.",badInput:()=>"Veuillez saisir une date.",rangeUnderflow:()=>(({min:e})=>`Veuillez saisir une date supérieure à ${e}.`)({min:this.min}),rangeOverflow:()=>(({max:e})=>`Veuillez saisir une date inférieure à ${e}.`)({max:this.max})}}_getFormControlElement(){return this._inputRef.value}_getErrorElement(){return this._errorRef.value}_getErrorMessages(){return this._errorMessages}_getValidator(){return l([this.required?new u:null,d((()=>{if("empty"===this._valueState.type)return c.VALID;if("NaD"===this._valueState.type)return c.invalid("badInput");const e=this._valueState.date;return null!=this._minDate&&e.getTime()<this._minDate.getTime()?c.invalid("rangeUnderflow"):null!=this._maxDate&&e.getTime()>this._maxDate.getTime()?c.invalid("rangeOverflow"):c.VALID}))])}_getFormControlData(){return"empty"===this._valueState.type?"":this._valueState.value}_getReactiveValidationProperties(){return R.reactiveValidationProperties}focus(e){this._inputRef.value.focus(e)}get valueAsDate(){return"valid"===this._valueState.type?this._valueState.date??null:null}_resolveDateFormatter(){return new e("datetime-short",this.timezone)}_parseAsDate(e){if(p(e))return null;try{return t(e,this.timezone)}catch(t){return r(e)}}_formatValue(){switch(this._valueState.type){case"empty":return"";case"NaD":return this._valueState.value??"";case"valid":return this._dateFormatter.format(this._valueState.date)}}_setNewValueState(e,t=!0){const r="empty"===this._valueState.type?"":this._valueState.value;this._valueState=e,this.value="empty"===this._valueState.type?"":this._valueState.value,t&&r!==this.value&&o(this,"input",this.value)}_toValueState(e){if(e instanceof Date)return i(e)?V(e):{type:"empty"};try{const t=this._parseAsDate(e);return null==t?{type:"empty"}:V(t)}catch(t){return function(e){return{type:"NaD",value:e}}(e)}}_onInput(e){const t=e.target.value;this._setNewValueState(this._toValueState(t))}_onFocus(e){this.readonly&&e.target.select()}_onKeyEvent(e){if("keydown"!==e.type&&"keypress"!==e.type||e.stopPropagation(),"keydown"===e.type&&"Enter"===e.key&&(e.preventDefault(),this._internals.form?.requestSubmit(),o(this,"requestimplicitsubmit")),this.readonly||"keypress"!==e.type||"Enter"!==e.key||(this._internals.form?.requestSubmit(),o(this,"requestimplicitsubmit")),!this.readonly&&"valid"===this._valueState.type&&"keydown"===e.type&&["ArrowDown","ArrowUp"].includes(e.key)){e.preventDefault();const t=e.target,r=t.selectionStart,i="ArrowDown"===e.key?-1:1,o=a(this._valueState.date,$[r],i),s=n(o,this._minDate,this._maxDate);this._setNewValueState(V(s)),this.getUpdateComplete().then((()=>{t.setSelectionRange(r,r)}))}}willUpdate(e){if(e.has("timezone")&&(this._dateFormatter=this._resolveDateFormatter()),e.has("min"))try{this._minDate=T(this.min)}catch(e){this._minDate=null}if(e.has("max"))try{this._maxDate=T(this.max)}catch(e){this._maxDate=null}e.has("value")&&this._setNewValueState(this._toValueState(this.value),!1)}render(){const e=null!=this.errorMessage&&""!==this.errorMessage;return b`
      ${null!=this.label?b`
        <label class=${E({"visually-hidden":this.hiddenLabel})} for="input">
          <span class="label-text">${this.label}</span>
          ${this.required?b`
            <span class="required">${"obligatoire"}</span>
          `:""}
        </label>
      `:""}

      <div class="meta-input">
        <div class="wrapper ${E({skeleton:this.skeleton})}">
          ${this._renderUnderlay()}
          <input
            id="input"
            ${D(this._inputRef)}
            type="text"
            class="input ${E({error:e})}"
            ?disabled=${this.disabled||this.skeleton}
            ?readonly=${this.readonly}
            .value=${z(this._formatValue())}
            spellcheck="false"
            aria-describedby="help error keyboard-hint"
            @focus=${this._onFocus}
            @input=${this._onInput}
            @keydown=${this._onKeyEvent}
            @keypress=${this._onKeyEvent}
          >
          <div class="ring"></div>
        </div>
      </div>

      <div class="help-container" id="help">
        <slot name="help"></slot>
      </div>

      ${e?b`
        <p class="error-container" id="error" ${D(this._errorRef)}>
          ${this.errorMessage}
        </p>`:""}

      ${"valid"===this._valueState.type?b`
        <p id="keyboard-hint" class="visually-hidden">${"Vous pouvez utiliser les touches flèche haut et flèche bas pour modifier des parties de la date."}</p>
      `:""}
    `}_renderUnderlay(){return this.skeleton||"valid"!==this._valueState.type?null:b`
      <div class="input underlay" aria-hidden="true">
        ${this._dateFormatter.mapParts(this._valueState.date,(({type:e,value:t})=>"separator"===e?t:b`<span>${t}</span>`))}
      </div>`}static get styles(){return[h,m,g`
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
          color: var(--cc-color-text-weak, #333);
          font-size: 0.9em;
          font-variant: small-caps;
        }

        :host([inline]) .required {
          font-size: 0.8em;
        }

        slot[name='help']::slotted(*) {
          margin: 0.3em 0 0;
          color: var(--cc-color-text-weak, #333);
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

        .input {
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

        /* BASE */

        .input {
          z-index: 2;
          overflow: hidden;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          height: 2em;
          border: none;
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace, monospace));
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          line-height: 2em;
        }

        /* STATES */

        input:focus,
        input:active {
          outline: 0;
        }

        input[disabled] {
          color: var(--cc-color-text-weak, #333);
          opacity: 1;
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
          background: var(--cc-color-bg-neutral-disabled, #eee);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #777);
          background-color: var(--cc-color-bg-neutral-disabled, #eee);
          cursor: progress;
        }

        .skeleton input {
          color: transparent;
        }

        /* UNDERLAY */

        .input,
        .underlay {
          height: auto;
          padding: 0 3px;
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace, monospace));
        }

        .underlay {
          z-index: 1;
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: nowrap;
        }

        .underlay span:not(:empty) {
          --color: var(--cc-color-border-neutral, #aaa);

          padding: 1px 0;
          border-bottom: 2px solid var(--cc-color-border-neutral, #eee);
        }
      `]}}window.customElements.define("cc-input-date",R);export{R as CcInputDate};
