function n(n){const e=new Intl.PluralRules(n);return function(n,t,r=t+"s"){return{one:t,other:r}[e.select(n)]}}export{n as p};
