import"./cc-button-fafeef50.js";import{E as e,d as t}from"./events-4c8e3503.js";import{s as o,x as n,i}from"./lit-element-98ed46d4.js";import{e as s,n as c}from"./ref-948c5e44.js";class r extends o{static get properties(){return{a11yName:{type:String,attribute:"a11y-name"},hideText:{type:Boolean,attribute:"hide-text"},icon:{type:Object},isOpen:{type:Boolean,attribute:"is-open",reflect:!0},position:{type:String}}}constructor(){super(),this.a11yName=null,this.hideText=!1,this.icon=null,this.isOpen=!1,this.position="bottom-left",this._contentRef=s(),this._buttonRef=s(),this._onOutsideClickHandler=new e(window,"click",(e=>{const t=this._contentRef.value;null==t||e.composedPath().includes(t)||this.close()})),this._onEscapeKeyHandler=new e(this,"keydown",(e=>{"Escape"===e.key&&this.close()}));let t=null;this._onCcPopoverOpenHandler=new e(window,"cc-popover:open",(e=>{const o=e.composedPath()[0];o!==this?t=o:(t?.close(!1),t=null)}))}open(){this.isOpen||(this.isOpen=!0,t(this,"open"))}close(e=!0){this.isOpen&&(this.isOpen=!1,e&&this.focus(),t(this,"close"))}toggle(){this.isOpen?this.close():this.open()}focus(){this._buttonRef.value?.focus()}updated(e){e.has("isOpen")&&(this.isOpen?(this._onOutsideClickHandler.connect(),this._onEscapeKeyHandler.connect()):(this._onOutsideClickHandler.disconnect(),this._onEscapeKeyHandler.disconnect()))}connectedCallback(){super.connectedCallback(),this._onCcPopoverOpenHandler.connect()}disconnectedCallback(){super.disconnectedCallback(),this._onOutsideClickHandler.disconnect(),this._onEscapeKeyHandler.disconnect(),this._onCcPopoverOpenHandler.disconnect()}render(){return n`
      <div class="wrapper">
        <cc-button
          ${c(this._buttonRef)}
          .a11yExpanded=${this.isOpen}
          .a11yName=${this.a11yName}
          ?hide-text=${this.hideText}
          .icon=${this.icon}
          @cc-button:click=${this.toggle}
        >
          <slot name="button-content"></slot>
        </cc-button>
  
        ${this.isOpen?n`
          <div class="content ${this.position.replace("-"," ")}" ${c(this._contentRef)}>
            <slot></slot>
          </div>
        `:null}
      </div>
    `}static get styles(){return[i`
        :host {
          display: block;

          --cc-popover-gap: 0.4em;
        }
        
        .wrapper {
          position: relative;
        }
        
        cc-button {
          width: var(--cc-popover-trigger-button-width, inherit);
        }
        
        .content {
          position: absolute;
          z-index: var(--cc-popover-z-index, 999);
          padding: 0.5em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          box-shadow: 0 2px 4px rgb(38 38 38 / 25%),
            0 5px 15px rgb(38 38 38 / 25%);
        }

        .content.bottom {
          top: calc(100% + var(--cc-popover-gap));
        }
        
        .content.top {
          bottom: calc(100% + var(--cc-popover-gap));
        }

        .content.right {
          right: 0;
        }

        .content.left {
          left: 0;
        }
      `]}}window.customElements.define("cc-popover",r);export{r as CcPopover};
