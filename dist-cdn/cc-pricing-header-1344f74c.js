import{c as e,L as t,d as s,h as i,s as o}from"./vendor-5e139a4e.js";import{i18n as r}from"./i18n-446ebe81.js";import{w as n}from"./with-resize-observer-2a1b198b.js";import{CcZone as l}from"./cc-zone-535a4410.js";var a,c,d,h,p,u=Object.defineProperty,f=Object.defineProperties,m=Object.getOwnPropertyDescriptor,g=Object.getOwnPropertyDescriptors,v=Object.getOwnPropertySymbols,b=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable,w=(e,t,s)=>t in e?u(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,x=(e,t)=>{for(var s in t||(t={}))b.call(t,s)&&w(e,s,t[s]);if(v)for(var s of v(t))y.call(t,s)&&w(e,s,t[s]);return e},_=(e,t)=>f(e,g(t)),k=(e,t,s,i)=>{for(var o,r=i>1?void 0:i?m(t,s):t,n=e.length-1;n>=0;n--)(o=e[n])&&(r=(i?o(t,s,r):o(r))||r);return i&&r&&u(t,s,r),r},z=globalThis.trustedTypes,S=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,C=`lit$${(Math.random()+"").slice(9)}$`,T="?"+C,O=`<${T}>`,$=document,E=(e="")=>$.createComment(e),L=e=>null===e||"object"!=typeof e&&"function"!=typeof e,A=Array.isArray,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,P=/>/g,I=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,H=/'/g,U=/"/g,j=/^(?:script|style|textarea)$/i,R=(p=1,(e,...t)=>({_$litType$:p,strings:e,values:t})),B=Symbol.for("lit-noChange"),N=Symbol.for("lit-nothing"),V=new WeakMap,q=$.createTreeWalker($,129,null,!1),W=class{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,r=0;const n=e.length-1,l=this.parts,[a,c]=((e,t)=>{const s=e.length-1,i=[];let o,r=2===t?"<svg>":"",n=M;for(let t=0;t<s;t++){const s=e[t];let l,a,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,a=n.exec(s),null!==a);)d=n.lastIndex,n===M?"!--"===a[1]?n=D:void 0!==a[1]?n=P:void 0!==a[2]?(j.test(a[2])&&(o=RegExp("</"+a[2],"g")),n=I):void 0!==a[3]&&(n=I):n===I?">"===a[0]?(n=null!=o?o:M,c=-1):void 0===a[1]?c=-2:(c=n.lastIndex-a[2].length,l=a[1],n=void 0===a[3]?I:'"'===a[3]?U:H):n===U||n===H?n=I:n===D||n===P?n=M:(n=I,o=void 0);const h=n===I&&e[t+1].startsWith("/>")?" ":"";r+=n===M?s+O:c>=0?(i.push(l),s.slice(0,c)+"$lit$"+s.slice(c)+C+h):s+C+(-2===c?(i.push(void 0),t):h)}const l=r+(e[s]||"<?>")+(2===t?"</svg>":"");return[void 0!==S?S.createHTML(l):l,i]})(e,t);if(this.el=W.createElement(a,s),q.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(i=q.nextNode())&&l.length<n;){if(1===i.nodeType){if(i.hasAttributes()){const e=[];for(const t of i.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(C)){const s=c[r++];if(e.push(t),void 0!==s){const e=i.getAttribute(s.toLowerCase()+"$lit$").split(C),t=/([.?@])?(.*)/.exec(s);l.push({type:1,index:o,name:t[2],strings:e,ctor:"."===t[1]?Z:"?"===t[1]?G:"@"===t[1]?J:X})}else l.push({type:6,index:o})}for(const t of e)i.removeAttribute(t)}if(j.test(i.tagName)){const e=i.textContent.split(C),t=e.length-1;if(t>0){i.textContent=z?z.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],E()),q.nextNode(),l.push({type:2,index:++o});i.append(e[t],E())}}}else if(8===i.nodeType)if(i.data===T)l.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(C,e+1));)l.push({type:7,index:o}),e+=C.length-1}o++}}static createElement(e,t){const s=$.createElement("template");return s.innerHTML=e,s}};function F(e,t,s=e,i){var o,r,n,l;if(t===B)return t;let a=void 0!==i?null===(o=s.Σi)||void 0===o?void 0:o[i]:s.Σo;const c=L(t)?void 0:t._$litDirective$;return(null==a?void 0:a.constructor)!==c&&(null===(r=null==a?void 0:a.O)||void 0===r||r.call(a,!1),void 0===c?a=void 0:(a=new c(e),a.T(e,s,i)),void 0!==i?(null!==(n=(l=s).Σi)&&void 0!==n?n:l.Σi=[])[i]=a:s.Σo=a),void 0!==a&&(t=F(e,a.S(e,t.values),a,i)),t}var K=class{constructor(e,t,s,i){this.type=2,this.N=void 0,this.A=e,this.B=t,this.M=s,this.options=i}setConnected(e){var t;null===(t=this.P)||void 0===t||t.call(this,e)}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(e,t=this){e=F(this,e,t),L(e)?e===N||null==e||""===e?(this.H!==N&&this.R(),this.H=N):e!==this.H&&e!==B&&this.m(e):void 0!==e._$litType$?this._(e):void 0!==e.nodeType?this.$(e):(e=>{var t;return A(e)||"function"==typeof(null===(t=e)||void 0===t?void 0:t[Symbol.iterator])})(e)?this.g(e):this.m(e)}k(e,t=this.B){return this.A.parentNode.insertBefore(e,t)}$(e){this.H!==e&&(this.R(),this.H=this.k(e))}m(e){const t=this.A.nextSibling;null!==t&&3===t.nodeType&&(null===this.B?null===t.nextSibling:t===this.B.previousSibling)?t.data=e:this.$($.createTextNode(e)),this.H=e}_(e){var t;const{values:s,_$litType$:i}=e,o="number"==typeof i?this.C(e):(void 0===i.el&&(i.el=W.createElement(i.h,this.options)),i);if((null===(t=this.H)||void 0===t?void 0:t.D)===o)this.H.v(s);else{const e=new class{constructor(e,t){this.l=[],this.N=void 0,this.D=e,this.M=t}u(e){var t;const{el:{content:s},parts:i}=this.D,o=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:$).importNode(s,!0);q.currentNode=o;let r=q.nextNode(),n=0,l=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new K(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new Y(r,this,e)),this.l.push(t),a=i[++l]}n!==(null==a?void 0:a.index)&&(r=q.nextNode(),n++)}return o}v(e){let t=0;for(const s of this.l)void 0!==s&&(void 0!==s.strings?(s.I(e,s,t),t+=s.strings.length-2):s.I(e[t])),t++}}(o,this),t=e.u(this.options);e.v(s),this.$(t),this.H=e}}C(e){let t=V.get(e.strings);return void 0===t&&V.set(e.strings,t=new W(e)),t}g(e){A(this.H)||(this.H=[],this.R());const t=this.H;let s,i=0;for(const o of e)i===t.length?t.push(s=new K(this.k(E()),this.k(E()),this,this.options)):s=t[i],s.I(o),i++;i<t.length&&(this.R(s&&s.B.nextSibling,i),t.length=i)}R(e=this.A.nextSibling,t){var s;for(null===(s=this.P)||void 0===s||s.call(this,!1,!0,t);e&&e!==this.B;){const t=e.nextSibling;e.remove(),e=t}}},X=class{constructor(e,t,s,i,o){this.type=1,this.H=N,this.N=void 0,this.V=void 0,this.element=e,this.name=t,this.M=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this.H=Array(s.length-1).fill(N),this.strings=s):this.H=N}get tagName(){return this.element.tagName}I(e,t=this,s,i){const o=this.strings;let r=!1;if(void 0===o)e=F(this,e,t,0),r=!L(e)||e!==this.H&&e!==B,r&&(this.H=e);else{const i=e;let n,l;for(e=o[0],n=0;n<o.length-1;n++)l=F(this,i[s+n],t,n),l===B&&(l=this.H[n]),r||(r=!L(l)||l!==this.H[n]),l===N?e=N:e!==N&&(e+=(null!=l?l:"")+o[n+1]),this.H[n]=l}r&&!i&&this.W(e)}W(e){e===N?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}},Z=class extends X{constructor(){super(...arguments),this.type=3}W(e){this.element[this.name]=e===N?void 0:e}},G=class extends X{constructor(){super(...arguments),this.type=4}W(e){e&&e!==N?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)}},J=class extends X{constructor(){super(...arguments),this.type=5}I(e,t=this){var s;if((e=null!==(s=F(this,e,t,0))&&void 0!==s?s:N)===B)return;const i=this.H,o=e===N&&i!==N||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==N&&(i===N||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this.H=e}handleEvent(e){var t,s;"function"==typeof this.H?this.H.call(null!==(s=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==s?s:this.element,e):this.H.handleEvent(e)}},Y=class{constructor(e,t,s){this.element=e,this.type=6,this.N=void 0,this.V=void 0,this.M=t,this.options=s}I(e){F(this,e)}};null===(c=(a=globalThis).litHtmlPlatformSupport)||void 0===c||c.call(a,W,K),(null!==(d=(h=globalThis).litHtmlVersions)&&void 0!==d?d:h.litHtmlVersions=[]).push("2.0.0-rc.3");var Q,ee,te,se,ie,oe,re,ne,le,ae,ce=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),he=class{constructor(e,t){if(t!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return ce&&void 0===this.t&&(this.t=new CSSStyleSheet,this.t.replaceSync(this.cssText)),this.t}toString(){return this.cssText}},pe=new Map,ue=e=>{let t=pe.get(e);return void 0===t&&pe.set(e,t=new he(e,de)),t},fe=(e,...t)=>{const s=1===e.length?e[0]:t.reduce(((t,s,i)=>t+(e=>{if(e instanceof he)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1]),e[0]);return ue(s)},me=ce?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>ue("string"==typeof e?e:e+""))(t)})(e):e,ge={toAttribute(e,t){switch(t){case Boolean:e=e?"":null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},ve=(e,t)=>t!==e&&(t==t||e==e),be={attribute:!0,type:String,converter:ge,reflect:!1,hasChanged:ve},ye=class extends HTMLElement{constructor(){super(),this.Πi=new Map,this.Πo=void 0,this.Πl=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.Πh=null,this.u()}static addInitializer(e){var t;null!==(t=this.v)&&void 0!==t||(this.v=[]),this.v.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,s)=>{const i=this.Πp(s,t);void 0!==i&&(this.Πm.set(i,s),e.push(i))})),e}static createProperty(e,t=be){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const s="symbol"==typeof e?Symbol():"__"+e,i=this.getPropertyDescriptor(e,s,t);void 0!==i&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){return{get(){return this[t]},set(i){const o=this[e];this[t]=i,this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||be}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this.Πm=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const s of t)this.createProperty(s,e[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(me(e))}else void 0!==e&&t.push(me(e));return t}static"Πp"(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this.Πg=new Promise((e=>this.enableUpdating=e)),this.L=new Map,this.Π_(),this.requestUpdate(),null===(e=this.constructor.v)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,s;(null!==(t=this.ΠU)&&void 0!==t?t:this.ΠU=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(s=e.hostConnected)||void 0===s||s.call(e))}removeController(e){var t;null===(t=this.ΠU)||void 0===t||t.splice(this.ΠU.indexOf(e)>>>0,1)}"Π_"(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this.Πi.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{ce?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const s=document.createElement("style");s.textContent=t.cssText,e.appendChild(s)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)})),this.Πl&&(this.Πl(),this.Πo=this.Πl=void 0)}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)})),this.Πo=new Promise((e=>this.Πl=e))}attributeChangedCallback(e,t,s){this.K(e,s)}"Πj"(e,t,s=be){var i,o;const r=this.constructor.Πp(e,s);if(void 0!==r&&!0===s.reflect){const n=(null!==(o=null===(i=s.converter)||void 0===i?void 0:i.toAttribute)&&void 0!==o?o:ge.toAttribute)(t,s.type);this.Πh=e,null==n?this.removeAttribute(r):this.setAttribute(r,n),this.Πh=null}}K(e,t){var s,i,o;const r=this.constructor,n=r.Πm.get(e);if(void 0!==n&&this.Πh!==n){const e=r.getPropertyOptions(n),l=e.converter,a=null!==(o=null!==(i=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==i?i:"function"==typeof l?l:null)&&void 0!==o?o:ge.fromAttribute;this.Πh=n,this[n]=a(t,e.type),this.Πh=null}}requestUpdate(e,t,s){let i=!0;void 0!==e&&(((s=s||this.constructor.getPropertyOptions(e)).hasChanged||ve)(this[e],t)?(this.L.has(e)||this.L.set(e,t),!0===s.reflect&&this.Πh!==e&&(void 0===this.Πk&&(this.Πk=new Map),this.Πk.set(e,s))):i=!1),!this.isUpdatePending&&i&&(this.Πg=this.Πq())}async"Πq"(){this.isUpdatePending=!0;try{for(await this.Πg;this.Πo;)await this.Πo}catch(e){Promise.reject(e)}const e=this.performUpdate();return null!=e&&await e,!this.isUpdatePending}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this.Πi&&(this.Πi.forEach(((e,t)=>this[t]=e)),this.Πi=void 0);let t=!1;const s=this.L;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(s)):this.Π$()}catch(e){throw t=!1,this.Π$(),e}t&&this.E(s)}willUpdate(e){}E(e){var t;null===(t=this.ΠU)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}"Π$"(){this.L=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.Πg}shouldUpdate(e){return!0}update(e){void 0!==this.Πk&&(this.Πk.forEach(((e,t)=>this.Πj(t,this[t],e))),this.Πk=void 0),this.Π$()}updated(e){}firstUpdated(e){}};ye.finalized=!0,ye.elementProperties=new Map,ye.elementStyles=[],ye.shadowRootOptions={mode:"open"},null===(ee=(Q=globalThis).reactiveElementPlatformSupport)||void 0===ee||ee.call(Q,{ReactiveElement:ye}),(null!==(te=(se=globalThis).reactiveElementVersions)&&void 0!==te?te:se.reactiveElementVersions=[]).push("1.0.0-rc.2"),(null!==(ie=(ae=globalThis).litElementVersions)&&void 0!==ie?ie:ae.litElementVersions=[]).push("3.0.0-rc.2");var we=class extends ye{constructor(){super(...arguments),this.renderOptions={host:this},this.Φt=void 0}createRenderRoot(){var e,t;const s=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=s.firstChild),s}update(e){const t=this.render();super.update(e),this.Φt=((e,t,s)=>{var i,o;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:t;let n=r._$litPart$;if(void 0===n){const e=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;r._$litPart$=n=new K(t.insertBefore(E(),e),e,void 0,s)}return n.I(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this.Φt)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this.Φt)||void 0===e||e.setConnected(!1)}render(){return B}};we.finalized=!0,we._$litElement$=!0,null===(re=(oe=globalThis).litElementHydrateSupport)||void 0===re||re.call(oe,{LitElement:we}),null===(le=(ne=globalThis).litElementPlatformSupport)||void 0===le||le.call(ne,{LitElement:we});var xe=e=>t=>{return"function"==typeof t?(s=e,i=t,window.customElements.define(s,i),i):((e,t)=>{const{kind:s,elements:i}=t;return{kind:s,elements:i,finisher(t){window.customElements.define(e,t)}}})(e,t);var s,i},_e=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?_(x({},t),{finisher(s){s.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}};function ke(e){return(t,s)=>{return void 0!==s?(i=e,o=s,void t.constructor.createProperty(o,i)):_e(e,t);var i,o}}function ze(e){return ke(_(x({},e),{state:!0,attribute:!1}))}function Se(e,t){return(({finisher:e,descriptor:t})=>(s,i)=>{var o;if(void 0===i){const i=null!==(o=s.originalKey)&&void 0!==o?o:s.key,r=null!=t?{kind:"method",placement:"prototype",key:i,descriptor:t(s.key)}:_(x({},s),{key:i});return null!=e&&(r.finisher=function(t){e(t,i)}),r}{const o=s.constructor;void 0!==t&&Object.defineProperty(s,i,t(i)),null==e||e(o,i)}})({descriptor:s=>{const i={get(){var t;return null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e)},enumerable:!0,configurable:!0};if(t){const t="symbol"==typeof s?Symbol():"__"+s;i.get=function(){var s;return void 0===this[t]&&(this[t]=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(e)),this[t]}}return i}})}var Ce=e=>null!=e?e:N,Te=1,Oe=2,$e=e=>(...t)=>({_$litDirective$:e,values:t}),Ee=class{constructor(e){}T(e,t,s){this.Σdt=e,this.M=t,this.Σct=s}S(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},Le=$e(class extends Ee{constructor(e){var t;if(super(e),e.type!==Te||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).filter((t=>e[t])).join(" ")}update(e,[t]){if(void 0===this.bt){this.bt=new Set;for(const e in t)t[e]&&this.bt.add(e);return this.render(t)}const s=e.element.classList;this.bt.forEach((e=>{e in t||(s.remove(e),this.bt.delete(e))}));for(const e in t){const i=!!t[e];i!==this.bt.has(e)&&(i?(s.add(e),this.bt.add(e)):(s.remove(e),this.bt.delete(e)))}return B}});function Ae(e,t){return(s,i)=>{const{update:o}=s;t=Object.assign({waitUntilFirstUpdate:!1},t),s.update=function(s){if(s.has(e)){const o=s.get(e),r=this[e];o!==r&&((null==t?void 0:t.waitUntilFirstUpdate)&&!this.hasUpdated||this[i].call(this,o,r))}o.call(this,s)}}}function Me(e){const t=e?e.assignedNodes({flatten:!0}):[];let s="";return[...t].map((e=>{e.nodeType===Node.TEXT_NODE&&(s+=e.textContent)})),s}function De(e,t){return t?null!==e.querySelector(`:scope > [slot="${t}"]`):[...e.childNodes].some((e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){if(!e.hasAttribute("slot"))return!0}return!1}))}function Pe(e,t,s){const i=new CustomEvent(t,Object.assign({bubbles:!0,cancelable:!1,composed:!0,detail:{}},s));return e.dispatchEvent(i),i}function Ie(e,t){return new Promise((s=>{e.addEventListener(t,(function i(o){o.target===e&&(e.removeEventListener(t,i),s())}))}))}var He=fe`
  :host {
    position: relative;
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
`,Ue=fe`
  ${He}
  ${fe`
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
    margin-bottom: var(--sl-spacing-xxx-small);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--sl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--sl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control_label {
    font-size: var(--sl-input-label-font-size-large);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--sl-input-help-text-color);
  }

  .form-control--has-help-text .form-control__help-text ::slotted(*) {
    margin-top: var(--sl-spacing-xxx-small);
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
`}

  :host {
    --focus-ring: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);

    display: block;
  }

  .select {
    display: block;
  }

  .select__box {
    display: inline-flex;
    align-items: center;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-input-font-weight);
    letter-spacing: var(--sl-input-letter-spacing);
    background-color: var(--sl-input-background-color);
    border: solid var(--sl-input-border-width) var(--sl-input-border-color);
    vertical-align: middle;
    overflow: hidden;
    transition: var(--sl-transition-fast) color, var(--sl-transition-fast) border, var(--sl-transition-fast) box-shadow;
    cursor: pointer;
  }

  .select:not(.select--disabled) .select__box:hover {
    background-color: var(--sl-input-background-color-hover);
    border-color: var(--sl-input-border-color-hover);
    color: var(--sl-input-color-hover);
  }

  .select.select--focused:not(.select--disabled) .select__box {
    background-color: var(--sl-input-background-color-focus);
    border-color: var(--sl-input-border-color-focus);
    box-shadow: var(--focus-ring);
    outline: none;
    color: var(--sl-input-color-focus);
  }

  .select--disabled .select__box {
    background-color: var(--sl-input-background-color-disabled);
    border-color: var(--sl-input-border-color-disabled);
    color: var(--sl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--disabled .select__tags,
  .select--disabled .select__clear {
    pointer-events: none;
  }

  .select__label {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
    user-select: none;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    /* Hide scrollbar in Firefox */
    scrollbar-width: none;
  }

  /* Hide scrollbar in Chrome/Safari */
  .select__label::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .select__clear {
    flex: 0 0 auto;
  }

  .select__icon {
    flex: 0 0 auto;
    display: inline-flex;
    transition: var(--sl-transition-medium) transform ease;
  }

  .select--open .select__icon {
    transform: rotate(-180deg);
  }

  /* Placeholder */
  .select--placeholder-visible .select__label {
    color: var(--sl-input-placeholder-color);
  }

  .select--disabled.select--placeholder-visible .select__label {
    color: var(--sl-input-placeholder-color-disabled);
  }

  /* Tags */
  .select__tags {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: left;
    margin-left: var(--sl-spacing-xx-small);
  }

  /* Hidden input (for form control validation to show) */
  .select__hidden-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    overflow: hidden;
    white-space: nowrap;
  }

  /*
   * Size modifiers
   */

  /* Small */
  .select--small .select__box {
    border-radius: var(--sl-input-border-radius-small);
    font-size: var(--sl-input-font-size-small);
    min-height: var(--sl-input-height-small);
  }

  .select--small .select__label {
    margin: 0 var(--sl-input-spacing-small);
  }

  .select--small .select__clear {
    margin-right: var(--sl-input-spacing-small);
  }

  .select--small .select__icon {
    margin-right: var(--sl-input-spacing-small);
  }

  .select--small .select__tags {
    padding-bottom: 2px;
  }

  .select--small .select__tags sl-tag {
    padding-top: 2px;
  }

  .select--small .select__tags sl-tag:not(:last-of-type) {
    margin-right: var(--sl-spacing-xx-small);
  }

  .select--small.select--has-tags .select__label {
    margin-left: 0;
  }

  /* Medium */
  .select--medium .select__box {
    border-radius: var(--sl-input-border-radius-medium);
    font-size: var(--sl-input-font-size-medium);
    min-height: var(--sl-input-height-medium);
  }

  .select--medium .select__label {
    margin: 0 var(--sl-input-spacing-medium);
  }

  .select--medium .select__clear {
    margin-right: var(--sl-input-spacing-medium);
  }

  .select--medium .select__icon {
    margin-right: var(--sl-input-spacing-medium);
  }

  .select--medium .select__tags {
    padding-bottom: 3px;
  }

  .select--medium .select__tags sl-tag {
    padding-top: 3px;
  }

  .select--medium .select__tags sl-tag:not(:last-of-type) {
    margin-right: var(--sl-spacing-xx-small);
  }

  .select--medium.select--has-tags .select__label {
    margin-left: 0;
  }

  /* Large */
  .select--large .select__box {
    border-radius: var(--sl-input-border-radius-large);
    font-size: var(--sl-input-font-size-large);
    min-height: var(--sl-input-height-large);
  }

  .select--large .select__label {
    margin: 0 var(--sl-input-spacing-large);
  }

  .select--large .select__clear {
    margin-right: var(--sl-input-spacing-large);
  }

  .select--large .select__icon {
    margin-right: var(--sl-input-spacing-large);
  }

  .select--large .select__tags {
    padding-bottom: 4px;
  }
  .select--large .select__tags sl-tag {
    padding-top: 4px;
  }

  .select--large .select__tags sl-tag:not(:last-of-type) {
    margin-right: var(--sl-spacing-xx-small);
  }

  .select--large.select--has-tags .select__label {
    margin-left: 0;
  }

  /*
   * Pill modifier
   */
  .select--pill.select--small .select__box {
    border-radius: var(--sl-input-height-small);
  }

  .select--pill.select--medium .select__box {
    border-radius: var(--sl-input-height-medium);
  }

  .select--pill.select--large .select__box {
    border-radius: var(--sl-input-height-large);
  }
`,je=0,Re=class extends we{constructor(){super(...arguments),this.inputId="select-"+ ++je,this.helpTextId=`select-help-text-${je}`,this.labelId=`select-label-${je}`,this.hasFocus=!1,this.hasHelpTextSlot=!1,this.hasLabelSlot=!1,this.isOpen=!1,this.displayLabel="",this.displayTags=[],this.multiple=!1,this.maxTagsVisible=3,this.disabled=!1,this.name="",this.placeholder="",this.size="medium",this.hoist=!1,this.value="",this.pill=!1,this.required=!1,this.clearable=!1,this.invalid=!1}connectedCallback(){super.connectedCallback(),this.handleSlotChange=this.handleSlotChange.bind(this),this.resizeObserver=new ResizeObserver((()=>this.resizeMenu())),this.updateComplete.then((()=>{this.resizeObserver.observe(this),this.shadowRoot.addEventListener("slotchange",this.handleSlotChange),this.syncItemsFromValue()}))}firstUpdated(){this.invalid=!this.input.checkValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this),this.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.invalid=!this.input.checkValidity()}getItemLabel(e){return Me(e.shadowRoot.querySelector("slot:not([name])"))}getItems(){return[...this.querySelectorAll("sl-menu-item")]}getValueAsArray(){return this.multiple&&""===this.value?[]:Array.isArray(this.value)?this.value:[this.value]}handleBlur(){this.isOpen||(this.hasFocus=!1,Pe(this,"sl-blur"))}handleClearClick(e){e.stopPropagation(),this.value=this.multiple?[]:"",Pe(this,"sl-clear"),this.syncItemsFromValue()}handleDisabledChange(){this.disabled&&this.isOpen&&this.dropdown.hide(),this.input&&(this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity())}handleFocus(){this.hasFocus||(this.hasFocus=!0,Pe(this,"sl-focus"))}handleKeyDown(e){const t=e.target,s=this.getItems(),i=s[0],o=s[s.length-1];if("sl-tag"!==t.tagName.toLowerCase())if("Tab"!==e.key){if(["ArrowDown","ArrowUp"].includes(e.key)){if(e.preventDefault(),this.isOpen||this.dropdown.show(),"ArrowDown"===e.key&&i)return this.menu.setCurrentItem(i),void i.focus();if("ArrowUp"===e.key&&o)return this.menu.setCurrentItem(o),void o.focus()}this.isOpen||1!==e.key.length||(e.stopPropagation(),e.preventDefault(),this.dropdown.show(),this.menu.typeToSelect(e.key))}else this.isOpen&&this.dropdown.hide()}handleLabelClick(){var e;(null==(e=this.shadowRoot)?void 0:e.querySelector(".select__box")).focus()}handleMenuSelect(e){const t=e.detail.item;this.multiple?this.value=this.value.includes(t.value)?this.value.filter((e=>e!==t.value)):[...this.value,t.value]:this.value=t.value,this.syncItemsFromValue()}handleMenuShow(){this.resizeMenu(),this.isOpen=!0}handleMenuHide(){this.isOpen=!1,this.box.focus()}handleMultipleChange(){const e=this.getValueAsArray();this.value=this.multiple?e:e[0]||"",this.syncItemsFromValue()}async handleSlotChange(){this.hasHelpTextSlot=De(this,"help-text"),this.hasLabelSlot=De(this,"label");const e=this.getItems();await Promise.all(e.map((e=>e.render))).then((()=>this.syncItemsFromValue()))}handleTagInteraction(e){e.composedPath().find((e=>{if(e instanceof HTMLElement){return e.classList.contains("tag__clear")}return!1}))&&e.stopPropagation()}async handleValueChange(){this.syncItemsFromValue(),await this.updateComplete,this.invalid=!this.input.checkValidity(),Pe(this,"sl-change")}resizeMenu(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(".select__box");this.menu.style.width=`${t.clientWidth}px`,this.dropdown&&this.dropdown.reposition()}syncItemsFromValue(){const e=this.getItems(),t=this.getValueAsArray();if(e.map((e=>e.checked=t.includes(e.value))),this.multiple){const s=e.filter((e=>t.includes(e.value)));if(this.displayLabel=s[0]?this.getItemLabel(s[0]):"",this.displayTags=s.map((e=>R`
          <sl-tag
            exportparts="base:tag"
            type="info"
            size=${this.size}
            ?pill=${this.pill}
            clearable
            @click=${this.handleTagInteraction}
            @keydown=${this.handleTagInteraction}
            @sl-clear=${t=>{t.stopPropagation(),this.disabled||(e.checked=!1,this.syncValueFromItems())}}
          >
            ${this.getItemLabel(e)}
          </sl-tag>
        `)),this.maxTagsVisible>0&&this.displayTags.length>this.maxTagsVisible){const e=this.displayTags.length;this.displayLabel="",this.displayTags=this.displayTags.slice(0,this.maxTagsVisible),this.displayTags.push(R`
          <sl-tag exportparts="base:tag" type="info" size=${this.size}> +${e-this.maxTagsVisible} </sl-tag>
        `)}}else{const s=e.filter((e=>e.value===t[0]))[0];this.displayLabel=s?this.getItemLabel(s):"",this.displayTags=[]}}syncValueFromItems(){const e=this.getItems().filter((e=>e.checked)).map((e=>e.value));this.multiple?this.value=this.value.filter((t=>e.includes(t))):this.value=e.length>0?e[0]:""}render(){var e;const t=this.multiple?this.value.length>0:""!==this.value;return((e,t)=>{const s=!!e.label||!!e.hasLabelSlot,i=!!e.helpText||!!e.hasHelpTextSlot;return R`
    <div
      part="form-control"
      class=${Le({"form-control":!0,"form-control--small":"small"===e.size,"form-control--medium":"medium"===e.size,"form-control--large":"large"===e.size,"form-control--has-label":s,"form-control--has-help-text":i})}
    >
      <label
        part="label"
        id=${Ce(e.labelId)}
        class="form-control__label"
        for=${e.inputId}
        aria-hidden=${s?"false":"true"}
        @click=${t=>e.onLabelClick?e.onLabelClick(t):null}
      >
        <slot name="label">${e.label}</slot>
      </label>

      <div class="form-control__input">${R`${t}`}</div>

      <div
        part="help-text"
        id=${Ce(e.helpTextId)}
        class="form-control__help-text"
        aria-hidden=${i?"false":"true"}
      >
        <slot name="help-text">${e.helpText}</slot>
      </div>
    </div>
  `})({inputId:this.inputId,label:this.label,labelId:this.labelId,hasLabelSlot:this.hasLabelSlot,helpTextId:this.helpTextId,helpText:this.helpText,hasHelpTextSlot:this.hasHelpTextSlot,size:this.size,onLabelClick:()=>this.handleLabelClick()},R`
        <sl-dropdown
          part="base"
          .hoist=${this.hoist}
          .stayOpenOnSelect=${this.multiple}
          .containingElement=${this}
          ?disabled=${this.disabled}
          class=${Le({select:!0,"select--open":this.isOpen,"select--empty":0===(null==(e=this.value)?void 0:e.length),"select--focused":this.hasFocus,"select--clearable":this.clearable,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--has-tags":this.multiple&&this.displayTags.length>0,"select--placeholder-visible":""===this.displayLabel,"select--small":"small"===this.size,"select--medium":"medium"===this.size,"select--large":"large"===this.size,"select--pill":this.pill,"select--invalid":this.invalid})}
          @sl-show=${this.handleMenuShow}
          @sl-hide=${this.handleMenuHide}
        >
          <div
            slot="trigger"
            id=${this.inputId}
            class="select__box"
            role="combobox"
            aria-labelledby=${Ce((s={label:this.label,labelId:this.labelId,hasLabelSlot:this.hasLabelSlot,helpText:this.helpText,helpTextId:this.helpTextId,hasHelpTextSlot:this.hasHelpTextSlot},[s.label||s.hasLabelSlot?s.labelId:"",s.helpText||s.hasHelpTextSlot?s.helpTextId:""].filter((e=>e)).join(" ")||void 0))}
            aria-haspopup="true"
            aria-expanded=${this.isOpen?"true":"false"}
            tabindex=${this.disabled?"-1":"0"}
            @blur=${this.handleBlur}
            @focus=${this.handleFocus}
            @keydown=${this.handleKeyDown}
          >
            <div class="select__label">
              ${this.displayTags.length?R` <span part="tags" class="select__tags"> ${this.displayTags} </span> `:this.displayLabel||this.placeholder}
            </div>

            ${this.clearable&&t?R`
                  <sl-icon-button
                    exportparts="base:clear-button"
                    class="select__clear"
                    name="x-circle"
                    library="system"
                    @click=${this.handleClearClick}
                    tabindex="-1"
                  ></sl-icon-button>
                `:""}

            <span part="icon" class="select__icon" aria-hidden="true">
              <sl-icon name="chevron-down" library="system"></sl-icon>
            </span>

            <!-- The hidden input tricks the browser's built-in validation so it works as expected. We use an input
            instead of a select because, otherwise, iOS will show a list of options during validation. -->
            <input
              class="select__hidden-select"
              aria-hidden="true"
              ?required=${this.required}
              .value=${t?"1":""}
              tabindex="-1"
            />
          </div>

          <sl-menu part="menu" class="select__menu" @sl-select=${this.handleMenuSelect}>
            <slot @slotchange=${this.handleSlotChange}></slot>
          </sl-menu>
        </sl-dropdown>
      `);var s}};Re.styles=Ue,k([Se(".select")],Re.prototype,"dropdown",2),k([Se(".select__box")],Re.prototype,"box",2),k([Se(".select__hidden-select")],Re.prototype,"input",2),k([Se(".select__menu")],Re.prototype,"menu",2),k([ze()],Re.prototype,"hasFocus",2),k([ze()],Re.prototype,"hasHelpTextSlot",2),k([ze()],Re.prototype,"hasLabelSlot",2),k([ze()],Re.prototype,"isOpen",2),k([ze()],Re.prototype,"displayLabel",2),k([ze()],Re.prototype,"displayTags",2),k([ke({type:Boolean,reflect:!0})],Re.prototype,"multiple",2),k([ke({attribute:"max-tags-visible",type:Number})],Re.prototype,"maxTagsVisible",2),k([ke({type:Boolean,reflect:!0})],Re.prototype,"disabled",2),k([ke()],Re.prototype,"name",2),k([ke()],Re.prototype,"placeholder",2),k([ke()],Re.prototype,"size",2),k([ke({type:Boolean})],Re.prototype,"hoist",2),k([ke()],Re.prototype,"value",2),k([ke({type:Boolean,reflect:!0})],Re.prototype,"pill",2),k([ke()],Re.prototype,"label",2),k([ke({attribute:"help-text"})],Re.prototype,"helpText",2),k([ke({type:Boolean,reflect:!0})],Re.prototype,"required",2),k([ke({type:Boolean})],Re.prototype,"clearable",2),k([ke({type:Boolean,reflect:!0})],Re.prototype,"invalid",2),k([Ae("disabled")],Re.prototype,"handleDisabledChange",1),k([Ae("multiple")],Re.prototype,"handleMultipleChange",1),k([Ae("helpText"),Ae("label")],Re.prototype,"handleSlotChange",1),k([Ae("value",{waitUntilFirstUpdate:!0})],Re.prototype,"handleValueChange",1),Re=k([xe("sl-select")],Re);var Be=fe`
  ${He}

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
    cursor: default;
  }

  .tag__clear::part(base) {
    color: inherit;
    padding: 0;
  }

  /*
   * Type modifiers
   */

  .tag--primary {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-200);
    color: var(--sl-color-primary-700);
  }

  .tag--success {
    background-color: var(--sl-color-success-100);
    border-color: var(--sl-color-success-200);
    color: var(--sl-color-success-700);
  }

  .tag--info {
    background-color: var(--sl-color-info-100);
    border-color: var(--sl-color-info-200);
    color: var(--sl-color-info-700);
  }

  .tag--warning {
    background-color: var(--sl-color-warning-100);
    border-color: var(--sl-color-warning-200);
    color: var(--sl-color-warning-700);
  }

  .tag--danger {
    background-color: var(--sl-color-danger-100);
    border-color: var(--sl-color-danger-200);
    color: var(--sl-color-danger-700);
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

  .tag--small .tag__clear {
    margin-left: var(--sl-spacing-xx-small);
    margin-right: calc(-1 * var(--sl-spacing-xxx-small));
  }

  .tag--medium {
    font-size: var(--sl-button-font-size-medium);
    height: calc(var(--sl-input-height-medium) * 0.8);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
    padding: 0 var(--sl-spacing-small);
  }

  .tag__clear {
    margin-left: var(--sl-spacing-xx-small);
    margin-right: calc(-1 * var(--sl-spacing-xx-small));
  }

  .tag--large {
    font-size: var(--sl-button-font-size-large);
    height: calc(var(--sl-input-height-large) * 0.8);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
    padding: 0 var(--sl-spacing-medium);
  }

  .tag__clear {
    margin-left: var(--sl-spacing-xx-small);
    margin-right: calc(-1 * var(--sl-spacing-x-small));
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--sl-border-radius-pill);
  }
`,Ne=class extends we{constructor(){super(...arguments),this.type="primary",this.size="medium",this.pill=!1,this.clearable=!1}handleClearClick(){Pe(this,"sl-clear")}render(){return R`
      <span
        part="base"
        class=${Le({tag:!0,"tag--primary":"primary"===this.type,"tag--success":"success"===this.type,"tag--info":"info"===this.type,"tag--warning":"warning"===this.type,"tag--danger":"danger"===this.type,"tag--text":"text"===this.type,"tag--small":"small"===this.size,"tag--medium":"medium"===this.size,"tag--large":"large"===this.size,"tag--pill":this.pill,"tag--clearable":this.clearable})}
      >
        <span part="content" class="tag__content">
          <slot></slot>
        </span>

        ${this.clearable?R`
              <sl-icon-button
                exportparts="base:clear-button"
                name="x"
                library="system"
                class="tag__clear"
                @click=${this.handleClearClick}
              ></sl-icon-button>
            `:""}
      </span>
    `}};Ne.styles=Be,k([ke({reflect:!0})],Ne.prototype,"type",2),k([ke({reflect:!0})],Ne.prototype,"size",2),k([ke({type:Boolean,reflect:!0})],Ne.prototype,"pill",2),k([ke({type:Boolean})],Ne.prototype,"clearable",2),Ne=k([xe("sl-tag")],Ne);var Ve=fe`
  ${He}

  :host {
    display: block;
  }

  .menu {
    padding: var(--sl-spacing-x-small) 0;
  }
  .menu:focus {
    outline: none;
  }
`,qe=class extends we{constructor(){super(...arguments),this.typeToSelectString=""}getAllItems(e={includeDisabled:!0}){return[...this.defaultSlot.assignedElements({flatten:!0})].filter((t=>"menuitem"===t.getAttribute("role")&&!(!(null==e?void 0:e.includeDisabled)&&t.disabled)))}getCurrentItem(){return this.getAllItems({includeDisabled:!1}).find((e=>"0"===e.getAttribute("tabindex")))}setCurrentItem(e){const t=this.getAllItems({includeDisabled:!1});let s=e.disabled?t[0]:e;t.map((e=>e.setAttribute("tabindex",e===s?"0":"-1")))}typeToSelect(e){const t=this.getAllItems({includeDisabled:!1});clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=setTimeout((()=>this.typeToSelectString=""),750),this.typeToSelectString+=e.toLowerCase();for(const e of t){if(Me(e.shadowRoot.querySelector("slot:not([name])")).toLowerCase().trim().substring(0,this.typeToSelectString.length)===this.typeToSelectString){e.focus();break}}}handleClick(e){const t=e.target.closest("sl-menu-item");t&&!t.disabled&&Pe(this,"sl-select",{detail:{item:t}})}handleKeyDown(e){if("Enter"===e.key){const t=this.getCurrentItem();e.preventDefault(),t&&t.click()}if(" "===e.key&&e.preventDefault(),["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems({includeDisabled:!1}),s=this.getCurrentItem();let i=s?t.indexOf(s):0;if(t.length)return e.preventDefault(),"ArrowDown"===e.key?i++:"ArrowUp"===e.key?i--:"Home"===e.key?i=0:"End"===e.key&&(i=t.length-1),i<0&&(i=0),i>t.length-1&&(i=t.length-1),this.setCurrentItem(t[i]),void t[i].focus()}this.typeToSelect(e.key)}handleMouseDown(e){const t=e.target;"menuitem"===t.getAttribute("role")&&(this.setCurrentItem(t),t.focus())}handleSlotChange(){const e=this.getAllItems({includeDisabled:!1});e.length&&this.setCurrentItem(e[0])}render(){return R`
      <div
        part="base"
        class="menu"
        role="menu"
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}};function We(e){var t=e.getBoundingClientRect();return{width:t.width,height:t.height,top:t.top,right:t.right,bottom:t.bottom,left:t.left,x:t.left,y:t.top}}function Fe(e){if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function Ke(e){var t=Fe(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function Xe(e){return e instanceof Fe(e).Element||e instanceof Element}function Ze(e){return e instanceof Fe(e).HTMLElement||e instanceof HTMLElement}function Ge(e){return"undefined"!=typeof ShadowRoot&&(e instanceof Fe(e).ShadowRoot||e instanceof ShadowRoot)}function Je(e){return e?(e.nodeName||"").toLowerCase():null}function Ye(e){return((Xe(e)?e.ownerDocument:e.document)||window.document).documentElement}function Qe(e){return We(Ye(e)).left+Ke(e).scrollLeft}function et(e){return Fe(e).getComputedStyle(e)}function tt(e){var t=et(e),s=t.overflow,i=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(s+o+i)}function st(e,t,s){void 0===s&&(s=!1);var i,o,r=Ye(t),n=We(e),l=Ze(t),a={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(l||!l&&!s)&&(("body"!==Je(t)||tt(r))&&(a=(i=t)!==Fe(i)&&Ze(i)?{scrollLeft:(o=i).scrollLeft,scrollTop:o.scrollTop}:Ke(i)),Ze(t)?((c=We(t)).x+=t.clientLeft,c.y+=t.clientTop):r&&(c.x=Qe(r))),{x:n.left+a.scrollLeft-c.x,y:n.top+a.scrollTop-c.y,width:n.width,height:n.height}}function it(e){return{x:e.offsetLeft,y:e.offsetTop,width:e.offsetWidth,height:e.offsetHeight}}function ot(e){return"html"===Je(e)?e:e.assignedSlot||e.parentNode||(Ge(e)?e.host:null)||Ye(e)}function rt(e){return["html","body","#document"].indexOf(Je(e))>=0?e.ownerDocument.body:Ze(e)&&tt(e)?e:rt(ot(e))}function nt(e,t){var s;void 0===t&&(t=[]);var i=rt(e),o=i===(null==(s=e.ownerDocument)?void 0:s.body),r=Fe(i),n=o?[r].concat(r.visualViewport||[],tt(i)?i:[]):i,l=t.concat(n);return o?l:l.concat(nt(ot(n)))}function lt(e){return["table","td","th"].indexOf(Je(e))>=0}function at(e){return Ze(e)&&"fixed"!==et(e).position?e.offsetParent:null}function ct(e){for(var t=Fe(e),s=at(e);s&&lt(s)&&"static"===et(s).position;)s=at(s);return s&&("html"===Je(s)||"body"===Je(s)&&"static"===et(s).position)?t:s||function(e){for(var t=navigator.userAgent.toLowerCase().includes("firefox"),s=ot(e);Ze(s)&&["html","body"].indexOf(Je(s))<0;){var i=et(s);if("none"!==i.transform||"none"!==i.perspective||"paint"===i.contain||["transform","perspective"].includes(i.willChange)||t&&"filter"===i.willChange||t&&i.filter&&"none"!==i.filter)return s;s=s.parentNode}return null}(e)||t}qe.styles=Ve,k([Se(".menu")],qe.prototype,"menu",2),k([Se("slot")],qe.prototype,"defaultSlot",2),qe=k([xe("sl-menu")],qe);var dt="top",ht="bottom",pt="right",ut="left",ft=[dt,ht,pt,ut],mt=ft.reduce((function(e,t){return e.concat([t+"-start",t+"-end"])}),[]),gt=[].concat(ft,["auto"]).reduce((function(e,t){return e.concat([t,t+"-start",t+"-end"])}),[]),vt=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function bt(e){var t=new Map,s=new Set,i=[];function o(e){s.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!s.has(e)){var i=t.get(e);i&&o(i)}})),i.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){s.has(e.name)||o(e)})),i}function yt(e){return e.split("-")[0]}var wt=Math.max,xt=Math.min,_t=Math.round;function kt(e,t){var s=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(s&&Ge(s)){var i=t;do{if(i&&e.isSameNode(i))return!0;i=i.parentNode||i.host}while(i)}return!1}function zt(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function St(e,t){return"viewport"===t?zt(function(e){var t=Fe(e),s=Ye(e),i=t.visualViewport,o=s.clientWidth,r=s.clientHeight,n=0,l=0;return i&&(o=i.width,r=i.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(n=i.offsetLeft,l=i.offsetTop)),{width:o,height:r,x:n+Qe(e),y:l}}(e)):Ze(t)?function(e){var t=We(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(t):zt(function(e){var t,s=Ye(e),i=Ke(e),o=null==(t=e.ownerDocument)?void 0:t.body,r=wt(s.scrollWidth,s.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),n=wt(s.scrollHeight,s.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),l=-i.scrollLeft+Qe(e),a=-i.scrollTop;return"rtl"===et(o||s).direction&&(l+=wt(s.clientWidth,o?o.clientWidth:0)-r),{width:r,height:n,x:l,y:a}}(Ye(e)))}function Ct(e,t,s){var i="clippingParents"===t?function(e){var t=nt(ot(e)),s=["absolute","fixed"].indexOf(et(e).position)>=0&&Ze(e)?ct(e):e;return Xe(s)?t.filter((function(e){return Xe(e)&&kt(e,s)&&"body"!==Je(e)})):[]}(e):[].concat(t),o=[].concat(i,[s]),r=o[0],n=o.reduce((function(t,s){var i=St(e,s);return t.top=wt(i.top,t.top),t.right=xt(i.right,t.right),t.bottom=xt(i.bottom,t.bottom),t.left=wt(i.left,t.left),t}),St(e,r));return n.width=n.right-n.left,n.height=n.bottom-n.top,n.x=n.left,n.y=n.top,n}function Tt(e){return e.split("-")[1]}function Ot(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function $t(e){var t,s=e.reference,i=e.element,o=e.placement,r=o?yt(o):null,n=o?Tt(o):null,l=s.x+s.width/2-i.width/2,a=s.y+s.height/2-i.height/2;switch(r){case dt:t={x:l,y:s.y-i.height};break;case ht:t={x:l,y:s.y+s.height};break;case pt:t={x:s.x+s.width,y:a};break;case ut:t={x:s.x-i.width,y:a};break;default:t={x:s.x,y:s.y}}var c=r?Ot(r):null;if(null!=c){var d="y"===c?"height":"width";switch(n){case"start":t[c]=t[c]-(s[d]/2-i[d]/2);break;case"end":t[c]=t[c]+(s[d]/2-i[d]/2)}}return t}function Et(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function Lt(e,t){return t.reduce((function(t,s){return t[s]=e,t}),{})}function At(e,t){void 0===t&&(t={});var s=t,i=s.placement,o=void 0===i?e.placement:i,r=s.boundary,n=void 0===r?"clippingParents":r,l=s.rootBoundary,a=void 0===l?"viewport":l,c=s.elementContext,d=void 0===c?"popper":c,h=s.altBoundary,p=void 0!==h&&h,u=s.padding,f=void 0===u?0:u,m=Et("number"!=typeof f?f:Lt(f,ft)),g="popper"===d?"reference":"popper",v=e.elements.reference,b=e.rects.popper,y=e.elements[p?g:d],w=Ct(Xe(y)?y:y.contextElement||Ye(e.elements.popper),n,a),x=We(v),_=$t({reference:x,element:b,strategy:"absolute",placement:o}),k=zt(Object.assign({},b,_)),z="popper"===d?k:x,S={top:w.top-z.top+m.top,bottom:z.bottom-w.bottom+m.bottom,left:w.left-z.left+m.left,right:z.right-w.right+m.right},C=e.modifiersData.offset;if("popper"===d&&C){var T=C[o];Object.keys(S).forEach((function(e){var t=[pt,ht].indexOf(e)>=0?1:-1,s=[dt,ht].indexOf(e)>=0?"y":"x";S[e]+=T[s]*t}))}return S}var Mt={placement:"bottom",modifiers:[],strategy:"absolute"};function Dt(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function Pt(e){void 0===e&&(e={});var t=e,s=t.defaultModifiers,i=void 0===s?[]:s,o=t.defaultOptions,r=void 0===o?Mt:o;return function(e,t,s){void 0===s&&(s=r);var o,n,l={placement:"bottom",orderedModifiers:[],options:Object.assign({},Mt,r),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},a=[],c=!1,d={state:l,setOptions:function(s){h(),l.options=Object.assign({},r,l.options,s),l.scrollParents={reference:Xe(e)?nt(e):e.contextElement?nt(e.contextElement):[],popper:nt(t)};var o,n,c=function(e){var t=bt(e);return vt.reduce((function(e,s){return e.concat(t.filter((function(e){return e.phase===s})))}),[])}((o=[].concat(i,l.options.modifiers),n=o.reduce((function(e,t){var s=e[t.name];return e[t.name]=s?Object.assign({},s,t,{options:Object.assign({},s.options,t.options),data:Object.assign({},s.data,t.data)}):t,e}),{}),Object.keys(n).map((function(e){return n[e]}))));return l.orderedModifiers=c.filter((function(e){return e.enabled})),l.orderedModifiers.forEach((function(e){var t=e.name,s=e.options,i=void 0===s?{}:s,o=e.effect;if("function"==typeof o){var r=o({state:l,name:t,instance:d,options:i}),n=function(){};a.push(r||n)}})),d.update()},forceUpdate:function(){if(!c){var e=l.elements,t=e.reference,s=e.popper;if(Dt(t,s)){l.rects={reference:st(t,ct(s),"fixed"===l.options.strategy),popper:it(s)},l.reset=!1,l.placement=l.options.placement,l.orderedModifiers.forEach((function(e){return l.modifiersData[e.name]=Object.assign({},e.data)}));for(var i=0;i<l.orderedModifiers.length;i++)if(!0!==l.reset){var o=l.orderedModifiers[i],r=o.fn,n=o.options,a=void 0===n?{}:n,h=o.name;"function"==typeof r&&(l=r({state:l,options:a,name:h,instance:d})||l)}else l.reset=!1,i=-1}}},update:(o=function(){return new Promise((function(e){d.forceUpdate(),e(l)}))},function(){return n||(n=new Promise((function(e){Promise.resolve().then((function(){n=void 0,e(o())}))}))),n}),destroy:function(){h(),c=!0}};if(!Dt(e,t))return d;function h(){a.forEach((function(e){return e()})),a=[]}return d.setOptions(s).then((function(e){!c&&s.onFirstUpdate&&s.onFirstUpdate(e)})),d}}var It={passive:!0};var Ht={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Ut(e){var t,s=e.popper,i=e.popperRect,o=e.placement,r=e.offsets,n=e.position,l=e.gpuAcceleration,a=e.adaptive,c=e.roundOffsets,d=!0===c?function(e){var t=e.x,s=e.y,i=window.devicePixelRatio||1;return{x:_t(_t(t*i)/i)||0,y:_t(_t(s*i)/i)||0}}(r):"function"==typeof c?c(r):r,h=d.x,p=void 0===h?0:h,u=d.y,f=void 0===u?0:u,m=r.hasOwnProperty("x"),g=r.hasOwnProperty("y"),v=ut,b=dt,y=window;if(a){var w=ct(s),x="clientHeight",_="clientWidth";w===Fe(s)&&"static"!==et(w=Ye(s)).position&&(x="scrollHeight",_="scrollWidth"),o===dt&&(b=ht,f-=w[x]-i.height,f*=l?1:-1),o===ut&&(v=pt,p-=w[_]-i.width,p*=l?1:-1)}var k,z=Object.assign({position:n},a&&Ht);return l?Object.assign({},z,((k={})[b]=g?"0":"",k[v]=m?"0":"",k.transform=(y.devicePixelRatio||1)<2?"translate("+p+"px, "+f+"px)":"translate3d("+p+"px, "+f+"px, 0)",k)):Object.assign({},z,((t={})[b]=g?f+"px":"",t[v]=m?p+"px":"",t.transform="",t))}var jt={left:"right",right:"left",bottom:"top",top:"bottom"};function Rt(e){return e.replace(/left|right|bottom|top/g,(function(e){return jt[e]}))}var Bt={start:"end",end:"start"};function Nt(e){return e.replace(/start|end/g,(function(e){return Bt[e]}))}function Vt(e,t,s){return wt(e,xt(t,s))}function qt(e,t,s){return void 0===s&&(s={x:0,y:0}),{top:e.top-t.height-s.y,right:e.right-t.width+s.x,bottom:e.bottom-t.height+s.y,left:e.left-t.width-s.x}}function Wt(e){return[dt,pt,ht,ut].some((function(t){return e[t]>=0}))}var Ft=Pt({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,s=e.instance,i=e.options,o=i.scroll,r=void 0===o||o,n=i.resize,l=void 0===n||n,a=Fe(t.elements.popper),c=[].concat(t.scrollParents.reference,t.scrollParents.popper);return r&&c.forEach((function(e){e.addEventListener("scroll",s.update,It)})),l&&a.addEventListener("resize",s.update,It),function(){r&&c.forEach((function(e){e.removeEventListener("scroll",s.update,It)})),l&&a.removeEventListener("resize",s.update,It)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,s=e.name;t.modifiersData[s]=$t({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,s=e.options,i=s.gpuAcceleration,o=void 0===i||i,r=s.adaptive,n=void 0===r||r,l=s.roundOffsets,a=void 0===l||l,c={placement:yt(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,Ut(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:n,roundOffsets:a})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,Ut(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:a})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var s=t.styles[e]||{},i=t.attributes[e]||{},o=t.elements[e];Ze(o)&&Je(o)&&(Object.assign(o.style,s),Object.keys(i).forEach((function(e){var t=i[e];!1===t?o.removeAttribute(e):o.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,s={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,s.popper),t.styles=s,t.elements.arrow&&Object.assign(t.elements.arrow.style,s.arrow),function(){Object.keys(t.elements).forEach((function(e){var i=t.elements[e],o=t.attributes[e]||{},r=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:s[e]).reduce((function(e,t){return e[t]="",e}),{});Ze(i)&&Je(i)&&(Object.assign(i.style,r),Object.keys(o).forEach((function(e){i.removeAttribute(e)})))}))}},requires:["computeStyles"]},{name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,s=e.options,i=e.name,o=s.offset,r=void 0===o?[0,0]:o,n=gt.reduce((function(e,s){return e[s]=function(e,t,s){var i=yt(e),o=[ut,dt].indexOf(i)>=0?-1:1,r="function"==typeof s?s(Object.assign({},t,{placement:e})):s,n=r[0],l=r[1];return n=n||0,l=(l||0)*o,[ut,pt].indexOf(i)>=0?{x:l,y:n}:{x:n,y:l}}(s,t.rects,r),e}),{}),l=n[t.placement],a=l.x,c=l.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=a,t.modifiersData.popperOffsets.y+=c),t.modifiersData[i]=n}},{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,s=e.options,i=e.name;if(!t.modifiersData[i]._skip){for(var o=s.mainAxis,r=void 0===o||o,n=s.altAxis,l=void 0===n||n,a=s.fallbackPlacements,c=s.padding,d=s.boundary,h=s.rootBoundary,p=s.altBoundary,u=s.flipVariations,f=void 0===u||u,m=s.allowedAutoPlacements,g=t.options.placement,v=yt(g),b=a||(v===g||!f?[Rt(g)]:function(e){if("auto"===yt(e))return[];var t=Rt(e);return[Nt(e),t,Nt(t)]}(g)),y=[g].concat(b).reduce((function(e,s){return e.concat("auto"===yt(s)?function(e,t){void 0===t&&(t={});var s=t,i=s.placement,o=s.boundary,r=s.rootBoundary,n=s.padding,l=s.flipVariations,a=s.allowedAutoPlacements,c=void 0===a?gt:a,d=Tt(i),h=d?l?mt:mt.filter((function(e){return Tt(e)===d})):ft,p=h.filter((function(e){return c.indexOf(e)>=0}));0===p.length&&(p=h);var u=p.reduce((function(t,s){return t[s]=At(e,{placement:s,boundary:o,rootBoundary:r,padding:n})[yt(s)],t}),{});return Object.keys(u).sort((function(e,t){return u[e]-u[t]}))}(t,{placement:s,boundary:d,rootBoundary:h,padding:c,flipVariations:f,allowedAutoPlacements:m}):s)}),[]),w=t.rects.reference,x=t.rects.popper,_=new Map,k=!0,z=y[0],S=0;S<y.length;S++){var C=y[S],T=yt(C),O="start"===Tt(C),$=[dt,ht].indexOf(T)>=0,E=$?"width":"height",L=At(t,{placement:C,boundary:d,rootBoundary:h,altBoundary:p,padding:c}),A=$?O?pt:ut:O?ht:dt;w[E]>x[E]&&(A=Rt(A));var M=Rt(A),D=[];if(r&&D.push(L[T]<=0),l&&D.push(L[A]<=0,L[M]<=0),D.every((function(e){return e}))){z=C,k=!1;break}_.set(C,D)}if(k)for(var P=function(e){var t=y.find((function(t){var s=_.get(t);if(s)return s.slice(0,e).every((function(e){return e}))}));if(t)return z=t,"break"},I=f?3:1;I>0;I--){if("break"===P(I))break}t.placement!==z&&(t.modifiersData[i]._skip=!0,t.placement=z,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},{name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,s=e.options,i=e.name,o=s.mainAxis,r=void 0===o||o,n=s.altAxis,l=void 0!==n&&n,a=s.boundary,c=s.rootBoundary,d=s.altBoundary,h=s.padding,p=s.tether,u=void 0===p||p,f=s.tetherOffset,m=void 0===f?0:f,g=At(t,{boundary:a,rootBoundary:c,padding:h,altBoundary:d}),v=yt(t.placement),b=Tt(t.placement),y=!b,w=Ot(v),x="x"===w?"y":"x",_=t.modifiersData.popperOffsets,k=t.rects.reference,z=t.rects.popper,S="function"==typeof m?m(Object.assign({},t.rects,{placement:t.placement})):m,C={x:0,y:0};if(_){if(r||l){var T="y"===w?dt:ut,O="y"===w?ht:pt,$="y"===w?"height":"width",E=_[w],L=_[w]+g[T],A=_[w]-g[O],M=u?-z[$]/2:0,D="start"===b?k[$]:z[$],P="start"===b?-z[$]:-k[$],I=t.elements.arrow,H=u&&I?it(I):{width:0,height:0},U=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},j=U[T],R=U[O],B=Vt(0,k[$],H[$]),N=y?k[$]/2-M-B-j-S:D-B-j-S,V=y?-k[$]/2+M+B+R+S:P+B+R+S,q=t.elements.arrow&&ct(t.elements.arrow),W=q?"y"===w?q.clientTop||0:q.clientLeft||0:0,F=t.modifiersData.offset?t.modifiersData.offset[t.placement][w]:0,K=_[w]+N-F-W,X=_[w]+V-F;if(r){var Z=Vt(u?xt(L,K):L,E,u?wt(A,X):A);_[w]=Z,C[w]=Z-E}if(l){var G="x"===w?dt:ut,J="x"===w?ht:pt,Y=_[x],Q=Y+g[G],ee=Y-g[J],te=Vt(u?xt(Q,K):Q,Y,u?wt(ee,X):ee);_[x]=te,C[x]=te-Y}}t.modifiersData[i]=C}},requiresIfExists:["offset"]},{name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,s=e.state,i=e.name,o=e.options,r=s.elements.arrow,n=s.modifiersData.popperOffsets,l=yt(s.placement),a=Ot(l),c=[ut,pt].indexOf(l)>=0?"height":"width";if(r&&n){var d=function(e,t){return Et("number"!=typeof(e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:Lt(e,ft))}(o.padding,s),h=it(r),p="y"===a?dt:ut,u="y"===a?ht:pt,f=s.rects.reference[c]+s.rects.reference[a]-n[a]-s.rects.popper[c],m=n[a]-s.rects.reference[a],g=ct(r),v=g?"y"===a?g.clientHeight||0:g.clientWidth||0:0,b=f/2-m/2,y=d[p],w=v-h[c]-d[u],x=v/2-h[c]/2+b,_=Vt(y,x,w),k=a;s.modifiersData[i]=((t={})[k]=_,t.centerOffset=_-x,t)}},effect:function(e){var t=e.state,s=e.options.element,i=void 0===s?"[data-popper-arrow]":s;null!=i&&("string"!=typeof i||(i=t.elements.popper.querySelector(i)))&&kt(t.elements.popper,i)&&(t.elements.arrow=i)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]},{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,s=e.name,i=t.rects.reference,o=t.rects.popper,r=t.modifiersData.preventOverflow,n=At(t,{elementContext:"reference"}),l=At(t,{altBoundary:!0}),a=qt(n,i),c=qt(l,o,r),d=Wt(a),h=Wt(c);t.modifiersData[s]={referenceClippingOffsets:a,popperEscapeOffsets:c,isReferenceHidden:d,hasPopperEscaped:h},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":d,"data-popper-escaped":h})}}]});function Kt(e){const t=e.tagName.toLowerCase();return"-1"!==e.getAttribute("tabindex")&&(!e.hasAttribute("disabled")&&((!e.hasAttribute("aria-disabled")||"false"===e.getAttribute("aria-disabled"))&&(!("input"===t&&"radio"===e.getAttribute("type")&&!e.hasAttribute("checked"))&&(!!e.offsetParent&&("hidden"!==window.getComputedStyle(e).visibility&&(!("audio"!==t&&"video"!==t||!e.hasAttribute("controls"))||(!!e.hasAttribute("tabindex")||(!(!e.hasAttribute("contenteditable")||"false"===e.getAttribute("contenteditable"))||["button","input","select","textarea","a","audio","video","summary"].includes(t)))))))))}function Xt(e,t,s="vertical",i="smooth"){const o=function(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}(e,t),r=o.top+t.scrollTop,n=o.left+t.scrollLeft,l=t.scrollLeft,a=t.scrollLeft+t.offsetWidth,c=t.scrollTop,d=t.scrollTop+t.offsetHeight;"horizontal"!==s&&"both"!==s||(n<l?t.scrollTo({left:n,behavior:i}):n+e.clientWidth>a&&t.scrollTo({left:n-t.offsetWidth+e.clientWidth,behavior:i})),"vertical"!==s&&"both"!==s||(r<c?t.scrollTo({top:r,behavior:i}):r+e.clientHeight>d&&t.scrollTo({top:r-t.offsetHeight+e.clientHeight,behavior:i}))}function Zt(e,t,s){return new Promise((async i=>{if((null==s?void 0:s.duration)===1/0)throw new Error("Promise-based animations must be finite.");const o=e.animate(t,_(x({},s),{duration:Gt()?0:s.duration}));o.addEventListener("cancel",i,{once:!0}),o.addEventListener("finish",i,{once:!0})}))}function Gt(){const e=window.matchMedia("(prefers-reduced-motion: reduce)");return null==e?void 0:e.matches}function Jt(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{const s=requestAnimationFrame(t);e.addEventListener("cancel",(()=>s),{once:!0}),e.addEventListener("finish",(()=>s),{once:!0}),e.cancel()})))))}var Yt=new Map,Qt=new WeakMap;function es(e,t){Yt.set(e,function(e){return null!=e?e:{keyframes:[],options:{duration:0}}}(t))}function ts(e,t){const s=Qt.get(e);if(s&&s[t])return s[t];const i=Yt.get(t);return i||{keyframes:[],options:{duration:0}}}var ss=fe`
  ${He}

  :host {
    display: inline-block;
  }

  .dropdown {
    position: relative;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__positioner {
    position: absolute;
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown__panel {
    max-height: 75vh;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    color: var(--color);
    background-color: var(--sl-panel-background-color);
    border: solid 1px var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    box-shadow: var(--sl-shadow-large);
    overflow: auto;
    overscroll-behavior: none;
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    pointer-events: all;
  }

  .dropdown__positioner[data-popper-placement^='top'] .dropdown__panel {
    transform-origin: bottom;
  }

  .dropdown__positioner[data-popper-placement^='bottom'] .dropdown__panel {
    transform-origin: top;
  }

  .dropdown__positioner[data-popper-placement^='left'] .dropdown__panel {
    transform-origin: right;
  }

  .dropdown__positioner[data-popper-placement^='right'] .dropdown__panel {
    transform-origin: left;
  }
`,is=0,os=class extends we{constructor(){super(...arguments),this.componentId="dropdown-"+ ++is,this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=2,this.skidding=0,this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleMenuItemActivate=this.handleMenuItemActivate.bind(this),this.handlePanelSelect=this.handlePanelSelect.bind(this),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.handleDocumentMouseDown=this.handleDocumentMouseDown.bind(this),this.containingElement||(this.containingElement=this),this.updateComplete.then((()=>{this.popover=Ft(this.trigger,this.positioner,{placement:this.placement,strategy:this.hoist?"fixed":"absolute",modifiers:[{name:"flip",options:{boundary:"viewport"}},{name:"offset",options:{offset:[this.skidding,this.distance]}}]})}))}firstUpdated(){this.panel.hidden=!this.open}disconnectedCallback(){super.disconnectedCallback(),this.hide(),this.popover.destroy()}focusOnTrigger(){const e=this.trigger.querySelector("slot").assignedElements({flatten:!0})[0];e&&"function"==typeof e.focus&&e.focus()}getMenu(){return this.panel.querySelector("slot").assignedElements({flatten:!0}).filter((e=>"sl-menu"===e.tagName.toLowerCase()))[0]}handleDocumentKeyDown(e){var t;if("Escape"===e.key)return this.hide(),void this.focusOnTrigger();if("Tab"===e.key){if(this.open&&"sl-menu-item"===(null==(t=document.activeElement)?void 0:t.tagName.toLowerCase()))return e.preventDefault(),this.hide(),void this.focusOnTrigger();setTimeout((()=>{var e,t;const s=this.containingElement.getRootNode()instanceof ShadowRoot?null==(t=null==(e=document.activeElement)?void 0:e.shadowRoot)?void 0:t.activeElement:document.activeElement;(null==s?void 0:s.closest(this.containingElement.tagName.toLowerCase()))===this.containingElement||this.hide()}))}}handleDocumentMouseDown(e){e.composedPath().includes(this.containingElement)||this.hide()}handleMenuItemActivate(e){Xt(e.target,this.panel)}handlePanelSelect(e){const t=e.target;this.stayOpenOnSelect||"sl-menu"!==t.tagName.toLowerCase()||(this.hide(),this.focusOnTrigger())}handlePopoverOptionsChange(){this.popover&&this.popover.setOptions({placement:this.placement,strategy:this.hoist?"fixed":"absolute",modifiers:[{name:"flip",options:{boundary:"viewport"}},{name:"offset",options:{offset:[this.skidding,this.distance]}}]})}handleTriggerClick(){this.open?this.hide():this.show()}handleTriggerKeyDown(e){const t=this.getMenu(),s=t?[...t.querySelectorAll("sl-menu-item")]:[],i=s[0],o=s[s.length-1];if("Escape"===e.key)return this.focusOnTrigger(),void this.hide();if([" ","Enter"].includes(e.key))return e.preventDefault(),void(this.open?this.hide():this.show());if(["ArrowDown","ArrowUp"].includes(e.key)){if(e.preventDefault(),this.open||this.show(),"ArrowDown"===e.key&&i){return this.getMenu().setCurrentItem(i),void i.focus()}if("ArrowUp"===e.key&&o)return t.setCurrentItem(o),void o.focus()}this.open&&t&&!["Tab","Shift","Meta","Ctrl","Alt"].includes(e.key)&&t.typeToSelect(e.key)}handleTriggerKeyUp(e){" "===e.key&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){if(this.trigger){const e=this.trigger.querySelector("slot").assignedElements({flatten:!0}).find((e=>function(e){const t=[];return function e(s){s instanceof HTMLElement&&(t.push(s),s.shadowRoot&&"open"===s.shadowRoot.mode&&e(s.shadowRoot)),[...s.querySelectorAll("*")].map((t=>e(t)))}(e),{start:t.find((e=>Kt(e)))||null,end:t.reverse().find((e=>Kt(e)))||null}}(e).start));e&&(e.setAttribute("aria-haspopup","true"),e.setAttribute("aria-expanded",this.open?"true":"false"))}}async show(){if(!this.open)return this.open=!0,Ie(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,Ie(this,"sl-after-hide")}reposition(){this.open&&this.popover.update()}async handleOpenChange(){if(!this.disabled)if(this.updateAccessibleTrigger(),this.open){Pe(this,"sl-show"),this.panel.addEventListener("sl-activate",this.handleMenuItemActivate),this.panel.addEventListener("sl-select",this.handlePanelSelect),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown),await Jt(this),this.popover.update(),this.panel.hidden=!1;const{keyframes:e,options:t}=ts(this,"dropdown.show");await Zt(this.panel,e,t),Pe(this,"sl-after-show")}else{Pe(this,"sl-hide"),this.panel.removeEventListener("sl-activate",this.handleMenuItemActivate),this.panel.removeEventListener("sl-select",this.handlePanelSelect),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),await Jt(this);const{keyframes:e,options:t}=ts(this,"dropdown.hide");await Zt(this.panel,e,t),this.panel.hidden=!0,Pe(this,"sl-after-hide")}}render(){return R`
      <div
        part="base"
        id=${this.componentId}
        class=${Le({dropdown:!0,"dropdown--open":this.open})}
      >
        <span
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
        >
          <slot name="trigger" @slotchange=${this.handleTriggerSlotChange}></slot>
        </span>

        <!-- Position the panel with a wrapper since the popover makes use of translate. This let's us add animations
        on the panel without interfering with the position. -->
        <div class="dropdown__positioner">
          <div
            part="panel"
            class="dropdown__panel"
            role="menu"
            aria-hidden=${this.open?"false":"true"}
            aria-labelledby=${this.componentId}
          >
            <slot></slot>
          </div>
        </div>
      </div>
    `}};os.styles=ss,k([Se(".dropdown__trigger")],os.prototype,"trigger",2),k([Se(".dropdown__panel")],os.prototype,"panel",2),k([Se(".dropdown__positioner")],os.prototype,"positioner",2),k([ke({type:Boolean,reflect:!0})],os.prototype,"open",2),k([ke()],os.prototype,"placement",2),k([ke({type:Boolean})],os.prototype,"disabled",2),k([ke({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],os.prototype,"stayOpenOnSelect",2),k([ke({attribute:!1})],os.prototype,"containingElement",2),k([ke({type:Number})],os.prototype,"distance",2),k([ke({type:Number})],os.prototype,"skidding",2),k([ke({type:Boolean})],os.prototype,"hoist",2),k([Ae("distance"),Ae("hoist"),Ae("placement"),Ae("skidding")],os.prototype,"handlePopoverOptionsChange",1),k([Ae("open",{waitUntilFirstUpdate:!0})],os.prototype,"handleOpenChange",1),os=k([xe("sl-dropdown")],os),es("dropdown.show",{keyframes:[{opacity:0,transform:"scale(0.9)"},{opacity:1,transform:"scale(1)"}],options:{duration:150,easing:"ease"}}),es("dropdown.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.9)"}],options:{duration:150,easing:"ease"}});var rs=new WeakMap;var ns={observe:function(e){const t=["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End","PageDown","PageUp"],s=s=>{t.includes(s.key)&&e.classList.add("focus-visible")},i=()=>e.classList.remove("focus-visible");rs.set(e,{is:s,isNot:i}),e.addEventListener("keydown",s),e.addEventListener("keyup",s),e.addEventListener("mousedown",i),e.addEventListener("mousedown",i)},unobserve:function(e){const{is:t,isNot:s}=rs.get(e);e.classList.remove("focus-visible"),e.removeEventListener("keydown",t),e.removeEventListener("keyup",t),e.removeEventListener("mousedown",s),e.removeEventListener("mousedown",s)}},ls=fe`
  ${He}

  :host {
    display: inline-block;
  }

  .icon-button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--sl-border-radius-medium);
    font-size: inherit;
    color: var(--sl-color-gray-500);
    padding: var(--sl-spacing-x-small);
    cursor: pointer;
    transition: var(--sl-transition-medium) color;
    -webkit-appearance: none;
  }

  .icon-button:hover:not(.icon-button--disabled),
  .icon-button:focus:not(.icon-button--disabled) {
    color: var(--sl-color-primary-500);
  }

  .icon-button:active:not(.icon-button--disabled) {
    color: var(--sl-color-primary-600);
  }

  .icon-button:focus {
    outline: none;
  }

  .icon-button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .focus-visible.icon-button:focus {
    box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);
  }
`,as=class extends we{constructor(){super(...arguments),this.label="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.updateComplete.then((()=>ns.observe(this.button)))}disconnectedCallback(){super.disconnectedCallback(),ns.unobserve(this.button)}render(){return R`
      <button
        part="base"
        class=${Le({"icon-button":!0,"icon-button--disabled":this.disabled})}
        ?disabled=${this.disabled}
        type="button"
        aria-label=${this.label}
      >
        <sl-icon
          name=${Ce(this.name)}
          library=${Ce(this.library)}
          src=${Ce(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </button>
    `}};as.styles=ls,k([Se("button")],as.prototype,"button",2),k([ke()],as.prototype,"name",2),k([ke()],as.prototype,"library",2),k([ke()],as.prototype,"src",2),k([ke()],as.prototype,"label",2),k([ke({type:Boolean,reflect:!0})],as.prototype,"disabled",2),as=k([xe("sl-icon-button")],as);var cs="";function ds(e){cs=e}var hs=[...document.getElementsByTagName("script")],ps=hs.find((e=>e.hasAttribute("data-shoelace")));if(ps)ds(ps.getAttribute("data-shoelace"));else{const e=hs.find((e=>/shoelace(\.min)?\.js$/.test(e.src)));let t="";e&&(t=e.getAttribute("src")),ds(t.split("/").slice(0,-1).join("/"))}var us={check:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">\n      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',x:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">\n      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"x-circle":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">\n      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\n      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  '},fs=[{name:"default",resolver:e=>`${cs.replace(/\/$/,"")}/assets/icons/${e}.svg`},{name:"system",resolver:e=>us[e]?`data:image/svg+xml,${encodeURIComponent(us[e])}`:""}],ms=[];function gs(e){return fs.filter((t=>t.name===e))[0]}var vs=new Map,bs=class extends Ee{constructor(e){if(super(e),this.vt=N,e.type!==Oe)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===N)return this.Vt=void 0,this.vt=e;if(e===B)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.vt)return this.Vt;this.vt=e;const t=[e];return t.raw=t,this.Vt={_$litType$:this.constructor.resultType,strings:t,values:[]}}};bs.directiveName="unsafeHTML",bs.resultType=1;var ys=class extends bs{};ys.directiveName="unsafeSVG",ys.resultType=2;var ws=$e(ys),xs=fe`
  ${He}

  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    contain: strict;
    box-sizing: content-box !important;
  }

  .icon,
  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`,_s=new DOMParser,ks=class extends we{constructor(){super(...arguments),this.svg="",this.library="default"}connectedCallback(){var e;super.connectedCallback(),e=this,ms.push(e)}firstUpdated(){this.setIcon()}disconnectedCallback(){var e;super.disconnectedCallback(),e=this,ms=ms.filter((t=>t!==e))}getLabel(){let e="";return this.label?e=this.label:this.name?e=this.name.replace(/-/g," "):this.src&&(e=this.src.replace(/.*\//,"").replace(/-/g," ").replace(/\.svg/i,"")),e}getUrl(){const e=gs(this.library);return this.name&&e?e.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){const e=gs(this.library),t=this.getUrl();if(t)try{const s=await(e=>{if(vs.has(e))return vs.get(e);{const t=fetch(e).then((async e=>{if(e.ok){const t=document.createElement("div");t.innerHTML=await e.text();const s=t.firstElementChild;return{ok:e.ok,status:e.status,svg:s&&"svg"===s.tagName.toLowerCase()?s.outerHTML:""}}return{ok:e.ok,status:e.status,svg:null}}));return vs.set(e,t),t}})(t);if(t!==this.getUrl())return;if(s.ok){const t=_s.parseFromString(s.svg,"text/html").body.querySelector("svg");t?(e&&e.mutator&&e.mutator(t),this.svg=t.outerHTML,Pe(this,"sl-load")):(this.svg="",Pe(this,"sl-error",{detail:{status:s.status}}))}else this.svg="",Pe(this,"sl-error",{detail:{status:s.status}})}catch(e){Pe(this,"sl-error",{detail:{status:-1}})}else this.svg&&(this.svg="")}handleChange(){this.setIcon()}render(){return R` <div part="base" class="icon" role="img" aria-label=${this.getLabel()}>${ws(this.svg)}</div>`}};ks.styles=xs,k([ze()],ks.prototype,"svg",2),k([ke()],ks.prototype,"name",2),k([ke()],ks.prototype,"src",2),k([ke()],ks.prototype,"label",2),k([ke()],ks.prototype,"library",2),k([Ae("name"),Ae("src"),Ae("library")],ks.prototype,"setIcon",1),ks=k([xe("sl-icon")],ks);var zs=fe`
  ${He}

  :host {
    display: block;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    text-align: left;
    color: var(--sl-color-gray-700);
    padding: var(--sl-spacing-xx-small) var(--sl-spacing-x-large);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }
  .menu-item.menu-item--disabled {
    outline: none;
    color: var(--sl-color-gray-400);
    cursor: not-allowed;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix ::slotted(*) {
    margin-right: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix ::slotted(*) {
    margin-left: var(--sl-spacing-x-small);
  }

  :host(:focus) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'])) .menu-item,
  :host(:focus:not([aria-disabled='true'])) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-500);
    color: var(--sl-color-white);
  }

  .menu-item .menu-item__check {
    display: flex;
    position: absolute;
    left: 0.5em;
    top: calc(50% - 0.5em);
    visibility: hidden;
    align-items: center;
    font-size: inherit;
  }

  .menu-item--checked .menu-item__check {
    visibility: visible;
  }
`,Ss=class extends we{constructor(){super(...arguments),this.checked=!1,this.value="",this.disabled=!1}firstUpdated(){this.setAttribute("role","menuitem")}handleCheckedChange(){this.setAttribute("aria-checked",String(this.checked))}handleDisabledChange(){this.setAttribute("aria-disabled",String(this.disabled))}render(){return R`
      <div
        part="base"
        class=${Le({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled})}
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <span part="prefix" class="menu-item__prefix">
          <slot name="prefix"></slot>
        </span>

        <span part="label" class="menu-item__label">
          <slot></slot>
        </span>

        <span part="suffix" class="menu-item__suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `}};Ss.styles=zs,k([Se(".menu-item")],Ss.prototype,"menuItem",2),k([ke({type:Boolean,reflect:!0})],Ss.prototype,"checked",2),k([ke()],Ss.prototype,"value",2),k([ke({type:Boolean,reflect:!0})],Ss.prototype,"disabled",2),k([Ae("checked")],Ss.prototype,"handleCheckedChange",1),k([Ae("disabled")],Ss.prototype,"handleDisabledChange",1),Ss=k([xe("sl-menu-item")],Ss);const Cs=e`:host{--sl-color-black:#000;--sl-color-white:#fff;--sl-color-gray-50:#f9fafb;--sl-color-gray-100:#f3f4f6;--sl-color-gray-200:#e5e7eb;--sl-color-gray-300:#d1d5db;--sl-color-gray-400:#9ca3af;--sl-color-gray-500:#6b7280;--sl-color-gray-600:#4b5563;--sl-color-gray-700:#374151;--sl-color-gray-800:#1f2937;--sl-color-gray-900:#111827;--sl-color-gray-950:#0d131e;--sl-color-primary-50:#f0f9ff;--sl-color-primary-100:#e0f2fe;--sl-color-primary-200:#bae6fd;--sl-color-primary-300:#7dd3fc;--sl-color-primary-400:#38bdf8;--sl-color-primary-500:#0ea5e9;--sl-color-primary-600:#0284c7;--sl-color-primary-700:#0369a1;--sl-color-primary-800:#075985;--sl-color-primary-900:#0c4a6e;--sl-color-primary-950:#082e45;--sl-color-primary-text:var(--sl-color-white);--sl-color-success-50:#f0fdf4;--sl-color-success-100:#dcfce7;--sl-color-success-200:#bbf7d0;--sl-color-success-300:#86efac;--sl-color-success-400:#4ade80;--sl-color-success-500:#22c55e;--sl-color-success-600:#16a34a;--sl-color-success-700:#15803d;--sl-color-success-800:#166534;--sl-color-success-900:#14532d;--sl-color-success-950:#0d381e;--sl-color-success-text:var(--sl-color-white);--sl-color-info-50:#f9fafb;--sl-color-info-100:#f3f4f6;--sl-color-info-200:#e5e7eb;--sl-color-info-300:#d1d5db;--sl-color-info-400:#9ca3af;--sl-color-info-500:#6b7280;--sl-color-info-600:#4b5563;--sl-color-info-700:#374151;--sl-color-info-800:#1f2937;--sl-color-info-900:#111827;--sl-color-info-950:#0d131e;--sl-color-info-text:var(--sl-color-white);--sl-color-warning-50:#fffbeb;--sl-color-warning-100:#fef3c7;--sl-color-warning-200:#fde68a;--sl-color-warning-300:#fcd34d;--sl-color-warning-400:#fbbf24;--sl-color-warning-500:#f59e0b;--sl-color-warning-600:#d97706;--sl-color-warning-700:#b45309;--sl-color-warning-800:#92400e;--sl-color-warning-900:#78350f;--sl-color-warning-950:#4d220a;--sl-color-warning-text:var(--sl-color-white);--sl-color-danger-50:#fef2f2;--sl-color-danger-100:#fee2e2;--sl-color-danger-200:#fecaca;--sl-color-danger-300:#fca5a5;--sl-color-danger-400:#f87171;--sl-color-danger-500:#ef4444;--sl-color-danger-600:#dc2626;--sl-color-danger-700:#b91c1c;--sl-color-danger-800:#991b1b;--sl-color-danger-900:#7f1d1d;--sl-color-danger-950:#481111;--sl-color-danger-text:var(--sl-color-white);--sl-border-radius-small:0.125rem;--sl-border-radius-medium:0.25rem;--sl-border-radius-large:0.5rem;--sl-border-radius-x-large:1rem;--sl-border-radius-circle:50%;--sl-border-radius-pill:9999px;--sl-shadow-x-small:0 1px 0 #0d131e0d;--sl-shadow-small:0 1px 2px #0d131e1a;--sl-shadow-medium:0 2px 4px #0d131e1a;--sl-shadow-large:0 2px 8px #0d131e1a;--sl-shadow-x-large:0 4px 16px #0d131e1a;--sl-spacing-xxx-small:0.125rem;--sl-spacing-xx-small:0.25rem;--sl-spacing-x-small:0.5rem;--sl-spacing-small:0.75rem;--sl-spacing-medium:1rem;--sl-spacing-large:1.25rem;--sl-spacing-x-large:1.75rem;--sl-spacing-xx-large:2.25rem;--sl-spacing-xxx-large:3rem;--sl-spacing-xxxx-large:4.5rem;--sl-transition-x-slow:1000ms;--sl-transition-slow:500ms;--sl-transition-medium:250ms;--sl-transition-fast:150ms;--sl-transition-x-fast:50ms;--sl-font-mono:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;--sl-font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--sl-font-serif:Georgia,"Times New Roman",serif;--sl-font-size-xx-small:0.625rem;--sl-font-size-x-small:0.75rem;--sl-font-size-small:0.875rem;--sl-font-size-medium:1rem;--sl-font-size-large:1.25rem;--sl-font-size-x-large:1.5rem;--sl-font-size-xx-large:2.25rem;--sl-font-size-xxx-large:3rem;--sl-font-size-xxxx-large:4.5rem;--sl-font-weight-light:300;--sl-font-weight-normal:400;--sl-font-weight-semibold:500;--sl-font-weight-bold:700;--sl-letter-spacing-dense:-0.015em;--sl-letter-spacing-normal:normal;--sl-letter-spacing-loose:0.075em;--sl-line-height-dense:1.4;--sl-line-height-normal:1.8;--sl-line-height-loose:2.2;--sl-focus-ring-color-primary:#0ea5e954;--sl-focus-ring-color-success:#22c55e54;--sl-focus-ring-color-info:#6b728054;--sl-focus-ring-color-warning:#f59e0b54;--sl-focus-ring-color-danger:#ef444454;--sl-focus-ring-width:3px;--sl-button-font-size-small:var(--sl-font-size-x-small);--sl-button-font-size-medium:var(--sl-font-size-small);--sl-button-font-size-large:var(--sl-font-size-medium);--sl-input-height-small:1.875rem;--sl-input-height-medium:2.5rem;--sl-input-height-large:3.125rem;--sl-input-background-color:var(--sl-color-white);--sl-input-background-color-hover:var(--sl-color-white);--sl-input-background-color-focus:var(--sl-color-white);--sl-input-background-color-disabled:var(--sl-color-gray-100);--sl-input-border-color:var(--sl-color-gray-300);--sl-input-border-color-hover:var(--sl-color-gray-400);--sl-input-border-color-focus:var(--sl-color-primary-500);--sl-input-border-color-disabled:var(--sl-color-gray-300);--sl-input-border-width:1px;--sl-input-border-radius-small:var(--sl-border-radius-medium);--sl-input-border-radius-medium:var(--sl-border-radius-medium);--sl-input-border-radius-large:var(--sl-border-radius-medium);--sl-input-font-family:var(--sl-font-sans);--sl-input-font-weight:var(--sl-font-weight-normal);--sl-input-font-size-small:var(--sl-font-size-small);--sl-input-font-size-medium:var(--sl-font-size-medium);--sl-input-font-size-large:var(--sl-font-size-large);--sl-input-letter-spacing:var(--sl-letter-spacing-normal);--sl-input-color:var(--sl-color-gray-700);--sl-input-color-hover:var(--sl-color-gray-700);--sl-input-color-focus:var(--sl-color-gray-700);--sl-input-color-disabled:var(--sl-color-gray-900);--sl-input-icon-color:var(--sl-color-gray-400);--sl-input-icon-color-hover:var(--sl-color-gray-600);--sl-input-icon-color-focus:var(--sl-color-gray-600);--sl-input-placeholder-color:var(--sl-color-gray-400);--sl-input-placeholder-color-disabled:var(--sl-color-gray-600);--sl-input-spacing-small:var(--sl-spacing-small);--sl-input-spacing-medium:var(--sl-spacing-medium);--sl-input-spacing-large:var(--sl-spacing-large);--sl-input-label-font-size-small:var(--sl-font-size-small);--sl-input-label-font-size-medium:var(--sl-font-size-medium);--sl-input-label-font-size-large:var(--sl-font-size-large);--sl-input-label-color:inherit;--sl-input-help-text-font-size-small:var(--sl-font-size-x-small);--sl-input-help-text-font-size-medium:var(--sl-font-size-small);--sl-input-help-text-font-size-large:var(--sl-font-size-medium);--sl-input-help-text-color:var(--sl-color-gray-400);--sl-toggle-size:1rem;--sl-overlay-background-color:#37415180;--sl-panel-background-color:var(--sl-color-white);--sl-panel-border-color:var(--sl-color-gray-200);--sl-tooltip-border-radius:var(--sl-border-radius-medium);--sl-tooltip-background-color:var(--sl-color-gray-900);--sl-tooltip-color:var(--sl-color-white);--sl-tooltip-font-family:var(--sl-font-sans);--sl-tooltip-font-weight:var(--sl-font-weight-normal);--sl-tooltip-font-size:var(--sl-font-size-small);--sl-tooltip-line-height:var(--sl-line-height-dense);--sl-tooltip-padding:var(--sl-spacing-xx-small) var(--sl-spacing-x-small);--sl-tooltip-arrow-size:5px;--sl-tooltip-arrow-start-end-offset:8px;--sl-z-index-drawer:700;--sl-z-index-dialog:800;--sl-z-index-dropdown:900;--sl-z-index-toast:950;--sl-z-index-tooltip:1000}.sl-scroll-lock{overflow:hidden!important}`;class Ts extends(n(t)){static get properties(){return{currency:{type:Object},currencies:{type:Array},totalPrice:{type:Number,attribute:"total-price"},zoneId:{type:String,attribute:"zone-id"},zones:{type:Array},_size:{type:String}}}constructor(){super(),this.breakpoints={width:[600]},this.currencies=[],this.currency={},this.totalPrice=0,this.zoneId="PAR",this.zones=[],this._size=0}onResize({width:e}){this._size=e}_getCurrencySymbol(e){return new Intl.NumberFormat("fr",{style:"currency",currency:e,currencyDisplay:"narrowSymbol",maximumFractionDigits:0}).formatToParts(0).find((e=>"currency"===e.type)).value}_getformattedCurrencies(e){return e.map((e=>{const t=`${this._getCurrencySymbol(e.code)} ${e.code}`;return{...e,displayValue:t}}))}_onCurrencyChange(e){const t=this.currencies.find((t=>t.code===e.target.value));s(this,"change-currency",t)}_onZoneInput(e){const t=e.target.value;s(this,"change-zone",t)}render(){return i`<div class=header><div class=currency-text>${r("cc-pricing-header.currency-text")}</div><div class=currency-select><sl-select value=${this.currency.code} class=select @sl-change=${this._onCurrencyChange}>${0===this.currencies.length?i`<sl-menu-item class=skeleton><div slot=prefix class=skeleton-item>€ EUR</div></sl-menu-item>`:""} ${this.currencies.length>0?this._getformattedCurrencies(this.currencies).map((e=>i`<sl-menu-item value=${e.code}>${e.displayValue}</sl-menu-item>`)):""}</sl-select></div><div class=zone-text>${r("cc-pricing-header.selected-zone")}</div><div class=zones><sl-select value=${this.zoneId} class=select @sl-change=${this._onZoneInput}>${0===this.zones.length?i`<sl-menu-item><cc-zone slot=prefix mode=medium></cc-zone></sl-menu-item><sl-menu-item><cc-zone slot=prefix mode=medium></cc-zone></sl-menu-item><sl-menu-item><cc-zone slot=prefix mode=medium></cc-zone></sl-menu-item>`:""} ${this.zones.length>0?this.zones.map((e=>i`<sl-menu-item class=zone-item value=${e.name}>${l.getText(e)}<cc-zone slot=prefix class=zone-item mode=medium .zone=${e}></cc-zone></sl-menu-item>`)):""}</sl-select></div><div class=est-cost-text>${r("cc-pricing-header.est-cost")}</div><div class=total-price>${0===Object.values(this.currency).length?i`<div class=skeleton>00000 €</div>`:""} ${Object.values(this.currency).length>0?i`${r("cc-pricing-header.price",{price:this.totalPrice*this.currency.changeRate,code:this.currency.code})}`:""}</div></div>`}static get styles(){return[Cs,o,e`:host{display:block;margin-bottom:1.5em;padding:1em}.skeleton{background-color:#bbb}.skeleton-item{visibility:hidden}.select-currency{align-items:center;display:flex;flex-direction:column;gap:.25em}.header{display:flex;flex-direction:column;gap:.75em}:host([w-gte-600]) .header{display:grid;gap:.5rem;grid-template:"currency-text zone-text estimation-text" "currency-select zones estimation";grid-template-columns:min-content 1fr}.est-cost-text{align-self:end;grid-area:estimation-text;justify-self:end}.currency-text{grid-area:currency-text}.currency-select{grid-area:currency-select}.select-content{width:min-content}.select-item{background-color:#fff}.zone-item{margin:.5em 0 .5em .5em}sl-menu-item.zone-item::part(base):focus{--cc-zone-subtitle-color:#fff;--cc-zone-tag-bgcolor:transparent;--cc-zone-tag-border-color:#fff}sl-menu-item.zone-item::part(label){display:none}sl-menu-item.zone-item::part(prefix){display:block;flex:1 1 0}.zones{grid-area:zones}.zone-text{grid-area:zone-text}.total-price{align-self:end;font-size:1.5em;font-weight:700;grid-area:estimation;justify-self:end}:host([w-gte-600]) .total-price{align-self:center}.select{--focus-ring:0 0 0 .2em rgba(50, 115, 220, .25)}`]}}window.customElements.define("cc-pricing-header",Ts);export{Ts as CcPricingHeader};
//# sourceMappingURL=cc-pricing-header-1344f74c.js.map
