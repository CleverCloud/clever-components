import"./cc-addon-linked-apps-732667c5.js";import{L as n,u as a}from"./cc-smart-container-0c093be7.js";import{g as o}from"./addon-f5d51d1d.js";import{g as e}from"./product-857e3fb7.js";import{s as r,O as i}from"./send-to-api-d26c0c41.js";import{d as s}from"./smart-manager-10eab692.js";import{m as t}from"./merge-d357dbf8.js";import{c as d}from"./combineLatest-ab1ee35e.js";s({selector:"cc-addon-linked-apps",params:{apiConfig:{type:Object},ownerId:{type:String},addonId:{type:String}},onConnect(s,p,c,m){const l=new n,u=new n,f=t(l.error$,u.error$),g=d(l.value$,u.value$);a(m,[f.subscribe(console.error),f.subscribe((()=>p.error=!0)),g.subscribe((([n,a])=>{p.applications=a.map((a=>{const o=n.find((n=>n.name===a.zoneName));return{...a,zone:o}}))})),c.subscribe((({apiConfig:n,ownerId:a,addonId:s})=>{p.error=!1,p.applications=null,null!=n&&null!=a&&null!=s&&(l.push((a=>function({apiConfig:n,signal:a}){return e().then(r({apiConfig:n,signal:a,cacheDelay:i}))}({apiConfig:n,signal:a}))),u.push((e=>function({apiConfig:n,signal:a,ownerId:e,addonId:i}){return o({id:e,addonId:i}).then(r({apiConfig:n,signal:a})).then((n=>n.map((n=>{const{name:a,instance:o,zone:r}=n;return{name:a,link:function(n,a){return n.startsWith("orga_")?`/organisations/${n}/applications/${a}`:`/users/me/applications/${a}`}(e,n.id),instance:o,zoneName:r}}))))}({apiConfig:n,signal:e,ownerId:a,addonId:s}))))}))])}});
