import{d as e}from"./events-4c8e3503.js";import{c as l}from"./repeat-92fcb4ec.js";import{s as t,x as o,i}from"./lit-element-98ed46d4.js";import{l as r}from"./if-defined-cd9b1ec0.js";import{o as a}from"./class-map-1feb5cf7.js";class s extends t{static get properties(){return{choices:{type:Array},disabled:{type:Boolean},hideText:{type:Boolean,attribute:"hide-text"},inline:{type:Boolean,reflect:!0},legend:{type:String},multipleValues:{type:Array,attribute:"multiple-values",reflect:!0},name:{type:String,reflect:!0},subtle:{type:Boolean},value:{type:String,reflect:!0}}}constructor(){super(),this.choices=null,this.disabled=!1,this.hideText=!1,this.inline=!1,this.legend=null,this.multipleValues=null,this.name=null,this.subtle=!1,this.value=null}_onChange(l){if(null==this.multipleValues)this.value=l.target.value,e(this,"input",this.value);else{const t=this.choices.filter((({value:e})=>e===l.target.value?l.target.checked:this.multipleValues.includes(e))).map((({value:e})=>e));this.multipleValues=t,e(this,"input-multiple",t)}}render(){const e={disabled:this.disabled,enabled:!this.disabled,"display-normal":!this.subtle,"display-subtle":this.subtle,"mode-single":null==this.multipleValues,"mode-multiple":null!=this.multipleValues},t=null==this.multipleValues?"radio":"checkbox",i=e=>null!=this.multipleValues?this.multipleValues.includes(e):this.value===e,s=null!=this.legend&&this.legend.length>0;return o`
      <div role="group" aria-labelledby=${r(s?"legend":void 0)} class="group">
        ${s?o`<div id="legend">${this.legend}</div>`:""}
        <div class="toggle-group ${a(e)}">
          ${l(this.choices,(({value:e})=>e),(({label:e,image:l,value:a})=>o`
            <!--
              If the name=null, the name of the native <input> will be 'toggle'. In order to navigate through a group of inputs using the arrow keys, each <input> must have the same name value.
            -->    
            <input
              type=${t}
              name=${this.name??"toggle"}
              .value=${a}
              id=${a}
              ?disabled=${this.disabled}
              .checked=${i(a)}
              @change=${this._onChange}
              aria-label=${r(null!=l&&this.hideText?e:void 0)}>
            <label for=${a} title=${r(null!=l&&this.hideText?e:void 0)}>
              ${null!=l?o`
                <img src=${l} alt="">
              `:""}
              ${null!=l&&this.hideText?"":o`
                <span>${e}</span>
              `}
            </label>
          `))}
        </div>
      </div>
    `}static get styles(){return[i`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          --cc-toggle-color: var(--cc-color-bg-primary, #000);
          --cc-toggle-img-filter: none;
          --cc-toggle-img-filter-selected: none;
          --height: 2em;

          display: inline-flex;
        }
        
        .group {
          display: flex;
          flex-direction: column;
          gap: 0.35em;
        }

        :host([inline]) .group {
          flex-direction: row;
          align-items: center;
          gap: 1em;
        }
        
        #legend {
          color: var(--cc-toggle-legend-color, inherit);
          font-size: var(--cc-toggle-legend-font-size, inherit);
          font-weight: var(--cc-toggle-legend-font-weight, normal);
          line-height: 1.25em;
        }

        .toggle-group {
          display: flex;
          overflow: visible;
          width: max-content;
          height: var(--height);
          box-sizing: border-box;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-small, 0.15em);
          line-height: 1.25;
        }

        /* We hide the <input> and only display the related <label> */

        input {
          display: block;
          width: 0;
          height: 0;
          border: 0;
          margin: 0;
          -moz-appearance: none;
          -webkit-appearance: none;
          appearance: none;
          outline: none;
        }

        label {
          /* used around the background */
          --space: 2px;
          --border-radius: var(--cc-toggle-border-radius, 0.15em);

          position: relative;
          display: grid;
          align-items: center;
          padding: 0 0.6em;
          border-style: solid;
          border-color: var(--cc-toggle-color);
          color: var(--color-txt);
          cursor: pointer;
          font-size: 0.85em;
          font-weight: var(--cc-toggle-font-weight, bold);
          gap: 0.6em;
          grid-auto-flow: column;
          text-transform: var(--cc-toggle-text-transform, uppercase);
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        label {
          border-width: 1px 0;
        }

        label:first-of-type {
          border-left-width: 1px;
          border-radius: var(--border-radius) 0 0 var(--border-radius);
        }

        label:last-of-type {
          border-right-width: 1px;
          border-radius: 0 var(--border-radius) var(--border-radius) 0;
        }

        label:not(:first-of-type) {
          margin-left: calc(var(--space) * -1);
        }

        /* Used to display a background behind the text */

        label::before {
          position: absolute;
          z-index: 0;
          top: var(--space);
          right: var(--space);
          bottom: var(--space);
          left: var(--space);
          display: block;
          background-color: var(--cc-color-bg);
          border-radius: var(--cc-border-radius-small, 0.15em);
          content: '';
        }

        /* Used to display a bottom line in display subtle */

        .display-subtle label::after {
          position: absolute;
          z-index: 0;
          right: 0.25em;
          bottom: 0;
          left: 0.25em;
          display: block;
          height: var(--space);
          background-color: var(--color-subtle-border);
          content: '';
        }

        label span,
        label img {
          z-index: 0;
        }

        img {
          display: block;
          width: 1.45em;
          height: 1.45em;
        }

        /* NOT SELECTED */

        label {
          --cc-color-bg: var(--cc-color-bg-default, #fff);
          --color-txt: var(--cc-color-text-default);
        }

        img {
          filter: var(--cc-toggle-img-filter);
        }

        /* DISABLED */

        .toggle-group.disabled {
          opacity: 0.5;
        }

        .disabled label {
          cursor: default;
        }

        /* HOVERED */

        .display-normal input:not(:checked):enabled:hover + label,
        .display-subtle input:enabled:hover + label {
          --cc-color-bg: var(--cc-color-bg-neutral-hovered);
        }

        /* FOCUS */

        .toggle-group.mode-single.enabled:not(:hover):focus-within,
        .toggle-group.mode-multiple.enabled:not(:hover) input:enabled:focus + label {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .toggle-group.mode-multiple.enabled:not(:hover) input:enabled:focus + label {
          z-index: 1;
        }

        /* ACTIVE */

        input:enabled:active + label::before {
          transform: scale(0.95);
        }

        /* SELECTED */

        input:checked + label img {
          filter: var(--cc-toggle-img-filter-selected);
        }

        .display-normal input:checked + label {
          --cc-color-bg: var(--cc-toggle-color);
          --color-txt: var(--cc-color-text-inverted, #fff);
        }

        .display-subtle input:checked + label {
          --color-txt: var(--cc-toggle-color);
          --color-subtle-border: var(--cc-toggle-color);
        }
      `]}}window.customElements.define("cc-toggle",s);export{s as CcToggle};
