import{p as t,f as s,v as i,$ as e}from"./cc-toast-d47d1987.js";import{s as o,x as a,i as n}from"./lit-element-98ed46d4.js";import{c as r}from"./repeat-92fcb4ec.js";const m=[{transform:"translateY(-100%)"}],l=[{transform:"translateY(100%)"}],u=[{transform:"translateX(-100%)"}],c=[{transform:"translateX(100%)"}],h={in:t,out:s},d={top:{in:m,out:i},"top-left":{in:m,out:u},"top-right":{in:m,out:c},bottom:{in:l,out:i},"bottom-left":{in:l,out:u},"bottom-right":{in:l,out:c}};class p extends o{static get properties(){return{animation:{type:String},maxToasts:{type:Number,attribute:"max-toasts"},position:{type:String},toastDefaultOptions:{type:Object,attribute:"toast-default-options"},_toasts:{type:Array,state:!0}}}constructor(){super(),this.animation="fade",this.maxToasts=null,this.position="top-right",this.toastDefaultOptions=null,this._toasts=[],this._mediaQuery=window.matchMedia("(prefers-reduced-motion: reduce)")}show(t){if(0===this.maxToasts)return;if(null!=this.maxToasts&&!Number.isNaN(this.maxToasts)){const t=this._toasts.filter((t=>!t.dismissing));if(t.length>=this.maxToasts){const s=t[t.length-1];this._dismiss(s)}}const s=this._createToast(t);return this._toasts=[s,...this._toasts],()=>{this._dismiss(s)}}_createToast(t){return{...t,key:Math.random().toString(36).slice(2),options:{closeable:!1,showProgress:!1,timeout:5e3,...this.toastDefaultOptions,...t.options}}}_dismiss(t){this._toasts=this._toasts.filter((s=>s!==t))}render(){const t=this.position.split("-").join(" ");return a`
      <div class="toaster ${t}" aria-live="polite" aria-atomic="true">
        ${r(this._toasts,(t=>t.key),(t=>this._renderToast(t)))}
      </div>
    `}_getInOutAnimations(){return"fade"===this.animation?h:"slide"===this.animation?d[this.position]:"fade-and-slide"===this.animation?{in:[{...(t=d[this.position]).in[0],opacity:0}],out:[{...t.out[0],opacity:0}]}:void 0;var t}_getAnimationDirective(){const t={duration:400,easing:"ease"};return null!=this._mediaQuery&&this._mediaQuery.matches?null:e({keyframeOptions:t,...this._getInOutAnimations()})}_renderToast(t){return a`
      <cc-toast
        intent="${t.intent}"
        .heading=${t.title}
        .message=${t.message}
        .timeout=${t.options.timeout}
        ?closeable=${t.options.closeable}
        ?show-progress=${t.options.showProgress}
        ${this._getAnimationDirective()}
        @cc-toast:dismiss=${()=>this._dismiss(t)}
      ></cc-toast>
    `}static get styles(){return[n`
        :host {
          display: block;
        }

        .toaster {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1em;
          pointer-events: none;
        }

        /* region POSITION */

        .toaster.left {
          align-items: start;
        }

        .toaster.right {
          align-items: end;
        }

        .toaster.bottom {
          flex-direction: column-reverse;
        }

        /* endregion */
      `]}}window.customElements.define("cc-toaster",p);export{p as CcToaster};
