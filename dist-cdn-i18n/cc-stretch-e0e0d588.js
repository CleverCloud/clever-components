import{s as t,x as e,i}from"./lit-element-98ed46d4.js";class s extends t{static get properties(){return{disableStretching:{type:Boolean,attribute:"disable-stretching",reflect:!0},visibleElementId:{type:String,attribute:"visible-element-id",reflect:!0}}}constructor(){super(),this.disableStretching=!1,this.visibleElementId=null}_makeElementVisible(){const t=this.querySelector(":scope > .cc-stretch--visible"),e=this.querySelector(`:scope > #${this.visibleElementId}`);t?.classList.remove("cc-stretch--visible"),e?.classList.add("cc-stretch--visible")}updated(t){t.has("visibleElementId")&&this._makeElementVisible()}render(){return e`
      <slot @slotchange=${this._makeElementVisible}></slot>
    `}static get styles(){return[i`
        :host {
          display: inline-grid;
          width: max-content;
          align-items: var(--cc-stretch-align-items, center);
          justify-items: var(--cc-stretch-justify-items, center);
        }

        :host([disable-stretching]) slot::slotted(:not(.cc-stretch--visible)) {
          display: none;
        }

        slot::slotted(*) {
          grid-area: 1 / 1 / 2 / 2;
          visibility: hidden;
        }

        /* 
         * Very important: do not set to visible as this would break nested cc-stretch components.
         * In a parent with "visibility: hidden", a child with "visibility: visible" is visible.
         * With inherit, the visibility of the child depends on the visibility of the parents, which is what we want.
         */

        slot::slotted(.cc-stretch--visible) {
          visibility: inherit;
        }
      `]}}window.customElements.define("cc-stretch",s);export{s as CcStretch};
