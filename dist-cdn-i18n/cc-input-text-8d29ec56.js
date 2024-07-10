import{s as e}from"./i18n-sanitize-4edc4a2d.js";import{i as t,a as i,b as r,c as o}from"./cc-remix.icons-d7d44eac.js";import{d as s}from"./events-4c8e3503.js";import{C as a,c as n,R as l,E as c}from"./cc-form-control-element.abstract-0dd8a3c9.js";import{a as d}from"./utils-aa566623.js";import{a as p}from"./accessibility-664b7197.js";import{s as h}from"./skeleton-68a3d018.js";import"./cc-icon-f84255c7.js";import{e as u,n as b}from"./ref-948c5e44.js";import{o as g}from"./class-map-1feb5cf7.js";import{l as m}from"./if-defined-cd9b1ec0.js";import{x as f,i as v}from"./lit-element-98ed46d4.js";const y=" ";class w extends a{static get properties(){return{...super.properties,clipboard:{type:Boolean,reflect:!0},disabled:{type:Boolean,reflect:!0},label:{type:String},hiddenLabel:{type:Boolean,attribute:"hidden-label"},inline:{type:Boolean,reflect:!0},multi:{type:Boolean,reflect:!0},placeholder:{type:String},readonly:{type:Boolean,reflect:!0},required:{type:Boolean},resetValue:{type:String,attribute:"reset-value"},secret:{type:Boolean,reflect:!0},skeleton:{type:Boolean,reflect:!0},tags:{type:Array},type:{type:String,reflect:!0},value:{type:String},_copyOk:{type:Boolean,state:!0},_showSecret:{type:Boolean,state:!0},_tagsEnabled:{type:Boolean,state:!0}}}static reactiveValidationProperties=["required","type"];constructor(){super(),this.clipboard=!1,this.disabled=!1,this.inline=!1,this.label=null,this.hiddenLabel=!1,this.multi=!1,this.placeholder="",this.readonly=!1,this.required=!1,this.resetValue="",this.secret=!1,this.skeleton=!1,this.tags=null,this.type="text",this.value="",this._copyOk=!1,this._errorRef=u(),this._inputRef=u(),this._showSecret=!1,this._tagsEnabled=!1,this._errorMessages={empty:()=>"email"===this.type?"Veuillez saisir une adresse e-mail.":"Veuillez saisir une valeur.",badEmail:()=>e`Format d'adresse e-mail invalide.<br>Exemple: john.doe@example.com.`}}_getFormControlElement(){return this._inputRef.value}_getErrorElement(){return this._errorRef.value}_getErrorMessages(){return this._errorMessages}_getValidator(){return n([this.required?new l:null,"email"===this.type?new c:null])}_getFormControlData(){if(this._tagsEnabled){const e=new FormData;return this.tags.forEach((t=>{e.append(this.name,t)})),e}return this.value}_getReactiveValidationProperties(){return w.reactiveValidationProperties}get tags(){return this._tagsEnabled?this.value.split(y).filter((e=>""!==e)):null}set tags(e){if(this._tagsEnabled=null!=e,this._tagsEnabled){const t=this.tags;d(t,e)||(this.value=e.join(y),this.requestUpdate("tags",t))}}focus(){this._inputRef.value?.focus()}_onInput(e){if(this._tagsEnabled&&e.target.value.includes("\n")){const{selectionStart:t,selectionEnd:i}=e.target,r=e.target.value,o=e.target.value.replace(/\n/g,""),s=r.length-o.length;e.target.value=o,e.target.setSelectionRange(t-s,i-s)}this.value=e.target.value,s(this,"input",this.value),this._tagsEnabled&&s(this,"tags",this.tags)}_onFocus(e){this.readonly&&e.target.select()}_onClickCopy(){navigator.clipboard.writeText(this.value).then((()=>{this._copyOk=!0,setTimeout((()=>this._copyOk=!1),1e3)}))}_onClickSecret(){this._showSecret=!this._showSecret}_onKeyEvent(e){"keydown"!==e.type&&"keypress"!==e.type||e.stopPropagation(),this._tagsEnabled&&"keydown"===e.type&&13===e.keyCode&&(e.preventDefault(),this._internals.form?.requestSubmit(),s(this,"requestimplicitsubmit")),this.readonly||"keypress"!==e.type||13!==e.keyCode||(!this.multi||this.multi&&e.ctrlKey)&&(this._internals.form?.requestSubmit(),s(this,"requestimplicitsubmit"))}render(){const e=this.value??"",s=e.split("\n").length,a=this.clipboard&&!this.disabled&&!this.skeleton,n=this.secret&&!this.multi&&!this.disabled&&!this.skeleton,l=this.multi||this._tagsEnabled,c=null!=this.errorMessage&&""!==this.errorMessage,d=e.split(y).map(((e,t,i)=>f`<span class="tag">${e}</span>${t!==i.length-1?y:""}`));return f`

      ${null!=this.label?f`
        <label class=${g({"visually-hidden":this.hiddenLabel})} for="input-id">
          <span class="label-text">${this.label}</span>
          ${this.required?f`
            <span class="required">${"obligatoire"}</span>
          `:""}
        </label>
      `:""}

      <div class="meta-input">
        <div class="wrapper ${g({skeleton:this.skeleton})}"
             @input=${this._onInput}
             @keydown=${this._onKeyEvent}
             @keypress=${this._onKeyEvent}>

          ${l?f`
            ${this._tagsEnabled&&!this.skeleton?f`
              <!--
                We use this to display colored background rectangles behind space separated values. 
                This needs to be on the same line and the 2 level parent is important to keep scroll behaviour.
              -->
              <div class="input input-underlayer" style="--rows: ${s}"><div class="all-tags">${d}</div></div>
            `:""}
            <textarea
              id="input-id"
              class="input ${g({"input-tags":this._tagsEnabled,error:c})}"
              style="--rows: ${s}"
              rows=${s}
              ?disabled=${this.disabled||this.skeleton}
              ?readonly=${this.readonly}
              .value=${e}
              placeholder=${this.placeholder}
              spellcheck="false"
              wrap="${m(this._tagsEnabled?"soft":void 0)}"
              aria-describedby="help-id error-id"
              @focus=${this._onFocus}
              ${b(this._inputRef)}
            ></textarea>
          `:""}

          ${l?"":f`
            ${a&&this.readonly?f`
              <!--
                This div has the same styles as the input (but it's hidden with height:0)
                this way we can use it to know what width the content is
                and "auto size" the container.
              -->
              <div class="input input-mirror">${e}</div>
            `:""}
            <input
              id="input-id"
              type=${this.secret&&!this._showSecret?"password":"text"}
              class="input ${g({error:c})}"
              ?disabled=${this.disabled||this.skeleton}
              ?readonly=${this.readonly}
              .value=${e}
              placeholder=${this.placeholder}
              spellcheck="false"
              aria-describedby="help-id error-id"
              @focus=${this._onFocus}
              ${b(this._inputRef)}
            >
          `}

          <div class="ring"></div>
        </div>

        ${n?f`
          <button class="btn" @click=${this._onClickSecret}
                  title=${this._showSecret?"Cacher le secret":"Afficher le secret"}
          >
            <cc-icon
              class="btn-img"
              .icon=${this._showSecret?t:i}
              a11y-name=${this._showSecret?"Cacher le secret":"Afficher le secret"}
              size="lg"
            ></cc-icon>
          </button>
        `:""}

        ${a?f`
          <button class="btn" @click=${this._onClickCopy} title=${"Copier dans le presse-papier"}>
            <cc-icon
              class="btn-img"
              .icon=${this._copyOk?r:o}
              a11y-name=${"Copier dans le presse-papier"}
              size="lg"
            ></cc-icon>
          </button>
        `:""}
      </div>


      <div class="help-container" id="help-id">
        <slot name="help"></slot>
      </div>

      ${c?f`
        <p class="error-container" id="error-id" ${b(this._errorRef)}>
          ${this.errorMessage}
        </p>`:""}
    `}static get styles(){return[p,h,v`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: inline-block;
        }

        :host([multi]) {
          display: block;
        }

        /* region Common to cc-input-* & cc-select (apart from multi) */

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

        :host([inline][multi]) {
          display: grid;
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
          width: 100%;
          height: max-content;
          box-sizing: border-box;
          grid-area: input;
          vertical-align: top;
        }

        :host([multi]) .meta-input {
          display: flex;
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
          /* multiline behaviour */
          height: calc(var(--rows, 1) * 2em);
          border: none;
          font-family: var(--cc-input-font-family, inherit);
          font-size: 0.85em;
          grid-area: 1 / 1 / 2 / 2;
          /* 2em with a 0.85em font-size ~ 1.7em */
          /* (2em - 1.7em) / 2 ~ 0.15em of padding (top and bottom) on the wrapper */
          line-height: 2em;
        }

        .input::placeholder {
          font-style: italic;
        }

        textarea:not([wrap]) {
          white-space: pre;
        }

        /* STATES */

        .input:focus,
        .input:active {
          outline: 0;
        }

        .input[disabled] {
          color: var(--cc-color-text-weak);
          opacity: 1;
          pointer-events: none;
        }

        /* Hide only height and keep content width */

        .input-mirror {
          height: 0;
        }

        /* TAGS UNDERLAYER */

        .input-tags,
        .input-underlayer {
          height: auto;
          padding: 0 3px;
          font-family: var(--cc-input-font-family, var(--cc-ff-monospace));
          word-break: break-all;
          word-spacing: 0.5ch;
        }

        .input-underlayer {
          z-index: 1;
          color: transparent;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          white-space: pre-wrap;
        }

        .input-underlayer .tag:not(:empty) {
          --color: var(--cc-color-bg-soft, #eee);

          padding: 1px 0;
          background-color: var(--color);
          border-radius: 3px;
          box-shadow: 0 0 0 2px var(--color);
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

        .input.error + .ring {
          border-color: var(--cc-color-border-danger) !important;
        }

        .input:focus + .ring {
          border-color: var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .input.error:focus + .ring {
          outline: var(--cc-focus-outline-error, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-hovered, #777);
        }

        :host([disabled]) .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background: var(--cc-color-bg-neutral-disabled);
        }

        :host([readonly]) .ring {
          background: var(--cc-color-bg-neutral-readonly, #aaa);
        }

        /* SKELETON */

        .skeleton .ring,
        .skeleton:hover .ring,
        .skeleton .input:hover + .ring {
          border-color: var(--cc-color-border-neutral-disabled, #eee);
          background-color: var(--cc-color-bg-neutral-disabled);
          cursor: progress;
        }

        .skeleton .input,
        .skeleton .input::placeholder {
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
          margin: 0.2em 0.2em 0.2em 0;
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
      `]}}window.customElements.define("cc-input-text",w);export{w as CcInputText};
