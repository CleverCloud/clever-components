import{b as t,c as e}from"./application-e1aa8d7f.js";import{d as n,p as s}from"./request.fetch-17efde15.js";import{a,s as i}from"./send-to-api-3f46dae0.js";import{u as o}from"./utils-aa566623.js";import{dateRangeSelectionToDateRange as r}from"./date-range-selection-313ae90d.js";import{isLive as c,lastXDays as l}from"./date-range-378a7f50.js";import"./cc-smart-container-f668ab58.js";import"./cc-logs-application-view-4a1f4606.js";class h extends EventTarget{on(t,e,n){return this.addEventListener(t,e,n),this}emit(t,e){const n=new Event(t);return Object.entries(e).forEach((([t,e])=>{n[t]=e})),this.dispatchEvent(n)}}const p={NewLine:10,CarriageReturn:13,Space:32,Colon:58};async function d(t,e,n){const s=function(t){let e=_();const n=new TextDecoder;return function(s,a){if(0===s.length)return t?.(e),void(e=_());if(a>0){const t=n.decode(s.subarray(0,a)),i=a+(s[a+1]===p.Space?2:1),o=n.decode(s.subarray(i));switch(t){case"data":e.data=e.data?e.data+"\n"+o:o;break;case"event":e.event=o;break;case"id":e.id=o;break;case"retry":{const t=parseInt(o,10);isNaN(t)||(e.retry=t);break}}}}}(n),a=function(t){let e,n,s,a=!1;return function(i){void 0===e?(e=i,n=0,s=-1):e=function(t,e){const n=new Uint8Array(t.length+e.length);return n.set(t),n.set(e,t.length),n}(e,i);const o=e.length;let r=0;for(;n<o;){a&&(e[n]===p.NewLine&&(r=++n),a=!1);let i=-1;for(;n<o&&-1===i;++n)switch(e[n]){case p.Colon:-1===s&&(s=n-r);break;case p.CarriageReturn:a=!0;case p.NewLine:i=n}if(-1===i)break;t(e.subarray(r,i),s),r=n,s=-1}r!==o?0!==r&&(e=e.subarray(r),n-=r):e=void 0}}(s);if("getReader"in t){const n=t.getReader();e.addEventListener("abort",(()=>{n.cancel(e.reason).catch((()=>null))}),{once:!0});let s=!0;for(;s;){const t=await n.read();s=!t.done,s&&a(t.value)}}}function _(){return{data:"",event:"",id:"",retry:void 0}}const u="text/event-stream";const m={enabled:!1,backoffFactor:1.25,initRetryTimeout:1e3,maxRetryCount:1/0},g=["EAI_AGAIN","ENOTFOUND","ECONNREFUSED","ECONNRESET","EPIPE","ETIMEDOUT","UND_ERR_SOCKET"];class f extends h{constructor(t,e,n={},s){super(),this._apiHost=t,this._tokens=e,this._promise=null,this._lastId=null,this._lastContact=null,this._connectionTimeoutId=null,this._heartbeatIntervalId=null,this._retry={...m,...n},this._retryTimeoutId=null,this.retryCount=0,this._connectionTimeout=s??5e3,this.state="init"}buildUrl(t="",e={}){const n=new URL(t,this._apiHost);return Object.entries(e).forEach((([t,e])=>{(Array.isArray(e)?e:[e]).filter((t=>null!=t)).forEach((e=>{n.searchParams.append(t,function(t){if(t instanceof Date)return t.toISOString();return t.toString()}(e))}))})),n}getUrl(){throw new Error("please implement getUrl() method")}async start(){return null==this._promise&&(this._promise=new Promise(((t,e)=>{this._resolve=t,this._reject=e})),this._start()),this._promise}async _start(){try{const t=this.getUrl(),e={};Array.from(t.searchParams.entries()).forEach((([t,n])=>{Object.hasOwn(e,t)?Array.isArray(e[t])?e[t]=[...e[t],n]:e[t]=[e[t],n]:e[t]=n}));let n={method:"get",url:t.origin+t.pathname,queryParams:e};null!=this._tokens&&(n=await a(this._tokens)(n)),this.state="connecting",this._abortController=new AbortController,this._connectionTimeoutId=setTimeout((()=>{this._onError(new y("Connection timeout..."))}),5e3),function(t,{abortController:e=new AbortController,headers:n,onOpen:s,onMessage:a,onClose:i,onError:o,resumeFrom:r,...c}){const l={accept:u,...n};r&&(l["Last-Event-ID"]=r),fetch(t,{...c,headers:l,signal:e.signal}).then((async t=>(await s(t),await d(t.body,e.signal,a),i?.()))).catch((t=>{e.signal.aborted?i?.(e.signal.reason):o?.(t)}))}(t.toString(),{headers:n.headers,abortController:this._abortController,resumeFrom:this._lastId,onOpen:t=>this._onOpen(t),onMessage:t=>this._onMessage(t),onClose:t=>this._onClose(t),onError:t=>this._onError(t)})}catch(t){this._onError(new y("Server closed the response without a END_OF_STREAM event",{cause:t}))}}pause(){this.state="paused",this._cleanup()}resume(){this._start()}close(t){"closed"!==this.state&&(this.state="closed",this._cleanup(),this._resolve({reason:t}))}_canRetry(t){if(!this._retry.enabled)return!1;if(this.retryCount>=this._retry.maxRetryCount)return!1;return null==t||t instanceof I||t instanceof y||t instanceof w&&t.status>=500}_cleanup(){clearTimeout(this._retryTimeoutId),clearTimeout(this._connectionTimeoutId),clearInterval(this._heartbeatIntervalId),this._abortController?.abort()}async _onOpen(t){clearTimeout(this._connectionTimeoutId);const e=t.headers.get("content-type");if(200!==t.status){if("application/json"===e){const e=await t.json(),n=e.context?.OVDErrorFieldContext?.fieldValue||"";throw new w(t.status,`${e.error} ${n}`)}{const e=await t.text();throw new w(t.status,e||"Unknown error")}}if(!e?.startsWith(u))throw new I(`Invalid content type for an SSE: ${e}`);this.emit("open",{response:t}),this.state="open",this._lastContact=new Date,this.retryCount=0,this._heartbeatIntervalId=setInterval((()=>{(new Date).getTime()-this._lastContact.getTime()>4e3&&this._onError(new y("Failed to receive heartbeat within 4000ms period"))}),1e3)}transform(t,e){return e}_onMessage(t){switch(this._lastContact=new Date,null!=t.id&&(this._lastId=t.id),t.event){case"HEARTBEAT":return;case"END_OF_STREAM":try{const e=JSON.parse(t.data);this.close(e)}catch(e){this._onError(new I(`Expect JSON for END_OF_STREAM event but got "${t.data}"`,{cause:e}))}return;default:try{const e=this.transform(t.event,t.data);this.emit(t.event,{data:e})}catch(e){this._onError(new I(`Cannot transform ${t.event} event`,{cause:e}))}}}_onClose(t){"closed"!==this.state&&"paused"!==this.state&&this._onError(new I("Server closed the response without a END_OF_STREAM event"))}_onError(t){if("closed"===this.state||"paused"===this.state)return;this._cleanup();const e=function(t){const e=t?.cause?.code??t.code;if(g.includes(e))return!0;if("TypeError"===t.name){if("Failed to fetch"===t.message)return!0;if(t.message.startsWith("NetworkError"))return!0}return!1}(t)?new y("Failed to establish/maintain the connection with the server",{cause:t}):t;if(this._canRetry(e)){this.state="paused",this.emit("error",{error:e}),this.retryCount++;const t=this._retry.initRetryTimeout*this._retry.backoffFactor**this.retryCount;this._retryTimeoutId=setTimeout((()=>{this._start()}),t)}else this.state="closed",this._reject(e)}}class y extends Error{}class w extends Error{constructor(t,e,n){super(`HTTP error ${t}: ${e}`,n),this.status=t}}class I extends Error{}class v extends f{constructor({apiHost:t,tokens:e,ownerId:n,appId:s,retryConfiguration:a,connectionTimeout:i,...o}){super(t,e,a??{},i),this._ownerId=n,this._appId=s,this._options=o,this._logsCount=0,this.onLog((()=>{this._logsCount++}))}getUrl(){return this.buildUrl(`/v4/logs/organisations/${this._ownerId}/applications/${this._appId}/logs`,{...this._options,limit:this._computedLimit()})}_computedLimit(){return null==this._options.limit?null:Math.max(this._options.limit-this._logsCount,0)}transform(t,e){if("APPLICATION_LOG"!==t)return e;const n=JSON.parse(e);return n.date&&(n.date=new Date(n.date)),n}onLog(t){return this.on("APPLICATION_LOG",(e=>t(e.data)))}}class S{constructor(t,e){if(this._onFlush=t,this._bucket=[],this._timeout=e.timeout,this._length=e.length,this._timeoutId=null,null==this._timeout&&null==this._length)throw new Error("Illegal argument: You must specify at least one flush condition");if(null!=this._timeout&&this._timeout<=0)throw new Error("Illegal argument: timeout condition must be greater than 0");if(null!=this._length&&this._length<=0)throw new Error("Illegal argument: length condition must be greater than 0");this._flusher=()=>{this.flush()}}add(t){null!=this._timeout&&null==this._timeoutId&&(this._timeoutId=setTimeout(this._flusher,this._timeout)),this._bucket.push(t),null!=this._length&&this._bucket.length===this._length&&this.flush()}flush(){const t=[...this._bucket];t.length>0&&(this.clear(),this._onFlush(t))}clear(){clearTimeout(this._timeoutId),this._timeoutId=null,this._bucket=[]}get length(){return this._bucket.length}}let E=null;n({selector:"cc-logs-application-view-beta",params:{apiConfig:{type:Object},ownerId:{type:String},appId:{type:String},deploymentId:{type:String,optional:!0},dateRangeSelection:{type:Object,optional:!0}},onContextUpdate({component:t,context:e,onEvent:n,updateComponent:s,signal:a}){a.onabort=()=>{E?.stopAndClear()},E?.stopAndClear(),t.overflowWatermarkOffset=10;const{apiConfig:i,ownerId:o,appId:r,deploymentId:c,dateRangeSelection:l}=e;E=new C(i,{ownerId:o,applicationId:r},{component:t,update:s,updateState:t=>s("state",t)}),n("cc-logs-application-view:date-range-change",(t=>{E.setNewDateRange(t)})),n("cc-logs-application-view:instance-selection-change",(t=>{E.setNewInstanceSelection(t)})),n("cc-logs-application-view:pause",(()=>{E.pause()})),n("cc-logs-application-view:resume",(()=>{E.resume()})),null!=c?E.initByDeploymentId(c):null!=l?E.initByDateRangeSelection(l):E.initByLastDeployment()}});class C{constructor(t,e,n){this._apiConfig=t,this._applicationRef=e,this._view=n,this._logsBuffer=new S(this._onLogsBufferFlush.bind(this),{timeout:1e3,length:10}),this._instancesManager=new D(new b(t,e),this._onInstancesChanged.bind(this)),this._selection=[],this._dateRange=null}openLogsStream(){this._stopAndClearLogs(),this._view.updateState({type:"connectingLogs",instances:this._instancesManager.getInstances(),selection:this._selection});const t=this._optimizeLogsStreamParameters();this._logsStream=new A(this._apiConfig,{applicationRef:this._applicationRef,since:t.since,until:t.until,instances:this._selection},{onOpen:()=>{this._view.updateState((t=>{t.type="receivingLogs"}))},onLog:async t=>{this._logsBuffer.add(await this._convertLog(t))},onFatalError:t=>{console.error(t),t instanceof w&&404===t.status?this._view.updateState({type:"logStreamEnded",instances:this._instancesManager.getInstances(),selection:this._selection}):this._view.updateState((t=>{t.type="errorLogs"}))},onError:t=>{console.error(t)},onFinish:async t=>{console.log(t),await this._logsBuffer.flush(),"USER_CLOSE"!==t&&this._view.updateState({type:"logStreamEnded",instances:this._instancesManager.getInstances(),selection:this._selection})}}),this._logsStream.open()}init(t,e){this._selection=e,this.setNewDateRange(t)}initByDeploymentId(t){this.stopAndClear(),this._instancesManager.fetchInstancesByDeployment(t).then((t=>{if(0===t.length)return void this._view.updateState({type:"logStreamEnded",instances:[],selection:[]});this._selection=t.map((t=>t.id));const e=t[0].deployment;N(e)?(this._dateRange={since:e.creationDate.toISOString()},this._view.component.dateRangeSelection={type:"live"}):(this._dateRange={since:e.creationDate.toISOString(),until:e.endDate.toISOString()},this._view.component.dateRangeSelection={type:"custom",since:this._dateRange.since,until:this._dateRange.until}),this._instancesManager.enabledAutoRefresh(c(this._dateRange)),this.openLogsStream()})).catch((t=>{console.error(t),this._view.updateState({type:"errorInstances"})}))}initByLastDeployment(){this.stopAndClear();const t=l(7);this._instancesManager.fetchInstances(t.since,t.until).then((e=>{if(0===e.length)return this._dateRange=t,this._view.component.dateRangeSelection={type:"predefined",def:"last7Days"},void this._view.updateState({type:"logStreamEnded",instances:[],selection:[]});const n=this._instancesManager.getLastDeploymentInstances();if(N(n[0].deployment)){this._view.component.dateRangeSelection={type:"live"};const t=r(this._view.component.dateRangeSelection);this.init(t,[])}else this._dateRange=t,this._view.component.dateRangeSelection={type:"predefined",def:"last7Days"},this._selection=n.map((t=>t.id)),this.openLogsStream()})).catch((t=>{console.error(t),this._view.updateState({type:"errorInstances"})}))}initByDateRangeSelection(t){this.stopAndClear(),this._view.component.dateRangeSelection=t;const e=r(this._view.component.dateRangeSelection);this.init(e,[])}setNewDateRange(t){this.stopAndClear();const e=null==this._dateRange||c(this._dateRange)&&!c(t)||!c(this._dateRange)&&c(t);this._dateRange=t,this._instancesManager.fetchInstances(this._dateRange.since,this._dateRange.until).then((t=>{if(0!==t.length){if(this._instancesManager.enabledAutoRefresh(c(this._dateRange)),this._selection=e?[]:this._selection.filter((t=>this._instancesManager.hasInstance(t))),0===this._selection.length&&"predefined"===this._view.component.dateRangeSelection.type&&"last7Days"===this._view.component.dateRangeSelection.def){const t=this._instancesManager.getLastDeploymentInstances();this._selection=t.map((t=>t.id))}this.openLogsStream()}else this._view.updateState({type:"logStreamEnded",instances:[],selection:[]})})).catch((t=>{console.error(t),this._view.updateState({type:"errorInstances"})}))}setNewInstanceSelection(t){this._selection=t,this.openLogsStream()}stopAndClear(){this._stopAndClearLogs(),this._stopAndClearInstances()}pause(){this._logsStream?.pause(),this._view.updateState((t=>{t.type="logStreamPaused"}))}resume(){this._logsStream?.resume(),this._view.updateState((t=>{t.type="receivingLogs"}))}_stopAndClearLogs(){this._logsStream?.close(),this._logsBuffer.clear(),this._view.component.clear()}_stopAndClearInstances(){this._instancesManager?.close(),this._instancesManager?.clear(),this._view.updateState({type:"loadingInstances"})}_onLogsBufferFlush(t){this._view.component.appendLogs(t)}_onInstancesChanged(t){this._view.updateState((e=>{e.instances=t}))}async _convertLog(t){const e=await this._instancesManager.getOrFetchInstance(t.instanceId);return{id:t.id,date:new Date(t.date),message:t.message,metadata:[{name:"instance",value:e.ghost?"?":e.name},{name:"instanceId",value:e.id}]}}_optimizeLogsStreamParameters(){if(c(this._dateRange))return this._dateRange;if(0===this._selection.length)return this._dateRange;const t=this._selection.map((t=>this._instancesManager.getInstance(t)));if(null!=t.find((t=>T(t))))return this._dateRange;const e=(new Date).getTime(),n=t.map((t=>t.creationDate.getTime())).reduce(((t,e)=>Math.min(t,e)),1/0);let s=t.map((t=>t.deletionDate?.getTime()??e)).reduce(((t,e)=>Math.max(t,e)),-1/0);s=s===-1/0?1/0:s;const a=null==this._dateRange.until?1/0:new Date(this._dateRange.until).getTime(),i=Math.min(s,a);return{since:new Date(Math.max(n,new Date(this._dateRange.since).getTime())).toISOString(),until:i===1/0?null:new Date(i).toISOString()}}}class D{constructor(t,e){this._api=t,this._instancesMap=new Map,this._onChange=e,this._deploymentsManager=new R(t)}async getOrFetchInstance(t){if(this._instancesMap.has(t))return this._instancesMap.get(t);const e=await this._fetchAndConvert(t);return this._instancesMap.set(t,e),this._fireChanged(),e}getInstance(t){return this._instancesMap.get(t)}async fetchInstances(t,e){const n=await this._api.fetchInstances(t,e);await this._deploymentsManager.fetchOrRefreshDeployments(n.map((t=>t.deploymentId)));const s=await Promise.all(n.map((t=>this._convert(t))));return O(s,"id",this._instancesMap),s}async fetchInstancesByDeployment(t){const e=await this._api.fetchInstancesByDeployment(t);await this._deploymentsManager.fetchOrRefreshDeployments(e.map((t=>t.deploymentId)));const n=await Promise.all(e.map((t=>this._convert(t))));return O(n,"id",this._instancesMap),n}hasInstance(t){return this._instancesMap.has(t)}getInstances(){return Array.from(this._instancesMap.values())}close(){this._stopRefresher()}clear(){this._instancesMap.clear()}enabledAutoRefresh(t){t&&null==this._refresher?this._startRefresher():t||null==this._refresher||this._stopRefresher()}getLastDeploymentInstances(){if(0===this._instancesMap.size)return[];const t=this._deploymentsManager.getLastDeployment();return Array.from(this._instancesMap.values()).filter((e=>e.deployment===t))}_startRefresher(){this._refresher=setInterval((async()=>{const t=Array.from(this._instancesMap.values()).filter((t=>T(t)||"SUCCEEDED"!==t.deployment.state||"DELETED"!==t.state));await this._deploymentsManager.fetchOrRefreshDeployments(t.map((t=>t.deployment.id)));const e=await Promise.all(t.map((t=>this._fetchAndConvert(t.id))));e.some((t=>this._hasChanged(t)))&&(O(e,"id",this._instancesMap),this._fireChanged())}),2e3)}_stopRefresher(){clearInterval(this._refresher),this._refresher=null}async _fetchAndConvert(t){let e;try{e=await this._api.fetchInstance(t)}catch(e){if(404===e?.response?.status)return{ghost:!0,id:t}}return this._convert(e)}async _convert(t){let e;return null==t.deploymentId?console.error(`deploymentId is null! Could not get deployment for instance ${t.id}.`):e=await this._deploymentsManager.getOrFetchDeployment(t.deploymentId),{id:t.id,name:t.name,index:t.index,deployment:e,state:t.state,creationDate:new Date(t.creationDate),deletionDate:null!=t.deletionDate?new Date(t.deletionDate):null,kind:t.isBuildVm?"BUILD":"RUN"}}_fireChanged(){this._onChange(this.getInstances())}_hasChanged(t){const e=this._instancesMap.get(t.id);return null==e||(T(e)?!T(t):e.state!==t.state||e.deployment.state!==t.deployment.state)}}class R{constructor(t){this._api=t,this._deploymentsMap=new Map}async getOrFetchDeployment(t){let e=this._deploymentsMap.get(t);return null==e&&(e=await this._fetchAndConvert(t),this._deploymentsMap.set(t,e)),e}async fetchOrRefreshDeployments(t){const e=t.flatMap(o).filter((t=>{const e=this._deploymentsMap.get(t);return null==e||"QUEUED"===e.state||"WORK_IN_PROGRESS"===e.state}));O(await Promise.all(e.map((t=>this._fetchAndConvert(t)))),"id",this._deploymentsMap)}getLastDeployment(){if(0===this._deploymentsMap.size)return null;return Array.from(this._deploymentsMap.values()).sort(((t,e)=>N(t)?-1:N(e)?1:e.creationDate.getTime()-t.creationDate.getTime()))[0]}async _fetchAndConvert(t){try{return await this._convertV4(await this._api.fetchDeployment(t),"v4")}catch(e){if(404===e?.response?.status)return await this._convertV2(await this._api.fetchDeploymentV2(t),"v2");throw e}}_convertV4(t){const e={id:t.id,state:t.state,creationDate:new Date(t.startDate),commitId:t.version.commitId};return"SUCCEEDED"!==e.state&&"FAILED"!==e.state&&"CANCELLED"!==e.state||(e.endDate=new Date(t.steps.find((t=>t.state===e.state)).date)),e}async _convertV2(t){let e;"QUEUED"===t.state?e="QUEUED":"WIP"===t.state?e="WORK_IN_PROGRESS":"OK"===t.state?e="SUCCEEDED":"CANCELLED"===t.state?e="CANCELLED":"FAIL"===t.state&&(e="FAILED");let n=null;if("SUCCEEDED"===e||"FAILED"===e||"CANCELLED"===e){const e=await this._api.fetchInstancesByDeployment(t.uuid);for(const t of e){if(null==t.deletionDate){n=null;break}const e=new Date(t.deletionDate).getTime();n=null==n?e:Math.max(n,e)}}return{id:t.uuid,state:e,creationDate:new Date(t.date),endDate:null==n?null:new Date(n),commitId:t.commit}}}class A{constructor(t,e,n){this._logsStream=null,this._apiConfig=t,this._params=e,this._callbacks=n}open(){if(null!=this._logsStream)throw new Error("Already opened");this._logsStream=new v({apiHost:this._apiConfig.API_HOST,tokens:this._apiConfig,ownerId:this._params.applicationRef.ownerId,appId:this._params.applicationRef.applicationId,since:this._params.since,until:this._params.until,instanceId:this._params.instances,retryConfiguration:{enabled:!0,maxRetryCount:10},throttleElements:1e3,throttlePerInMilliseconds:10}).on("open",this._callbacks.onOpen).onLog(this._callbacks.onLog).on("error",(t=>{this._logsStream.retryCount>=3&&this._callbacks.onError(t.error)})),this._logsStream.start().then((t=>{this._callbacks.onFinish(t.reason),this._logsStream=null})).catch((t=>{this._callbacks.onFatalError(t),this._logsStream=null}))}pause(){this._logsStream.pause()}resume(){this._logsStream.resume()}close(){null!=this._logsStream&&(this._logsStream.close("USER_CLOSE"),this._logsStream=null)}}class b{constructor(t,e){this._apiConfig=t,this._commonApiPrams={id:e.ownerId,appId:e.applicationId}}fetchDeployment(t){return M.getDeployment({...this._commonApiPrams,deploymentId:t}).then(i({apiConfig:this._apiConfig}))}fetchDeploymentV2(t){return L.getDeployment({...this._commonApiPrams,deploymentId:t}).then(i({apiConfig:this._apiConfig}))}fetchInstances(t,e){return M.getInstances({...this._commonApiPrams,limit:100,since:t,until:e}).then(i({apiConfig:this._apiConfig}))}fetchInstancesByDeployment(t){return M.getInstances({...this._commonApiPrams,limit:100,deploymentId:t}).then(i({apiConfig:this._apiConfig}))}fetchInstance(t){return M.getInstance({...this._commonApiPrams,instanceId:t}).then(i({apiConfig:this._apiConfig}))}}const M={getInstances:t=>Promise.resolve({method:"get",url:`/v4/orchestration/organisations/${t.id}/applications/${t.appId}/instances`,headers:{Accept:"application/json"},queryParams:s(t,["limit","since","until","deploymentId","includeState"])}),getInstance:t=>Promise.resolve({method:"get",url:`/v4/orchestration/organisations/${t.id}/applications/${t.appId}/instances/${t.instanceId}`,headers:{Accept:"application/json"}}),getDeployment:t=>Promise.resolve({method:"get",url:`/v4/orchestration/organisations/${t.id}/applications/${t.appId}/deployments/${t.deploymentId}`,headers:{Accept:"application/json"}})},L={getDeployment:t,getAllInstances:e};function O(t,e,n){t.forEach((t=>{n.set(t[e],t)}))}function T(t){return!0===t.ghost}function N(t){return"WORK_IN_PROGRESS"===t.state||"QUEUED"===t.state||null==t.endDate}