function e(e,n){return e===n||null!=e&&null!=n&&(Object.keys(e).length===Object.keys(n).length&&Object.entries(e).every((([e,t])=>n[e]===t)))}function n(e){return n=>{throw n.type=e,n}}const t=[(e,n,t,r)=>{if(t===r.length-1)return Array.from(new Set(r))},[]];function r(e,n=!1){return(t,r)=>!1===n?t[e].localeCompare(r[e]):r[e].localeCompare(t[e])}function o(e,n){return Promise.all(e.map(n))}export{n as a,o as b,e as o,r as s,t as u};
