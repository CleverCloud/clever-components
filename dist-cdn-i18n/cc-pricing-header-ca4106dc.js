import{c as e}from"./i18n-bf531c19.js";import"./cc-flex-gap-4e6ab5ba.js";import{c as t,L as s,d as i,h as o,a as r,s as n}from"./vendor-5e139a4e.js";import{s as l}from"./zone-48aed84f.js";import{CcZone as a}from"./cc-zone-280ca68f.js";var c,d,h,p,u,f=Object.defineProperty,m=Object.defineProperties,g=Object.getOwnPropertyDescriptor,v=Object.getOwnPropertyDescriptors,b=Object.getOwnPropertySymbols,y=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable,x=(e,t,s)=>t in e?f(e,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[t]=s,_=(e,t)=>{for(var s in t||(t={}))y.call(t,s)&&x(e,s,t[s]);if(b)for(var s of b(t))w.call(t,s)&&x(e,s,t[s]);return e},k=(e,t)=>m(e,v(t)),S=(e,t,s,i)=>{for(var o,r=i>1?void 0:i?g(t,s):t,n=e.length-1;n>=0;n--)(o=e[n])&&(r=(i?o(t,s,r):o(r))||r);return i&&r&&f(t,s,r),r},z=globalThis.trustedTypes,C=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,T=`lit$${(Math.random()+"").slice(9)}$`,O="?"+T,$=`<${O}>`,E=document,L=(e="")=>E.createComment(e),A=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,I=/>/g,H=/>|[ 	\n\r](?:([^\s"'>=/]+)([ 	\n\r]*=[ 	\n\r]*(?:[^ 	\n\r"'`<>=]|("|')|))|$)/g,U=/'/g,j=/"/g,B=/^(?:script|style|textarea)$/i,R=(u=1,(e,...t)=>({_$litType$:u,strings:e,values:t})),N=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,W=E.createTreeWalker(E,129,null,!1),F=class{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let o=0,r=0;const n=e.length-1,l=this.parts,[a,c]=((e,t)=>{const s=e.length-1,i=[];let o,r=2===t?"<svg>":"",n=D;for(let t=0;t<s;t++){const s=e[t];let l,a,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,a=n.exec(s),null!==a);)d=n.lastIndex,n===D?"!--"===a[1]?n=P:void 0!==a[1]?n=I:void 0!==a[2]?(B.test(a[2])&&(o=RegExp("</"+a[2],"g")),n=H):void 0!==a[3]&&(n=H):n===H?">"===a[0]?(n=null!=o?o:D,c=-1):void 0===a[1]?c=-2:(c=n.lastIndex-a[2].length,l=a[1],n=void 0===a[3]?H:'"'===a[3]?j:U):n===j||n===U?n=H:n===P||n===I?n=D:(n=H,o=void 0);const h=n===H&&e[t+1].startsWith("/>")?" ":"";r+=n===D?s+$:c>=0?(i.push(l),s.slice(0,c)+"$lit$"+s.slice(c)+T+h):s+T+(-2===c?(i.push(void 0),t):h)}const l=r+(e[s]||"<?>")+(2===t?"</svg>":"");return[void 0!==C?C.createHTML(l):l,i]})(e,t);if(this.el=F.createElement(a,s),W.currentNode=this.el.content,2===t){const e=this.el.content,t=e.firstChild;t.remove(),e.append(...t.childNodes)}for(;null!==(i=W.nextNode())&&l.length<n;){if(1===i.nodeType){if(i.hasAttributes()){const e=[];for(const t of i.getAttributeNames())if(t.endsWith("$lit$")||t.startsWith(T)){const s=c[r++];if(e.push(t),void 0!==s){const e=i.getAttribute(s.toLowerCase()+"$lit$").split(T),t=/([.?@])?(.*)/.exec(s);l.push({type:1,index:o,name:t[2],strings:e,ctor:"."===t[1]?G:"?"===t[1]?J:"@"===t[1]?Y:X})}else l.push({type:6,index:o})}for(const t of e)i.removeAttribute(t)}if(B.test(i.tagName)){const e=i.textContent.split(T),t=e.length-1;if(t>0){i.textContent=z?z.emptyScript:"";for(let s=0;s<t;s++)i.append(e[s],L()),W.nextNode(),l.push({type:2,index:++o});i.append(e[t],L())}}}else if(8===i.nodeType)if(i.data===O)l.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(T,e+1));)l.push({type:7,index:o}),e+=T.length-1}o++}}static createElement(e,t){const s=E.createElement("template");return s.innerHTML=e,s}};function K(e,t,s=e,i){var o,r,n,l;if(t===N)return t;let a=void 0!==i?null===(o=s.Σi)||void 0===o?void 0:o[i]:s.Σo;const c=A(t)?void 0:t._$litDirective$;return(null==a?void 0:a.constructor)!==c&&(null===(r=null==a?void 0:a.O)||void 0===r||r.call(a,!1),void 0===c?a=void 0:(a=new c(e),a.T(e,s,i)),void 0!==i?(null!==(n=(l=s).Σi)&&void 0!==n?n:l.Σi=[])[i]=a:s.Σo=a),void 0!==a&&(t=K(e,a.S(e,t.values),a,i)),t}var Z=class{constructor(e,t,s,i){this.type=2,this.N=void 0,this.A=e,this.B=t,this.M=s,this.options=i}setConnected(e){var t;null===(t=this.P)||void 0===t||t.call(this,e)}get parentNode(){return this.A.parentNode}get startNode(){return this.A}get endNode(){return this.B}I(e,t=this){e=K(this,e,t),A(e)?e===V||null==e||""===e?(this.H!==V&&this.R(),this.H=V):e!==this.H&&e!==N&&this.m(e):void 0!==e._$litType$?this._(e):void 0!==e.nodeType?this.$(e):(e=>{var t;return M(e)||"function"==typeof(null===(t=e)||void 0===t?void 0:t[Symbol.iterator])})(e)?this.g(e):this.m(e)}k(e,t=this.B){return this.A.parentNode.insertBefore(e,t)}$(e){this.H!==e&&(this.R(),this.H=this.k(e))}m(e){const t=this.A.nextSibling;null!==t&&3===t.nodeType&&(null===this.B?null===t.nextSibling:t===this.B.previousSibling)?t.data=e:this.$(E.createTextNode(e)),this.H=e}_(e){var t;const{values:s,_$litType$:i}=e,o="number"==typeof i?this.C(e):(void 0===i.el&&(i.el=F.createElement(i.h,this.options)),i);if((null===(t=this.H)||void 0===t?void 0:t.D)===o)this.H.v(s);else{const e=new class{constructor(e,t){this.l=[],this.N=void 0,this.D=e,this.M=t}u(e){var t;const{el:{content:s},parts:i}=this.D,o=(null!==(t=null==e?void 0:e.creationScope)&&void 0!==t?t:E).importNode(s,!0);W.currentNode=o;let r=W.nextNode(),n=0,l=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new Z(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new Q(r,this,e)),this.l.push(t),a=i[++l]}n!==(null==a?void 0:a.index)&&(r=W.nextNode(),n++)}return o}v(e){let t=0;for(const s of this.l)void 0!==s&&(void 0!==s.strings?(s.I(e,s,t),t+=s.strings.length-2):s.I(e[t])),t++}}(o,this),t=e.u(this.options);e.v(s),this.$(t),this.H=e}}C(e){let t=q.get(e.strings);return void 0===t&&q.set(e.strings,t=new F(e)),t}g(e){M(this.H)||(this.H=[],this.R());const t=this.H;let s,i=0;for(const o of e)i===t.length?t.push(s=new Z(this.k(L()),this.k(L()),this,this.options)):s=t[i],s.I(o),i++;i<t.length&&(this.R(s&&s.B.nextSibling,i),t.length=i)}R(e=this.A.nextSibling,t){var s;for(null===(s=this.P)||void 0===s||s.call(this,!1,!0,t);e&&e!==this.B;){const t=e.nextSibling;e.remove(),e=t}}},X=class{constructor(e,t,s,i,o){this.type=1,this.H=V,this.N=void 0,this.V=void 0,this.element=e,this.name=t,this.M=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this.H=Array(s.length-1).fill(V),this.strings=s):this.H=V}get tagName(){return this.element.tagName}I(e,t=this,s,i){const o=this.strings;let r=!1;if(void 0===o)e=K(this,e,t,0),r=!A(e)||e!==this.H&&e!==N,r&&(this.H=e);else{const i=e;let n,l;for(e=o[0],n=0;n<o.length-1;n++)l=K(this,i[s+n],t,n),l===N&&(l=this.H[n]),r||(r=!A(l)||l!==this.H[n]),l===V?e=V:e!==V&&(e+=(null!=l?l:"")+o[n+1]),this.H[n]=l}r&&!i&&this.W(e)}W(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}},G=class extends X{constructor(){super(...arguments),this.type=3}W(e){this.element[this.name]=e===V?void 0:e}},J=class extends X{constructor(){super(...arguments),this.type=4}W(e){e&&e!==V?this.element.setAttribute(this.name,""):this.element.removeAttribute(this.name)}},Y=class extends X{constructor(){super(...arguments),this.type=5}I(e,t=this){var s;if((e=null!==(s=K(this,e,t,0))&&void 0!==s?s:V)===N)return;const i=this.H,o=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==V&&(i===V||o);o&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this.H=e}handleEvent(e){var t,s;"function"==typeof this.H?this.H.call(null!==(s=null===(t=this.options)||void 0===t?void 0:t.host)&&void 0!==s?s:this.element,e):this.H.handleEvent(e)}},Q=class{constructor(e,t,s){this.element=e,this.type=6,this.N=void 0,this.V=void 0,this.M=t,this.options=s}I(e){K(this,e)}};null===(d=(c=globalThis).litHtmlPlatformSupport)||void 0===d||d.call(c,F,Z),(null!==(h=(p=globalThis).litHtmlVersions)&&void 0!==h?h:p.litHtmlVersions=[]).push("2.0.0-rc.3");var ee,te,se,ie,oe,re,ne,le,ae,ce,de=window.ShadowRoot&&(void 0===window.ShadyCSS||window.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),pe=class{constructor(e,t){if(t!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e}get styleSheet(){return de&&void 0===this.t&&(this.t=new CSSStyleSheet,this.t.replaceSync(this.cssText)),this.t}toString(){return this.cssText}},ue=new Map,fe=e=>{let t=ue.get(e);return void 0===t&&ue.set(e,t=new pe(e,he)),t},me=(e,...t)=>{const s=1===e.length?e[0]:t.reduce(((t,s,i)=>t+(e=>{if(e instanceof pe)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+e[i+1]),e[0]);return fe(s)},ge=de?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return(e=>fe("string"==typeof e?e:e+""))(t)})(e):e,ve={toAttribute(e,t){switch(t){case Boolean:e=e?"":null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let s=e;switch(t){case Boolean:s=null!==e;break;case Number:s=null===e?null:Number(e);break;case Object:case Array:try{s=JSON.parse(e)}catch(e){s=null}}return s}},be=(e,t)=>t!==e&&(t==t||e==e),ye={attribute:!0,type:String,converter:ve,reflect:!1,hasChanged:be},we=class extends HTMLElement{constructor(){super(),this.Πi=new Map,this.Πo=void 0,this.Πl=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.Πh=null,this.u()}static addInitializer(e){var t;null!==(t=this.v)&&void 0!==t||(this.v=[]),this.v.push(e)}static get observedAttributes(){this.finalize();const e=[];return this.elementProperties.forEach(((t,s)=>{const i=this.Πp(s,t);void 0!==i&&(this.Πm.set(i,s),e.push(i))})),e}static createProperty(e,t=ye){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){const s="symbol"==typeof e?Symbol():"__"+e,i=this.getPropertyDescriptor(e,s,t);void 0!==i&&Object.defineProperty(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){return{get(){return this[t]},set(i){const o=this[e];this[t]=i,this.requestUpdate(e,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ye}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const e=Object.getPrototypeOf(this);if(e.finalize(),this.elementProperties=new Map(e.elementProperties),this.Πm=new Map,this.hasOwnProperty("properties")){const e=this.properties,t=[...Object.getOwnPropertyNames(e),...Object.getOwnPropertySymbols(e)];for(const s of t)this.createProperty(s,e[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const e of s)t.unshift(ge(e))}else void 0!==e&&t.push(ge(e));return t}static"Πp"(e,t){const s=t.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof e?e.toLowerCase():void 0}u(){var e;this.Πg=new Promise((e=>this.enableUpdating=e)),this.L=new Map,this.Π_(),this.requestUpdate(),null===(e=this.constructor.v)||void 0===e||e.forEach((e=>e(this)))}addController(e){var t,s;(null!==(t=this.ΠU)&&void 0!==t?t:this.ΠU=[]).push(e),void 0!==this.renderRoot&&this.isConnected&&(null===(s=e.hostConnected)||void 0===s||s.call(e))}removeController(e){var t;null===(t=this.ΠU)||void 0===t||t.splice(this.ΠU.indexOf(e)>>>0,1)}"Π_"(){this.constructor.elementProperties.forEach(((e,t)=>{this.hasOwnProperty(t)&&(this.Πi.set(t,this[t]),delete this[t])}))}createRenderRoot(){var e;const t=null!==(e=this.shadowRoot)&&void 0!==e?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{de?e.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet)):t.forEach((t=>{const s=document.createElement("style");s.textContent=t.cssText,e.appendChild(s)}))})(t,this.constructor.elementStyles),t}connectedCallback(){var e;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostConnected)||void 0===t?void 0:t.call(e)})),this.Πl&&(this.Πl(),this.Πo=this.Πl=void 0)}enableUpdating(e){}disconnectedCallback(){var e;null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostDisconnected)||void 0===t?void 0:t.call(e)})),this.Πo=new Promise((e=>this.Πl=e))}attributeChangedCallback(e,t,s){this.K(e,s)}"Πj"(e,t,s=ye){var i,o;const r=this.constructor.Πp(e,s);if(void 0!==r&&!0===s.reflect){const n=(null!==(o=null===(i=s.converter)||void 0===i?void 0:i.toAttribute)&&void 0!==o?o:ve.toAttribute)(t,s.type);this.Πh=e,null==n?this.removeAttribute(r):this.setAttribute(r,n),this.Πh=null}}K(e,t){var s,i,o;const r=this.constructor,n=r.Πm.get(e);if(void 0!==n&&this.Πh!==n){const e=r.getPropertyOptions(n),l=e.converter,a=null!==(o=null!==(i=null===(s=l)||void 0===s?void 0:s.fromAttribute)&&void 0!==i?i:"function"==typeof l?l:null)&&void 0!==o?o:ve.fromAttribute;this.Πh=n,this[n]=a(t,e.type),this.Πh=null}}requestUpdate(e,t,s){let i=!0;void 0!==e&&(((s=s||this.constructor.getPropertyOptions(e)).hasChanged||be)(this[e],t)?(this.L.has(e)||this.L.set(e,t),!0===s.reflect&&this.Πh!==e&&(void 0===this.Πk&&(this.Πk=new Map),this.Πk.set(e,s))):i=!1),!this.isUpdatePending&&i&&(this.Πg=this.Πq())}async"Πq"(){this.isUpdatePending=!0;try{for(await this.Πg;this.Πo;)await this.Πo}catch(e){Promise.reject(e)}const e=this.performUpdate();return null!=e&&await e,!this.isUpdatePending}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this.Πi&&(this.Πi.forEach(((e,t)=>this[t]=e)),this.Πi=void 0);let t=!1;const s=this.L;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),null===(e=this.ΠU)||void 0===e||e.forEach((e=>{var t;return null===(t=e.hostUpdate)||void 0===t?void 0:t.call(e)})),this.update(s)):this.Π$()}catch(e){throw t=!1,this.Π$(),e}t&&this.E(s)}willUpdate(e){}E(e){var t;null===(t=this.ΠU)||void 0===t||t.forEach((e=>{var t;return null===(t=e.hostUpdated)||void 0===t?void 0:t.call(e)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}"Π$"(){this.L=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.Πg}shouldUpdate(e){return!0}update(e){void 0!==this.Πk&&(this.Πk.forEach(((e,t)=>this.Πj(t,this[t],e))),this.Πk=void 0),this.Π$()}updated(e){}firstUpdated(e){}};we.finalized=!0,we.elementProperties=new Map,we.elementStyles=[],we.shadowRootOptions={mode:"open"},null===(te=(ee=globalThis).reactiveElementPlatformSupport)||void 0===te||te.call(ee,{ReactiveElement:we}),(null!==(se=(ie=globalThis).reactiveElementVersions)&&void 0!==se?se:ie.reactiveElementVersions=[]).push("1.0.0-rc.2"),(null!==(oe=(ce=globalThis).litElementVersions)&&void 0!==oe?oe:ce.litElementVersions=[]).push("3.0.0-rc.2");var xe=class extends we{constructor(){super(...arguments),this.renderOptions={host:this},this.Φt=void 0}createRenderRoot(){var e,t;const s=super.createRenderRoot();return null!==(e=(t=this.renderOptions).renderBefore)&&void 0!==e||(t.renderBefore=s.firstChild),s}update(e){const t=this.render();super.update(e),this.Φt=((e,t,s)=>{var i,o;const r=null!==(i=null==s?void 0:s.renderBefore)&&void 0!==i?i:t;let n=r._$litPart$;if(void 0===n){const e=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;r._$litPart$=n=new Z(t.insertBefore(L(),e),e,void 0,s)}return n.I(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null===(e=this.Φt)||void 0===e||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null===(e=this.Φt)||void 0===e||e.setConnected(!1)}render(){return N}};xe.finalized=!0,xe._$litElement$=!0,null===(ne=(re=globalThis).litElementHydrateSupport)||void 0===ne||ne.call(re,{LitElement:xe}),null===(ae=(le=globalThis).litElementPlatformSupport)||void 0===ae||ae.call(le,{LitElement:xe});var _e=e=>t=>{return"function"==typeof t?(s=e,i=t,window.customElements.define(s,i),i):((e,t)=>{const{kind:s,elements:i}=t;return{kind:s,elements:i,finisher(t){window.customElements.define(e,t)}}})(e,t);var s,i},ke=(e,t)=>"method"===t.kind&&t.descriptor&&!("value"in t.descriptor)?k(_({},t),{finisher(s){s.createProperty(t.key,e)}}):{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:t.key,initializer(){"function"==typeof t.initializer&&(this[t.key]=t.initializer.call(this))},finisher(s){s.createProperty(t.key,e)}};function Se(e){return(t,s)=>{return void 0!==s?(i=e,o=s,void t.constructor.createProperty(o,i)):ke(e,t);var i,o}}function ze(e){return Se(k(_({},e),{state:!0,attribute:!1}))}function Ce(e,t){return(({finisher:e,descriptor:t})=>(s,i)=>{var o;if(void 0===i){const i=null!==(o=s.originalKey)&&void 0!==o?o:s.key,r=null!=t?{kind:"method",placement:"prototype",key:i,descriptor:t(s.key)}:k(_({},s),{key:i});return null!=e&&(r.finisher=function(t){e(t,i)}),r}{const o=s.constructor;void 0!==t&&Object.defineProperty(s,i,t(i)),null==e||e(o,i)}})({descriptor:s=>{const i={get(){var t;return null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(e)},enumerable:!0,configurable:!0};if(t){const t="symbol"==typeof s?Symbol():"__"+s;i.get=function(){var s;return void 0===this[t]&&(this[t]=null===(s=this.renderRoot)||void 0===s?void 0:s.querySelector(e)),this[t]}}return i}})}var Te=e=>null!=e?e:V,Oe=1,$e=2,Ee=e=>(...t)=>({_$litDirective$:e,values:t}),Le=class{constructor(e){}T(e,t,s){this.Σdt=e,this.M=t,this.Σct=s}S(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},Ae=Ee(class extends Le{constructor(e){var t;if(super(e),e.type!==Oe||"class"!==e.name||(null===(t=e.strings)||void 0===t?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).filter((t=>e[t])).join(" ")}update(e,[t]){if(void 0===this.bt){this.bt=new Set;for(const e in t)t[e]&&this.bt.add(e);return this.render(t)}const s=e.element.classList;this.bt.forEach((e=>{e in t||(s.remove(e),this.bt.delete(e))}));for(const e in t){const i=!!t[e];i!==this.bt.has(e)&&(i?(s.add(e),this.bt.add(e)):(s.remove(e),this.bt.delete(e)))}return N}});function Me(e,t){return(s,i)=>{const{update:o}=s;t=Object.assign({waitUntilFirstUpdate:!1},t),s.update=function(s){if(s.has(e)){const o=s.get(e),r=this[e];o!==r&&((null==t?void 0:t.waitUntilFirstUpdate)&&!this.hasUpdated||this[i].call(this,o,r))}o.call(this,s)}}}function De(e){const t=e?e.assignedNodes({flatten:!0}):[];let s="";return[...t].map((e=>{e.nodeType===Node.TEXT_NODE&&(s+=e.textContent)})),s}function Pe(e,t){return t?null!==e.querySelector(`:scope > [slot="${t}"]`):[...e.childNodes].some((e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){if(!e.hasAttribute("slot"))return!0}return!1}))}function Ie(e,t,s){const i=new CustomEvent(t,Object.assign({bubbles:!0,cancelable:!1,composed:!0,detail:{}},s));return e.dispatchEvent(i),i}function He(e,t){return new Promise((s=>{e.addEventListener(t,(function i(o){o.target===e&&(e.removeEventListener(t,i),s())}))}))}var Ue=me`
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
`,je=me`
  ${Ue}
  ${me`
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
`,Be=0,Re=class extends xe{constructor(){super(...arguments),this.inputId="select-"+ ++Be,this.helpTextId=`select-help-text-${Be}`,this.labelId=`select-label-${Be}`,this.hasFocus=!1,this.hasHelpTextSlot=!1,this.hasLabelSlot=!1,this.isOpen=!1,this.displayLabel="",this.displayTags=[],this.multiple=!1,this.maxTagsVisible=3,this.disabled=!1,this.name="",this.placeholder="",this.size="medium",this.hoist=!1,this.value="",this.pill=!1,this.required=!1,this.clearable=!1,this.invalid=!1}connectedCallback(){super.connectedCallback(),this.handleSlotChange=this.handleSlotChange.bind(this),this.resizeObserver=new ResizeObserver((()=>this.resizeMenu())),this.updateComplete.then((()=>{this.resizeObserver.observe(this),this.shadowRoot.addEventListener("slotchange",this.handleSlotChange),this.syncItemsFromValue()}))}firstUpdated(){this.invalid=!this.input.checkValidity()}disconnectedCallback(){super.disconnectedCallback(),this.resizeObserver.unobserve(this),this.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}reportValidity(){return this.input.reportValidity()}setCustomValidity(e){this.input.setCustomValidity(e),this.invalid=!this.input.checkValidity()}getItemLabel(e){return De(e.shadowRoot.querySelector("slot:not([name])"))}getItems(){return[...this.querySelectorAll("sl-menu-item")]}getValueAsArray(){return this.multiple&&""===this.value?[]:Array.isArray(this.value)?this.value:[this.value]}handleBlur(){this.isOpen||(this.hasFocus=!1,Ie(this,"sl-blur"))}handleClearClick(e){e.stopPropagation(),this.value=this.multiple?[]:"",Ie(this,"sl-clear"),this.syncItemsFromValue()}handleDisabledChange(){this.disabled&&this.isOpen&&this.dropdown.hide(),this.input&&(this.input.disabled=this.disabled,this.invalid=!this.input.checkValidity())}handleFocus(){this.hasFocus||(this.hasFocus=!0,Ie(this,"sl-focus"))}handleKeyDown(e){const t=e.target,s=this.getItems(),i=s[0],o=s[s.length-1];if("sl-tag"!==t.tagName.toLowerCase())if("Tab"!==e.key){if(["ArrowDown","ArrowUp"].includes(e.key)){if(e.preventDefault(),this.isOpen||this.dropdown.show(),"ArrowDown"===e.key&&i)return this.menu.setCurrentItem(i),void i.focus();if("ArrowUp"===e.key&&o)return this.menu.setCurrentItem(o),void o.focus()}this.isOpen||1!==e.key.length||(e.stopPropagation(),e.preventDefault(),this.dropdown.show(),this.menu.typeToSelect(e.key))}else this.isOpen&&this.dropdown.hide()}handleLabelClick(){var e;(null==(e=this.shadowRoot)?void 0:e.querySelector(".select__box")).focus()}handleMenuSelect(e){const t=e.detail.item;this.multiple?this.value=this.value.includes(t.value)?this.value.filter((e=>e!==t.value)):[...this.value,t.value]:this.value=t.value,this.syncItemsFromValue()}handleMenuShow(){this.resizeMenu(),this.isOpen=!0}handleMenuHide(){this.isOpen=!1,this.box.focus()}handleMultipleChange(){const e=this.getValueAsArray();this.value=this.multiple?e:e[0]||"",this.syncItemsFromValue()}async handleSlotChange(){this.hasHelpTextSlot=Pe(this,"help-text"),this.hasLabelSlot=Pe(this,"label");const e=this.getItems();await Promise.all(e.map((e=>e.render))).then((()=>this.syncItemsFromValue()))}handleTagInteraction(e){e.composedPath().find((e=>{if(e instanceof HTMLElement){return e.classList.contains("tag__clear")}return!1}))&&e.stopPropagation()}async handleValueChange(){this.syncItemsFromValue(),await this.updateComplete,this.invalid=!this.input.checkValidity(),Ie(this,"sl-change")}resizeMenu(){var e;const t=null==(e=this.shadowRoot)?void 0:e.querySelector(".select__box");this.menu.style.width=`${t.clientWidth}px`,this.dropdown&&this.dropdown.reposition()}syncItemsFromValue(){const e=this.getItems(),t=this.getValueAsArray();if(e.map((e=>e.checked=t.includes(e.value))),this.multiple){const s=e.filter((e=>t.includes(e.value)));if(this.displayLabel=s[0]?this.getItemLabel(s[0]):"",this.displayTags=s.map((e=>R`
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
      class=${Ae({"form-control":!0,"form-control--small":"small"===e.size,"form-control--medium":"medium"===e.size,"form-control--large":"large"===e.size,"form-control--has-label":s,"form-control--has-help-text":i})}
    >
      <label
        part="label"
        id=${Te(e.labelId)}
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
        id=${Te(e.helpTextId)}
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
          class=${Ae({select:!0,"select--open":this.isOpen,"select--empty":0===(null==(e=this.value)?void 0:e.length),"select--focused":this.hasFocus,"select--clearable":this.clearable,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--has-tags":this.multiple&&this.displayTags.length>0,"select--placeholder-visible":""===this.displayLabel,"select--small":"small"===this.size,"select--medium":"medium"===this.size,"select--large":"large"===this.size,"select--pill":this.pill,"select--invalid":this.invalid})}
          @sl-show=${this.handleMenuShow}
          @sl-hide=${this.handleMenuHide}
        >
          <div
            slot="trigger"
            id=${this.inputId}
            class="select__box"
            role="combobox"
            aria-labelledby=${Te((s={label:this.label,labelId:this.labelId,hasLabelSlot:this.hasLabelSlot,helpText:this.helpText,helpTextId:this.helpTextId,hasHelpTextSlot:this.hasHelpTextSlot},[s.label||s.hasLabelSlot?s.labelId:"",s.helpText||s.hasHelpTextSlot?s.helpTextId:""].filter((e=>e)).join(" ")||void 0))}
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
      `);var s}};Re.styles=je,S([Ce(".select")],Re.prototype,"dropdown",2),S([Ce(".select__box")],Re.prototype,"box",2),S([Ce(".select__hidden-select")],Re.prototype,"input",2),S([Ce(".select__menu")],Re.prototype,"menu",2),S([ze()],Re.prototype,"hasFocus",2),S([ze()],Re.prototype,"hasHelpTextSlot",2),S([ze()],Re.prototype,"hasLabelSlot",2),S([ze()],Re.prototype,"isOpen",2),S([ze()],Re.prototype,"displayLabel",2),S([ze()],Re.prototype,"displayTags",2),S([Se({type:Boolean,reflect:!0})],Re.prototype,"multiple",2),S([Se({attribute:"max-tags-visible",type:Number})],Re.prototype,"maxTagsVisible",2),S([Se({type:Boolean,reflect:!0})],Re.prototype,"disabled",2),S([Se()],Re.prototype,"name",2),S([Se()],Re.prototype,"placeholder",2),S([Se()],Re.prototype,"size",2),S([Se({type:Boolean})],Re.prototype,"hoist",2),S([Se()],Re.prototype,"value",2),S([Se({type:Boolean,reflect:!0})],Re.prototype,"pill",2),S([Se()],Re.prototype,"label",2),S([Se({attribute:"help-text"})],Re.prototype,"helpText",2),S([Se({type:Boolean,reflect:!0})],Re.prototype,"required",2),S([Se({type:Boolean})],Re.prototype,"clearable",2),S([Se({type:Boolean,reflect:!0})],Re.prototype,"invalid",2),S([Me("disabled")],Re.prototype,"handleDisabledChange",1),S([Me("multiple")],Re.prototype,"handleMultipleChange",1),S([Me("helpText"),Me("label")],Re.prototype,"handleSlotChange",1),S([Me("value",{waitUntilFirstUpdate:!0})],Re.prototype,"handleValueChange",1),Re=S([_e("sl-select")],Re);var Ne=me`
  ${Ue}

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
`,Ve=class extends xe{constructor(){super(...arguments),this.type="primary",this.size="medium",this.pill=!1,this.clearable=!1}handleClearClick(){Ie(this,"sl-clear")}render(){return R`
      <span
        part="base"
        class=${Ae({tag:!0,"tag--primary":"primary"===this.type,"tag--success":"success"===this.type,"tag--info":"info"===this.type,"tag--warning":"warning"===this.type,"tag--danger":"danger"===this.type,"tag--text":"text"===this.type,"tag--small":"small"===this.size,"tag--medium":"medium"===this.size,"tag--large":"large"===this.size,"tag--pill":this.pill,"tag--clearable":this.clearable})}
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
    `}};Ve.styles=Ne,S([Se({reflect:!0})],Ve.prototype,"type",2),S([Se({reflect:!0})],Ve.prototype,"size",2),S([Se({type:Boolean,reflect:!0})],Ve.prototype,"pill",2),S([Se({type:Boolean})],Ve.prototype,"clearable",2),Ve=S([_e("sl-tag")],Ve);var qe=me`
  ${Ue}

  :host {
    display: block;
  }

  .menu {
    padding: var(--sl-spacing-x-small) 0;
  }
  .menu:focus {
    outline: none;
  }
`,We=class extends xe{constructor(){super(...arguments),this.typeToSelectString=""}getAllItems(e={includeDisabled:!0}){return[...this.defaultSlot.assignedElements({flatten:!0})].filter((t=>"menuitem"===t.getAttribute("role")&&!(!(null==e?void 0:e.includeDisabled)&&t.disabled)))}getCurrentItem(){return this.getAllItems({includeDisabled:!1}).find((e=>"0"===e.getAttribute("tabindex")))}setCurrentItem(e){const t=this.getAllItems({includeDisabled:!1});let s=e.disabled?t[0]:e;t.map((e=>e.setAttribute("tabindex",e===s?"0":"-1")))}typeToSelect(e){const t=this.getAllItems({includeDisabled:!1});clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=setTimeout((()=>this.typeToSelectString=""),750),this.typeToSelectString+=e.toLowerCase();for(const e of t){if(De(e.shadowRoot.querySelector("slot:not([name])")).toLowerCase().trim().substring(0,this.typeToSelectString.length)===this.typeToSelectString){e.focus();break}}}handleClick(e){const t=e.target.closest("sl-menu-item");t&&!t.disabled&&Ie(this,"sl-select",{detail:{item:t}})}handleKeyDown(e){if("Enter"===e.key){const t=this.getCurrentItem();e.preventDefault(),t&&t.click()}if(" "===e.key&&e.preventDefault(),["ArrowDown","ArrowUp","Home","End"].includes(e.key)){const t=this.getAllItems({includeDisabled:!1}),s=this.getCurrentItem();let i=s?t.indexOf(s):0;if(t.length)return e.preventDefault(),"ArrowDown"===e.key?i++:"ArrowUp"===e.key?i--:"Home"===e.key?i=0:"End"===e.key&&(i=t.length-1),i<0&&(i=0),i>t.length-1&&(i=t.length-1),this.setCurrentItem(t[i]),void t[i].focus()}this.typeToSelect(e.key)}handleMouseDown(e){const t=e.target;"menuitem"===t.getAttribute("role")&&(this.setCurrentItem(t),t.focus())}handleSlotChange(){const e=this.getAllItems({includeDisabled:!1});e.length&&this.setCurrentItem(e[0])}render(){return R`
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
    `}};function Fe(e){var t=e.getBoundingClientRect();return{width:t.width,height:t.height,top:t.top,right:t.right,bottom:t.bottom,left:t.left,x:t.left,y:t.top}}function Ke(e){if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function Ze(e){var t=Ke(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function Xe(e){return e instanceof Ke(e).Element||e instanceof Element}function Ge(e){return e instanceof Ke(e).HTMLElement||e instanceof HTMLElement}function Je(e){return"undefined"!=typeof ShadowRoot&&(e instanceof Ke(e).ShadowRoot||e instanceof ShadowRoot)}function Ye(e){return e?(e.nodeName||"").toLowerCase():null}function Qe(e){return((Xe(e)?e.ownerDocument:e.document)||window.document).documentElement}function et(e){return Fe(Qe(e)).left+Ze(e).scrollLeft}function tt(e){return Ke(e).getComputedStyle(e)}function st(e){var t=tt(e),s=t.overflow,i=t.overflowX,o=t.overflowY;return/auto|scroll|overlay|hidden/.test(s+o+i)}function it(e,t,s){void 0===s&&(s=!1);var i,o,r=Qe(t),n=Fe(e),l=Ge(t),a={scrollLeft:0,scrollTop:0},c={x:0,y:0};return(l||!l&&!s)&&(("body"!==Ye(t)||st(r))&&(a=(i=t)!==Ke(i)&&Ge(i)?{scrollLeft:(o=i).scrollLeft,scrollTop:o.scrollTop}:Ze(i)),Ge(t)?((c=Fe(t)).x+=t.clientLeft,c.y+=t.clientTop):r&&(c.x=et(r))),{x:n.left+a.scrollLeft-c.x,y:n.top+a.scrollTop-c.y,width:n.width,height:n.height}}function ot(e){return{x:e.offsetLeft,y:e.offsetTop,width:e.offsetWidth,height:e.offsetHeight}}function rt(e){return"html"===Ye(e)?e:e.assignedSlot||e.parentNode||(Je(e)?e.host:null)||Qe(e)}function nt(e){return["html","body","#document"].indexOf(Ye(e))>=0?e.ownerDocument.body:Ge(e)&&st(e)?e:nt(rt(e))}function lt(e,t){var s;void 0===t&&(t=[]);var i=nt(e),o=i===(null==(s=e.ownerDocument)?void 0:s.body),r=Ke(i),n=o?[r].concat(r.visualViewport||[],st(i)?i:[]):i,l=t.concat(n);return o?l:l.concat(lt(rt(n)))}function at(e){return["table","td","th"].indexOf(Ye(e))>=0}function ct(e){return Ge(e)&&"fixed"!==tt(e).position?e.offsetParent:null}function dt(e){for(var t=Ke(e),s=ct(e);s&&at(s)&&"static"===tt(s).position;)s=ct(s);return s&&("html"===Ye(s)||"body"===Ye(s)&&"static"===tt(s).position)?t:s||function(e){for(var t=navigator.userAgent.toLowerCase().includes("firefox"),s=rt(e);Ge(s)&&["html","body"].indexOf(Ye(s))<0;){var i=tt(s);if("none"!==i.transform||"none"!==i.perspective||"paint"===i.contain||["transform","perspective"].includes(i.willChange)||t&&"filter"===i.willChange||t&&i.filter&&"none"!==i.filter)return s;s=s.parentNode}return null}(e)||t}We.styles=qe,S([Ce(".menu")],We.prototype,"menu",2),S([Ce("slot")],We.prototype,"defaultSlot",2),We=S([_e("sl-menu")],We);var ht="top",pt="bottom",ut="right",ft="left",mt=[ht,pt,ut,ft],gt=mt.reduce((function(e,t){return e.concat([t+"-start",t+"-end"])}),[]),vt=[].concat(mt,["auto"]).reduce((function(e,t){return e.concat([t,t+"-start",t+"-end"])}),[]),bt=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function yt(e){var t=new Map,s=new Set,i=[];function o(e){s.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!s.has(e)){var i=t.get(e);i&&o(i)}})),i.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){s.has(e.name)||o(e)})),i}function wt(e){return e.split("-")[0]}var xt=Math.max,_t=Math.min,kt=Math.round;function St(e,t){var s=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(s&&Je(s)){var i=t;do{if(i&&e.isSameNode(i))return!0;i=i.parentNode||i.host}while(i)}return!1}function zt(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function Ct(e,t){return"viewport"===t?zt(function(e){var t=Ke(e),s=Qe(e),i=t.visualViewport,o=s.clientWidth,r=s.clientHeight,n=0,l=0;return i&&(o=i.width,r=i.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(n=i.offsetLeft,l=i.offsetTop)),{width:o,height:r,x:n+et(e),y:l}}(e)):Ge(t)?function(e){var t=Fe(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(t):zt(function(e){var t,s=Qe(e),i=Ze(e),o=null==(t=e.ownerDocument)?void 0:t.body,r=xt(s.scrollWidth,s.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),n=xt(s.scrollHeight,s.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),l=-i.scrollLeft+et(e),a=-i.scrollTop;return"rtl"===tt(o||s).direction&&(l+=xt(s.clientWidth,o?o.clientWidth:0)-r),{width:r,height:n,x:l,y:a}}(Qe(e)))}function Tt(e,t,s){var i="clippingParents"===t?function(e){var t=lt(rt(e)),s=["absolute","fixed"].indexOf(tt(e).position)>=0&&Ge(e)?dt(e):e;return Xe(s)?t.filter((function(e){return Xe(e)&&St(e,s)&&"body"!==Ye(e)})):[]}(e):[].concat(t),o=[].concat(i,[s]),r=o[0],n=o.reduce((function(t,s){var i=Ct(e,s);return t.top=xt(i.top,t.top),t.right=_t(i.right,t.right),t.bottom=_t(i.bottom,t.bottom),t.left=xt(i.left,t.left),t}),Ct(e,r));return n.width=n.right-n.left,n.height=n.bottom-n.top,n.x=n.left,n.y=n.top,n}function Ot(e){return e.split("-")[1]}function $t(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function Et(e){var t,s=e.reference,i=e.element,o=e.placement,r=o?wt(o):null,n=o?Ot(o):null,l=s.x+s.width/2-i.width/2,a=s.y+s.height/2-i.height/2;switch(r){case ht:t={x:l,y:s.y-i.height};break;case pt:t={x:l,y:s.y+s.height};break;case ut:t={x:s.x+s.width,y:a};break;case ft:t={x:s.x-i.width,y:a};break;default:t={x:s.x,y:s.y}}var c=r?$t(r):null;if(null!=c){var d="y"===c?"height":"width";switch(n){case"start":t[c]=t[c]-(s[d]/2-i[d]/2);break;case"end":t[c]=t[c]+(s[d]/2-i[d]/2)}}return t}function Lt(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function At(e,t){return t.reduce((function(t,s){return t[s]=e,t}),{})}function Mt(e,t){void 0===t&&(t={});var s=t,i=s.placement,o=void 0===i?e.placement:i,r=s.boundary,n=void 0===r?"clippingParents":r,l=s.rootBoundary,a=void 0===l?"viewport":l,c=s.elementContext,d=void 0===c?"popper":c,h=s.altBoundary,p=void 0!==h&&h,u=s.padding,f=void 0===u?0:u,m=Lt("number"!=typeof f?f:At(f,mt)),g="popper"===d?"reference":"popper",v=e.elements.reference,b=e.rects.popper,y=e.elements[p?g:d],w=Tt(Xe(y)?y:y.contextElement||Qe(e.elements.popper),n,a),x=Fe(v),_=Et({reference:x,element:b,strategy:"absolute",placement:o}),k=zt(Object.assign({},b,_)),S="popper"===d?k:x,z={top:w.top-S.top+m.top,bottom:S.bottom-w.bottom+m.bottom,left:w.left-S.left+m.left,right:S.right-w.right+m.right},C=e.modifiersData.offset;if("popper"===d&&C){var T=C[o];Object.keys(z).forEach((function(e){var t=[ut,pt].indexOf(e)>=0?1:-1,s=[ht,pt].indexOf(e)>=0?"y":"x";z[e]+=T[s]*t}))}return z}var Dt={placement:"bottom",modifiers:[],strategy:"absolute"};function Pt(){for(var e=arguments.length,t=new Array(e),s=0;s<e;s++)t[s]=arguments[s];return!t.some((function(e){return!(e&&"function"==typeof e.getBoundingClientRect)}))}function It(e){void 0===e&&(e={});var t=e,s=t.defaultModifiers,i=void 0===s?[]:s,o=t.defaultOptions,r=void 0===o?Dt:o;return function(e,t,s){void 0===s&&(s=r);var o,n,l={placement:"bottom",orderedModifiers:[],options:Object.assign({},Dt,r),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},a=[],c=!1,d={state:l,setOptions:function(s){h(),l.options=Object.assign({},r,l.options,s),l.scrollParents={reference:Xe(e)?lt(e):e.contextElement?lt(e.contextElement):[],popper:lt(t)};var o,n,c=function(e){var t=yt(e);return bt.reduce((function(e,s){return e.concat(t.filter((function(e){return e.phase===s})))}),[])}((o=[].concat(i,l.options.modifiers),n=o.reduce((function(e,t){var s=e[t.name];return e[t.name]=s?Object.assign({},s,t,{options:Object.assign({},s.options,t.options),data:Object.assign({},s.data,t.data)}):t,e}),{}),Object.keys(n).map((function(e){return n[e]}))));return l.orderedModifiers=c.filter((function(e){return e.enabled})),l.orderedModifiers.forEach((function(e){var t=e.name,s=e.options,i=void 0===s?{}:s,o=e.effect;if("function"==typeof o){var r=o({state:l,name:t,instance:d,options:i}),n=function(){};a.push(r||n)}})),d.update()},forceUpdate:function(){if(!c){var e=l.elements,t=e.reference,s=e.popper;if(Pt(t,s)){l.rects={reference:it(t,dt(s),"fixed"===l.options.strategy),popper:ot(s)},l.reset=!1,l.placement=l.options.placement,l.orderedModifiers.forEach((function(e){return l.modifiersData[e.name]=Object.assign({},e.data)}));for(var i=0;i<l.orderedModifiers.length;i++)if(!0!==l.reset){var o=l.orderedModifiers[i],r=o.fn,n=o.options,a=void 0===n?{}:n,h=o.name;"function"==typeof r&&(l=r({state:l,options:a,name:h,instance:d})||l)}else l.reset=!1,i=-1}}},update:(o=function(){return new Promise((function(e){d.forceUpdate(),e(l)}))},function(){return n||(n=new Promise((function(e){Promise.resolve().then((function(){n=void 0,e(o())}))}))),n}),destroy:function(){h(),c=!0}};if(!Pt(e,t))return d;function h(){a.forEach((function(e){return e()})),a=[]}return d.setOptions(s).then((function(e){!c&&s.onFirstUpdate&&s.onFirstUpdate(e)})),d}}var Ht={passive:!0};var Ut={top:"auto",right:"auto",bottom:"auto",left:"auto"};function jt(e){var t,s=e.popper,i=e.popperRect,o=e.placement,r=e.offsets,n=e.position,l=e.gpuAcceleration,a=e.adaptive,c=e.roundOffsets,d=!0===c?function(e){var t=e.x,s=e.y,i=window.devicePixelRatio||1;return{x:kt(kt(t*i)/i)||0,y:kt(kt(s*i)/i)||0}}(r):"function"==typeof c?c(r):r,h=d.x,p=void 0===h?0:h,u=d.y,f=void 0===u?0:u,m=r.hasOwnProperty("x"),g=r.hasOwnProperty("y"),v=ft,b=ht,y=window;if(a){var w=dt(s),x="clientHeight",_="clientWidth";w===Ke(s)&&"static"!==tt(w=Qe(s)).position&&(x="scrollHeight",_="scrollWidth"),o===ht&&(b=pt,f-=w[x]-i.height,f*=l?1:-1),o===ft&&(v=ut,p-=w[_]-i.width,p*=l?1:-1)}var k,S=Object.assign({position:n},a&&Ut);return l?Object.assign({},S,((k={})[b]=g?"0":"",k[v]=m?"0":"",k.transform=(y.devicePixelRatio||1)<2?"translate("+p+"px, "+f+"px)":"translate3d("+p+"px, "+f+"px, 0)",k)):Object.assign({},S,((t={})[b]=g?f+"px":"",t[v]=m?p+"px":"",t.transform="",t))}var Bt={left:"right",right:"left",bottom:"top",top:"bottom"};function Rt(e){return e.replace(/left|right|bottom|top/g,(function(e){return Bt[e]}))}var Nt={start:"end",end:"start"};function Vt(e){return e.replace(/start|end/g,(function(e){return Nt[e]}))}function qt(e,t,s){return xt(e,_t(t,s))}function Wt(e,t,s){return void 0===s&&(s={x:0,y:0}),{top:e.top-t.height-s.y,right:e.right-t.width+s.x,bottom:e.bottom-t.height+s.y,left:e.left-t.width-s.x}}function Ft(e){return[ht,ut,pt,ft].some((function(t){return e[t]>=0}))}var Kt=It({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,s=e.instance,i=e.options,o=i.scroll,r=void 0===o||o,n=i.resize,l=void 0===n||n,a=Ke(t.elements.popper),c=[].concat(t.scrollParents.reference,t.scrollParents.popper);return r&&c.forEach((function(e){e.addEventListener("scroll",s.update,Ht)})),l&&a.addEventListener("resize",s.update,Ht),function(){r&&c.forEach((function(e){e.removeEventListener("scroll",s.update,Ht)})),l&&a.removeEventListener("resize",s.update,Ht)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,s=e.name;t.modifiersData[s]=Et({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,s=e.options,i=s.gpuAcceleration,o=void 0===i||i,r=s.adaptive,n=void 0===r||r,l=s.roundOffsets,a=void 0===l||l,c={placement:wt(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:o};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,jt(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:n,roundOffsets:a})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,jt(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:a})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var s=t.styles[e]||{},i=t.attributes[e]||{},o=t.elements[e];Ge(o)&&Ye(o)&&(Object.assign(o.style,s),Object.keys(i).forEach((function(e){var t=i[e];!1===t?o.removeAttribute(e):o.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,s={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,s.popper),t.styles=s,t.elements.arrow&&Object.assign(t.elements.arrow.style,s.arrow),function(){Object.keys(t.elements).forEach((function(e){var i=t.elements[e],o=t.attributes[e]||{},r=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:s[e]).reduce((function(e,t){return e[t]="",e}),{});Ge(i)&&Ye(i)&&(Object.assign(i.style,r),Object.keys(o).forEach((function(e){i.removeAttribute(e)})))}))}},requires:["computeStyles"]},{name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,s=e.options,i=e.name,o=s.offset,r=void 0===o?[0,0]:o,n=vt.reduce((function(e,s){return e[s]=function(e,t,s){var i=wt(e),o=[ft,ht].indexOf(i)>=0?-1:1,r="function"==typeof s?s(Object.assign({},t,{placement:e})):s,n=r[0],l=r[1];return n=n||0,l=(l||0)*o,[ft,ut].indexOf(i)>=0?{x:l,y:n}:{x:n,y:l}}(s,t.rects,r),e}),{}),l=n[t.placement],a=l.x,c=l.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=a,t.modifiersData.popperOffsets.y+=c),t.modifiersData[i]=n}},{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,s=e.options,i=e.name;if(!t.modifiersData[i]._skip){for(var o=s.mainAxis,r=void 0===o||o,n=s.altAxis,l=void 0===n||n,a=s.fallbackPlacements,c=s.padding,d=s.boundary,h=s.rootBoundary,p=s.altBoundary,u=s.flipVariations,f=void 0===u||u,m=s.allowedAutoPlacements,g=t.options.placement,v=wt(g),b=a||(v===g||!f?[Rt(g)]:function(e){if("auto"===wt(e))return[];var t=Rt(e);return[Vt(e),t,Vt(t)]}(g)),y=[g].concat(b).reduce((function(e,s){return e.concat("auto"===wt(s)?function(e,t){void 0===t&&(t={});var s=t,i=s.placement,o=s.boundary,r=s.rootBoundary,n=s.padding,l=s.flipVariations,a=s.allowedAutoPlacements,c=void 0===a?vt:a,d=Ot(i),h=d?l?gt:gt.filter((function(e){return Ot(e)===d})):mt,p=h.filter((function(e){return c.indexOf(e)>=0}));0===p.length&&(p=h);var u=p.reduce((function(t,s){return t[s]=Mt(e,{placement:s,boundary:o,rootBoundary:r,padding:n})[wt(s)],t}),{});return Object.keys(u).sort((function(e,t){return u[e]-u[t]}))}(t,{placement:s,boundary:d,rootBoundary:h,padding:c,flipVariations:f,allowedAutoPlacements:m}):s)}),[]),w=t.rects.reference,x=t.rects.popper,_=new Map,k=!0,S=y[0],z=0;z<y.length;z++){var C=y[z],T=wt(C),O="start"===Ot(C),$=[ht,pt].indexOf(T)>=0,E=$?"width":"height",L=Mt(t,{placement:C,boundary:d,rootBoundary:h,altBoundary:p,padding:c}),A=$?O?ut:ft:O?pt:ht;w[E]>x[E]&&(A=Rt(A));var M=Rt(A),D=[];if(r&&D.push(L[T]<=0),l&&D.push(L[A]<=0,L[M]<=0),D.every((function(e){return e}))){S=C,k=!1;break}_.set(C,D)}if(k)for(var P=function(e){var t=y.find((function(t){var s=_.get(t);if(s)return s.slice(0,e).every((function(e){return e}))}));if(t)return S=t,"break"},I=f?3:1;I>0;I--){if("break"===P(I))break}t.placement!==S&&(t.modifiersData[i]._skip=!0,t.placement=S,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},{name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,s=e.options,i=e.name,o=s.mainAxis,r=void 0===o||o,n=s.altAxis,l=void 0!==n&&n,a=s.boundary,c=s.rootBoundary,d=s.altBoundary,h=s.padding,p=s.tether,u=void 0===p||p,f=s.tetherOffset,m=void 0===f?0:f,g=Mt(t,{boundary:a,rootBoundary:c,padding:h,altBoundary:d}),v=wt(t.placement),b=Ot(t.placement),y=!b,w=$t(v),x="x"===w?"y":"x",_=t.modifiersData.popperOffsets,k=t.rects.reference,S=t.rects.popper,z="function"==typeof m?m(Object.assign({},t.rects,{placement:t.placement})):m,C={x:0,y:0};if(_){if(r||l){var T="y"===w?ht:ft,O="y"===w?pt:ut,$="y"===w?"height":"width",E=_[w],L=_[w]+g[T],A=_[w]-g[O],M=u?-S[$]/2:0,D="start"===b?k[$]:S[$],P="start"===b?-S[$]:-k[$],I=t.elements.arrow,H=u&&I?ot(I):{width:0,height:0},U=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},j=U[T],B=U[O],R=qt(0,k[$],H[$]),N=y?k[$]/2-M-R-j-z:D-R-j-z,V=y?-k[$]/2+M+R+B+z:P+R+B+z,q=t.elements.arrow&&dt(t.elements.arrow),W=q?"y"===w?q.clientTop||0:q.clientLeft||0:0,F=t.modifiersData.offset?t.modifiersData.offset[t.placement][w]:0,K=_[w]+N-F-W,Z=_[w]+V-F;if(r){var X=qt(u?_t(L,K):L,E,u?xt(A,Z):A);_[w]=X,C[w]=X-E}if(l){var G="x"===w?ht:ft,J="x"===w?pt:ut,Y=_[x],Q=Y+g[G],ee=Y-g[J],te=qt(u?_t(Q,K):Q,Y,u?xt(ee,Z):ee);_[x]=te,C[x]=te-Y}}t.modifiersData[i]=C}},requiresIfExists:["offset"]},{name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,s=e.state,i=e.name,o=e.options,r=s.elements.arrow,n=s.modifiersData.popperOffsets,l=wt(s.placement),a=$t(l),c=[ft,ut].indexOf(l)>=0?"height":"width";if(r&&n){var d=function(e,t){return Lt("number"!=typeof(e="function"==typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:At(e,mt))}(o.padding,s),h=ot(r),p="y"===a?ht:ft,u="y"===a?pt:ut,f=s.rects.reference[c]+s.rects.reference[a]-n[a]-s.rects.popper[c],m=n[a]-s.rects.reference[a],g=dt(r),v=g?"y"===a?g.clientHeight||0:g.clientWidth||0:0,b=f/2-m/2,y=d[p],w=v-h[c]-d[u],x=v/2-h[c]/2+b,_=qt(y,x,w),k=a;s.modifiersData[i]=((t={})[k]=_,t.centerOffset=_-x,t)}},effect:function(e){var t=e.state,s=e.options.element,i=void 0===s?"[data-popper-arrow]":s;null!=i&&("string"!=typeof i||(i=t.elements.popper.querySelector(i)))&&St(t.elements.popper,i)&&(t.elements.arrow=i)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]},{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,s=e.name,i=t.rects.reference,o=t.rects.popper,r=t.modifiersData.preventOverflow,n=Mt(t,{elementContext:"reference"}),l=Mt(t,{altBoundary:!0}),a=Wt(n,i),c=Wt(l,o,r),d=Ft(a),h=Ft(c);t.modifiersData[s]={referenceClippingOffsets:a,popperEscapeOffsets:c,isReferenceHidden:d,hasPopperEscaped:h},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":d,"data-popper-escaped":h})}}]});function Zt(e){const t=e.tagName.toLowerCase();return"-1"!==e.getAttribute("tabindex")&&(!e.hasAttribute("disabled")&&((!e.hasAttribute("aria-disabled")||"false"===e.getAttribute("aria-disabled"))&&(!("input"===t&&"radio"===e.getAttribute("type")&&!e.hasAttribute("checked"))&&(!!e.offsetParent&&("hidden"!==window.getComputedStyle(e).visibility&&(!("audio"!==t&&"video"!==t||!e.hasAttribute("controls"))||(!!e.hasAttribute("tabindex")||(!(!e.hasAttribute("contenteditable")||"false"===e.getAttribute("contenteditable"))||["button","input","select","textarea","a","audio","video","summary"].includes(t)))))))))}function Xt(e,t,s="vertical",i="smooth"){const o=function(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}(e,t),r=o.top+t.scrollTop,n=o.left+t.scrollLeft,l=t.scrollLeft,a=t.scrollLeft+t.offsetWidth,c=t.scrollTop,d=t.scrollTop+t.offsetHeight;"horizontal"!==s&&"both"!==s||(n<l?t.scrollTo({left:n,behavior:i}):n+e.clientWidth>a&&t.scrollTo({left:n-t.offsetWidth+e.clientWidth,behavior:i})),"vertical"!==s&&"both"!==s||(r<c?t.scrollTo({top:r,behavior:i}):r+e.clientHeight>d&&t.scrollTo({top:r-t.offsetHeight+e.clientHeight,behavior:i}))}function Gt(e,t,s){return new Promise((async i=>{if((null==s?void 0:s.duration)===1/0)throw new Error("Promise-based animations must be finite.");const o=e.animate(t,k(_({},s),{duration:Jt()?0:s.duration}));o.addEventListener("cancel",i,{once:!0}),o.addEventListener("finish",i,{once:!0})}))}function Jt(){const e=window.matchMedia("(prefers-reduced-motion: reduce)");return null==e?void 0:e.matches}function Yt(e){return Promise.all(e.getAnimations().map((e=>new Promise((t=>{const s=requestAnimationFrame(t);e.addEventListener("cancel",(()=>s),{once:!0}),e.addEventListener("finish",(()=>s),{once:!0}),e.cancel()})))))}var Qt=new Map,es=new WeakMap;function ts(e,t){Qt.set(e,function(e){return null!=e?e:{keyframes:[],options:{duration:0}}}(t))}function ss(e,t){const s=es.get(e);if(s&&s[t])return s[t];const i=Qt.get(t);return i||{keyframes:[],options:{duration:0}}}var is=me`
  ${Ue}

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
`,os=0,rs=class extends xe{constructor(){super(...arguments),this.componentId="dropdown-"+ ++os,this.open=!1,this.placement="bottom-start",this.disabled=!1,this.stayOpenOnSelect=!1,this.distance=2,this.skidding=0,this.hoist=!1}connectedCallback(){super.connectedCallback(),this.handleMenuItemActivate=this.handleMenuItemActivate.bind(this),this.handlePanelSelect=this.handlePanelSelect.bind(this),this.handleDocumentKeyDown=this.handleDocumentKeyDown.bind(this),this.handleDocumentMouseDown=this.handleDocumentMouseDown.bind(this),this.containingElement||(this.containingElement=this),this.updateComplete.then((()=>{this.popover=Kt(this.trigger,this.positioner,{placement:this.placement,strategy:this.hoist?"fixed":"absolute",modifiers:[{name:"flip",options:{boundary:"viewport"}},{name:"offset",options:{offset:[this.skidding,this.distance]}}]})}))}firstUpdated(){this.panel.hidden=!this.open}disconnectedCallback(){super.disconnectedCallback(),this.hide(),this.popover.destroy()}focusOnTrigger(){const e=this.trigger.querySelector("slot").assignedElements({flatten:!0})[0];e&&"function"==typeof e.focus&&e.focus()}getMenu(){return this.panel.querySelector("slot").assignedElements({flatten:!0}).filter((e=>"sl-menu"===e.tagName.toLowerCase()))[0]}handleDocumentKeyDown(e){var t;if("Escape"===e.key)return this.hide(),void this.focusOnTrigger();if("Tab"===e.key){if(this.open&&"sl-menu-item"===(null==(t=document.activeElement)?void 0:t.tagName.toLowerCase()))return e.preventDefault(),this.hide(),void this.focusOnTrigger();setTimeout((()=>{var e,t;const s=this.containingElement.getRootNode()instanceof ShadowRoot?null==(t=null==(e=document.activeElement)?void 0:e.shadowRoot)?void 0:t.activeElement:document.activeElement;(null==s?void 0:s.closest(this.containingElement.tagName.toLowerCase()))===this.containingElement||this.hide()}))}}handleDocumentMouseDown(e){e.composedPath().includes(this.containingElement)||this.hide()}handleMenuItemActivate(e){Xt(e.target,this.panel)}handlePanelSelect(e){const t=e.target;this.stayOpenOnSelect||"sl-menu"!==t.tagName.toLowerCase()||(this.hide(),this.focusOnTrigger())}handlePopoverOptionsChange(){this.popover&&this.popover.setOptions({placement:this.placement,strategy:this.hoist?"fixed":"absolute",modifiers:[{name:"flip",options:{boundary:"viewport"}},{name:"offset",options:{offset:[this.skidding,this.distance]}}]})}handleTriggerClick(){this.open?this.hide():this.show()}handleTriggerKeyDown(e){const t=this.getMenu(),s=t?[...t.querySelectorAll("sl-menu-item")]:[],i=s[0],o=s[s.length-1];if("Escape"===e.key)return this.focusOnTrigger(),void this.hide();if([" ","Enter"].includes(e.key))return e.preventDefault(),void(this.open?this.hide():this.show());if(["ArrowDown","ArrowUp"].includes(e.key)){if(e.preventDefault(),this.open||this.show(),"ArrowDown"===e.key&&i){return this.getMenu().setCurrentItem(i),void i.focus()}if("ArrowUp"===e.key&&o)return t.setCurrentItem(o),void o.focus()}this.open&&t&&!["Tab","Shift","Meta","Ctrl","Alt"].includes(e.key)&&t.typeToSelect(e.key)}handleTriggerKeyUp(e){" "===e.key&&e.preventDefault()}handleTriggerSlotChange(){this.updateAccessibleTrigger()}updateAccessibleTrigger(){if(this.trigger){const e=this.trigger.querySelector("slot").assignedElements({flatten:!0}).find((e=>function(e){const t=[];return function e(s){s instanceof HTMLElement&&(t.push(s),s.shadowRoot&&"open"===s.shadowRoot.mode&&e(s.shadowRoot)),[...s.querySelectorAll("*")].map((t=>e(t)))}(e),{start:t.find((e=>Zt(e)))||null,end:t.reverse().find((e=>Zt(e)))||null}}(e).start));e&&(e.setAttribute("aria-haspopup","true"),e.setAttribute("aria-expanded",this.open?"true":"false"))}}async show(){if(!this.open)return this.open=!0,He(this,"sl-after-show")}async hide(){if(this.open)return this.open=!1,He(this,"sl-after-hide")}reposition(){this.open&&this.popover.update()}async handleOpenChange(){if(!this.disabled)if(this.updateAccessibleTrigger(),this.open){Ie(this,"sl-show"),this.panel.addEventListener("sl-activate",this.handleMenuItemActivate),this.panel.addEventListener("sl-select",this.handlePanelSelect),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown),await Yt(this),this.popover.update(),this.panel.hidden=!1;const{keyframes:e,options:t}=ss(this,"dropdown.show");await Gt(this.panel,e,t),Ie(this,"sl-after-show")}else{Ie(this,"sl-hide"),this.panel.removeEventListener("sl-activate",this.handleMenuItemActivate),this.panel.removeEventListener("sl-select",this.handlePanelSelect),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),await Yt(this);const{keyframes:e,options:t}=ss(this,"dropdown.hide");await Gt(this.panel,e,t),this.panel.hidden=!0,Ie(this,"sl-after-hide")}}render(){return R`
      <div
        part="base"
        id=${this.componentId}
        class=${Ae({dropdown:!0,"dropdown--open":this.open})}
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
    `}};rs.styles=is,S([Ce(".dropdown__trigger")],rs.prototype,"trigger",2),S([Ce(".dropdown__panel")],rs.prototype,"panel",2),S([Ce(".dropdown__positioner")],rs.prototype,"positioner",2),S([Se({type:Boolean,reflect:!0})],rs.prototype,"open",2),S([Se()],rs.prototype,"placement",2),S([Se({type:Boolean})],rs.prototype,"disabled",2),S([Se({attribute:"stay-open-on-select",type:Boolean,reflect:!0})],rs.prototype,"stayOpenOnSelect",2),S([Se({attribute:!1})],rs.prototype,"containingElement",2),S([Se({type:Number})],rs.prototype,"distance",2),S([Se({type:Number})],rs.prototype,"skidding",2),S([Se({type:Boolean})],rs.prototype,"hoist",2),S([Me("distance"),Me("hoist"),Me("placement"),Me("skidding")],rs.prototype,"handlePopoverOptionsChange",1),S([Me("open",{waitUntilFirstUpdate:!0})],rs.prototype,"handleOpenChange",1),rs=S([_e("sl-dropdown")],rs),ts("dropdown.show",{keyframes:[{opacity:0,transform:"scale(0.9)"},{opacity:1,transform:"scale(1)"}],options:{duration:150,easing:"ease"}}),ts("dropdown.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.9)"}],options:{duration:150,easing:"ease"}});var ns=new WeakMap;var ls={observe:function(e){const t=["Tab","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End","PageDown","PageUp"],s=s=>{t.includes(s.key)&&e.classList.add("focus-visible")},i=()=>e.classList.remove("focus-visible");ns.set(e,{is:s,isNot:i}),e.addEventListener("keydown",s),e.addEventListener("keyup",s),e.addEventListener("mousedown",i),e.addEventListener("mousedown",i)},unobserve:function(e){const{is:t,isNot:s}=ns.get(e);e.classList.remove("focus-visible"),e.removeEventListener("keydown",t),e.removeEventListener("keyup",t),e.removeEventListener("mousedown",s),e.removeEventListener("mousedown",s)}},as=me`
  ${Ue}

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
`,cs=class extends xe{constructor(){super(...arguments),this.label="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.updateComplete.then((()=>ls.observe(this.button)))}disconnectedCallback(){super.disconnectedCallback(),ls.unobserve(this.button)}render(){return R`
      <button
        part="base"
        class=${Ae({"icon-button":!0,"icon-button--disabled":this.disabled})}
        ?disabled=${this.disabled}
        type="button"
        aria-label=${this.label}
      >
        <sl-icon
          name=${Te(this.name)}
          library=${Te(this.library)}
          src=${Te(this.src)}
          aria-hidden="true"
        ></sl-icon>
      </button>
    `}};cs.styles=as,S([Ce("button")],cs.prototype,"button",2),S([Se()],cs.prototype,"name",2),S([Se()],cs.prototype,"library",2),S([Se()],cs.prototype,"src",2),S([Se()],cs.prototype,"label",2),S([Se({type:Boolean,reflect:!0})],cs.prototype,"disabled",2),cs=S([_e("sl-icon-button")],cs);var ds="";function hs(e){ds=e}var ps=[...document.getElementsByTagName("script")],us=ps.find((e=>e.hasAttribute("data-shoelace")));if(us)hs(us.getAttribute("data-shoelace"));else{const e=ps.find((e=>/shoelace(\.min)?\.js$/.test(e.src)));let t="";e&&(t=e.getAttribute("src")),hs(t.split("/").slice(0,-1).join("/"))}var fs={check:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">\n      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>\n    </svg>\n  ',"chevron-down":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"chevron-left":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>\n    </svg>\n  ',"chevron-right":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">\n      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',eye:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">\n      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>\n      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>\n    </svg>\n  ',"eye-slash":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\n      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>\n      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>\n      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>\n    </svg>\n  ',"grip-vertical":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">\n      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>\n    </svg>\n  ',"person-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">\n      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>\n    </svg>\n  ',"star-fill":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">\n      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>\n    </svg>\n  ',x:'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">\n      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  ',"x-circle":'\n    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">\n      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>\n      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n    </svg>\n  '},ms=[{name:"default",resolver:e=>`${ds.replace(/\/$/,"")}/assets/icons/${e}.svg`},{name:"system",resolver:e=>fs[e]?`data:image/svg+xml,${encodeURIComponent(fs[e])}`:""}],gs=[];function vs(e){return ms.filter((t=>t.name===e))[0]}var bs=new Map,ys=class extends Le{constructor(e){if(super(e),this.vt=V,e.type!==$e)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===V)return this.Vt=void 0,this.vt=e;if(e===N)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.vt)return this.Vt;this.vt=e;const t=[e];return t.raw=t,this.Vt={_$litType$:this.constructor.resultType,strings:t,values:[]}}};ys.directiveName="unsafeHTML",ys.resultType=1;var ws=class extends ys{};ws.directiveName="unsafeSVG",ws.resultType=2;var xs=Ee(ws),_s=me`
  ${Ue}

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
`,ks=new DOMParser,Ss=class extends xe{constructor(){super(...arguments),this.svg="",this.library="default"}connectedCallback(){var e;super.connectedCallback(),e=this,gs.push(e)}firstUpdated(){this.setIcon()}disconnectedCallback(){var e;super.disconnectedCallback(),e=this,gs=gs.filter((t=>t!==e))}getLabel(){let e="";return this.label?e=this.label:this.name?e=this.name.replace(/-/g," "):this.src&&(e=this.src.replace(/.*\//,"").replace(/-/g," ").replace(/\.svg/i,"")),e}getUrl(){const e=vs(this.library);return this.name&&e?e.resolver(this.name):this.src}redraw(){this.setIcon()}async setIcon(){const e=vs(this.library),t=this.getUrl();if(t)try{const s=await(e=>{if(bs.has(e))return bs.get(e);{const t=fetch(e).then((async e=>{if(e.ok){const t=document.createElement("div");t.innerHTML=await e.text();const s=t.firstElementChild;return{ok:e.ok,status:e.status,svg:s&&"svg"===s.tagName.toLowerCase()?s.outerHTML:""}}return{ok:e.ok,status:e.status,svg:null}}));return bs.set(e,t),t}})(t);if(t!==this.getUrl())return;if(s.ok){const t=ks.parseFromString(s.svg,"text/html").body.querySelector("svg");t?(e&&e.mutator&&e.mutator(t),this.svg=t.outerHTML,Ie(this,"sl-load")):(this.svg="",Ie(this,"sl-error",{detail:{status:s.status}}))}else this.svg="",Ie(this,"sl-error",{detail:{status:s.status}})}catch(e){Ie(this,"sl-error",{detail:{status:-1}})}else this.svg&&(this.svg="")}handleChange(){this.setIcon()}render(){return R` <div part="base" class="icon" role="img" aria-label=${this.getLabel()}>${xs(this.svg)}</div>`}};Ss.styles=_s,S([ze()],Ss.prototype,"svg",2),S([Se()],Ss.prototype,"name",2),S([Se()],Ss.prototype,"src",2),S([Se()],Ss.prototype,"label",2),S([Se()],Ss.prototype,"library",2),S([Me("name"),Me("src"),Me("library")],Ss.prototype,"setIcon",1),Ss=S([_e("sl-icon")],Ss);var zs=me`
  ${Ue}

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
`,Cs=class extends xe{constructor(){super(...arguments),this.checked=!1,this.value="",this.disabled=!1}firstUpdated(){this.setAttribute("role","menuitem")}handleCheckedChange(){this.setAttribute("aria-checked",String(this.checked))}handleDisabledChange(){this.setAttribute("aria-disabled",String(this.disabled))}render(){return R`
      <div
        part="base"
        class=${Ae({"menu-item":!0,"menu-item--checked":this.checked,"menu-item--disabled":this.disabled})}
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
    `}};Cs.styles=zs,S([Ce(".menu-item")],Cs.prototype,"menuItem",2),S([Se({type:Boolean,reflect:!0})],Cs.prototype,"checked",2),S([Se()],Cs.prototype,"value",2),S([Se({type:Boolean,reflect:!0})],Cs.prototype,"disabled",2),S([Me("checked")],Cs.prototype,"handleCheckedChange",1),S([Me("disabled")],Cs.prototype,"handleDisabledChange",1),Cs=S([_e("sl-menu-item")],Cs);const Ts=t`:host{--sl-color-black:#000;--sl-color-white:#fff;--sl-color-gray-50:#f9fafb;--sl-color-gray-100:#f3f4f6;--sl-color-gray-200:#e5e7eb;--sl-color-gray-300:#d1d5db;--sl-color-gray-400:#9ca3af;--sl-color-gray-500:#6b7280;--sl-color-gray-600:#4b5563;--sl-color-gray-700:#374151;--sl-color-gray-800:#1f2937;--sl-color-gray-900:#111827;--sl-color-gray-950:#0d131e;--sl-color-primary-50:#f0f9ff;--sl-color-primary-100:#e0f2fe;--sl-color-primary-200:#bae6fd;--sl-color-primary-300:#7dd3fc;--sl-color-primary-400:#38bdf8;--sl-color-primary-500:#0ea5e9;--sl-color-primary-600:#0284c7;--sl-color-primary-700:#0369a1;--sl-color-primary-800:#075985;--sl-color-primary-900:#0c4a6e;--sl-color-primary-950:#082e45;--sl-color-primary-text:var(--sl-color-white);--sl-color-success-50:#f0fdf4;--sl-color-success-100:#dcfce7;--sl-color-success-200:#bbf7d0;--sl-color-success-300:#86efac;--sl-color-success-400:#4ade80;--sl-color-success-500:#22c55e;--sl-color-success-600:#16a34a;--sl-color-success-700:#15803d;--sl-color-success-800:#166534;--sl-color-success-900:#14532d;--sl-color-success-950:#0d381e;--sl-color-success-text:var(--sl-color-white);--sl-color-info-50:#f9fafb;--sl-color-info-100:#f3f4f6;--sl-color-info-200:#e5e7eb;--sl-color-info-300:#d1d5db;--sl-color-info-400:#9ca3af;--sl-color-info-500:#6b7280;--sl-color-info-600:#4b5563;--sl-color-info-700:#374151;--sl-color-info-800:#1f2937;--sl-color-info-900:#111827;--sl-color-info-950:#0d131e;--sl-color-info-text:var(--sl-color-white);--sl-color-warning-50:#fffbeb;--sl-color-warning-100:#fef3c7;--sl-color-warning-200:#fde68a;--sl-color-warning-300:#fcd34d;--sl-color-warning-400:#fbbf24;--sl-color-warning-500:#f59e0b;--sl-color-warning-600:#d97706;--sl-color-warning-700:#b45309;--sl-color-warning-800:#92400e;--sl-color-warning-900:#78350f;--sl-color-warning-950:#4d220a;--sl-color-warning-text:var(--sl-color-white);--sl-color-danger-50:#fef2f2;--sl-color-danger-100:#fee2e2;--sl-color-danger-200:#fecaca;--sl-color-danger-300:#fca5a5;--sl-color-danger-400:#f87171;--sl-color-danger-500:#ef4444;--sl-color-danger-600:#dc2626;--sl-color-danger-700:#b91c1c;--sl-color-danger-800:#991b1b;--sl-color-danger-900:#7f1d1d;--sl-color-danger-950:#481111;--sl-color-danger-text:var(--sl-color-white);--sl-border-radius-small:0.125em;--sl-border-radius-medium:0.25em;--sl-border-radius-large:0.5em;--sl-border-radius-x-large:1em;--sl-border-radius-circle:50%;--sl-border-radius-pill:9999px;--sl-shadow-x-small:0 1px 0 #0d131e0d;--sl-shadow-small:0 1px 2px #0d131e1a;--sl-shadow-medium:0 2px 4px #0d131e1a;--sl-shadow-large:0 2px 8px #0d131e1a;--sl-shadow-x-large:0 4px 16px #0d131e1a;--sl-spacing-xxx-small:0.125em;--sl-spacing-xx-small:0.25em;--sl-spacing-x-small:0.5em;--sl-spacing-small:0.75em;--sl-spacing-medium:1em;--sl-spacing-large:1.25em;--sl-spacing-x-large:1.75em;--sl-spacing-xx-large:2.25em;--sl-spacing-xxx-large:3em;--sl-spacing-xxxx-large:4.5em;--sl-transition-x-slow:1000ms;--sl-transition-slow:500ms;--sl-transition-medium:250ms;--sl-transition-fast:150ms;--sl-transition-x-fast:50ms;--sl-font-mono:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;--sl-font-sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";--sl-font-serif:Georgia,"Times New Roman",serif;--sl-font-size-xx-small:0.625em;--sl-font-size-x-small:0.75em;--sl-font-size-small:0.875em;--sl-font-size-medium:1em;--sl-font-size-large:1.25em;--sl-font-size-x-large:1.5em;--sl-font-size-xx-large:2.25em;--sl-font-size-xxx-large:3em;--sl-font-size-xxxx-large:4.5em;--sl-font-weight-light:300;--sl-font-weight-normal:400;--sl-font-weight-semibold:500;--sl-font-weight-bold:700;--sl-letter-spacing-dense:-0.015em;--sl-letter-spacing-normal:normal;--sl-letter-spacing-loose:0.075em;--sl-line-height-dense:1.4;--sl-line-height-normal:1.8;--sl-line-height-loose:2.2;--sl-focus-ring-color-primary:#0ea5e954;--sl-focus-ring-color-success:#22c55e54;--sl-focus-ring-color-info:#6b728054;--sl-focus-ring-color-warning:#f59e0b54;--sl-focus-ring-color-danger:#ef444454;--sl-focus-ring-width:3px;--sl-button-font-size-small:var(--sl-font-size-x-small);--sl-button-font-size-medium:var(--sl-font-size-small);--sl-button-font-size-large:var(--sl-font-size-medium);--sl-input-height-small:1.875em;--sl-input-height-medium:2.5em;--sl-input-height-large:3.125em;--sl-input-background-color:var(--sl-color-white);--sl-input-background-color-hover:var(--sl-color-white);--sl-input-background-color-focus:var(--sl-color-white);--sl-input-background-color-disabled:var(--sl-color-gray-100);--sl-input-border-color:var(--sl-color-gray-300);--sl-input-border-color-hover:var(--sl-color-gray-400);--sl-input-border-color-focus:var(--sl-color-primary-500);--sl-input-border-color-disabled:var(--sl-color-gray-300);--sl-input-border-width:1px;--sl-input-border-radius-small:var(--sl-border-radius-medium);--sl-input-border-radius-medium:var(--sl-border-radius-medium);--sl-input-border-radius-large:var(--sl-border-radius-medium);--sl-input-font-family:var(--sl-font-sans);--sl-input-font-weight:var(--sl-font-weight-normal);--sl-input-font-size-small:var(--sl-font-size-small);--sl-input-font-size-medium:var(--sl-font-size-medium);--sl-input-font-size-large:var(--sl-font-size-large);--sl-input-letter-spacing:var(--sl-letter-spacing-normal);--sl-input-color:var(--sl-color-gray-700);--sl-input-color-hover:var(--sl-color-gray-700);--sl-input-color-focus:var(--sl-color-gray-700);--sl-input-color-disabled:var(--sl-color-gray-900);--sl-input-icon-color:var(--sl-color-gray-400);--sl-input-icon-color-hover:var(--sl-color-gray-600);--sl-input-icon-color-focus:var(--sl-color-gray-600);--sl-input-placeholder-color:var(--sl-color-gray-400);--sl-input-placeholder-color-disabled:var(--sl-color-gray-600);--sl-input-spacing-small:var(--sl-spacing-small);--sl-input-spacing-medium:var(--sl-spacing-medium);--sl-input-spacing-large:var(--sl-spacing-large);--sl-input-label-font-size-small:var(--sl-font-size-small);--sl-input-label-font-size-medium:var(--sl-font-size-medium);--sl-input-label-font-size-large:var(--sl-font-size-large);--sl-input-label-color:inherit;--sl-input-help-text-font-size-small:var(--sl-font-size-x-small);--sl-input-help-text-font-size-medium:var(--sl-font-size-small);--sl-input-help-text-font-size-large:var(--sl-font-size-medium);--sl-input-help-text-color:var(--sl-color-gray-400);--sl-toggle-size:1em;--sl-overlay-background-color:#37415180;--sl-panel-background-color:var(--sl-color-white);--sl-panel-border-color:var(--sl-color-gray-200);--sl-tooltip-border-radius:var(--sl-border-radius-medium);--sl-tooltip-background-color:var(--sl-color-gray-900);--sl-tooltip-color:var(--sl-color-white);--sl-tooltip-font-family:var(--sl-font-sans);--sl-tooltip-font-weight:var(--sl-font-weight-normal);--sl-tooltip-font-size:var(--sl-font-size-small);--sl-tooltip-line-height:var(--sl-line-height-dense);--sl-tooltip-padding:var(--sl-spacing-xx-small) var(--sl-spacing-x-small);--sl-tooltip-arrow-size:5px;--sl-tooltip-arrow-start-end-offset:8px;--sl-z-index-drawer:700;--sl-z-index-dialog:800;--sl-z-index-dropdown:900;--sl-z-index-toast:950;--sl-z-index-tooltip:1000}.sl-scroll-lock{overflow:hidden!important}`,Os=[],$s=[],Es={code:"EUR",changeRate:1};class Ls extends s{static get properties(){return{currencies:{type:Array},currency:{type:Object},totalPrice:{type:Number,attribute:"total-price"},zoneId:{type:String,attribute:"zone-id"},zones:{type:Array},_sortedZones:{type:Array}}}constructor(){super(),this.currency=Es,this.totalPrice=0}_getCurrencySymbol(e){return new Intl.NumberFormat("en",{style:"currency",currency:e}).formatToParts(0).find((e=>"currency"===e.type)).value.replace("$US","$")}_onCurrencyChange(e){const t=this.currencies.find((t=>t.code===e.target.value));i(this,"change-currency",t)}_onZoneChange(e){const t=e.target.value;i(this,"change-zone",t)}update(e){e.has("zones")&&(this._sortedZones=l(this.zones)),super.update(e)}render(){const t=null==this.currencies,s=t?Os:this.currencies,i=null==this._sortedZones,n=i?$s:this._sortedZones;return o`<cc-flex-gap class=main><sl-select class="${r({skeleton:t})} currency-select" label=Currency:  value=${this.currency?.code} ?disabled=${t} @sl-change=${this._onCurrencyChange}>${s.map((e=>o`<sl-menu-item value=${e.code}>${this._getCurrencySymbol(e.code)} ${e.code}</sl-menu-item>`))}</sl-select><sl-select class="${r({skeleton:i})} zone-select" label=Zone:  value=${this.zoneId} ?disabled=${null==this._sortedZones} @sl-change=${this._onZoneChange}>${n.map((e=>o`<sl-menu-item class=zone-item value=${e.name}>${a.getText(e)}<cc-zone slot=prefix .zone=${e}></cc-zone></sl-menu-item>`))}</sl-select><div class=estimated-cost><div class=estimated-cost--label>Estimated Cost: </div><div class=estimated-cost--value><span class=total-price>${(({price:t,code:s})=>`${e("en",t,{currency:s})}`)({price:this.totalPrice*this.currency.changeRate,code:this.currency.code})}</span></div></div></cc-flex-gap>`}static get styles(){return[Ts,n,t`:host{display:block}.main{--cc-gap:1em;--sl-input-height-medium:2.5em}sl-select{--focus-ring:0 0 0 .2em rgba(50, 115, 220, .25);--sl-input-background-color-disabled:#eee;--sl-input-border-color-disabled:#eee;--sl-input-border-color-focus:#777;--sl-input-border-color-hover:#777;--sl-input-border-color:#aaa;--sl-input-border-radius-medium:0.25em;--sl-input-color-focus:#000;--sl-input-color-hover:#000;--sl-input-color:#000}.estimated-cost--label,sl-select::part(label){color:#000;padding-bottom:.35em}.currency-select{flex:1 1 0;min-width:10em}.zone-select{flex:2 1 25em}.zone-item{margin:0}.zone-item::part(label){display:none}.zone-item::part(prefix){display:block;flex:1 1 0}.zone-item:focus::part(base),.zone-item:hover::part(base){--cc-zone-subtitle-color:#fff;--cc-zone-tag-bdcolor:#fff;--cc-zone-tag-bgcolor:transparent}cc-zone{margin:.25em 0 .25em .5em}.estimated-cost--value{font-weight:700;height:var(--sl-input-height-medium);line-height:var(--sl-input-height-medium)}.total-price{font-size:1.5em}sl-select.skeleton::part(base){--sl-input-background-color-disabled:#bbb}`]}}window.customElements.define("cc-pricing-header",Ls);export{Ls as CcPricingHeader};
