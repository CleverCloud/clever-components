/**
 * @typedef {import('./cc-product-list.types.js').ProductSection} ProductSection
 * @typedef {import('./cc-product-list').CcProductList} CcProductList
 * @typedef {import('./cc-product-list.types.js').Category} Category
 */

export class ProductsController {

  constructor (host) {
    /** @type {CcProductList} The host. */
    this._host = host;

    /** @type {ProductSection[]} The initial product list. */
    this._productsList = [];

    /** @type {ProductSection[]} product list filtered by the category selected nor with the input */
    this._currentProductsList = [];

    /** @type {Category[]}  */
    this._categories = [];

    /** @type {'all'|string}  */
    this._currentCategory = 'all';
  }

  getProductsList () {
    return this._currentProductsList;
  }

  /**
   * @param {ProductSection[]} productsList
   */
  set productsList (productsList) {

    const everyPlHasCatName = productsList.every((pl) => pl.categoryName != null);
    const everyProductHasAName = productsList.filter((pl) => pl.products.every((p) => p.name != null)).length === productsList.length;

    if (!everyPlHasCatName || !everyProductHasAName) {
      throw Error('a product list does not have a category name or a product does not have a name');
    }

    this._productsList = productsList;
    this._currentProductsList = this._productsList;
    this._categories = this._productsList.map(({ categoryName }) => ({ categoryName, toggled: false }));
    this._currentCategory = 'all';
  }

  getCategories () {
    return this._categories;
  }

  filterCategory (c) {

    const categoryExists = this._categories.find((cat) => cat.categoryName === c) != null;

    // If we don't have a category or it doesn't exist we reset the category to 'all'
    // If we're being given the current category as it acts as a toggle we also reset to 'all'
    this._currentCategory = (c == null || c === '' || !categoryExists || this._currentCategory === c)
      ? 'all'
      : c;

    this._categories = this._categories.map((category) => {
      return {
        categoryName: category.categoryName,
        toggled: (this._currentCategory !== 'all') ? category.categoryName === this._currentCategory : false,
      };
    });

    this._currentProductsList = this._getProductsByCurrentCategory();

    this._host.requestUpdate();
  }

  _getProductsByCurrentCategory () {
    return (this._currentCategory !== 'all')
      ? this._productsList.filter(({ categoryName }) => categoryName === this._currentCategory)
      : this._productsList;
  }

  /**
   * @param {string|null} input
   */
  search (input) {

    const plByCategory = this._getProductsByCurrentCategory();

    if (input == null || input === '') {
      this._currentProductsList = plByCategory;
      this._host.requestUpdate();
      return;
    }

    const filteredProductsList = [];
    const regex = RegExp(input, 'i');
    const inputKeywordsLowerCase = input
      .toLowerCase()
      .split(' ');

    for (const productSection of plByCategory) {

      /** @type {ProductSection} */
      const filteredProductSection = { categoryName: productSection.categoryName, products: [] };

      if (productSection.icon != null) {
        filteredProductSection.icon = productSection.icon;
      }

      for (const product of productSection.products) {
        const keywords = product?.keywords?.map(({ value }) => value) ?? [];

        const someText = [
          product.name,
          product.description,
          ...keywords,
        ];

        const itMatches = someText.some((text) => {
          return inputKeywordsLowerCase.some((input) => {
            return text.toLowerCase().includes(input);
          });
        });

        if (itMatches) {
          filteredProductSection.products.push(product);
        }
      }

      if (filteredProductSection.products.length > 0) {
        filteredProductsList.push(filteredProductSection);
      }
    }

    this._currentProductsList = filteredProductsList;

    this._host.requestUpdate();
  }
}
