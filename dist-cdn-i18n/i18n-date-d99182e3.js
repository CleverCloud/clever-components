const n=[{unit:"year",duration:315576e5},{unit:"month",duration:26298e5},{unit:"week",duration:6048e5},{unit:"day",duration:864e5},{unit:"hour",duration:36e5},{unit:"minute",duration:6e4},{unit:"second",duration:1e3}];function t(t,e,r){const o="RelativeTimeFormat"in Intl?(n,e)=>new Intl.RelativeTimeFormat(t,{numeric:"auto"}).format(-n,e):e;return function(t){const e=new Date(t).getTime(),i=(new Date).getTime()-e;for(const{unit:t,duration:e}of n){const n=i/e,r=Math.round(n);if(n>=1)return o(r,t)}return r}}function e(n,t){const e=new Intl.DateTimeFormat(n,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric",timeZoneName:"short"}),r=new Date(t);return e.format(r)}function r(n,t){const e=new Intl.DateTimeFormat(n,{year:"numeric",month:"short",day:"numeric",hour:"numeric",minute:"numeric"}),r=new Date(t);return e.format(r)}function o(n,t){const e=new Intl.DateTimeFormat(n,{year:"numeric",month:"short",day:"numeric"}),r=new Date(t);return e.format(r)}function i(n,t){const e=new Intl.DateTimeFormat(n,{hour:"numeric"}),r=new Date(t);return e.format(r)}export{r as a,o as b,i as c,e as f,t as p};