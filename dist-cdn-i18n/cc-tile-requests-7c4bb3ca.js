import{c as t,b as e}from"./i18n-date-d99182e3.js";import{a as r,c as a}from"./i18n-number-a9c20d27.js";import{s as i}from"./i18n-sanitize-4edc4a2d.js";import{p as o}from"./i18n-string-3f556d8d.js";import"./cc-button-fafeef50.js";import{m as n,i as s,t as l,r as c,e as d,f as h,v as u,g as f,h as p,A as y,P as x,a as _,j as g,C as m,B as v,p as b,b as w,L as k,c as M}from"./chart.esm-50c173f4.js";import{n as C}from"./cc-clever.icons-e2a98bd6.js";import{k as $,j as A}from"./cc-remix.icons-d7d44eac.js";import{R as P}from"./resize-controller-3aadf1c4.js";import{t as S}from"./info-tiles-8286a15a.js";import{s as j}from"./skeleton-68a3d018.js";import{s as I,x as z,i as R}from"./lit-element-98ed46d4.js";import{e as D,n as T}from"./ref-948c5e44.js";import{o as q}from"./class-map-1feb5cf7.js";const B="fr",W=o(B),E=a(B);var H=function(){if("undefined"!=typeof window){if(window.devicePixelRatio)return window.devicePixelRatio;var t=window.screen;if(t)return(t.deviceXDPI||1)/(t.logicalXDPI||1)}return 1}(),V=function(t){var e,r=[];for(t=[].concat(t);t.length;)"string"==typeof(e=t.pop())?r.unshift.apply(r,e.split("\n")):Array.isArray(e)?t.push.apply(t,e):s(t)||r.unshift(""+e);return r},N=function(t,e,r){var a,i=[].concat(e),o=i.length,n=t.font,s=0;for(t.font=r.string,a=0;a<o;++a)s=Math.max(t.measureText(i[a]).width,s);return t.font=n,{height:o*r.lineHeight,width:s}},U=function(t,e,r){return Math.max(t,Math.min(e,r))},O=function(t,e){var r,a,i,o,n=t.slice(),s=[];for(r=0,i=e.length;r<i;++r)o=e[r],-1===(a=n.indexOf(o))?s.push([o,1]):n.splice(a,1);for(r=0,i=n.length;r<i;++r)s.push([n[r],-1]);return s};function L(t,e){var r=e.x,a=e.y;if(null===r)return{x:0,y:-1};if(null===a)return{x:1,y:0};var i=t.x-r,o=t.y-a,n=Math.sqrt(i*i+o*o);return{x:n?i/n:0,y:n?o/n:-1}}var X=0,F=1,G=2,J=4,Z=8;function K(t,e,r){var a=X;return t<r.left?a|=F:t>r.right&&(a|=G),e<r.top?a|=Z:e>r.bottom&&(a|=J),a}function Q(t,e){var r,a,i=e.anchor,o=t;return e.clamp&&(o=function(t,e){for(var r,a,i,o=t.x0,n=t.y0,s=t.x1,l=t.y1,c=K(o,n,e),d=K(s,l,e);c|d&&!(c&d);)(r=c||d)&Z?(a=o+(s-o)*(e.top-n)/(l-n),i=e.top):r&J?(a=o+(s-o)*(e.bottom-n)/(l-n),i=e.bottom):r&G?(i=n+(l-n)*(e.right-o)/(s-o),a=e.right):r&F&&(i=n+(l-n)*(e.left-o)/(s-o),a=e.left),r===c?c=K(o=a,n=i,e):d=K(s=a,l=i,e);return{x0:o,x1:s,y0:n,y1:l}}(o,e.area)),"start"===i?(r=o.x0,a=o.y0):"end"===i?(r=o.x1,a=o.y1):(r=(o.x0+o.x1)/2,a=(o.y0+o.y1)/2),function(t,e,r,a,i){switch(i){case"center":r=a=0;break;case"bottom":r=0,a=1;break;case"right":r=1,a=0;break;case"left":r=-1,a=0;break;case"top":r=0,a=-1;break;case"start":r=-r,a=-a;break;case"end":break;default:i*=Math.PI/180,r=Math.cos(i),a=Math.sin(i)}return{x:t,y:e,vx:r,vy:a}}(r,a,t.vx,t.vy,e.align)}var Y=function(t,e){var r=(t.startAngle+t.endAngle)/2,a=Math.cos(r),i=Math.sin(r),o=t.innerRadius,n=t.outerRadius;return Q({x0:t.x+a*o,y0:t.y+i*o,x1:t.x+a*n,y1:t.y+i*n,vx:a,vy:i},e)},tt=function(t,e){var r=L(t,e.origin),a=r.x*t.options.radius,i=r.y*t.options.radius;return Q({x0:t.x-a,y0:t.y-i,x1:t.x+a,y1:t.y+i,vx:r.x,vy:r.y},e)},et=function(t,e){var r=L(t,e.origin),a=t.x,i=t.y,o=0,n=0;return t.horizontal?(a=Math.min(t.x,t.base),o=Math.abs(t.base-t.x)):(i=Math.min(t.y,t.base),n=Math.abs(t.base-t.y)),Q({x0:a,y0:i+n,x1:a+o,y1:i,vx:r.x,vy:r.y},e)},rt=function(t,e){var r=L(t,e.origin);return Q({x0:t.x,y0:t.y,x1:t.x,y1:t.y,vx:r.x,vy:r.y},e)},at=function(t){return Math.round(t*H)/H};function it(t,e){var r=e.chart.getDatasetMeta(e.datasetIndex).vScale;if(!r)return null;if(void 0!==r.xCenter&&void 0!==r.yCenter)return{x:r.xCenter,y:r.yCenter};var a=r.getBasePixel();return t.horizontal?{x:a,y:null}:{x:null,y:a}}function ot(t,e,r){var a=r.backgroundColor,i=r.borderColor,o=r.borderWidth;(a||i&&o)&&(t.beginPath(),function(t,e,r,a,i,o){var n=Math.PI/2;if(o){var s=Math.min(o,i/2,a/2),l=e+s,c=r+s,d=e+a-s,h=r+i-s;t.moveTo(e,c),l<d&&c<h?(t.arc(l,c,s,-Math.PI,-n),t.arc(d,c,s,-n,0),t.arc(d,h,s,0,n),t.arc(l,h,s,n,Math.PI)):l<d?(t.moveTo(l,r),t.arc(d,c,s,-n,n),t.arc(l,c,s,n,Math.PI+n)):c<h?(t.arc(l,c,s,-Math.PI,0),t.arc(l,h,s,0,Math.PI)):t.arc(l,c,s,-Math.PI,Math.PI),t.closePath(),t.moveTo(e,r)}else t.rect(e,r,a,i)}(t,at(e.x)+o/2,at(e.y)+o/2,at(e.w)-o,at(e.h)-o,r.borderRadius),t.closePath(),a&&(t.fillStyle=a,t.fill()),i&&o&&(t.strokeStyle=i,t.lineWidth=o,t.lineJoin="miter",t.stroke()))}function nt(t,e,r){var a=t.shadowBlur,i=r.stroked,o=at(r.x),n=at(r.y),s=at(r.w);i&&t.strokeText(e,o,n,s),r.filled&&(a&&i&&(t.shadowBlur=0),t.fillText(e,o,n,s),a&&i&&(t.shadowBlur=a))}var st=function(t,e,r,a){var i=this;i._config=t,i._index=a,i._model=null,i._rects=null,i._ctx=e,i._el=r};n(st.prototype,{_modelize:function(t,e,r,a){var i,o=this,n=o._index,s=l(c([r.font,{}],a,n)),u=c([r.color,d.color],a,n);return{align:c([r.align,"center"],a,n),anchor:c([r.anchor,"center"],a,n),area:a.chart.chartArea,backgroundColor:c([r.backgroundColor,null],a,n),borderColor:c([r.borderColor,null],a,n),borderRadius:c([r.borderRadius,0],a,n),borderWidth:c([r.borderWidth,0],a,n),clamp:c([r.clamp,!1],a,n),clip:c([r.clip,!1],a,n),color:u,display:t,font:s,lines:e,offset:c([r.offset,0],a,n),opacity:c([r.opacity,1],a,n),origin:it(o._el,a),padding:h(c([r.padding,0],a,n)),positioner:(i=o._el,i instanceof y?Y:i instanceof x?tt:i instanceof _?et:rt),rotation:c([r.rotation,0],a,n)*(Math.PI/180),size:N(o._ctx,e,s),textAlign:c([r.textAlign,"start"],a,n),textShadowBlur:c([r.textShadowBlur,0],a,n),textShadowColor:c([r.textShadowColor,u],a,n),textStrokeColor:c([r.textStrokeColor,u],a,n),textStrokeWidth:c([r.textStrokeWidth,0],a,n)}},update:function(t){var e,r,a,i=this,o=null,n=null,l=i._index,d=i._config,h=c([d.display,!0],t,l);h&&(e=t.dataset.data[l],r=u(f(d.formatter,[e,t]),e),(a=s(r)?[]:V(r)).length&&(n=function(t){var e=t.borderWidth||0,r=t.padding,a=t.size.height,i=t.size.width,o=-i/2,n=-a/2;return{frame:{x:o-r.left-e,y:n-r.top-e,w:i+r.width+2*e,h:a+r.height+2*e},text:{x:o,y:n,w:i,h:a}}}(o=i._modelize(h,a,d,t)))),i._model=o,i._rects=n},geometry:function(){return this._rects?this._rects.frame:{}},rotation:function(){return this._model?this._model.rotation:0},visible:function(){return this._model&&this._model.opacity},model:function(){return this._model},draw:function(t,e){var r,a=t.ctx,i=this._model,o=this._rects;this.visible()&&(a.save(),i.clip&&(r=i.area,a.beginPath(),a.rect(r.left,r.top,r.right-r.left,r.bottom-r.top),a.clip()),a.globalAlpha=U(0,i.opacity,1),a.translate(at(e.x),at(e.y)),a.rotate(i.rotation),ot(a,o.frame,i),function(t,e,r,a){var i,o=a.textAlign,n=a.color,s=!!n,l=a.font,c=e.length,d=a.textStrokeColor,h=a.textStrokeWidth,u=d&&h;if(c&&(s||u))for(r=function(t,e,r){var a=r.lineHeight,i=t.w,o=t.x;return"center"===e?o+=i/2:"end"!==e&&"right"!==e||(o+=i),{h:a,w:i,x:o,y:t.y+a/2}}(r,o,l),t.font=l.string,t.textAlign=o,t.textBaseline="middle",t.shadowBlur=a.textShadowBlur,t.shadowColor=a.textShadowColor,s&&(t.fillStyle=n),u&&(t.lineJoin="round",t.lineWidth=h,t.strokeStyle=d),i=0,c=e.length;i<c;++i)nt(t,e[i],{stroked:u,filled:s,w:r.w,x:r.x,y:r.y+r.h*i})}(a,i.lines,o.text,i),a.restore())}});var lt=Number.MIN_SAFE_INTEGER||-9007199254740991,ct=Number.MAX_SAFE_INTEGER||9007199254740991;function dt(t,e,r){var a=Math.cos(r),i=Math.sin(r),o=e.x,n=e.y;return{x:o+a*(t.x-o)-i*(t.y-n),y:n+i*(t.x-o)+a*(t.y-n)}}function ht(t,e){var r,a,i,o,n,s=ct,l=lt,c=e.origin;for(r=0;r<t.length;++r)i=(a=t[r]).x-c.x,o=a.y-c.y,n=e.vx*i+e.vy*o,s=Math.min(s,n),l=Math.max(l,n);return{min:s,max:l}}function ut(t,e){var r=e.x-t.x,a=e.y-t.y,i=Math.sqrt(r*r+a*a);return{vx:(e.x-t.x)/i,vy:(e.y-t.y)/i,origin:t,ln:i}}var ft=function(){this._rotation=0,this._rect={x:0,y:0,w:0,h:0}};function pt(t,e,r){var a=e.positioner(t,e),i=a.vx,o=a.vy;if(!i&&!o)return{x:a.x,y:a.y};var n=r.w,s=r.h,l=e.rotation,c=Math.abs(n/2*Math.cos(l))+Math.abs(s/2*Math.sin(l)),d=Math.abs(n/2*Math.sin(l))+Math.abs(s/2*Math.cos(l)),h=1/Math.max(Math.abs(i),Math.abs(o));return c*=i*h,d*=o*h,c+=e.offset*i,d+=e.offset*o,{x:a.x+c,y:a.y+d}}n(ft.prototype,{center:function(){var t=this._rect;return{x:t.x+t.w/2,y:t.y+t.h/2}},update:function(t,e,r){this._rotation=r,this._rect={x:e.x+t.x,y:e.y+t.y,w:e.w,h:e.h}},contains:function(t){var e=this,r=e._rect;return!((t=dt(t,e.center(),-e._rotation)).x<r.x-1||t.y<r.y-1||t.x>r.x+r.w+2||t.y>r.y+r.h+2)},intersects:function(t){var e,r,a,i=this._points(),o=t._points(),n=[ut(i[0],i[1]),ut(i[0],i[3])];for(this._rotation!==t._rotation&&n.push(ut(o[0],o[1]),ut(o[0],o[3])),e=0;e<n.length;++e)if(r=ht(i,n[e]),a=ht(o,n[e]),r.max<a.min||a.max<r.min)return!1;return!0},_points:function(){var t=this,e=t._rect,r=t._rotation,a=t.center();return[dt({x:e.x,y:e.y},a,r),dt({x:e.x+e.w,y:e.y},a,r),dt({x:e.x+e.w,y:e.y+e.h},a,r),dt({x:e.x,y:e.y+e.h},a,r)]}});var yt={prepare:function(t){var e,r,a,i,o,n=[];for(e=0,a=t.length;e<a;++e)for(r=0,i=t[e].length;r<i;++r)o=t[e][r],n.push(o),o.$layout={_box:new ft,_hidable:!1,_visible:!0,_set:e,_idx:r};return n.sort((function(t,e){var r=t.$layout,a=e.$layout;return r._idx===a._idx?a._set-r._set:a._idx-r._idx})),this.update(n),n},update:function(t){var e,r,a,i,o,n=!1;for(e=0,r=t.length;e<r;++e)i=(a=t[e]).model(),(o=a.$layout)._hidable=i&&"auto"===i.display,o._visible=a.visible(),n|=o._hidable;n&&function(t){var e,r,a,i,o,n,s;for(e=0,r=t.length;e<r;++e)(i=(a=t[e]).$layout)._visible&&(s=new Proxy(a._el,{get:(t,e)=>t.getProps([e],!0)[e]}),o=a.geometry(),n=pt(s,a.model(),o),i._box.update(n,o,a.rotation()));(function(t,e){var r,a,i,o;for(r=t.length-1;r>=0;--r)for(i=t[r].$layout,a=r-1;a>=0&&i._visible;--a)(o=t[a].$layout)._visible&&i._box.intersects(o._box)&&e(i,o)})(t,(function(t,e){var r=t._hidable,a=e._hidable;r&&a||a?e._visible=!1:r&&(t._visible=!1)}))}(t)},lookup:function(t,e){var r,a;for(r=t.length-1;r>=0;--r)if((a=t[r].$layout)&&a._visible&&a._box.contains(e))return t[r];return null},draw:function(t,e){var r,a,i,o,n,s;for(r=0,a=e.length;r<a;++r)(o=(i=e[r]).$layout)._visible&&(n=i.geometry(),s=pt(i._el,i.model(),n),o._box.update(s,n,i.rotation()),i.draw(t,s))}},xt="$datalabels",_t="$default";function gt(t,e,r){if(e){var a,i=r.$context,o=r.$groups;e[o._set]&&(a=e[o._set][o._key])&&!0===f(a,[i])&&(t[xt]._dirty=!0,r.update(i))}}function mt(t,e){var r,a,i=t[xt],o=i._listeners;if(o.enter||o.leave){if("mousemove"===e.type)a=yt.lookup(i._labels,e);else if("mouseout"!==e.type)return;r=i._hovered,i._hovered=a,function(t,e,r,a){var i,o;(r||a)&&(r?a?r!==a&&(o=i=!0):o=!0:i=!0,o&&gt(t,e.leave,r),i&&gt(t,e.enter,a))}(t,o,r,a)}}var vt={id:"datalabels",defaults:{align:"center",anchor:"center",backgroundColor:null,borderColor:null,borderRadius:0,borderWidth:0,clamp:!1,clip:!1,color:void 0,display:!0,font:{family:void 0,lineHeight:1.2,size:void 0,style:void 0,weight:null},formatter:function(t){if(s(t))return null;var e,r,a,i=t;if(g(t))if(s(t.label))if(s(t.r))for(i="",a=0,r=(e=Object.keys(t)).length;a<r;++a)i+=(0!==a?", ":"")+e[a]+": "+t[e[a]];else i=t.r;else i=t.label;return""+i},labels:void 0,listeners:{},offset:4,opacity:1,padding:{top:4,right:4,bottom:4,left:4},rotation:0,textAlign:"start",textStrokeColor:void 0,textStrokeWidth:0,textShadowBlur:0,textShadowColor:void 0},beforeInit:function(t){t[xt]={_actives:[]}},beforeUpdate:function(t){var e=t[xt];e._listened=!1,e._listeners={},e._datasets=[],e._labels=[]},afterDatasetUpdate:function(t,e,r){var a,i,o,s,l,c,d,h,u=e.index,f=t[xt],y=f._datasets[u]=[],x=t.isDatasetVisible(u),_=t.data.datasets[u],g=function(t,e){var r,a,i,o=t.datalabels,s=[];return!1===o?null:(!0===o&&(o={}),e=n({},[e,o]),a=e.labels||{},i=Object.keys(a),delete e.labels,i.length?i.forEach((function(t){a[t]&&s.push(n({},[e,a[t],{_key:t}]))})):s.push(e),r=s.reduce((function(t,e){return p(e.listeners||{},(function(r,a){t[a]=t[a]||{},t[a][e._key||_t]=r})),delete e.listeners,t}),{}),{labels:s,listeners:r})}(_,r),m=e.meta.data||[],v=t.ctx;for(v.save(),a=0,o=m.length;a<o;++a)if((d=m[a])[xt]=[],x&&d&&t.getDataVisibility(a)&&!d.skip)for(i=0,s=g.labels.length;i<s;++i)c=(l=g.labels[i])._key,(h=new st(l,v,d,a)).$groups={_set:u,_key:c||_t},h.$context={active:!1,chart:t,dataIndex:a,dataset:_,datasetIndex:u},h.update(h.$context),d[xt].push(h),y.push(h);v.restore(),n(f._listeners,g.listeners,{merger:function(t,r,a){r[t]=r[t]||{},r[t][e.index]=a[t],f._listened=!0}})},afterUpdate:function(t,e){t[xt]._labels=yt.prepare(t[xt]._datasets,e)},afterDatasetsDraw:function(t){yt.draw(t,t[xt]._labels)},beforeEvent:function(t,e){if(t[xt]._listened){var r=e.event;switch(r.type){case"mousemove":case"mouseout":mt(t,r);break;case"click":!function(t,e){var r=t[xt],a=r._listeners.click,i=a&&yt.lookup(r._labels,e);i&&gt(t,a,i)}(t,r)}}},afterEvent:function(t){var e,r,a,i,o,n,s,l=t[xt],c=l._actives,d=l._actives=t.getActiveElements(),h=O(c,d);for(e=0,r=h.length;e<r;++e)if((o=h[e])[1])for(a=0,i=(s=o[0].element[xt]||[]).length;a<i;++a)(n=s[a]).$context.active=1===o[1],n.update(n.$context);(l._dirty||h.length)&&(yt.update(l._labels),t.render()),delete l._dirty}},bt=vt;m.register(v,_,b,w,k,M);const wt=Array.from(new Array(24)).map((()=>[0,0,1]));class kt extends I{static get properties(){return{state:{type:Object},_barCount:{type:Number,state:!0},_docs:{type:Boolean,state:!0},_empty:{type:Boolean,state:!0}}}constructor(){super(),this.state={type:"loading"},this._barCount=6,this._ctxRef=D(),this._docs=!1,this._empty=!1,this._resizeController=new P(this)}_onToggleDocs(){this._docs=!this._docs}async _refreshChart(){const e="loading"===this.state.type,r="loaded"===this.state.type?this.state.data:wt;if(this._empty=0===r.length,this._empty)return;const a=24/this._barCount;this._groupedData=Array.from(new Array(this._barCount)).map(((t,e)=>{const i=e*a,o=(e+1)*a;return[r[i][0],r[o-1][1],r.slice(i,o).map((t=>t[2])).reduce(((t,e)=>t+e),0)]})),this._groupedValues=this._groupedData.map((([t,e,r])=>r)),this._xLabels=e?this._groupedData.map((()=>"??")):this._groupedData.map((([e])=>(({date:e})=>t(B,e))({date:e})));const i=e?"#bbb":"#30ab61";await this.updateComplete;const o=Math.ceil(1.2*Math.max(...this._groupedValues));this._chart.options.scales.y.suggestedMax=o,this._chart.options.plugins.tooltip.enabled=!e;const n=this._groupedValues.reduce(((t,e)=>t+e),0);this._chart.options.plugins.title.text=e?"...":(({totalRequests:t})=>{const e=W(t,"requête");return`${E(t)} ${e} sur 24 heures`})({totalRequests:n}),this._chart.data={labels:this._xLabels,datasets:[{backgroundColor:i,data:this._groupedValues}]},this._chart.options.animation.duration=e?0:300,this._chart.update(),this._chart.resize()}firstUpdated(){this._chart=new m(this._ctxRef.value,{plugins:[bt],type:"bar",options:{responsive:!1,maintainAspectRatio:!1,plugins:{title:{display:!0,position:"bottom",padding:0,font:{style:"italic",weight:"normal"}},legend:{display:!1},tooltip:{backgroundColor:"#000",displayColors:!1,callbacks:{title:([r])=>{const[a,i]=this._groupedData[r.dataIndex];return(({from:r,to:a})=>`${e(B,r)} : de ${t(B,r)} à ${t(B,a)}`)({from:a,to:i})},label:t=>{const e=24/this._barCount;return(({value:t,windowHours:e})=>{const a=W(t,"requête"),i=W(e,"heure");return`${r(B,t)} ${a} (en ${e} ${i})`})({value:this._groupedValues[t.dataIndex],windowHours:e})}}},datalabels:{anchor:"end",offset:0,align:"end",formatter:t=>"loading"===this.state.type?"?":(({requestCount:t})=>E(t))({requestCount:t})}},scales:{x:{grid:{drawOnChartArea:!1,drawTicks:!1},ticks:{padding:10,font:{size:12}}},y:{display:!1,beginAtZero:!0}},animation:{duration:0}}})}willUpdate(){const{width:t}=this._resizeController;t<380&&(this._barCount=6),t>=380&&t<540&&(this._barCount=8),t>=540&&(this._barCount=12),this._refreshChart()}updated(t){!t.has("state")||"loaded"!==this.state.type&&"loading"!==this.state.type||this._refreshChart(),super.updated(t)}render(){const t=!("loaded"!==this.state.type&&"loading"!==this.state.type||this._empty||this._docs),e="error"===this.state.type&&!this._docs,r="loaded"===this.state.type&&this._empty&&!this._docs,a=this._docs;return z`
      <div class="tile_title tile_title--image">
        ${"Requêtes HTTP"}
        <cc-button
          class="docs-toggle ${a?"close":"info"}"
          .icon=${a?$:C}
          hide-text
          outlined
          primary
          @cc-button:click=${this._onToggleDocs}
        >${this._docs?"Afficher le graphe":"À propos de ce graphe..."}
        </cc-button>
      </div>

      <div class="tile_body ${q({"tile--hidden":!t})}">
        <div class="chart-container ${q({skeleton:"loading"===this.state.type})}">
          <canvas ${T(this._ctxRef)}></canvas>
        </div>
      </div>

      <div class="tile_message ${q({"tile--hidden":!r})}">${"Il n'y a pas de données à afficher pour l'instant."}</div>

      <div class="tile_message ${q({"tile--hidden":!e})}">
        <div class="error-message">
          <cc-icon .icon="${A}" a11y-name="${"Avertissement"}" class="icon-warning"></cc-icon>
          <p>${"Une erreur est survenue pendant le chargement des requêtes."}</p>
        </div>
      </div>

      <div class="tile_docs ${q({"tile--hidden":!a})}">
        <p>${(({windowHours:t})=>{const e=W(t,"heure");return i`Requêtes HTTP reçues durant les dernières 24 heures. Chaque barre représente une fenêtre de temps de <strong>${t} ${e}</strong>.`})({windowHours:24/this._barCount})}</p>
      </div>
    `}static get styles(){return[S,j,R`
        .tile_title {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .docs-toggle {
          margin: 0 0 0 1em;
          font-size: 0.8em;
        }

        .docs-toggle.close {
          --cc-icon-size: 1.5em;
        }

        .docs-toggle.info {
          --cc-icon-size: 1.25em;
        }

        .chart-container {
          position: absolute;
          width: 100%;
          min-width: 0;
          /* We need this because: https://github.com/chartjs/Chart.js/issues/4156 */
          height: 100%;
        }

        /*
          body, message and docs are placed in the same area (on top of each other)
          this way, we can just hide the docs
          and let the tile take at least the height of the docs text content
         */

        .tile_body,
        .tile_message,
        .tile_docs {
          grid-area: 2 / 1 / 2 / 1;
        }

        /* See above why we hide instead of display:none */

        .tile--hidden {
          visibility: hidden;
        }

        .tile_body {
          position: relative;
          min-height: 140px;
        }

        .tile_docs {
          align-self: center;
          font-size: 0.9em;
          font-style: italic;
        }

        .tile_docs_link {
          color: var(--cc-color-text-primary-highlight);
          text-decoration: underline;
        }

        .error-message {
          display: grid;
          gap: 0.75em;
          grid-template-columns: min-content 1fr;
          text-align: left;
        }

        .error-message p {
          margin: 0;
        }

        .icon-warning {
          align-self: center;
          color: var(--cc-color-text-warning);

          --cc-icon-size: 1.25em;
        }
      `]}}window.customElements.define("cc-tile-requests",kt);export{kt as CcTileRequests};
