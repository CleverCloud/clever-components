import"./cc-addon-option-4cc8f049.js";import"./cc-button-fafeef50.js";import"./cc-block-025e5b2d.js";import{d as t}from"./events-4c8e3503.js";import{l as o}from"./cc-link-f2b8f554.js";import{s as i,x as n,i as e}from"./lit-element-98ed46d4.js";class s extends i{static get properties(){return{options:{type:Array},title:{type:String}}}constructor(){super(),this.options=null,this.title=null,this._optionsStates={}}_onSubmit(){this.options.forEach((t=>{null==this._optionsStates[t.name]&&(this._optionsStates[t.name]=t.enabled||!1)})),t(this,"submit",this._optionsStates)}_onOptionToggle({detail:t},o){this._optionsStates[o]=t}render(){return n`
      <cc-block>
        <div slot="title">${this.title}</div>
        <slot name="description"></slot>
        ${this.options.map((t=>{const o=t.enabled||!1;return n`
            <cc-addon-option
              title="${t.title}"
              .icon="${t.icon}"
              logo="${t.logo}"
              ?enabled=${o}
              @cc-addon-option:input=${o=>this._onOptionToggle(o,t.name)}
            >
              ${t.description}
            </cc-addon-option>`}))}
        <div class="button-bar">
          <cc-button primary @cc-button:click=${this._onSubmit}>
            ${"Confirmer les options"}
          </cc-button>
        </div>
      </cc-block>
    `}static get styles(){return[o,e`
        :host {
          display: block;
        }

        .button-bar {
          display: grid;
          justify-content: flex-end;
        }

        [name='description'] {
          line-height: 1.5;
        }

        .option-warning {
          display: grid;
          gap: 0.5em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .option-warning p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `]}}window.customElements.define("cc-addon-option-form",s);export{s as CcAddonOptionForm};
