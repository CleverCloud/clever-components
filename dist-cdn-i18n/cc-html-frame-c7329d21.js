import"./cc-loader-c9072fed.js";import{s as t,x as e,i}from"./lit-element-98ed46d4.js";import{l as o}from"./if-defined-cd9b1ec0.js";class r extends t{static get properties(){return{loading:{type:Boolean,reflect:!0},sandbox:{type:String},iframeTitle:{type:String,attribute:"iframe-title"}}}constructor(t){super(t),this.loading=!1,this.sandbox=null,this.iframeTitle=""}_updateHtmlSource(){if(1===this.children.length&&"TEMPLATE"===this.children[0].tagName){const t=this.children[0],e=new Blob([t.innerHTML],{type:"text/html"});this._blobUrl&&window.URL.revokeObjectURL(this._blobUrl),this._blobUrl=window.URL.createObjectURL(e);const i=this.shadowRoot.querySelector("iframe");this.loading=!0,i.addEventListener("load",(()=>this.loading=!1),{once:!0}),i.src=this._blobUrl}}connectedCallback(){super.connectedCallback(),this._mo=new MutationObserver((()=>this._updateHtmlSource())),this._mo.observe(this,{childList:!0})}disconnectedCallback(){super.disconnectedCallback(),this._mo.disconnect(),this._blobUrl&&window.URL.revokeObjectURL(this._blobUrl)}firstUpdated(){this._updateHtmlSource()}render(){return e`
      <iframe title=${this.iframeTitle} src="about:blank" sandbox=${o(this.sandbox??void 0)}></iframe>
      ${this.loading?e`
        <cc-loader></cc-loader>
      `:""}
    `}static get styles(){return[i`
        :host {
          position: relative;
          display: block;
        }

        iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        :host([loading]) iframe {
          opacity: 0.25;
        }

        cc-loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `]}}window.customElements.define("cc-html-frame",r);export{r as CcHtmlFrame};
