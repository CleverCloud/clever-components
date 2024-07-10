import{i as e,x as i}from"./lit-element-98ed46d4.js";import{o}from"./class-map-1feb5cf7.js";import{l as n}from"./if-defined-cd9b1ec0.js";function c(e){try{return new URL(e,location.href).origin!==location.origin}catch(e){return!0}}const r=(e,r,l=!1,t)=>{const a=null==e||l?void 0:e,s=c(a)?"_blank":void 0,d=c(a)?"noopener noreferrer":void 0;return i`<a class="cc-link ${o({skeleton:l})}" href=${n(a)} target=${n(s)} rel=${n(d)} title="${n(t)}">${r}</a>`},l=e`
  .sanitized-link,
  .sanitized-link:visited,
  .sanitized-link:active,
  .cc-link,
  .cc-link:visited,
  .cc-link:active {
    color: var(--cc-color-text-primary-highlight, blue);
  }

  .sanitized-link:enabled:hover,
  .cc-link:enabled:hover {
    color: var(--cc-color-text-primary);
  }

  .sanitized-link:focus,
  .cc-link:focus {
    background-color: var(--cc-color-bg-default, #fff);
    border-radius: 0.1em;
    outline: var(--cc-focus-outline, #000 solid 2px);
    outline-offset: var(--cc-focus-outline-offset, 2px);
  }

  .sanitized-link::-moz-focus-inner,
  .cc-link::-moz-focus-inner {
    border: 0;
  }

  .cc-link.skeleton,
  .sanitized-link.skeleton,
  .cc-link .skeleton,
  .sanitized-link .skeleton {
    background-color: var(--cc-color-text-primary-weak, hsl(209deg 98% 73%));
    color: transparent;
  }
`;export{r as c,l};
