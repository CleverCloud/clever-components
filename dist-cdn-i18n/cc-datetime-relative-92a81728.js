import{f as t,d as e,e as i}from"./i18n-bf531c19.js";const a=i("en"),n=e("en",((t,e)=>`${t} ${a(t,e)} ago`),"just now"),s=[];let d;function r(){s.forEach((t=>t._triggerUpdate()))}class l extends HTMLElement{static get observedAttributes(){return["datetime"]}get datetime(){return this.getAttribute("datetime")}set datetime(t){this.setAttribute("datetime",t)}attributeChangedCallback(e,i,a){"datetime"===e&&(this.title=(({date:e})=>t("en",e))({date:a}),this._triggerUpdate())}connectedCallback(){s.push(this),null==d&&(r(),d=setInterval(r,1e4))}disconnectedCallback(){const t=s.indexOf(this);-1!==t&&s.splice(t,1),s.length>0&&null!=d&&(clearInterval(d),d=null)}_triggerUpdate(){const t=(({date:t})=>n(t))({date:this.getAttribute("datetime")});this.textContent!==t&&(this.textContent=t)}}window.customElements.define("cc-datetime-relative",l);export{l as CcDatetimeRelative};
