import"./cc-env-var-form-e72b0c15.js";import{L as a,c as r,u as e}from"./cc-smart-container-0c093be7.js";import{u as n,f as s,g as i}from"./api-helpers-a710dc87.js";import{a as o}from"./env-vars-13fc89da.js";import{s as p}from"./send-to-api-d26c0c41.js";import{d as t}from"./smart-manager-10eab692.js";import{a as c}from"./utils-e732f1fc.js";import{m}from"./merge-d357dbf8.js";import{w as l}from"./withLatestFrom-81917e03.js";t({selector:'cc-env-var-form[context="exposed-config"]',params:{apiConfig:{type:Object},ownerId:{type:String},appId:{type:String}},onConnect(t,d,f,g){const u=new a,b=new a,v=m(u.error$,b.error$),I=r(d,"cc-env-var-form:submit").pipe(l(f)),h=r(d,"cc-env-var-form:dismissed-error");e(g,[v.subscribe(console.error),v.subscribe((a=>{d.error=a.type,d.saving=!1})),u.value$.subscribe((a=>d.appName=a.name)),b.value$.subscribe((a=>{d.variables=a,d.saving=!1})),I.subscribe((([a,{apiConfig:r,ownerId:e,appId:s}])=>{d.error=null,d.saving=!0,b.push((()=>function({apiConfig:a,signal:r,ownerId:e,appId:s,variables:i}){const t=o(i);return n({id:e,appId:s},t).then(p({apiConfig:a,signal:r}))}({apiConfig:r,ownerId:e,appId:s,variables:a}).then((()=>a)).catch(c("saving"))))})),h.subscribe((()=>{d.error=null,d.saving=!1})),f.subscribe((({apiConfig:a,ownerId:r,appId:e})=>{d.error=null,d.saving=!1,d.variables=null,null!=a&&null!=r&&null!=e&&(u.push((n=>s({apiConfig:a,signal:n,ownerId:r,appId:e}).catch(c("loading")))),b.push((n=>function({apiConfig:a,signal:r,ownerId:e,appId:n}){return i({id:e,appId:n}).then(p({apiConfig:a,signal:r})).then((a=>Object.entries(a).map((([a,r])=>({name:a,value:r})))))}({apiConfig:a,signal:n,ownerId:r,appId:e}).catch(c("loading")))))}))])}});
