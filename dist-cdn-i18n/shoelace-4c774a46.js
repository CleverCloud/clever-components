import{s as t,i as e,x as o,n as i}from"./lit-element-98ed46d4.js";import{o as l}from"./class-map-1feb5cf7.js";import{l as s}from"./if-defined-cd9b1ec0.js";import{n as r}from"./directive-helpers-34e7fc26.js";var n=Object.defineProperty,a=Object.defineProperties,c=Object.getOwnPropertyDescriptor,d=Object.getOwnPropertyDescriptors,h=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,u=Object.prototype.propertyIsEnumerable,f=(t,e,o)=>e in t?n(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o,m=(t,e)=>{for(var o in e||(e={}))p.call(e,o)&&f(t,o,e[o]);if(h)for(var o of h(e))u.call(e,o)&&f(t,o,e[o]);return t},g=(t,e)=>a(t,d(e)),b=(t,e,o,i)=>{for(var l,s=i>1?void 0:i?c(e,o):e,r=t.length-1;r>=0;r--)(l=t[r])&&(s=(i?l(e,o,s):l(s))||s);return i&&s&&n(e,o,s),s};const v=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:o,elements:i}=e;return{kind:o,elements:i,finisher(e){customElements.define(t,e)}}})(t,e),y=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(o){o.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(o){o.createProperty(e.key,t)}};function w(t){return(e,o)=>void 0!==o?((t,e,o)=>{e.constructor.createProperty(o,t)})(t,e,o):y(t,e)}function x(t){return w({...t,state:!0})}function _(t,e){return(({finisher:t,descriptor:e})=>(o,i)=>{var l;if(void 0===i){const i=null!==(l=o.originalKey)&&void 0!==l?l:o.key,s=null!=e?{kind:"method",placement:"prototype",key:i,descriptor:e(o.key)}:{...o,key:i};return null!=t&&(s.finisher=function(e){t(e,i)}),s}{const l=o.constructor;void 0!==e&&Object.defineProperty(o,i,e(i)),null==t||t(l,i)}})({descriptor:o=>{const i={get(){var e,o;return null!==(o=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==o?o:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof o?Symbol():"__"+o;i.get=function(){var o,i;return void 0===this[e]&&(this[e]=null!==(i=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(t))&&void 0!==i?i:null),this[e]}}return i}})}let z="";function k(t){z=t}const C={name:"default",resolver:t=>function(t=""){if(!z){const t=[...document.getElementsByTagName("script")],e=t.find((t=>t.hasAttribute("data-shoelace")));if(e)k(e.getAttribute("data-shoelace"));else{const e=t.find((t=>/shoelace(\.min)?\.js($|\?)/.test(t.src)||/shoelace-autoloader(\.min)?\.js($|\?)/.test(t.src)));let o="";e&&(o=e.getAttribute("src")),k(o.split("/").slice(0,-1).join("/"))}}return z.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}(`assets/icons/${t}.svg`)};const S={caret:'\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <polyline points="6 9 12 15 18 9"></polyline>\n    </svg>\n  ',check:'\n    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(3.428571, 3.428571)">\n            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>\n            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',eyedropper:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">\n      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>\n    </svg>\n  ',indeterminate:'\n    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">\n        <g stroke="currentColor" stroke-width="2">\n          <g transform="translate(2.285714, 6.857143)">\n            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>\n          </g>\n        </g>\n      </g>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"play-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">\n      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>\n    </svg>\n  ',"pause-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">\n      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>\n    </svg>\n  ',radio:'\n    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">\n      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n        <g fill="currentColor">\n          <circle cx="8" cy="8" r="3.42857143"></circle>\n        </g>\n      </g>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',"x-lg":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">\n      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>\n    </svg>\n  ',"x-circle-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">\n      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>\n    </svg>\n  '};let O=[C,{name:"system",resolver:t=>t in S?`data:image/svg+xml,${encodeURIComponent(S[t])}`:""}],E=[];function L(t){return O.find((e=>e.name===t))}function $(t,e){const o=Object.assign({waitUntilFirstUpdate:!1},e);return(e,i)=>{const{update:l}=e,s=Array.isArray(t)?t:[t];e.update=function(t){s.forEach((e=>{const l=e;if(t.has(l)){const e=t.get(l),s=this[l];e!==s&&(o.waitUntilFirstUpdate&&!this.hasUpdated||this[i](e,s))}})),l.call(this,t)}}}var A=function(t,e,o,i){var l,s=arguments.length,r=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,o,i);else for(var n=t.length-1;n>=0;n--)(l=t[n])&&(r=(s<3?l(r):s>3?l(e,o,r):l(e,o))||r);return s>3&&r&&Object.defineProperty(e,o,r),r};class P extends t{emit(t,e){const o=new CustomEvent(t,Object.assign({bubbles:!0,cancelable:!1,composed:!0,detail:{}},e));return this.dispatchEvent(o),o}}A([w()],P.prototype,"dir",void 0),A([w()],P.prototype,"lang",void 0);var T=e`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`,F=e`
  ${T}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;const D=Symbol(),M=Symbol();let R;const B=new Map;let I=class extends P{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.label="",this.library="default"}async resolveIcon(t,e){var i;let l;if(null==e?void 0:e.spriteSheet)return o`<svg part="svg">
        <use part="use" href="${t}"></use>
      </svg>`;try{if(l=await fetch(t,{mode:"cors"}),!l.ok)return 410===l.status?D:M}catch(t){return M}try{const t=document.createElement("div");t.innerHTML=await l.text();const e=t.firstElementChild;if("svg"!==(null==(i=null==e?void 0:e.tagName)?void 0:i.toLowerCase()))return D;R||(R=new DOMParser);const o=R.parseFromString(e.outerHTML,"text/html").body.querySelector("svg");return o?(o.part.add("svg"),document.adoptNode(o)):D}catch(t){return D}}connectedCallback(){var t;super.connectedCallback(),t=this,E.push(t)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){var t;super.disconnectedCallback(),t=this,E=E.filter((e=>e!==t))}getUrl(){const t=L(this.library);return this.name&&t?t.resolver(this.name):this.src}handleLabelChange(){"string"==typeof this.label&&this.label.length>0?(this.setAttribute("role","img"),this.setAttribute("aria-label",this.label),this.removeAttribute("aria-hidden")):(this.removeAttribute("role"),this.removeAttribute("aria-label"),this.setAttribute("aria-hidden","true"))}async setIcon(){var t;const e=L(this.library),o=this.getUrl();if(!o)return void(this.svg=null);let i=B.get(o);if(i||(i=this.resolveIcon(o,e),B.set(o,i)),!this.initialRender)return;const l=await i;if(l===M&&B.delete(o),o===this.getUrl())if(r(l))this.svg=l;else switch(l){case M:case D:this.svg=null,this.emit("sl-error");break;default:this.svg=l.cloneNode(!0),null==(t=null==e?void 0:e.mutator)||t.call(e,this.svg),this.emit("sl-load")}}render(){return this.svg}};function V(t){return t.split("-")[1]}function j(t){return"y"===t?"height":"width"}function N(t){return t.split("-")[0]}function H(t){return["top","bottom"].includes(N(t))?"x":"y"}function U(t,e,o){let{reference:i,floating:l}=t;const s=i.x+i.width/2-l.width/2,r=i.y+i.height/2-l.height/2,n=H(e),a=j(n),c=i[a]/2-l[a]/2,d="x"===n;let h;switch(N(e)){case"top":h={x:s,y:i.y-l.height};break;case"bottom":h={x:s,y:i.y+i.height};break;case"right":h={x:i.x+i.width,y:r};break;case"left":h={x:i.x-l.width,y:r};break;default:h={x:i.x,y:i.y}}switch(V(e)){case"start":h[n]-=c*(o&&d?-1:1);break;case"end":h[n]+=c*(o&&d?-1:1)}return h}I.styles=F,b([x()],I.prototype,"svg",2),b([w({reflect:!0})],I.prototype,"name",2),b([w()],I.prototype,"src",2),b([w()],I.prototype,"label",2),b([w({reflect:!0})],I.prototype,"library",2),b([$("label")],I.prototype,"handleLabelChange",1),b([$(["name","src","library"])],I.prototype,"setIcon",1),I=b([v("sl-icon")],I);function q(t){return"number"!=typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function W(t){return{...t,top:t.y,left:t.x,right:t.x+t.width,bottom:t.y+t.height}}async function K(t,e){var o;void 0===e&&(e={});const{x:i,y:l,platform:s,rects:r,elements:n,strategy:a}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:h="floating",altBoundary:p=!1,padding:u=0}=e,f=q(u),m=n[p?"floating"===h?"reference":"floating":h],g=W(await s.getClippingRect({element:null==(o=await(null==s.isElement?void 0:s.isElement(m)))||o?m:m.contextElement||await(null==s.getDocumentElement?void 0:s.getDocumentElement(n.floating)),boundary:c,rootBoundary:d,strategy:a})),b="floating"===h?{...r.floating,x:i,y:l}:r.reference,v=await(null==s.getOffsetParent?void 0:s.getOffsetParent(n.floating)),y=await(null==s.isElement?void 0:s.isElement(v))&&await(null==s.getScale?void 0:s.getScale(v))||{x:1,y:1},w=W(s.convertOffsetParentRelativeRectToViewportRelativeRect?await s.convertOffsetParentRelativeRectToViewportRelativeRect({rect:b,offsetParent:v,strategy:a}):b);return{top:(g.top-w.top+f.top)/y.y,bottom:(w.bottom-g.bottom+f.bottom)/y.y,left:(g.left-w.left+f.left)/y.x,right:(w.right-g.right+f.right)/y.x}}const X=Math.min,Y=Math.max;function G(t,e,o){return Y(t,X(e,o))}const Z={left:"right",right:"left",bottom:"top",top:"bottom"};function J(t){return t.replace(/left|right|bottom|top/g,(t=>Z[t]))}const Q={start:"end",end:"start"};function tt(t){return t.replace(/start|end/g,(t=>Q[t]))}const et=function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){const{x:o,y:i}=e,l=await async function(t,e){const{placement:o,platform:i,elements:l}=t,s=await(null==i.isRTL?void 0:i.isRTL(l.floating)),r=N(o),n=V(o),a="x"===H(o),c=["left","top"].includes(r)?-1:1,d=s&&a?-1:1,h="function"==typeof e?e(t):e;let{mainAxis:p,crossAxis:u,alignmentAxis:f}="number"==typeof h?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...h};return n&&"number"==typeof f&&(u="end"===n?-1*f:f),a?{x:u*d,y:p*c}:{x:p*c,y:u*d}}(e,t);return{x:o+l.x,y:i+l.y,data:l}}}};const ot=Math.min,it=Math.max,lt=Math.round,st=Math.floor,rt=t=>({x:t,y:t});function nt(t){return dt(t)?(t.nodeName||"").toLowerCase():"#document"}function at(t){var e;return(null==t||null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function ct(t){var e;return null==(e=(dt(t)?t.ownerDocument:t.document)||window.document)?void 0:e.documentElement}function dt(t){return t instanceof Node||t instanceof at(t).Node}function ht(t){return t instanceof Element||t instanceof at(t).Element}function pt(t){return t instanceof HTMLElement||t instanceof at(t).HTMLElement}function ut(t){return"undefined"!=typeof ShadowRoot&&(t instanceof ShadowRoot||t instanceof at(t).ShadowRoot)}function ft(t){const{overflow:e,overflowX:o,overflowY:i,display:l}=yt(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&!["inline","contents"].includes(l)}function mt(t){return["table","td","th"].includes(nt(t))}function gt(t){const e=bt(),o=yt(t);return"none"!==o.transform||"none"!==o.perspective||!!o.containerType&&"normal"!==o.containerType||!e&&!!o.backdropFilter&&"none"!==o.backdropFilter||!e&&!!o.filter&&"none"!==o.filter||["transform","perspective","filter"].some((t=>(o.willChange||"").includes(t)))||["paint","layout","strict","content"].some((t=>(o.contain||"").includes(t)))}function bt(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function vt(t){return["html","body","#document"].includes(nt(t))}function yt(t){return at(t).getComputedStyle(t)}function wt(t){return ht(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function xt(t){if("html"===nt(t))return t;const e=t.assignedSlot||t.parentNode||ut(t)&&t.host||ct(t);return ut(e)?e.host:e}function _t(t){const e=xt(t);return vt(e)?t.ownerDocument?t.ownerDocument.body:t.body:pt(e)&&ft(e)?e:_t(e)}function zt(t,e,o){var i;void 0===e&&(e=[]),void 0===o&&(o=!0);const l=_t(t),s=l===(null==(i=t.ownerDocument)?void 0:i.body),r=at(l);return s?e.concat(r,r.visualViewport||[],ft(l)?l:[],r.frameElement&&o?zt(r.frameElement):[]):e.concat(l,zt(l,[],o))}function kt(t){const e=yt(t);let o=parseFloat(e.width)||0,i=parseFloat(e.height)||0;const l=pt(t),s=l?t.offsetWidth:o,r=l?t.offsetHeight:i,n=lt(o)!==s||lt(i)!==r;return n&&(o=s,i=r),{width:o,height:i,$:n}}function Ct(t){return ht(t)?t:t.contextElement}function St(t){const e=Ct(t);if(!pt(e))return rt(1);const o=e.getBoundingClientRect(),{width:i,height:l,$:s}=kt(e);let r=(s?lt(o.width):o.width)/i,n=(s?lt(o.height):o.height)/l;return r&&Number.isFinite(r)||(r=1),n&&Number.isFinite(n)||(n=1),{x:r,y:n}}const Ot=rt(0);function Et(t){const e=at(t);return bt()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:Ot}function Lt(t,e,o,i){void 0===e&&(e=!1),void 0===o&&(o=!1);const l=t.getBoundingClientRect(),s=Ct(t);let r=rt(1);e&&(i?ht(i)&&(r=St(i)):r=St(t));const n=function(t,e,o){return void 0===e&&(e=!1),!(!o||e&&o!==at(t))&&e}(s,o,i)?Et(s):rt(0);let a=(l.left+n.x)/r.x,c=(l.top+n.y)/r.y,d=l.width/r.x,h=l.height/r.y;if(s){const t=at(s),e=i&&ht(i)?at(i):i;let o=t,l=o.frameElement;for(;l&&i&&e!==o;){const t=St(l),e=l.getBoundingClientRect(),i=yt(l),s=e.left+(l.clientLeft+parseFloat(i.paddingLeft))*t.x,r=e.top+(l.clientTop+parseFloat(i.paddingTop))*t.y;a*=t.x,c*=t.y,d*=t.x,h*=t.y,a+=s,c+=r,o=at(l),l=o.frameElement}}return W({width:d,height:h,x:a,y:c})}const $t=[":popover-open",":modal"];function At(t){return $t.some((e=>{try{return t.matches(e)}catch(t){return!1}}))}function Pt(t){return Lt(ct(t)).left+wt(t).scrollLeft}function Tt(t,e,o){let i;if("viewport"===e)i=function(t,e){const o=at(t),i=ct(t),l=o.visualViewport;let s=i.clientWidth,r=i.clientHeight,n=0,a=0;if(l){s=l.width,r=l.height;const t=bt();(!t||t&&"fixed"===e)&&(n=l.offsetLeft,a=l.offsetTop)}return{width:s,height:r,x:n,y:a}}(t,o);else if("document"===e)i=function(t){const e=ct(t),o=wt(t),i=t.ownerDocument.body,l=it(e.scrollWidth,e.clientWidth,i.scrollWidth,i.clientWidth),s=it(e.scrollHeight,e.clientHeight,i.scrollHeight,i.clientHeight);let r=-o.scrollLeft+Pt(t);const n=-o.scrollTop;return"rtl"===yt(i).direction&&(r+=it(e.clientWidth,i.clientWidth)-l),{width:l,height:s,x:r,y:n}}(ct(t));else if(ht(e))i=function(t,e){const o=Lt(t,!0,"fixed"===e),i=o.top+t.clientTop,l=o.left+t.clientLeft,s=pt(t)?St(t):rt(1);return{width:t.clientWidth*s.x,height:t.clientHeight*s.y,x:l*s.x,y:i*s.y}}(e,o);else{const o=Et(t);i={...e,x:e.x-o.x,y:e.y-o.y}}return W(i)}function Ft(t,e){const o=xt(t);return!(o===e||!ht(o)||vt(o))&&("fixed"===yt(o).position||Ft(o,e))}function Dt(t,e,o){const i=pt(e),l=ct(e),s="fixed"===o,r=Lt(t,!0,s,e);let n={scrollLeft:0,scrollTop:0};const a=rt(0);if(i||!i&&!s)if(("body"!==nt(e)||ft(l))&&(n=wt(e)),i){const t=Lt(e,!0,s,e);a.x=t.x+e.clientLeft,a.y=t.y+e.clientTop}else l&&(a.x=Pt(l));return{x:r.left+n.scrollLeft-a.x,y:r.top+n.scrollTop-a.y,width:r.width,height:r.height}}function Mt(t,e){return pt(t)&&"fixed"!==yt(t).position?e?e(t):t.offsetParent:null}function Rt(t,e){const o=at(t);if(!pt(t)||At(t))return o;let i=Mt(t,e);for(;i&&mt(i)&&"static"===yt(i).position;)i=Mt(i,e);return i&&("html"===nt(i)||"body"===nt(i)&&"static"===yt(i).position&&!gt(i))?o:i||function(t){let e=xt(t);for(;pt(e)&&!vt(e);){if(gt(e))return e;e=xt(e)}return null}(t)||o}const Bt={convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{elements:e,rect:o,offsetParent:i,strategy:l}=t;const s="fixed"===l,r=ct(i),n=!!e&&At(e.floating);if(i===r||n&&s)return o;let a={scrollLeft:0,scrollTop:0},c=rt(1);const d=rt(0),h=pt(i);if((h||!h&&!s)&&(("body"!==nt(i)||ft(r))&&(a=wt(i)),pt(i))){const t=Lt(i);c=St(i),d.x=t.x+i.clientLeft,d.y=t.y+i.clientTop}return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-a.scrollLeft*c.x+d.x,y:o.y*c.y-a.scrollTop*c.y+d.y}},getDocumentElement:ct,getClippingRect:function(t){let{element:e,boundary:o,rootBoundary:i,strategy:l}=t;const s=[..."clippingAncestors"===o?function(t,e){const o=e.get(t);if(o)return o;let i=zt(t,[],!1).filter((t=>ht(t)&&"body"!==nt(t))),l=null;const s="fixed"===yt(t).position;let r=s?xt(t):t;for(;ht(r)&&!vt(r);){const e=yt(r),o=gt(r);o||"fixed"!==e.position||(l=null),(s?!o&&!l:!o&&"static"===e.position&&l&&["absolute","fixed"].includes(l.position)||ft(r)&&!o&&Ft(t,r))?i=i.filter((t=>t!==r)):l=e,r=xt(r)}return e.set(t,i),i}(e,this._c):[].concat(o),i],r=s[0],n=s.reduce(((t,o)=>{const i=Tt(e,o,l);return t.top=it(i.top,t.top),t.right=ot(i.right,t.right),t.bottom=ot(i.bottom,t.bottom),t.left=it(i.left,t.left),t}),Tt(e,r,l));return{width:n.right-n.left,height:n.bottom-n.top,x:n.left,y:n.top}},getOffsetParent:Rt,getElementRects:async function(t){const e=this.getOffsetParent||Rt,o=this.getDimensions;return{reference:Dt(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,...await o(t.floating)}}},getClientRects:function(t){return Array.from(t.getClientRects())},getDimensions:function(t){const{width:e,height:o}=kt(t);return{width:e,height:o}},getScale:St,isElement:ht,isRTL:function(t){return"rtl"===yt(t).direction}};function It(t,e,o,i){void 0===i&&(i={});const{ancestorScroll:l=!0,ancestorResize:s=!0,elementResize:r="function"==typeof ResizeObserver,layoutShift:n="function"==typeof IntersectionObserver,animationFrame:a=!1}=i,c=Ct(t),d=l||s?[...c?zt(c):[],...zt(e)]:[];d.forEach((t=>{l&&t.addEventListener("scroll",o,{passive:!0}),s&&t.addEventListener("resize",o)}));const h=c&&n?function(t,e){let o,i=null;const l=ct(t);function s(){var t;clearTimeout(o),null==(t=i)||t.disconnect(),i=null}return function r(n,a){void 0===n&&(n=!1),void 0===a&&(a=1),s();const{left:c,top:d,width:h,height:p}=t.getBoundingClientRect();if(n||e(),!h||!p)return;const u={rootMargin:-st(d)+"px "+-st(l.clientWidth-(c+h))+"px "+-st(l.clientHeight-(d+p))+"px "+-st(c)+"px",threshold:it(0,ot(1,a))||1};let f=!0;function m(t){const e=t[0].intersectionRatio;if(e!==a){if(!f)return r();e?r(!1,e):o=setTimeout((()=>{r(!1,1e-7)}),100)}f=!1}try{i=new IntersectionObserver(m,{...u,root:l.ownerDocument})}catch(t){i=new IntersectionObserver(m,u)}i.observe(t)}(!0),s}(c,o):null;let p,u=-1,f=null;r&&(f=new ResizeObserver((t=>{let[i]=t;i&&i.target===c&&f&&(f.unobserve(e),cancelAnimationFrame(u),u=requestAnimationFrame((()=>{var t;null==(t=f)||t.observe(e)}))),o()})),c&&!a&&f.observe(c),f.observe(e));let m=a?Lt(t):null;return a&&function e(){const i=Lt(t);!m||i.x===m.x&&i.y===m.y&&i.width===m.width&&i.height===m.height||o();m=i,p=requestAnimationFrame(e)}(),o(),()=>{var t;d.forEach((t=>{l&&t.removeEventListener("scroll",o),s&&t.removeEventListener("resize",o)})),null==h||h(),null==(t=f)||t.disconnect(),f=null,a&&cancelAnimationFrame(p)}}const Vt=function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:o,y:i,placement:l}=e,{mainAxis:s=!0,crossAxis:r=!1,limiter:n={fn:t=>{let{x:e,y:o}=t;return{x:e,y:o}}},...a}=t,c={x:o,y:i},d=await K(e,a),h=H(N(l)),p="x"===h?"y":"x";let u=c[h],f=c[p];if(s){const t="y"===h?"bottom":"right";u=G(u+d["y"===h?"top":"left"],u,u-d[t])}if(r){const t="y"===p?"bottom":"right";f=G(f+d["y"===p?"top":"left"],f,f-d[t])}const m=n.fn({...e,[h]:u,[p]:f});return{...m,data:{x:m.x-o,y:m.y-i}}}}},jt=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var o;const{placement:i,middlewareData:l,rects:s,initialPlacement:r,platform:n,elements:a}=e,{mainAxis:c=!0,crossAxis:d=!0,fallbackPlacements:h,fallbackStrategy:p="bestFit",fallbackAxisSideDirection:u="none",flipAlignment:f=!0,...m}=t,g=N(i),b=N(r)===r,v=await(null==n.isRTL?void 0:n.isRTL(a.floating)),y=h||(b||!f?[J(r)]:function(t){const e=J(t);return[tt(t),e,tt(e)]}(r));h||"none"===u||y.push(...function(t,e,o,i){const l=V(t);let s=function(t,e,o){const i=["left","right"],l=["right","left"],s=["top","bottom"],r=["bottom","top"];switch(t){case"top":case"bottom":return o?e?l:i:e?i:l;case"left":case"right":return e?s:r;default:return[]}}(N(t),"start"===o,i);return l&&(s=s.map((t=>t+"-"+l)),e&&(s=s.concat(s.map(tt)))),s}(r,f,u,v));const w=[r,...y],x=await K(e,m),_=[];let z=(null==(o=l.flip)?void 0:o.overflows)||[];if(c&&_.push(x[g]),d){const{main:t,cross:e}=function(t,e,o){void 0===o&&(o=!1);const i=V(t),l=H(t),s=j(l);let r="x"===l?i===(o?"end":"start")?"right":"left":"start"===i?"bottom":"top";return e.reference[s]>e.floating[s]&&(r=J(r)),{main:r,cross:J(r)}}(i,s,v);_.push(x[t],x[e])}if(z=[...z,{placement:i,overflows:_}],!_.every((t=>t<=0))){var k,C;const t=((null==(k=l.flip)?void 0:k.index)||0)+1,e=w[t];if(e)return{data:{index:t,overflows:z},reset:{placement:e}};let o=null==(C=z.filter((t=>t.overflows[0]<=0)).sort(((t,e)=>t.overflows[1]-e.overflows[1]))[0])?void 0:C.placement;if(!o)switch(p){case"bestFit":{var S;const t=null==(S=z.map((t=>[t.placement,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:S[0];t&&(o=t);break}case"initialPlacement":o=r}if(i!==o)return{reset:{placement:o}}}return{}}}},Nt=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){const{placement:o,rects:i,platform:l,elements:s}=e,{apply:r=(()=>{}),...n}=t,a=await K(e,n),c=N(o),d=V(o),h="x"===H(o),{width:p,height:u}=i.floating;let f,m;"top"===c||"bottom"===c?(f=c,m=d===(await(null==l.isRTL?void 0:l.isRTL(s.floating))?"start":"end")?"left":"right"):(m=c,f="end"===d?"top":"bottom");const g=u-a[f],b=p-a[m];let v=g,y=b;if(h?y=X(p-a.right-a.left,b):v=X(u-a.bottom-a.top,g),!e.middlewareData.shift&&!d){const t=Y(a.left,0),e=Y(a.right,0),o=Y(a.top,0),i=Y(a.bottom,0);h?y=p-2*(0!==t||0!==e?t+e:Y(a.left,a.right)):v=u-2*(0!==o||0!==i?o+i:Y(a.top,a.bottom))}await r({...e,availableWidth:y,availableHeight:v});const w=await l.getDimensions(s.floating);return p!==w.width||u!==w.height?{reset:{rects:!0}}:{}}}},Ht=t=>({name:"arrow",options:t,async fn(e){const{element:o,padding:i=0}=t||{},{x:l,y:s,placement:r,rects:n,platform:a,elements:c}=e;if(null==o)return{};const d=q(i),h={x:l,y:s},p=H(r),u=j(p),f=await a.getDimensions(o),m="y"===p,g=m?"top":"left",b=m?"bottom":"right",v=m?"clientHeight":"clientWidth",y=n.reference[u]+n.reference[p]-h[p]-n.floating[u],w=h[p]-n.reference[p],x=await(null==a.getOffsetParent?void 0:a.getOffsetParent(o));let _=x?x[v]:0;_&&await(null==a.isElement?void 0:a.isElement(x))||(_=c.floating[v]||n.floating[u]);const z=y/2-w/2,k=d[g],C=_-f[u]-d[b],S=_/2-f[u]/2+z,O=G(k,S,C),E=null!=V(r)&&S!=O&&n.reference[u]/2-(S<k?d[g]:d[b])-f[u]/2<0;return{[p]:h[p]-(E?S<k?k-S:C-S:0),data:{[p]:O,centerOffset:S-O}}}}),Ut=(t,e,o)=>{const i=new Map,l={platform:Bt,...o},s={...l.platform,_c:i};return(async(t,e,o)=>{const{placement:i="bottom",strategy:l="absolute",middleware:s=[],platform:r}=o,n=s.filter(Boolean),a=await(null==r.isRTL?void 0:r.isRTL(e));let c=await r.getElementRects({reference:t,floating:e,strategy:l}),{x:d,y:h}=U(c,i,a),p=i,u={},f=0;for(let o=0;o<n.length;o++){const{name:s,fn:m}=n[o],{x:g,y:b,data:v,reset:y}=await m({x:d,y:h,initialPlacement:i,placement:p,strategy:l,middlewareData:u,rects:c,platform:r,elements:{reference:t,floating:e}});d=null!=g?g:d,h=null!=b?b:h,u={...u,[s]:{...u[s],...v}},y&&f<=50&&(f++,"object"==typeof y&&(y.placement&&(p=y.placement),y.rects&&(c=!0===y.rects?await r.getElementRects({reference:t,floating:e,strategy:l}):y.rects),({x:d,y:h}=U(c,p,a))),o=-1)}return{x:d,y:h,placement:p,strategy:l,middlewareData:u}})(t,e,{...l,platform:s})};function qt(t){return function(t){for(let e=t;e;e=Wt(e))if(e instanceof Element&&"none"===getComputedStyle(e).display)return null;for(let e=Wt(t);e;e=Wt(e)){if(!(e instanceof Element))continue;const t=getComputedStyle(e);if("contents"!==t.display){if("static"!==t.position||"none"!==t.filter)return e;if("BODY"===e.tagName)return e}}return null}(t)}function Wt(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}var Kt=e`
  ${T}

  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }
`;let Xt=class extends P{constructor(){super(...arguments),this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=10,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&"string"==typeof this.anchor){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');if(this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),!this.anchorEl)throw new Error("Invalid anchor element: no anchor could be found using the anchor slot or the anchor attribute.");this.start()}start(){this.anchorEl&&(this.cleanup=It(this.anchorEl,this.popup,(()=>{this.reposition()})))}async stop(){return new Promise((t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame((()=>t()))):t()}))}reposition(){if(!this.active||!this.anchorEl)return;const t=[et({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?t.push(Nt({apply:({rects:t})=>{const e="width"===this.sync||"both"===this.sync,o="height"===this.sync||"both"===this.sync;this.popup.style.width=e?`${t.reference.width}px`:"",this.popup.style.height=o?`${t.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(jt({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:"best-fit"===this.flipFallbackStrategy?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(Vt({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Nt({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:t,availableHeight:e})=>{"vertical"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-height",`${e}px`):this.style.removeProperty("--auto-size-available-height"),"horizontal"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-width",`${t}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push(Ht({element:this.arrowEl,padding:this.arrowPadding}));const e="absolute"===this.strategy?t=>Bt.getOffsetParent(t,qt):Bt.getOffsetParent;Ut(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:g(m({},Bt),{getOffsetParent:e})}).then((({x:t,y:e,middlewareData:o,placement:i})=>{const l="rtl"===getComputedStyle(this).direction,s={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${t}px`,top:`${e}px`}),this.arrow){const t=o.arrow.x,e=o.arrow.y;let i="",r="",n="",a="";if("start"===this.arrowPlacement){const o="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";i="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",r=l?o:"",a=l?"":o}else if("end"===this.arrowPlacement){const o="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";r=l?"":o,a=l?o:"",n="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""}else"center"===this.arrowPlacement?(a="number"==typeof t?"calc(50% - var(--arrow-size-diagonal))":"",i="number"==typeof e?"calc(50% - var(--arrow-size-diagonal))":""):(a="number"==typeof t?`${t}px`:"",i="number"==typeof e?`${e}px`:"");Object.assign(this.arrowEl.style,{top:i,right:r,bottom:n,left:a,[s]:"calc(var(--arrow-size-diagonal) * -1)"})}})),this.emit("sl-reposition")}render(){return o`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <div
        part="popup"
        class=${l({popup:!0,"popup--active":this.active,"popup--fixed":"fixed"===this.strategy,"popup--has-arrow":this.arrow})}
      >
        <slot></slot>
        ${this.arrow?o`<div part="arrow" class="popup__arrow" role="presentation"></div>`:""}
      </div>
    `}};Xt.styles=Kt,b([_(".popup")],Xt.prototype,"popup",2),b([_(".popup__arrow")],Xt.prototype,"arrowEl",2),b([w()],Xt.prototype,"anchor",2),b([w({type:Boolean,reflect:!0})],Xt.prototype,"active",2),b([w({reflect:!0})],Xt.prototype,"placement",2),b([w({reflect:!0})],Xt.prototype,"strategy",2),b([w({type:Number})],Xt.prototype,"distance",2),b([w({type:Number})],Xt.prototype,"skidding",2),b([w({type:Boolean})],Xt.prototype,"arrow",2),b([w({attribute:"arrow-placement"})],Xt.prototype,"arrowPlacement",2),b([w({attribute:"arrow-padding",type:Number})],Xt.prototype,"arrowPadding",2),b([w({type:Boolean})],Xt.prototype,"flip",2),b([w({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map((t=>t.trim())).filter((t=>""!==t)),toAttribute:t=>t.join(" ")}})],Xt.prototype,"flipFallbackPlacements",2),b([w({attribute:"flip-fallback-strategy"})],Xt.prototype,"flipFallbackStrategy",2),b([w({type:Object})],Xt.prototype,"flipBoundary",2),b([w({attribute:"flip-padding",type:Number})],Xt.prototype,"flipPadding",2),b([w({type:Boolean})],Xt.prototype,"shift",2),b([w({type:Object})],Xt.prototype,"shiftBoundary",2),b([w({attribute:"shift-padding",type:Number})],Xt.prototype,"shiftPadding",2),b([w({attribute:"auto-size"})],Xt.prototype,"autoSize",2),b([w()],Xt.prototype,"sync",2),b([w({type:Object})],Xt.prototype,"autoSizeBoundary",2),b([w({attribute:"auto-size-padding",type:Number})],Xt.prototype,"autoSizePadding",2),Xt=b([v("sl-popup")],Xt);const Yt=Symbol.for(""),Gt=t=>{if((null==t?void 0:t.r)===Yt)return null==t?void 0:t._$litStatic$},Zt=(t,...e)=>({_$litStatic$:e.reduce(((e,o,i)=>e+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(o)+t[i+1]),t[0]),r:Yt}),Jt=new Map,Qt=(t=>(e,...o)=>{const i=o.length;let l,s;const r=[],n=[];let a,c=0,d=!1;for(;c<i;){for(a=e[c];c<i&&void 0!==(s=o[c],l=Gt(s));)a+=l+e[++c],d=!0;c!==i&&n.push(s),r.push(a),c++}if(c===i&&r.push(e[i]),d){const t=r.join("$$lit$$");void 0===(e=Jt.get(t))&&(r.raw=r,Jt.set(t,e=r)),o=n}return t(e,...o)})(o);var te=e`
  ${T}

  :host {
    display: inline-block;
    color: var(--sl-color-neutral-600);
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-x-fast) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus-visible:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-700);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .icon-button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .icon-button__icon {
    pointer-events: none;
  }
`;let ee=class extends P{constructor(){super(...arguments),this.hasFocus=!1,this.label="",this.disabled=!1}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleFocus(){this.hasFocus=!0,this.emit("sl-focus")}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}click(){this.button.click()}focus(t){this.button.focus(t)}blur(){this.button.blur()}render(){const t=!!this.href,e=t?Zt`a`:Zt`button`;return Qt`
      <${e}
        part="base"
        class=${l({"icon-button":!0,"icon-button--disabled":!t&&this.disabled,"icon-button--focused":this.hasFocus})}
        ?disabled=${s(t?void 0:this.disabled)}
        type=${s(t?void 0:"button")}
        href=${s(t?this.href:void 0)}
        target=${s(t?this.target:void 0)}
        download=${s(t?this.download:void 0)}
        rel=${s(t&&this.target?"noreferrer noopener":void 0)}
        role=${s(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        aria-label="${this.label}"
        tabindex=${this.disabled?"-1":"0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @click=${this.handleClick}
      >
        <sl-icon
          class="icon-button__icon"
          name=${s(this.name)}
          library=${s(this.library)}
          src=${s(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </${e}>
    `}};ee.styles=te,b([_(".icon-button")],ee.prototype,"button",2),b([x()],ee.prototype,"hasFocus",2),b([w()],ee.prototype,"name",2),b([w()],ee.prototype,"library",2),b([w()],ee.prototype,"src",2),b([w()],ee.prototype,"href",2),b([w()],ee.prototype,"target",2),b([w()],ee.prototype,"download",2),b([w()],ee.prototype,"label",2),b([w({type:Boolean,reflect:!0})],ee.prototype,"disabled",2),ee=b([v("sl-icon-button")],ee);const oe=new Set,ie=new MutationObserver(ae),le=new Map;let se,re=document.documentElement.dir||"ltr",ne=document.documentElement.lang||navigator.language;function ae(){re=document.documentElement.dir||"ltr",ne=document.documentElement.lang||navigator.language,[...oe.keys()].map((t=>{"function"==typeof t.requestUpdate&&t.requestUpdate()}))}ie.observe(document.documentElement,{attributes:!0,attributeFilter:["dir","lang"]});class ce{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){oe.add(this.host)}hostDisconnected(){oe.delete(this.host)}dir(){return`${this.host.dir||re}`.toLowerCase()}lang(){return`${this.host.lang||ne}`.toLowerCase()}getTranslationData(t){var e,o;const i=new Intl.Locale(t),l=null==i?void 0:i.language.toLowerCase(),s=null!==(o=null===(e=null==i?void 0:i.region)||void 0===e?void 0:e.toLowerCase())&&void 0!==o?o:"";return{locale:i,language:l,region:s,primary:le.get(`${l}-${s}`),secondary:le.get(l)}}exists(t,e){var o;const{primary:i,secondary:l}=this.getTranslationData(null!==(o=e.lang)&&void 0!==o?o:this.lang());return e=Object.assign({includeFallback:!1},e),!!(i&&i[t]||l&&l[t]||e.includeFallback&&se&&se[t])}term(t,...e){const{primary:o,secondary:i}=this.getTranslationData(this.lang());let l;if(o&&o[t])l=o[t];else if(i&&i[t])l=i[t];else{if(!se||!se[t])return console.error(`No translation found for: ${String(t)}`),String(t);l=se[t]}return"function"==typeof l?l(...e):l}date(t,e){return t=new Date(t),new Intl.DateTimeFormat(this.lang(),e).format(t)}number(t,e){return t=Number(t),isNaN(t)?"":new Intl.NumberFormat(this.lang(),e).format(t)}relativeTime(t,e,o){return new Intl.RelativeTimeFormat(this.lang(),o).format(t,e)}}!function(...t){t.map((t=>{const e=t.$code.toLowerCase();le.has(e)?le.set(e,Object.assign(Object.assign({},le.get(e)),t)):le.set(e,t),se||(se=t)})),ae()}({$code:"en",$name:"English",$dir:"ltr",carousel:"Carousel",clearEntry:"Clear entry",close:"Close",copy:"Copy",currentValue:"Current value",goToSlide:(t,e)=>`Go to slide ${t} of ${e}`,hidePassword:"Hide password",loading:"Loading",nextSlide:"Next slide",numOptionsSelected:t=>0===t?"No options selected":1===t?"1 option selected":`${t} options selected`,previousSlide:"Previous slide",progress:"Progress",remove:"Remove",resize:"Resize",scrollToEnd:"Scroll to end",scrollToStart:"Scroll to start",selectAColorFromTheScreen:"Select a color from the screen",showPassword:"Show password",slideNum:t=>`Slide ${t}`,toggleColorFormat:"Toggle color format"});class de extends ce{}var he=e`
  ${T}

  :host {
    display: inline-block;
  }

  .tag {
    display: flex;
    align-items: center;
    border: solid 1px;
    line-height: 1;
    white-space: nowrap;
    user-select: none;
  }

  .tag__remove::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Variant modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-800);
  }

  .tag--primary:active > sl-icon-button {
    color: var(--sl-color-primary-600);
  }

  .tag--success {
    background-color: var(--sl-color-success-50);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-800);
  }

  .tag--success:active > sl-icon-button {
    color: var(--sl-color-success-600);
  }

  .tag--neutral {
    background-color: var(--sl-color-neutral-50);
    border-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-800);
  }

  .tag--neutral:active > sl-icon-button {
    color: var(--sl-color-neutral-600);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-50);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-800);
  }

  .tag--warning:active > sl-icon-button {
    color: var(--sl-color-warning-600);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-50);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-800);
  }

  .tag--danger:active > sl-icon-button {
    color: var(--sl-color-danger-600);
  }

  /*
   * Size modifiers
   */

  .tag--small {
    font-size: var(--sl-button-font-size-small);
    height: calc(var(--sl-input-height-small) * 0.8);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
    padding: 0 var(--sl-spacing-x-small);
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__remove {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`;let pe=class extends P{constructor(){super(...arguments),this.localize=new de(this),this.variant="neutral",this.size="medium",this.pill=!1,this.removable=!1}handleRemoveClick(){this.emit("sl-remove")}render(){return o`
      <span
        part="base"
        class=${l({tag:!0,"tag--primary":"primary"===this.variant,"tag--success":"success"===this.variant,"tag--neutral":"neutral"===this.variant,"tag--warning":"warning"===this.variant,"tag--danger":"danger"===this.variant,"tag--text":"text"===this.variant,"tag--small":"small"===this.size,"tag--medium":"medium"===this.size,"tag--large":"large"===this.size,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <slot part="content" class="tag__content"></slot>

        ${this.removable?o`
              <sl-icon-button
                part="remove-button"
                exportparts="base:remove-button__base"
                name="x-lg"
                library="system"
                label=${this.localize.term("remove")}
                class="tag__remove"
                @click=${this.handleRemoveClick}
                tabindex="-1"
              ></sl-icon-button>
            `:""}
      </span>
    `}};function ue(t,e,o){return new Promise((i=>{if((null==o?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const l=t.animate(e,Object.assign(Object.assign({},o),{duration:fe()?0:o.duration}));l.addEventListener("cancel",i,{once:!0}),l.addEventListener("finish",i,{once:!0})}))}function fe(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function me(t){return Promise.all(t.getAnimations().map((t=>new Promise((e=>{const o=requestAnimationFrame(e);t.addEventListener("cancel",(()=>o),{once:!0}),t.addEventListener("finish",(()=>o),{once:!0}),t.cancel()})))))}pe.styles=he,b([w({reflect:!0})],pe.prototype,"variant",2),b([w({reflect:!0})],pe.prototype,"size",2),b([w({type:Boolean,reflect:!0})],pe.prototype,"pill",2),b([w({type:Boolean})],pe.prototype,"removable",2),pe=b([v("sl-tag")],pe);const ge=new WeakMap,be=new WeakMap,ve=new WeakSet,ye=new WeakMap;class we{constructor(t,e){(this.host=t).addController(this),this.options=Object.assign({form:t=>{if(t.hasAttribute("form")&&""!==t.getAttribute("form")){const e=t.getRootNode(),o=t.getAttribute("form");if(o)return e.getElementById(o)}return t.closest("form")},name:t=>t.name,value:t=>t.value,defaultValue:t=>t.defaultValue,disabled:t=>{var e;return null!==(e=t.disabled)&&void 0!==e&&e},reportValidity:t=>"function"!=typeof t.reportValidity||t.reportValidity(),setValue:(t,e)=>t.value=e,assumeInteractionOn:["sl-input"]},e),this.handleFormData=this.handleFormData.bind(this),this.handleFormSubmit=this.handleFormSubmit.bind(this),this.handleFormReset=this.handleFormReset.bind(this),this.reportFormValidity=this.reportFormValidity.bind(this),this.handleInteraction=this.handleInteraction.bind(this)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),ye.set(this.host,[]),this.options.assumeInteractionOn.forEach((t=>{this.host.addEventListener(t,this.handleInteraction)}))}hostDisconnected(){this.detachForm(),ye.delete(this.host),this.options.assumeInteractionOn.forEach((t=>{this.host.removeEventListener(t,this.handleInteraction)}))}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,ge.has(this.form)?ge.get(this.form).add(this.host):ge.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),be.has(this.form)||(be.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity())):this.form=void 0}detachForm(){var t;this.form&&(null===(t=ge.get(this.form))||void 0===t||t.delete(this.host),this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),be.has(this.form)&&(this.form.reportValidity=be.get(this.form),be.delete(this.form))),this.form=void 0}handleFormData(t){const e=this.options.disabled(this.host),o=this.options.name(this.host),i=this.options.value(this.host),l="sl-button"===this.host.tagName.toLowerCase();!e&&!l&&"string"==typeof o&&o.length>0&&void 0!==i&&(Array.isArray(i)?i.forEach((e=>{t.formData.append(o,e.toString())})):t.formData.append(o,i.toString()))}handleFormSubmit(t){var e;const o=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&(null===(e=ge.get(this.form))||void 0===e||e.forEach((t=>{this.setUserInteracted(t,!0)}))),!this.form||this.form.noValidate||o||i(this.host)||(t.preventDefault(),t.stopImmediatePropagation())}handleFormReset(){this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),ye.set(this.host,[])}handleInteraction(t){const e=ye.get(this.host);e.includes(t.type)||e.push(t.type),e.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)}reportFormValidity(){if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.reportValidity&&!e.reportValidity())return!1}return!0}setUserInteracted(t,e){e?ve.add(t):ve.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){const o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach((t=>{e.hasAttribute(t)&&o.setAttribute(t,e.getAttribute(t))}))),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return null!==(t=this.form)&&void 0!==t?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,o=Boolean(ve.has(e)),i=Boolean(e.required);e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("sl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||null==t||t.preventDefault()}}const xe=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(Object.assign(Object.assign({},xe),{valid:!1,valueMissing:!0})),Object.freeze(Object.assign(Object.assign({},xe),{valid:!1,customError:!0}));const _e=new Map,ze=new WeakMap;function ke(t,e){return"rtl"===e.toLowerCase()?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Ce(t,e){_e.set(t,function(t){return null!=t?t:{keyframes:[],options:{duration:0}}}(e))}function Se(t,e,o){const i=ze.get(t);if(null==i?void 0:i[e])return ke(i[e],o.dir);const l=_e.get(e);return l?ke(l,o.dir):{keyframes:[],options:{duration:0}}}class Oe{constructor(t,...e){this.slotNames=[],(this.host=t).addController(this),this.slotNames=e,this.handleSlotChange=this.handleSlotChange.bind(this)}hasDefaultSlot(){return[...this.host.childNodes].some((t=>{if(t.nodeType===t.TEXT_NODE&&""!==t.textContent.trim())return!0;if(t.nodeType===t.ELEMENT_NODE){const e=t;if("sl-visually-hidden"===e.tagName.toLowerCase())return!1;if(!e.hasAttribute("slot"))return!0}return!1}))}hasNamedSlot(t){return null!==this.host.querySelector(`:scope > [slot="${t}"]`)}test(t){return"[default]"===t?this.hasDefaultSlot():this.hasNamedSlot(t)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}handleSlotChange(t){const e=t.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()}}function Ee(t,e,o="vertical",i="smooth"){const l=function(t,e){return{top:Math.round(t.getBoundingClientRect().top-e.getBoundingClientRect().top),left:Math.round(t.getBoundingClientRect().left-e.getBoundingClientRect().left)}}(t,e),s=l.top+e.scrollTop,r=l.left+e.scrollLeft,n=e.scrollLeft,a=e.scrollLeft+e.offsetWidth,c=e.scrollTop,d=e.scrollTop+e.offsetHeight;"horizontal"!==o&&"both"!==o||(r<n?e.scrollTo({left:r,behavior:i}):r+t.clientWidth>a&&e.scrollTo({left:r-e.offsetWidth+t.clientWidth,behavior:i})),"vertical"!==o&&"both"!==o||(s<c?e.scrollTo({top:s,behavior:i}):s+t.clientHeight>d&&e.scrollTo({top:s-e.offsetHeight+t.clientHeight,behavior:i}))}function Le(t,e){return new Promise((o=>{t.addEventListener(e,(function i(l){l.target===t&&(t.removeEventListener(e,i),o())}))}))}var $e=e`
  ${T}
  ${e`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--sl-input-label-color);
    margin-bottom: var(--sl-spacing-3x-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--sl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--sl-input-required-content);
    margin-inline-start: var(--sl-input-required-content-offset);
    color: var(--sl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
    margin-top: var(--sl-spacing-3x-small);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--sl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--sl-spacing-2x-small);
  }
`}

  :host {
    display: block;
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow,
      var(--sl-transition-fast) background-color;
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--sl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--sl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--sl-spacing-2x-small);
  }

  .select__tags::slotted(sl-tag) {
    cursor: pointer !important;
  }

  .select--disabled .select__tags,
  .select--disabled .select__tags::slotted(sl-tag) {
    cursor: not-allowed !important;
  }

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-input-focus-ring-color);
  }

  /* Filled selects */
  .select--filled .select__combobox {
    border: none;
    background-color: var(--sl-input-filled-background-color);
    color: var(--sl-input-color);
  }

  .select--filled:hover:not(.select--disabled) .select__combobox {
    background-color: var(--sl-input-filled-background-color-hover);
  }

  .select--filled.select--disabled .select__combobox {
    background-color: var(--sl-input-filled-background-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select--filled:not(.select--disabled).select--open .select__combobox,
  .select--filled:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--sl-input-filled-background-color-focus);
    outline: var(--sl-focus-ring);
  }

  /* Sizes */
  .select--small .select__combobox {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-small);
  }

  .select--small .select__clear {
    margin-inline-start: var(--sl-input-spacing-small);
  }

  .select--small .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-small);
  }

  .select--small.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-block: 2px;
    padding-inline-start: 0;
  }

  .select--small .select__tags {
    gap: 2px;
  }

  .select--medium .select__combobox {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-inline-start: var(--sl-input-spacing-medium);
  }

  .select--medium .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-medium);
  }

  .select--medium.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 3px;
  }

  .select--medium .select__tags {
    gap: 3px;
  }

  .select--large .select__combobox {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
    padding-block: 0;
    padding-inline: var(--sl-input-spacing-large);
  }

  .select--large .select__clear {
    margin-inline-start: var(--sl-input-spacing-large);
  }

  .select--large .select__prefix::slotted(*) {
    margin-inline-end: var(--sl-input-spacing-large);
  }

  .select--large.select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    padding-block: 4px;
  }

  .select--large .select__tags {
    gap: 4px;
  }

  /* Pills */
  .select--pill.select--small .select__combobox {
    border-radius: var(--sl-input-height-small);
  }

  .select--pill.select--medium .select__combobox {
    border-radius: var(--sl-input-height-medium);
  }

  .select--pill.select--large .select__combobox {
    border-radius: var(--sl-input-height-large);
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--sl-input-placeholder-color);
  }

  /* Clear button */
  .select__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--sl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--sl-transition-fast) color;
    cursor: pointer;
  }

  .select__clear:hover {
    color: var(--sl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--sl-spacing-small);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: 0;
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    max-height: var(--auto-size-available-height);
  }

  .select__listbox::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }

  .select__listbox::slotted(small) {
    font-size: var(--sl-font-size-small);
    font-weight: var(--sl-font-weight-semibold);
    color: var(--sl-color-neutral-500);
    padding-block: var(--sl-spacing-x-small);
    padding-inline: var(--sl-spacing-x-large);
  }
`;let Ae=class extends P{constructor(){super(...arguments),this.formControlController=new we(this,{assumeInteractionOn:["sl-blur","sl-input"]}),this.hasSlotController=new Oe(this,"help-text","label"),this.localize=new de(this),this.typeToSelectString="",this.hasFocus=!1,this.displayLabel="",this.selectedOptions=[],this.name="",this.value="",this.defaultValue="",this.size="medium",this.placeholder="",this.multiple=!1,this.maxOptionsVisible=3,this.disabled=!1,this.clearable=!1,this.open=!1,this.hoist=!1,this.filled=!1,this.pill=!1,this.label="",this.placement="bottom",this.helpText="",this.form="",this.required=!1,this.handleDocumentFocusIn=t=>{const e=t.composedPath();this&&!e.includes(this)&&this.hide()},this.handleDocumentKeyDown=t=>{const e=t.target,o=null!==e.closest(".select__clear"),i=null!==e.closest("sl-icon-button");if(!o&&!i){if("Escape"===t.key&&this.open&&(t.preventDefault(),t.stopPropagation(),this.hide(),this.displayInput.focus({preventScroll:!0})),"Enter"===t.key||" "===t.key&&""===this.typeToSelectString)return t.preventDefault(),t.stopImmediatePropagation(),this.open?void(this.currentOption&&!this.currentOption.disabled&&(this.multiple?this.toggleOptionSelection(this.currentOption):this.setSelectedOptions(this.currentOption),this.updateComplete.then((()=>{this.emit("sl-input"),this.emit("sl-change")})),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))):void this.show();if(["ArrowUp","ArrowDown","Home","End"].includes(t.key)){const e=this.getAllOptions(),o=e.indexOf(this.currentOption);let i=Math.max(0,o);if(t.preventDefault(),!this.open&&(this.show(),this.currentOption))return;"ArrowDown"===t.key?(i=o+1,i>e.length-1&&(i=0)):"ArrowUp"===t.key?(i=o-1,i<0&&(i=e.length-1)):"Home"===t.key?i=0:"End"===t.key&&(i=e.length-1),this.setCurrentOption(e[i])}if(1===t.key.length||"Backspace"===t.key){const e=this.getAllOptions();if(t.metaKey||t.ctrlKey||t.altKey)return;if(!this.open){if("Backspace"===t.key)return;this.show()}t.stopPropagation(),t.preventDefault(),clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=window.setTimeout((()=>this.typeToSelectString=""),1e3),"Backspace"===t.key?this.typeToSelectString=this.typeToSelectString.slice(0,-1):this.typeToSelectString+=t.key.toLowerCase();for(const t of e){if(t.getTextLabel().toLowerCase().startsWith(this.typeToSelectString)){this.setCurrentOption(t);break}}}}},this.handleDocumentMouseDown=t=>{const e=t.composedPath();this&&!e.includes(this)&&this.hide()}}get validity(){return this.valueInput.validity}get validationMessage(){return this.valueInput.validationMessage}connectedCallback(){super.connectedCallback(),this.open=!1}addOpenListeners(){document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown)}removeOpenListeners(){document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown)}handleFocus(){this.hasFocus=!0,this.displayInput.setSelectionRange(0,0),this.emit("sl-focus")}handleBlur(){this.hasFocus=!1,this.emit("sl-blur")}handleLabelClick(){this.displayInput.focus()}handleComboboxMouseDown(t){const e=t.composedPath().some((t=>t instanceof Element&&"sl-icon-button"===t.tagName.toLowerCase()));this.disabled||e||(t.preventDefault(),this.displayInput.focus({preventScroll:!0}),this.open=!this.open)}handleComboboxKeyDown(t){t.stopPropagation(),this.handleDocumentKeyDown(t)}handleClearClick(t){t.stopPropagation(),""!==this.value&&(this.setSelectedOptions([]),this.displayInput.focus({preventScroll:!0}),this.updateComplete.then((()=>{this.emit("sl-clear"),this.emit("sl-input"),this.emit("sl-change")})))}handleClearMouseDown(t){t.stopPropagation(),t.preventDefault()}handleOptionClick(t){const e=t.target.closest("sl-option"),o=this.value;e&&!e.disabled&&(this.multiple?this.toggleOptionSelection(e):this.setSelectedOptions(e),this.updateComplete.then((()=>this.displayInput.focus({preventScroll:!0}))),this.value!==o&&this.updateComplete.then((()=>{this.emit("sl-input"),this.emit("sl-change")})),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))}handleDefaultSlotChange(){const t=this.getAllOptions(),e=Array.isArray(this.value)?this.value:[this.value],o=[];customElements.get("sl-option")?(t.forEach((t=>o.push(t.value))),this.setSelectedOptions(t.filter((t=>e.includes(t.value))))):customElements.whenDefined("sl-option").then((()=>this.handleDefaultSlotChange()))}handleTagRemove(t,e){t.stopPropagation(),this.disabled||(this.toggleOptionSelection(e,!1),this.updateComplete.then((()=>{this.emit("sl-input"),this.emit("sl-change")})))}getAllOptions(){return[...this.querySelectorAll("sl-option")]}getFirstOption(){return this.querySelector("sl-option")}setCurrentOption(t){this.getAllOptions().forEach((t=>{t.current=!1,t.tabIndex=-1})),t&&(this.currentOption=t,t.current=!0,t.tabIndex=0,t.focus())}setSelectedOptions(t){const e=this.getAllOptions(),o=Array.isArray(t)?t:[t];e.forEach((t=>t.selected=!1)),o.length&&o.forEach((t=>t.selected=!0)),this.selectionChanged()}toggleOptionSelection(t,e){t.selected=!0===e||!1===e?e:!t.selected,this.selectionChanged()}selectionChanged(){var t,e,o,i;this.selectedOptions=this.getAllOptions().filter((t=>t.selected)),this.multiple?(this.value=this.selectedOptions.map((t=>t.value)),this.placeholder&&0===this.value.length?this.displayLabel="":this.displayLabel=this.localize.term("numOptionsSelected",this.selectedOptions.length)):(this.value=null!=(e=null==(t=this.selectedOptions[0])?void 0:t.value)?e:"",this.displayLabel=null!=(i=null==(o=this.selectedOptions[0])?void 0:o.getTextLabel())?i:""),this.updateComplete.then((()=>{this.formControlController.updateValidity()}))}handleInvalid(t){this.formControlController.setValidity(!1),this.formControlController.emitInvalidEvent(t)}handleDisabledChange(){this.disabled&&(this.open=!1,this.handleOpenChange())}handleValueChange(){const t=this.getAllOptions(),e=Array.isArray(this.value)?this.value:[this.value];this.setSelectedOptions(t.filter((t=>e.includes(t.value))))}async handleOpenChange(){if(this.open&&!this.disabled){this.setCurrentOption(this.selectedOptions[0]||this.getFirstOption()),this.emit("sl-show"),this.addOpenListeners(),await me(this),this.listbox.hidden=!1,this.popup.active=!0,requestAnimationFrame((()=>{this.setCurrentOption(this.currentOption)}));const{keyframes:t,options:e}=Se(this,"select.show",{dir:this.localize.dir()});await ue(this.popup.popup,t,e),this.currentOption&&Ee(this.currentOption,this.listbox,"vertical","auto"),this.emit("sl-after-show")}else{this.emit("sl-hide"),this.removeOpenListeners(),await me(this);const{keyframes:t,options:e}=Se(this,"select.hide",{dir:this.localize.dir()});await ue(this.popup.popup,t,e),this.listbox.hidden=!0,this.popup.active=!1,this.emit("sl-after-hide")}}async show(){if(!this.open&&!this.disabled)return this.open=!0,Le(this,"sl-after-show");this.open=!1}async hide(){if(this.open&&!this.disabled)return this.open=!1,Le(this,"sl-after-hide");this.open=!1}checkValidity(){return this.valueInput.checkValidity()}getForm(){return this.formControlController.getForm()}reportValidity(){return this.valueInput.reportValidity()}setCustomValidity(t){this.valueInput.setCustomValidity(t),this.formControlController.updateValidity()}focus(t){this.displayInput.focus(t)}blur(){this.displayInput.blur()}render(){const t=this.hasSlotController.test("label"),e=this.hasSlotController.test("help-text"),i=!!this.label||!!t,s=!!this.helpText||!!e,r=this.clearable&&!this.disabled&&this.value.length>0,n=this.placeholder&&0===this.value.length;return o`
      <div
        part="form-control"
        class=${l({"form-control":!0,"form-control--small":"small"===this.size,"form-control--medium":"medium"===this.size,"form-control--large":"large"===this.size,"form-control--has-label":i,"form-control--has-help-text":s})}
      >
        <label
          id="label"
          part="form-control-label"
          class="form-control__label"
          aria-hidden=${i?"false":"true"}
          @click=${this.handleLabelClick}
        >
          <slot name="label">${this.label}</slot>
        </label>

        <div part="form-control-input" class="form-control-input">
          <sl-popup
            class=${l({select:!0,"select--standard":!0,"select--filled":this.filled,"select--pill":this.pill,"select--open":this.open,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--focused":this.hasFocus,"select--placeholder-visible":n,"select--top":"top"===this.placement,"select--bottom":"bottom"===this.placement,"select--small":"small"===this.size,"select--medium":"medium"===this.size,"select--large":"large"===this.size})}
            placement=${this.placement}
            strategy=${this.hoist?"fixed":"absolute"}
            flip
            shift
            sync="width"
            auto-size="vertical"
            auto-size-padding="10"
          >
            <div
              part="combobox"
              class="select__combobox"
              slot="anchor"
              @keydown=${this.handleComboboxKeyDown}
              @mousedown=${this.handleComboboxMouseDown}
            >
              <slot part="prefix" name="prefix" class="select__prefix"></slot>

              <input
                part="display-input"
                class="select__display-input"
                type="text"
                placeholder=${this.placeholder}
                .disabled=${this.disabled}
                .value=${this.displayLabel}
                autocomplete="off"
                spellcheck="false"
                autocapitalize="off"
                readonly
                aria-controls="listbox"
                aria-expanded=${this.open?"true":"false"}
                aria-haspopup="listbox"
                aria-labelledby="label"
                aria-disabled=${this.disabled?"true":"false"}
                aria-describedby="help-text"
                role="combobox"
                tabindex="0"
                @focus=${this.handleFocus}
                @blur=${this.handleBlur}
              />

              ${this.multiple?o`
                    <div part="tags" class="select__tags">
                      ${this.selectedOptions.map(((t,e)=>e<this.maxOptionsVisible||this.maxOptionsVisible<=0?o`
                            <sl-tag
                              part="tag"
                              exportparts="
                                base:tag__base,
                                content:tag__content,
                                remove-button:tag__remove-button,
                                remove-button__base:tag__remove-button__base
                              "
                              ?pill=${this.pill}
                              size=${this.size}
                              removable
                              @sl-remove=${e=>this.handleTagRemove(e,t)}
                            >
                              ${t.getTextLabel()}
                            </sl-tag>
                          `:e===this.maxOptionsVisible?o` <sl-tag size=${this.size}> +${this.selectedOptions.length-e} </sl-tag> `:null))}
                    </div>
                  `:""}

              <input
                class="select__value-input"
                type="text"
                ?disabled=${this.disabled}
                ?required=${this.required}
                .value=${Array.isArray(this.value)?this.value.join(", "):this.value}
                tabindex="-1"
                aria-hidden="true"
                @focus=${()=>this.focus()}
                @invalid=${this.handleInvalid}
              />

              ${r?o`
                    <button
                      part="clear-button"
                      class="select__clear"
                      type="button"
                      aria-label=${this.localize.term("clearEntry")}
                      @mousedown=${this.handleClearMouseDown}
                      @click=${this.handleClearClick}
                      tabindex="-1"
                    >
                      <slot name="clear-icon">
                        <sl-icon name="x-circle-fill" library="system"></sl-icon>
                      </slot>
                    </button>
                  `:""}

              <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
                <sl-icon library="system" name="chevron-down"></sl-icon>
              </slot>
            </div>

            <div
              id="listbox"
              role="listbox"
              aria-expanded=${this.open?"true":"false"}
              aria-multiselectable=${this.multiple?"true":"false"}
              aria-labelledby="label"
              part="listbox"
              class="select__listbox"
              tabindex="-1"
              @mouseup=${this.handleOptionClick}
              @slotchange=${this.handleDefaultSlotChange}
            >
              <slot></slot>
            </div>
          </sl-popup>
        </div>

        <slot
          name="help-text"
          part="form-control-help-text"
          id="help-text"
          class="form-control__help-text"
          aria-hidden=${s?"false":"true"}
        >
          ${this.helpText}
        </slot>
      </div>
    `}};Ae.styles=$e,b([_(".select")],Ae.prototype,"popup",2),b([_(".select__combobox")],Ae.prototype,"combobox",2),b([_(".select__display-input")],Ae.prototype,"displayInput",2),b([_(".select__value-input")],Ae.prototype,"valueInput",2),b([_(".select__listbox")],Ae.prototype,"listbox",2),b([x()],Ae.prototype,"hasFocus",2),b([x()],Ae.prototype,"displayLabel",2),b([x()],Ae.prototype,"currentOption",2),b([x()],Ae.prototype,"selectedOptions",2),b([w()],Ae.prototype,"name",2),b([w({converter:{fromAttribute:t=>t.split(" "),toAttribute:t=>t.join(" ")}})],Ae.prototype,"value",2),b([((t="value")=>(e,o)=>{const l=e.constructor,s=l.prototype.attributeChangedCallback;l.prototype.attributeChangedCallback=function(e,r,n){var a;const c=l.getPropertyOptions(t);if(e===("string"==typeof c.attribute?c.attribute:t)){const e=c.converter||i,l=("function"==typeof e?e:null!==(a=null==e?void 0:e.fromAttribute)&&void 0!==a?a:i.fromAttribute)(n,c.type);this[t]!==l&&(this[o]=l)}s.call(this,e,r,n)}})()],Ae.prototype,"defaultValue",2),b([w({reflect:!0})],Ae.prototype,"size",2),b([w()],Ae.prototype,"placeholder",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"multiple",2),b([w({attribute:"max-options-visible",type:Number})],Ae.prototype,"maxOptionsVisible",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"disabled",2),b([w({type:Boolean})],Ae.prototype,"clearable",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"open",2),b([w({type:Boolean})],Ae.prototype,"hoist",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"filled",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"pill",2),b([w()],Ae.prototype,"label",2),b([w({reflect:!0})],Ae.prototype,"placement",2),b([w({attribute:"help-text"})],Ae.prototype,"helpText",2),b([w({reflect:!0})],Ae.prototype,"form",2),b([w({type:Boolean,reflect:!0})],Ae.prototype,"required",2),b([$("disabled",{waitUntilFirstUpdate:!0})],Ae.prototype,"handleDisabledChange",1),b([$("value",{waitUntilFirstUpdate:!0})],Ae.prototype,"handleValueChange",1),b([$("open",{waitUntilFirstUpdate:!0})],Ae.prototype,"handleOpenChange",1),Ae=b([v("sl-select")],Ae),Ce("select.show",{keyframes:[{opacity:0,scale:.9},{opacity:1,scale:1}],options:{duration:100,easing:"ease"}}),Ce("select.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.9}],options:{duration:100,easing:"ease"}});var Pe=e`
  ${T}

  :host {
    display: block;
    user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-x-small) var(--sl-spacing-medium) var(--sl-spacing-x-small) var(--sl-spacing-x-small);
    transition: var(--sl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  .option--current,
  .option--current.option--disabled {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--sl-line-height-dense);
  }

  .option .option__check {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    visibility: hidden;
    padding-inline-end: var(--sl-spacing-2x-small);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix,
  .option__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .option__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`;let Te=class extends P{constructor(){super(...arguments),this.localize=new de(this),this.current=!1,this.selected=!1,this.hasHover=!1,this.value="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false")}handleDefaultSlotChange(){const t=this.getTextLabel();void 0!==this.cachedTextLabel?t!==this.cachedTextLabel&&(this.cachedTextLabel=t,this.emit("slotchange",{bubbles:!0,composed:!1,cancelable:!1})):this.cachedTextLabel=t}handleMouseEnter(){this.hasHover=!0}handleMouseLeave(){this.hasHover=!1}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleValueChange(){"string"!=typeof this.value&&(this.value=String(this.value)),this.value.includes(" ")&&(console.error("Option values cannot include a space. All spaces have been replaced with underscores.",this),this.value=this.value.replace(/ /g,"_"))}getTextLabel(){var t;return(null!=(t=this.textContent)?t:"").trim()}render(){return o`
      <div
        part="base"
        class=${l({option:!0,"option--current":this.current,"option--disabled":this.disabled,"option--selected":this.selected,"option--hover":this.hasHover})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <sl-icon part="checked-icon" class="option__check" name="check" library="system" aria-hidden="true"></sl-icon>
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        <slot part="suffix" name="suffix" class="option__suffix"></slot>
      </div>
    `}};Te.styles=Pe,b([_(".option__label")],Te.prototype,"defaultSlot",2),b([x()],Te.prototype,"current",2),b([x()],Te.prototype,"selected",2),b([x()],Te.prototype,"hasHover",2),b([w({reflect:!0})],Te.prototype,"value",2),b([w({type:Boolean,reflect:!0})],Te.prototype,"disabled",2),b([$("disabled")],Te.prototype,"handleDisabledChange",1),b([$("selected")],Te.prototype,"handleSelectedChange",1),b([$("value")],Te.prototype,"handleValueChange",1),Te=b([v("sl-option")],Te);const Fe=e`
  :host {
    --sl-color-black: #000;
    --sl-color-white: #fff;
    --sl-color-gray-50: #f9fafb;
    --sl-color-gray-100: #f3f4f6;
    --sl-color-gray-200: #e5e7eb;
    --sl-color-gray-300: #d1d5db;
    --sl-color-gray-400: #9ca3af;
    --sl-color-gray-500: #6b7280;
    --sl-color-gray-600: #4b5563;
    --sl-color-gray-700: #374151;
    --sl-color-gray-800: #1f2937;
    --sl-color-gray-900: #111827;
    --sl-color-gray-950: #0d131e;
    --sl-color-primary-50: #f0f9ff;
    --sl-color-primary-100: #e0f2fe;
    --sl-color-primary-200: #bae6fd;
    --sl-color-primary-300: #7dd3fc;
    --sl-color-primary-400: #38bdf8;
    --sl-color-primary-500: #0ea5e9;
    --sl-color-primary-600: #0284c7;
    --sl-color-primary-700: #0369a1;
    --sl-color-primary-800: #075985;
    --sl-color-primary-900: #0c4a6e;
    --sl-color-primary-950: #082e45;
    --sl-color-primary-text: var(--sl-color-white);
    --sl-color-success-50: #f0fdf4;
    --sl-color-success-100: #dcfce7;
    --sl-color-success-200: #bbf7d0;
    --sl-color-success-300: #86efac;
    --sl-color-success-400: #4ade80;
    --sl-color-success-500: #22c55e;
    --sl-color-success-600: #16a34a;
    --sl-color-success-700: #15803d;
    --sl-color-success-800: #166534;
    --sl-color-success-900: #14532d;
    --sl-color-success-950: #0d381e;
    --sl-color-success-text: var(--sl-color-white);
    --sl-color-info-50: #f9fafb;
    --sl-color-info-100: #f3f4f6;
    --sl-color-info-200: #e5e7eb;
    --sl-color-info-300: #d1d5db;
    --sl-color-info-400: #9ca3af;
    --sl-color-info-500: #6b7280;
    --sl-color-info-600: #4b5563;
    --sl-color-info-700: #374151;
    --sl-color-info-800: #1f2937;
    --sl-color-info-900: #111827;
    --sl-color-info-950: #0d131e;
    --sl-color-info-text: var(--sl-color-white);
    --sl-color-warning-50: #fffbeb;
    --sl-color-warning-100: #fef3c7;
    --sl-color-warning-200: #fde68a;
    --sl-color-warning-300: #fcd34d;
    --sl-color-warning-400: #fbbf24;
    --sl-color-warning-500: #f59e0b;
    --sl-color-warning-600: #d97706;
    --sl-color-warning-700: #b45309;
    --sl-color-warning-800: #92400e;
    --sl-color-warning-900: #78350f;
    --sl-color-warning-950: #4d220a;
    --sl-color-warning-text: var(--sl-color-white);
    --sl-color-danger-50: #fef2f2;
    --sl-color-danger-100: #fee2e2;
    --sl-color-danger-200: #fecaca;
    --sl-color-danger-300: #fca5a5;
    --sl-color-danger-400: #f87171;
    --sl-color-danger-500: #ef4444;
    --sl-color-danger-600: #dc2626;
    --sl-color-danger-700: #b91c1c;
    --sl-color-danger-800: #991b1b;
    --sl-color-danger-900: #7f1d1d;
    --sl-color-danger-950: #481111;
    --sl-color-danger-text: var(--sl-color-white);
    --sl-border-radius-small: 0.125em;
    --sl-border-radius-medium: 0.25em;
    --sl-border-radius-large: 0.5em;
    --sl-border-radius-x-large: 1em;
    --sl-border-radius-circle: 50%;
    --sl-border-radius-pill: 9999px;
    --sl-shadow-x-small: 0 1px 0 #0d131e0d;
    --sl-shadow-small: 0 1px 2px #0d131e1a;
    --sl-shadow-medium: 0 2px 4px #0d131e1a;
    --sl-shadow-large: 0 2px 8px #0d131e1a;
    --sl-shadow-x-large: 0 4px 16px #0d131e1a;
    --sl-spacing-xxx-small: 0.125em;
    --sl-spacing-xx-small: 0.25em;
    --sl-spacing-x-small: 0.5em;
    --sl-spacing-small: 0.75em;
    --sl-spacing-medium: 1em;
    --sl-spacing-large: 1.25em;
    --sl-spacing-x-large: 1.75em;
    --sl-spacing-xx-large: 2.25em;
    --sl-spacing-xxx-large: 3em;
    --sl-spacing-xxxx-large: 4.5em;
    --sl-transition-x-slow: 1000ms;
    --sl-transition-slow: 500ms;
    --sl-transition-medium: 250ms;
    --sl-transition-fast: 150ms;
    --sl-transition-x-fast: 50ms;
    --sl-font-mono:
            SFMono-Regular,
            Consolas,
            "Liberation Mono",
            Menlo,
            monospace;
    --sl-font-sans:
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            Helvetica,
            Arial,
            sans-serif,
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol";
    --sl-font-serif:
            Georgia,
            "Times New Roman",
            serif;
    --sl-font-size-xx-small: 0.625em;
    --sl-font-size-x-small: 0.75em;
    --sl-font-size-small: 0.875em;
    --sl-font-size-medium: 1em;
    --sl-font-size-large: 1.25em;
    --sl-font-size-x-large: 1.5em;
    --sl-font-size-xx-large: 2.25em;
    --sl-font-size-xxx-large: 3em;
    --sl-font-size-xxxx-large: 4.5em;
    --sl-font-weight-light: 300;
    --sl-font-weight-normal: 400;
    --sl-font-weight-semibold: 500;
    --sl-font-weight-bold: 700;
    --sl-letter-spacing-dense: -0.015em;
    --sl-letter-spacing-normal: normal;
    --sl-letter-spacing-loose: 0.075em;
    --sl-line-height-dense: 1.4;
    --sl-line-height-normal: 1.8;
    --sl-line-height-loose: 2.2;
    --sl-focus-ring-color-primary: #0ea5e954;
    --sl-focus-ring-color-success: #22c55e54;
    --sl-focus-ring-color-info: #6b728054;
    --sl-focus-ring-color-warning: #f59e0b54;
    --sl-focus-ring-color-danger: #ef444454;
    --sl-focus-ring-width: 3px;
    --sl-button-font-size-small: var(--sl-font-size-x-small);
    --sl-button-font-size-medium: var(--sl-font-size-small);
    --sl-button-font-size-large: var(--sl-font-size-medium);
    --sl-input-height-small: 1.875em;
    --sl-input-height-medium: 2.5em;
    --sl-input-height-large: 3.125em;
    --sl-input-background-color: var(--sl-color-white);
    --sl-input-background-color-hover: var(--sl-color-white);
    --sl-input-background-color-focus: var(--sl-color-white);
    --sl-input-background-color-disabled: var(--sl-color-gray-100);
    --sl-input-border-color: var(--sl-color-gray-300);
    --sl-input-border-color-hover: var(--sl-color-gray-400);
    --sl-input-border-color-focus: var(--sl-color-primary-500);
    --sl-input-border-color-disabled: var(--sl-color-gray-300);
    --sl-input-border-width: 1px;
    --sl-input-border-radius-small: var(--sl-border-radius-medium);
    --sl-input-border-radius-medium: var(--sl-border-radius-medium);
    --sl-input-border-radius-large: var(--sl-border-radius-medium);
    --sl-input-font-family: var(--sl-font-sans);
    --sl-input-font-weight: var(--sl-font-weight-normal);
    --sl-input-font-size-small: var(--sl-font-size-small);
    --sl-input-font-size-medium: var(--sl-font-size-medium);
    --sl-input-font-size-large: var(--sl-font-size-large);
    --sl-input-letter-spacing: var(--sl-letter-spacing-normal);
    --sl-input-color: var(--sl-color-gray-700);
    --sl-input-color-hover: var(--sl-color-gray-700);
    --sl-input-color-focus: var(--sl-color-gray-700);
    --sl-input-color-disabled: var(--sl-color-gray-900);
    --sl-input-icon-color: var(--sl-color-gray-400);
    --sl-input-icon-color-hover: var(--sl-color-gray-600);
    --sl-input-icon-color-focus: var(--sl-color-gray-600);
    --sl-input-placeholder-color: var(--sl-color-gray-400);
    --sl-input-placeholder-color-disabled: var(--sl-color-gray-600);
    --sl-input-spacing-small: var(--sl-spacing-small);
    --sl-input-spacing-medium: var(--sl-spacing-medium);
    --sl-input-spacing-large: var(--sl-spacing-large);
    --sl-input-label-font-size-small: var(--sl-font-size-small);
    --sl-input-label-font-size-medium: var(--sl-font-size-medium);
    --sl-input-label-font-size-large: var(--sl-font-size-large);
    --sl-input-label-color: inherit;
    --sl-input-help-text-font-size-small: var(--sl-font-size-x-small);
    --sl-input-help-text-font-size-medium: var(--sl-font-size-small);
    --sl-input-help-text-font-size-large: var(--sl-font-size-medium);
    --sl-input-help-text-color: var(--sl-color-gray-400);
    --sl-toggle-size: 1em;
    --sl-overlay-background-color: #37415180;
    --sl-panel-background-color: var(--sl-color-white);
    --sl-panel-border-color: var(--sl-color-gray-200);
    --sl-tooltip-border-radius: var(--sl-border-radius-medium);
    --sl-tooltip-background-color: var(--sl-color-gray-900);
    --sl-tooltip-color: var(--sl-color-white);
    --sl-tooltip-font-family: var(--sl-font-sans);
    --sl-tooltip-font-weight: var(--sl-font-weight-normal);
    --sl-tooltip-font-size: var(--sl-font-size-small);
    --sl-tooltip-line-height: var(--sl-line-height-dense);
    --sl-tooltip-padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-small);
    --sl-tooltip-arrow-size: 5px;
    --sl-tooltip-arrow-start-end-offset: 8px;
    --sl-z-index-drawer: 700;
    --sl-z-index-dialog: 800;
    --sl-z-index-dropdown: 900;
    --sl-z-index-toast: 950;
    --sl-z-index-tooltip: 1000;
  }
  .sl-scroll-lock {
    overflow: hidden !important;
  }
`;export{Fe as s};
