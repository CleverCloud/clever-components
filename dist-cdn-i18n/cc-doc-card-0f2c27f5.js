import{s as e}from"./i18n-sanitize-4edc4a2d.js";import"./cc-img-8b44c495.js";import{f as t}from"./fake-strings-b70817e4.js";import{s as i}from"./skeleton-68a3d018.js";import{l as s}from"./cc-link-f2b8f554.js";import{s as a,x as r,i as d}from"./lit-element-98ed46d4.js";import{o}from"./class-map-1feb5cf7.js";const n={heading:t(6),description:t(110),link:null,icons:[]};class c extends a{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){const t="loading"===this.state.type,{heading:i,description:s,link:a}="loaded"===this.state.type?this.state:n;return r`
      <div class="images">
        ${t?r`
          <cc-img skeleton></cc-img>
        `:""}
        ${"loaded"===this.state.type?r`
          ${this.state.icons.map((e=>r`
            <cc-img src=${e}></cc-img>
          `))}
        `:""}
      </div>
      <div class="title">
        <span class="${o({skeleton:t})}">${i}</span>
      </div>
      <div class="desc">
        <span class="${o({skeleton:t})}">${s}</span>
      </div>
      <div class="link ${o({skeleton:t})}">
        ${"loaded"===this.state.type?(({link:t,product:i})=>e`<a href=${t} aria-label="Lire la documentation - ${i}">Lire la documentation</a>`)({link:a,product:i}):"Lire la documentation"}
      </div>
    `}static get styles(){return[s,i,d`
        :host {
          display: grid;
          box-sizing: border-box;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 1em;
          grid-template-areas: 
            'img title'
            'desc desc'
            'link link';
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content 1fr min-content;
        }
        
        .images {
          display: flex;
          gap: 0.5em;
          grid-area: img;
        }

        cc-img {
          width: 2em;
          height: 2em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .title {
          align-self: center;
          font-size: 1.2em;
          font-weight: bold;
          grid-area: title;
          justify-self: start;
        }

        .desc {
          grid-area: desc;
        }

        .link {
          align-self: end;
          grid-area: link;
          justify-self: end;
        }
        
        .skeleton {
          background-color: #bbb;
        }
        
      `]}}window.customElements.define("cc-doc-card",c);export{c as CcDocCard};
