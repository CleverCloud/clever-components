const e=["STRONG","EM","CODE","A","BR","P"];const t=(()=>{if(null==globalThis.document)return()=>"";const e=document.createElement("span"),t=document.createTextNode("");return e.appendChild(t),n=>(t.data=n,e.innerHTML)})();function n(e){return e?.nodeType===document.TEXT_NODE?(e.parentNode.removeChild(e),e.data):""}function r(r,...o){let a="";for(let e=0;e<r.length;e++)a+=r[e],null!=o[e]&&(a+=t(o[e]));const l=document.createElement("template");return l.innerHTML=a,Array.from(l.content.querySelectorAll("*")).forEach((t=>{if(e.includes(t.tagName))Array.from(t.attributes).filter((e=>{return n=e.name,r=t.tagName,!("title"===n||"aria-label"===n||"href"===n&&"A"===r);var n,r})).forEach((e=>(console.warn(`Attribute ${e.name} is not allowed on <${t.tagName.toLowerCase()}> in translations!`),t.removeAttribute(e.name)))),"A"===t.tagName&&null!=t.getAttribute("href")&&(t.classList.add("sanitized-link"),t.origin?.length>0&&t.origin!==window.location.origin&&(t.setAttribute("rel","noopener noreferrer"),t.setAttribute("target","_blank")));else{const e=n(t.previousSibling),r=n(t.nextSibling),o=document.createTextNode(e+t.textContent+r);t.parentNode.replaceChild(o,t),console.warn(`Node <${t.tagName.toLowerCase()}> is not allowed in translations!`)}})),l.content.cloneNode(!0)}export{r as s};