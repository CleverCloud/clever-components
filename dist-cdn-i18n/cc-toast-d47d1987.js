import{a5 as t,p as i,a6 as e,a7 as s,k as o}from"./cc-remix.icons-d7d44eac.js";import{d as n}from"./events-4c8e3503.js";import"./cc-icon-f84255c7.js";import{t as r,e as a}from"./directive-de55b00a.js";import{A as l,s as h,x as c,i as d}from"./lit-element-98ed46d4.js";import{c as p}from"./async-directive-7becedb2.js";import{l as u}from"./if-defined-cd9b1ec0.js";import{o as m}from"./class-map-1feb5cf7.js";const g=new WeakMap;class v{constructor(t,i){this.startPaused=!1,this.disabled=!1,this.clients=new Set,this.pendingComplete=!1,this.host=t,this.defaultOptions=i.defaultOptions||{},this.startPaused=!!i.startPaused,this.disabled=!!i.disabled,this.onComplete=i.onComplete,g.set(this.host,this)}async add(t){var i,e;this.clients.add(t),this.startPaused&&(null===(i=t.webAnimation)||void 0===i||i.pause()),this.pendingComplete=!0,await t.finished,this.pendingComplete&&!this.isAnimating&&(this.pendingComplete=!1,null===(e=this.onComplete)||void 0===e||e.call(this))}remove(t){this.clients.delete(t)}pause(){this.clients.forEach((t=>{var i;return null===(i=t.webAnimation)||void 0===i?void 0:i.pause()}))}play(){this.clients.forEach((t=>{var i;return null===(i=t.webAnimation)||void 0===i?void 0:i.play()}))}cancel(){this.clients.forEach((t=>{var i;return null===(i=t.webAnimation)||void 0===i?void 0:i.cancel()})),this.clients.clear()}finish(){this.clients.forEach((t=>{var i;return null===(i=t.webAnimation)||void 0===i?void 0:i.finish()})),this.clients.clear()}togglePlay(){this.isPlaying?this.pause():this.play()}get isAnimating(){return this.clients.size>0}get isPlaying(){return Array.from(this.clients).some((t=>{var i;return"running"===(null===(i=t.webAnimation)||void 0===i?void 0:i.playState)}))}async finished(){await Promise.all(Array.from(this.clients).map((t=>t.finished)))}}let f=0;const b=new Map,y=new WeakSet,w=()=>new Promise((t=>requestAnimationFrame(t))),A=[{}],C=[{opacity:0}],O=[{opacity:0},{opacity:1}],k=(t,i)=>{const e=t-i;return 0===e?void 0:e},x=(t,i)=>{const e=t/i;return 1===e?void 0:e},$={left:(t,i)=>{const e=k(t,i);return{value:e,transform:e&&`translateX(${e}px)`}},top:(t,i)=>{const e=k(t,i);return{value:e,transform:e&&`translateY(${e}px)`}},width:(t,i)=>{const e=x(t,i);return{value:e,transform:e&&`scaleX(${e})`}},height:(t,i)=>{const e=x(t,i);return{value:e,transform:e&&`scaleY(${e})`}}},_={duration:333,easing:"ease-in-out"},P=["left","top","width","height","opacity","color","background"],S=new WeakMap;const E=a(class extends p{constructor(t){if(super(t),this.t=null,this.i=null,this.o=!0,this.shouldLog=!1,t.type===r.CHILD)throw Error("The `animate` directive must be used in attribute position.");this.createFinished()}createFinished(){var t;null===(t=this.resolveFinished)||void 0===t||t.call(this),this.finished=new Promise((t=>{this.h=t}))}async resolveFinished(){var t;null===(t=this.h)||void 0===t||t.call(this),this.h=void 0}render(t){return l}getController(){return g.get(this.l)}isDisabled(){var t;return this.options.disabled||(null===(t=this.getController())||void 0===t?void 0:t.disabled)}update(t,[i]){var e;const s=void 0===this.l;return s&&(this.l=null===(e=t.options)||void 0===e?void 0:e.host,this.l.addController(this),this.element=t.element,S.set(this.element,this)),this.optionsOrCallback=i,(s||"function"!=typeof i)&&this.u(i),this.render(i)}u(t){var i,e;t=null!=t?t:{};const s=this.getController();void 0!==s&&((t={...s.defaultOptions,...t}).keyframeOptions={...s.defaultOptions.keyframeOptions,...t.keyframeOptions}),null!==(i=(e=t).properties)&&void 0!==i||(e.properties=P),this.options=t}v(){const t={},i=this.element.getBoundingClientRect(),e=getComputedStyle(this.element);return this.options.properties.forEach((s=>{var o;const n=null!==(o=i[s])&&void 0!==o?o:$[s]?void 0:e[s],r=Number(n);t[s]=isNaN(r)?n+"":r})),t}p(){let t,i=!0;return this.options.guard&&(t=this.options.guard(),i=((t,i)=>{if(Array.isArray(t)){if(Array.isArray(i)&&i.length===t.length&&t.every(((t,e)=>t===i[e])))return!1}else if(i===t)return!1;return!0})(t,this.m)),this.o=this.l.hasUpdated&&!this.isDisabled()&&!this.isAnimating()&&i&&this.element.isConnected,this.o&&(this.m=Array.isArray(t)?Array.from(t):t),this.o}hostUpdate(){var t;"function"==typeof this.optionsOrCallback&&this.u(this.optionsOrCallback()),this.p()&&(this.g=this.v(),this.t=null!==(t=this.t)&&void 0!==t?t:this.element.parentNode,this.i=this.element.nextSibling)}async hostUpdated(){if(!this.o||!this.element.isConnected||this.options.skipInitial&&!this.isHostRendered)return;let t;this.prepare(),await w;const i=this._(),e=this.A(this.options.keyframeOptions,i),s=this.v();if(void 0!==this.g){const{from:e,to:o}=this.O(this.g,s,i);this.log("measured",[this.g,s,e,o]),t=this.calculateKeyframes(e,o)}else{const e=b.get(this.options.inId);if(e){b.delete(this.options.inId);const{from:o,to:n}=this.O(e,s,i);t=this.calculateKeyframes(o,n),t=this.options.in?[{...this.options.in[0],...t[0]},...this.options.in.slice(1),t[1]]:t,f++,t.forEach((t=>t.zIndex=f))}else this.options.in&&(t=[...this.options.in,{}])}this.animate(t,e)}resetStyles(){var t;void 0!==this.P&&(this.element.setAttribute("style",null!==(t=this.P)&&void 0!==t?t:""),this.P=void 0)}commitStyles(){var t,i;this.P=this.element.getAttribute("style"),null===(t=this.webAnimation)||void 0===t||t.commitStyles(),null===(i=this.webAnimation)||void 0===i||i.cancel()}reconnected(){}async disconnected(){var t;if(!this.o)return;if(void 0!==this.options.id&&b.set(this.options.id,this.g),void 0===this.options.out)return;if(this.prepare(),await w(),null===(t=this.t)||void 0===t?void 0:t.isConnected){const t=this.i&&this.i.parentNode===this.t?this.i:null;if(this.t.insertBefore(this.element,t),this.options.stabilizeOut){const t=this.v();this.log("stabilizing out");const i=this.g.left-t.left,e=this.g.top-t.top;!("static"===getComputedStyle(this.element).position)||0===i&&0===e||(this.element.style.position="relative"),0!==i&&(this.element.style.left=i+"px"),0!==e&&(this.element.style.top=e+"px")}}const i=this.A(this.options.keyframeOptions);await this.animate(this.options.out,i),this.element.remove()}prepare(){this.createFinished()}start(){var t,i;null===(i=(t=this.options).onStart)||void 0===i||i.call(t,this)}didFinish(t){var i,e;t&&(null===(e=(i=this.options).onComplete)||void 0===e||e.call(i,this)),this.g=void 0,this.animatingProperties=void 0,this.frames=void 0,this.resolveFinished()}_(){const t=[];for(let i=this.element.parentNode;i;i=null==i?void 0:i.parentNode){const e=S.get(i);e&&!e.isDisabled()&&e&&t.push(e)}return t}get isHostRendered(){const t=y.has(this.l);return t||this.l.updateComplete.then((()=>{y.add(this.l)})),t}A(t,i=this._()){const e={..._};return i.forEach((t=>Object.assign(e,t.options.keyframeOptions))),Object.assign(e,t),e}O(t,i,e){t={...t},i={...i};const s=e.map((t=>t.animatingProperties)).filter((t=>void 0!==t));let o=1,n=1;return void 0!==s&&(s.forEach((t=>{t.width&&(o/=t.width),t.height&&(n/=t.height)})),void 0!==t.left&&void 0!==i.left&&(t.left=o*t.left,i.left=o*i.left),void 0!==t.top&&void 0!==i.top&&(t.top=n*t.top,i.top=n*i.top)),{from:t,to:i}}calculateKeyframes(t,i,e=!1){var s;const o={},n={};let r=!1;const a={};for(const e in i){const l=t[e],h=i[e];if(e in $){const t=$[e];if(void 0===l||void 0===h)continue;const i=t(l,h);void 0!==i.transform&&(a[e]=i.value,r=!0,o.transform=`${null!==(s=o.transform)&&void 0!==s?s:""} ${i.transform}`)}else l!==h&&void 0!==l&&void 0!==h&&(r=!0,o[e]=l,n[e]=h)}return o.transformOrigin=n.transformOrigin=e?"center center":"top left",this.animatingProperties=a,r?[o,n]:void 0}async animate(t,i=this.options.keyframeOptions){this.start(),this.frames=t;let e=!1;if(!this.isAnimating()&&!this.isDisabled()&&(this.options.onFrames&&(this.frames=t=this.options.onFrames(this),this.log("modified frames",t)),void 0!==t)){this.log("animate",[t,i]),e=!0,this.webAnimation=this.element.animate(t,i);const s=this.getController();null==s||s.add(this);try{await this.webAnimation.finished}catch(t){}null==s||s.remove(this)}return this.didFinish(e),e}isAnimating(){var t,i;return"running"===(null===(t=this.webAnimation)||void 0===t?void 0:t.playState)||(null===(i=this.webAnimation)||void 0===i?void 0:i.pending)}log(t,i){this.shouldLog&&!this.isDisabled()&&console.log(t,this.options.id,i)}});class F extends h{static get properties(){return{closeable:{type:Boolean},heading:{type:String},intent:{type:String,reflect:!0},message:{type:String},showProgress:{type:Boolean,attribute:"show-progress"},timeout:{type:Number}}}constructor(){super(),this.closeable=!1,this.heading=null,this.intent="info",this.message=null,this.showProgress=!1,this.timeout=5e3,this._progressAnimateCtrl=new v(this,{defaultOptions:{keyframeOptions:{easing:"linear"},in:[{width:"100%"}]},onComplete:()=>this._dismiss()})}_dismiss(){n(this,"dismiss")}_getIcon(){return"info"===this.intent?t:"success"===this.intent?i:"warning"===this.intent?e:"danger"===this.intent?s:void 0}_getIconAlt(){return"info"===this.intent?"Information":"success"===this.intent?"Succès":"warning"===this.intent?"Avertissement":"danger"===this.intent?"Erreur":void 0}_onCloseButtonClick(){this._dismiss()}_pause(){this._progressAnimateCtrl.isAnimating&&this._progressAnimateCtrl.pause()}_resume(){this._progressAnimateCtrl.isAnimating&&this._progressAnimateCtrl.play()}render(){const t=this.timeout>0?"0":void 0;return c`
      <div class="toast" 
           @mouseenter=${this._pause} 
           @mouseleave=${this._resume} 
           @focus=${this._pause}
           @blur=${this._resume}
           tabindex="${u(t)}">
        <div class="icon-wrapper">
          <cc-icon class="icon" .icon="${this._getIcon()}" a11y-name="${this._getIconAlt()}"></cc-icon>
        </div>
        <div class="right">
          <div class="content">
            ${this.heading?c`<div class="heading">${this.heading}</div>`:""}
            ${this.message?c`<div>${this.message}</div>`:""}
          </div>

          ${this.closeable?c`
            <button class="close-button"
                    @click=${this._onCloseButtonClick}
                    @focus=${this._pause}
                    @blur=${this._resume}
                    title="${"Fermer cette notification"}">
              <cc-icon .icon="${o}" a11y-name="${"Fermer cette notification"}"></cc-icon>
            </button>
          `:""}

          ${this.timeout>0?c`
            <div class="progress-bar ${m({invisible:!this.showProgress})}">
              <div class="progress-bar-track" 
                   ${E({keyframeOptions:{duration:this.timeout}})}
              ></div>
            </div>
          `:""}
        </div>
      </div>
    `}static get styles(){return[d`
        :host {
          --padding: 0.8em;

          display: block;
        }

        /* region COMMON */

        .toast {
          display: flex;
          overflow: hidden;
          align-items: stretch;
          border: 1px solid var(--toast-color);
          background-color: var(--toast-color);
          border-radius: 0.3em;
          box-shadow: 0 2px 4px rgb(38 38 38 / 25%),
            0 5px 15px rgb(38 38 38 / 25%);
          pointer-events: all;
        }
        /* endregion */

        /* region COLOR */

        :host([intent='info']) {
          --toast-color: var(--cc-color-bg-primary);
        }

        :host([intent='success']) {
          --toast-color: var(--cc-color-bg-success);
        }

        :host([intent='warning']) {
          --toast-color: var(--cc-color-bg-warning);
        }

        :host([intent='danger']) {
          --toast-color: var(--cc-color-bg-danger);
        }
        /* endregion */

        /* region ICON */

        .icon-wrapper {
          display: flex;
          align-items: center;
          padding: var(--padding);
          border-right: 1px solid var(--toast-color);
          background-color: var(--toast-color);
        }

        .icon {
          --cc-icon-color: var(--cc-toast-icon-color, #e7e7e7);
          --cc-icon-size: 1.8em;
        }
        /* endregion */
        
        .right {
          position: relative;
          display: flex;
          flex: 1 1 auto;
          justify-content: stretch;
          background-color: var(--cc-color-bg-default);
        }
        
        /* region CONTENT */

        .content {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-self: center;
          justify-content: center;
          padding: var(--padding);
          color: var(--toast-color);
          gap: 0.5em;
        }

        .heading {
          font-weight: bold;
        }

        /* endregion */

        /* region CLOSE_BUTTON */

        .close-button {
          --cc-icon-color: var(--cc-color-text-weak);
          --cc-icon-size: 1.5em;
        
          width: auto;
          height: auto;
          align-self: start;
          padding: 0.2em;
          border: none;
          margin: 0.25em;
          background-color: transparent;
          border-radius: var(--cc-border-radius-small, 0.15em);
          cursor: pointer;
        }

        .close-button img {
          display: block;
          width: 1em;
          height: 1em;
        }

        .close-button:hover {
          background-color: var(--cc-color-bg-neutral-hovered);
        }
        
        .close-button:enabled:focus {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }
        /* endregion */

        /* region PROGRESS */

        .progress-bar {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 0.3em;
        }

        .progress-bar-track {
          width: 0;
          height: 100%;
          background-color: var(--toast-color);
        }

        .progress-bar.invisible {
          height: 0;
        }
        /* endregion */
      `]}}window.customElements.define("cc-toast",F);export{E as $,F as C,C as f,O as p,A as v};
