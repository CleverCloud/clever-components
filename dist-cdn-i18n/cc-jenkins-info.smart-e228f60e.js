import"./cc-jenkins-info-b62a8b41.js";import{L as n,u as e}from"./cc-smart-container-0c093be7.js";import{s as o}from"./send-to-api-d26c0c41.js";import{d as s}from"./smart-manager-10eab692.js";import{c as i}from"./combineLatest-ab1ee35e.js";import{m as a}from"./merge-d357dbf8.js";s({selector:"cc-jenkins-info",params:{apiConfig:{type:Object},addonId:{type:String}},onConnect(s,r,d,t){const p=new n,c=new n,l=i(p.value$,c.value$),m=a(p.error$,c.error$);e(t,[m.subscribe(console.error),m.subscribe((()=>r.error=!0)),l.subscribe((([n,e])=>{r.jenkinsLink=`https://${n.host}`,r.jenkinsManageLink=e.manageLink,r.versions=e.versions})),d.subscribe((({apiConfig:n,addonId:e})=>{r.error=!1,r.jenkinsManageLink=null,r.versions=null,null!=n&&null!=e&&(p.push((s=>function({apiConfig:n,signal:e,addonId:s}){return(i={providerId:"jenkins",addonId:s},Promise.resolve({method:"get",url:`/v4/addon-providers/${i.providerId}/addons/${i.addonId}`,headers:{Accept:"application/json"}})).then(o({apiConfig:n,signal:e}));var i}({apiConfig:n,signal:s,addonId:e}))),c.push((s=>function({apiConfig:n,signal:e,addonId:s}){return(i={addonId:s},Promise.resolve({method:"get",url:`/v4/addon-providers/jenkins/addons/${i.addonId}/updates`,headers:{Accept:"application/json"}})).then(o({apiConfig:n,signal:e}));var i}({apiConfig:n,signal:s,addonId:e}))))}))])}});
