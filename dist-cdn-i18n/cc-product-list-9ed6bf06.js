import{a as t}from"./accessibility-664b7197.js";import{l as e}from"./cc-link-f2b8f554.js";import"./cc-product-card-bb5b582c.js";import"./cc-badge-e1a0f4b6.js";import"./cc-icon-f84255c7.js";import"./cc-input-text-8d29ec56.js";import{ProductsController as r}from"./products-controller-a76332eb.js";import{s as i,x as o,i as c}from"./lit-element-98ed46d4.js";class s extends i{static get properties(){return{categoryFilter:{type:String,attribute:"category-filter"},productsByCategories:{type:Array,attribute:"products-by-categories"},textFilter:{type:String,attribute:"text-filter"}}}constructor(){super(),this.categoryFilter=null,this.productsByCategories=[],this.textFilter="",this._productsCrtl=new r(this)}_onCategoryChange(t){this.categoryFilter=t.target.value}_onSearchInput({detail:t}){this.textFilter=t}willUpdate(t){t.has("productsByCategories")&&(this._productsCrtl.productsByCategories=this.productsByCategories),t.has("categoryFilter")&&this._productsCrtl.toggleCategoryFilter(this.categoryFilter),t.has("textFilter")&&(this._productsCrtl.textFilter=this.textFilter)}render(){const t=this._productsCrtl.getCategories();return o`
      <div class="search-form">
        <cc-input-text
          label="${"Chercher un produit"}"
          value="${this.textFilter??""}"
          @cc-input-text:input="${this._onSearchInput}"></cc-input-text>
        <fieldset class="category-filter">
          <legend class="visually-hidden">${"Filtrer par catégorie"}</legend>
          ${this._renderCategory("Tout","all","all"===this._productsCrtl.getCurrentCategory())}
          ${t.map((t=>this._renderCategory(t.categoryName,t.categoryName,t.toggled)))}
        </fieldset>
      </div>
      <div class="products">
        ${this._renderProductsByCategories()}
      </div>
    `}_renderCategory(t,e,r){const i=t.replace(" ","-");return o`
      <input 
        type="radio"
        id="${i}"
        .value=${e}
        name="category-filter"
        class="visually-hidden" 
        @change=${this._onCategoryChange}>
      <label for="${i}">
        <cc-badge
          weight="${r?"dimmed":"outlined"}"
          intent="info"
        >${t}
        </cc-badge>
      </label>
    `}_renderProductsByCategories(){const t=this._productsCrtl.getFilteredProductsByCategories();return 0===t.length?o`
        <p class="search-empty">${"Aucun produit ne correspond à vos critères de recherche."}</p>
      `:t.map((t=>o`
      <div class="category">
        <div class="category-title">
          ${null!=t.icon?o`
            <cc-icon .icon="${t.icon}" class="category-icon"></cc-icon>
          `:""}
          <div class="category-name">${t.categoryName}</div>
        </div>
        <div class="category-products">
          ${t.products.map((t=>o`
            <cc-product-card
              name="${t.name}"
              description="${t.description}"
              .keywords="${t.keywords??[]}"
              icon-url="${t.iconUrl}"
              url="${t.url}"
            ></cc-product-card>
          `))}
        </div>
      </div>
    `))}static get styles(){return[t,e,c`
        :host {
          display: block;
        }

        .category-name {
          font-size: 1.75em;
          font-weight: bold;
        }

        .category-products {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
        }

        .category-title {
          display: flex;
          align-items: center;
          margin: 2.5em 0 1.5em;
          gap: 0.5em;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          padding: 0;
          border: none;
          gap: 0.25em;
        }

        label:hover {
          cursor: pointer;

          --cc-color-bg-primary: var(--cc-color-text-primary-strong);
        }

        input[type='radio']:focus-visible + label {
          /**
          * FIXME:
          * remove this once the "border-radius" of the "cc-badge" component is set on its host instead of its wrapper
          * see https://github.com/CleverCloud/clever-components/issues/990.
          */
          border-radius: 1em;
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .category-icon {
          width: 1.75em;
          height: 1.75em;
        }

        .search-empty {
          margin: 1.5em 0 0;
          font-style: italic;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      `]}}window.customElements.define("cc-product-list",s);export{s as CcProductList};
