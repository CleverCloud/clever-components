import{defineSmartComponentCore as t,observeContainer as e,updateContext as r}from"./smart-manager-7f86f02f.js";import{s as o,x as n,i as s}from"./lit-element-98ed46d4.js";t({selector:"cc-smart-container",onContextUpdate(t,e,r){e.parentContext=r}});class a extends o{static get properties(){return{context:{type:Object,reflect:!0},parentContext:{type:Object,attribute:!1}}}constructor(){super(),this.context={},this.parentContext={}}connectedCallback(){super.connectedCallback(),this._abortController=new AbortController,e(this,this._abortController.signal)}disconnectedCallback(){super.disconnectedCallback(),this._abortController.abort(),delete this._abortController}willUpdate(t){r(this,{...this.parentContext,...this.context})}render(){return n`
      <slot></slot>
    `}static get styles(){return[s`
        :host {
          display: contents;
        }
      `]}}customElements.define("cc-smart-container",a);export{a as CcSmartContainer};
