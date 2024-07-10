import{b as e}from"./i18n-date-d99182e3.js";import"./cc-img-8b44c495.js";import{f as t}from"./fake-strings-b70817e4.js";import{s as i}from"./skeleton-68a3d018.js";import{c as s,l as r}from"./cc-link-f2b8f554.js";import{s as o,x as a,i as n}from"./lit-element-98ed46d4.js";import{l}from"./if-defined-cd9b1ec0.js";import{o as d}from"./class-map-1feb5cf7.js";const c={date:"Tue, 22 Mar 2022 08:39:00 +0000",description:t(128),title:t(45),link:null,banner:null};class m extends o{static get properties(){return{state:{type:Object}}}constructor(){super(),this.state={type:"loading"}}render(){const t="loading"===this.state.type,i="loaded"===this.state.type?this.state:c;return a`
      <cc-img class="image" src=${l(i.banner)}></cc-img>
      ${t?a`
        <div class="title">
          <span class="skeleton">${i.title}</span>
        </div>
      `:""}
      ${"loaded"===this.state.type?a`
        <div class="title">
          ${s(i.link,i.title)}
        </div>
      `:""}
      <div>
        <span class=${d({skeleton:t})}>${i.description}</span>
      </div>
      <div class="date">
        <span class=${d({skeleton:t})}>${(({date:t})=>e("fr",t))({date:i.date})}</span>
      </div>
    `}static get styles(){return[r,i,n`
        :host {
          display: grid;
          overflow: hidden;
          box-sizing: border-box;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 1em;
          grid-template-columns: 1fr;
          grid-template-rows: min-content min-content 1fr min-content;
        }

        .image {
          display: block;
          height: 8em;
          border-bottom: 1px solid var(--cc-color-border-neutral, #aaa);
          margin: -1em -1em 0;
          justify-self: stretch;
        }

        .title {
          font-size: 1.2em;
          font-weight: bold;
        }

        .title a {
          color: inherit;
          text-decoration: none;
        }

        .title a:hover {
          text-decoration: underline;
        }

        .title a:visited {
          color: inherit;
        }

        .date {
          font-size: 0.85em;
          font-style: italic;
        }

        .skeleton {
          background-color: #bbb;
        }
      `]}}window.customElements.define("cc-article-card",m);export{m as CcArticleCard};
