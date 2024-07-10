import{s as e}from"./skeleton-68a3d018.js";import{A as t,T as i,s,x as r,i as o}from"./lit-element-98ed46d4.js";import{i as n,t as a,e as c}from"./directive-de55b00a.js";class l extends n{constructor(e){if(super(e),this.et=t,e.type!==a.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===t||null==e)return this.ft=void 0,this.et=e;if(e===i)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.et)return this.ft;this.et=e;const s=[e];return s.raw=s,this.ft={_$litType$:this.constructor.resultType,strings:s,values:[]}}}l.directiveName="unsafeHTML",l.resultType=1;const h=c(l);class u extends l{}u.directiveName="unsafeSVG",u.resultType=2;const m=c(u);class d extends s{static get properties(){return{a11yName:{type:String,attribute:"a11y-name"},icon:{type:Object},size:{type:String,reflect:!0},skeleton:{type:Boolean}}}constructor(){super(),this.a11yName=null,this.icon=null,this.size="md",this.skeleton=!1}updated(e){const t=e.has("a11yName")||e.has("icon"),i=this.shadowRoot.querySelector("svg");if(t&&null!=i)if(null==this.a11yName||""===this.a11yName)i.setAttribute("aria-hidden","true"),i.removeAttribute("aria-label"),i.removeAttribute("role"),i.querySelector("title")?.remove();else{i.removeAttribute("aria-hidden"),i.setAttribute("aria-label",this.a11yName),i.setAttribute("role","img");let e=i.querySelector("title");null==e&&(e=document.createElement("title"),i.prepend(e)),e.textContent=this.a11yName}}render(){if(this.skeleton)return r`<div class="skeleton"></div>`;const e=null!=this.icon?m(this.icon.content):"";return r`${e}`}static get styles(){return[e,o`
        :host {
          --skeleton-color: #bbb;

          display: inline-flex;
          width: var(--size, 1em);
          height: var(--size, 1em);
          vertical-align: top;
        }

        :host([size='xs']) {
          --size: var(--cc-icon-size, 0.5em);
        }

        :host([size='sm']) {
          --size: var(--cc-icon-size, 0.75em);
        }

        :host([size='md']) {
          --size: var(--cc-icon-size, 1em);
        }

        :host([size='lg']) {
          --size: var(--cc-icon-size, 1.5em);
        }

        :host([size='xl']) {
          --size: var(--cc-icon-size, 2.25em);
        }

        svg {
          width: 100%;
          height: 100%;
          fill: var(--cc-icon-color, currentColor);
        }

        .skeleton {
          width: var(--size, 1em);
          height: var(--size, 1em);
          background-color: var(--skeleton-color);
        }
      `]}}window.customElements.define("cc-icon",d);export{d as C,h as o};
