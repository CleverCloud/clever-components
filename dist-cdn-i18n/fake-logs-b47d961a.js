import{r as e,d as a,e as t}from"./utils-aa566623.js";const i="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",n="Lorem ipsum dolor sit amet, consectetur adipiscing elit...",o=[1,3,4,9],u=e(31,36);const r={level:e=>{let a="neutral";return"ERROR"===e.value?a="danger":"WARN"===e.value?a="warning":"INFO"===e.value&&(a="info"),{strong:!0,intent:a,size:5}},ip:e=>({text:`💻 ${e.value}`,strong:!0,size:17})};function l(r,{longMessage:l=!1,ansi:s=!1,manyMetadata:m=!1}){const d=l?i:n,c=s?function(e){return e.split(" ").slice(0,t(5,50)).map((e=>`[${a(o)};${a(u)}m${e}`)).join("[0m ")}(d):d,p=m?e(1,20).map((e=>({name:`metadata${e}`,value:`value${e}`}))):[{name:"level",value:a(["INFO","WARN","DEBUG","ERROR"])},{name:"ip",value:a(["192.168.12.1","192.168.48.157"])}],g=new Date;return{id:`${g.getTime()}-${r}`,date:g,message:`Message ${r}. ${c}`,metadata:p}}function s(e,a){return Array(e).fill(0).map(((e,t)=>l(t,a??{})))}export{r as CUSTOM_METADATA_RENDERERS,l as createFakeLog,s as createFakeLogs};