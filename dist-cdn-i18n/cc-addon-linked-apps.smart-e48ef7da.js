import"./cc-addon-linked-apps-3ccc250d.js";import"./cc-smart-container-f668ab58.js";import{g as n}from"./addon-d08729a3.js";import{g as a}from"./product-59a60684.js";import{d as o,O as i}from"./request.fetch-17efde15.js";import{s as t}from"./send-to-api-3f46dae0.js";function e({apiConfig:n,signal:o}){return a().then(t({apiConfig:n,signal:o,cacheDelay:i}))}function d({apiConfig:a,signal:o,ownerId:i,addonId:e}){return n({id:i,addonId:e}).then(t({apiConfig:a,signal:o}))}o({selector:"cc-addon-linked-apps",params:{apiConfig:{type:Object},ownerId:{type:String},addonId:{type:String}},onContextUpdate({context:n,updateComponent:a,signal:o}){a("state",{type:"loading"});const{apiConfig:i,ownerId:t,addonId:r}=n;(function({apiConfig:n,signal:a,ownerId:o,addonId:i}){return Promise.all([e({apiConfig:n,signal:a}),d({apiConfig:n,signal:a,ownerId:o,addonId:i})]).then((([n,a])=>a.map((a=>{const{name:i,instance:t}=a,e=t.variant?.name,d=t.variant?.logo,r=function(n,a){return n.startsWith("orga_")?`/organisations/${n}/applications/${a}`:`/users/me/applications/${a}`}(o,a.id);return{name:i,link:r,variantName:e,variantLogoUrl:d,zone:n.find((n=>n.name===a.zone))}}))))})({apiConfig:i,ownerId:t,addonId:r,signal:o}).then((n=>{a("state",{type:"loaded",linkedApplications:n})})).catch((n=>{console.error(n),a("state",{type:"error"})}))}});