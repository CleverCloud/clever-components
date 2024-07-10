import"./cc-img-8b44c495.js";import"./cc-button-fafeef50.js";import"./cc-badge-e1a0f4b6.js";import{s as e,x as r,i as o}from"./lit-element-98ed46d4.js";import{o as t}from"./class-map-1feb5cf7.js";class i extends e{static get properties(){return{description:{type:String},iconUrl:{type:String,attribute:"icon-url"},keywords:{type:Array},name:{type:String},url:{type:String}}}constructor(){super(),this.description=null,this.iconUrl=null,this.keywords=[],this.name=null,this.url=null}_areKeywordsAllHidden(){return this.keywords.every((e=>e.hidden))}render(){const e=this.keywords.length>0&&!this._areKeywordsAllHidden();return r`
      <div class="wrapper ${t({"wrapper--no-keywords":!e})}">
        <cc-img src="${this.iconUrl}"></cc-img>
        <a class="name" href="${this.url}" title="${o=this.name,`${o} - sélectionner ce produit`}">${this.name}</a>
        ${e?r`
          <ul class="keywords">
            ${this.keywords.map((e=>e.hidden?"":r`
                <li>
                  <cc-badge class="keyword-badge">${e.value}</cc-badge>
                </li>
              `))}
          </ul>
        `:""}
        <p class="description">${this.description}</p>
      </div>
    `;var o}static get styles(){return[o`
        :host {
          display: block;
        }

        /* region RESET */

        p {
          margin: 0;
        }

        ul {
          padding: 0;
          margin: 0;
          list-style: none;
        }

        /* endregion */

        /* region wrapper */

        .wrapper {
          position: relative;
          display: grid;
          height: 100%;
          box-sizing: border-box;
          padding: 1em;
          border: 2px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 0.75em;
          grid-template-areas: 
            'icon name'
            'keywords keywords'
            'description description';
          grid-template-columns: min-content 1fr;
          grid-template-rows: min-content max-content auto;
        }

        .wrapper:hover {
          border-color: var(--cc-color-border-neutral-focused, #777);
          cursor: pointer;
        }

        .wrapper:focus-within {
          border: 2px solid var(--cc-color-border-neutral-focused, #777);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .wrapper.wrapper--no-keywords {
          grid-template-areas:
            'icon name'
            'description description';
          grid-template-rows: min-content auto;
        }

        /* endregion */

        /* region grid-items */

        cc-img {
          width: 2em;
          height: 2em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .name {
          color: var(--cc-color-text-strongest, #000);
          font-size: 1.75em;
          text-decoration: none;
        }
        
        .name::after {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: '';
        }
        
        .name:focus {
          outline: none;
        }

        .keyword-badge {
          font-size: 0.85em;
        }

        .keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          grid-area: keywords;
        }

        .description {
          color: var(--cc-color-text-weak, #333);
          font-size: 0.8em;
          grid-area: description;
          line-height: 1.5em;
        }

        /*  endregion */

      `]}}window.customElements.define("cc-product-card",i);export{i as CcProductCard};
