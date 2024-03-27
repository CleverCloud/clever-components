/**
 * @typedef {import('./cc-product-list.types.js').ProductsCategory} ProductsByCategory
 * @typedef {import('./cc-product-list').CcProductList} CcProductList
 * @typedef {import('./cc-product-list.types.js').Product} Product
 * @typedef {import('./cc-product-list.types.js').CategoryFilter} CategoryFilter
 */

export class ProductsController {

  /**
   * @param {CcProductList} host
   */
  constructor (host) {
    /** @type {CcProductList} The host. */
    this._host = host;

    /** @type {ProductsByCategory[]} The initial products category list. */
    this._productsByCategories = [];

    /** @type {ProductsByCategory[]} products list filtered by the category selected nor with the input */
    this._productsByCategoriesFiltered = [];

    /** @type {CategoryFilter[]}  */
    this._categoriesFilters = [];

    /** @type {string|null}  */
    this._currentCategoryNameFilter = null;

    /** @type {string} previous given search in case you toggle */
    this._previousSearch = '';
  }

  getProductsByCategories () {
    return this._productsByCategoriesFiltered;
  }

  /**
   * @param {ProductsByCategory[]} productsByCategories
   */
  set productsByCategories (productsByCategories) {

    this._productsByCategories = productsByCategories;
    this._productsByCategoriesFiltered = this._productsByCategories;
    this._categoriesFilters = this._productsByCategories.map(({ categoryName }) => ({ categoryName, toggled: false }));
    this._currentCategoryNameFilter = 'all';
  }

  getCategories () {
    return this._categoriesFilters;
  }

  getCurrentCategory () {
    return this._currentCategoryNameFilter;
  }

  /**
   * Note: if you want to search from a specific category, please call `toggleCategory` before.
   *
   * @param {string|null} searchInput
   */
  search (searchInput) {

    const searchInputFormatted = searchInput?.toLowerCase().trim();

    // @type {ProductSection[]}
    const currentCategoryProductsList = this._getProductsByCurrentCategory();

    if (searchInputFormatted == null || searchInputFormatted === '') {
      this._previousSearch = '';
      this._productsByCategoriesFiltered = currentCategoryProductsList;
      this._host.requestUpdate();
      return;
    }

    this._previousSearch = searchInput;

    const searchTerms = searchInputFormatted
      .split(' ')
      .filter((i) => i !== '');

    this._productsByCategoriesFiltered = currentCategoryProductsList
      .map((pl) => ({ ...pl, products: this._filterProducts(pl.products, searchTerms) }))
      .filter((pl) => pl.products.length > 0);

    this._host.requestUpdate();

  }

  /**
   * @param {string} categoryName
   */
  toggleCategory (categoryName) {

    const categoryExists = this._categoriesFilters.find((cat) => cat.categoryName === categoryName) != null;

    // If we don't have a category or it doesn't exist we reset the category to 'all'
    // If we're being given the current category as it acts as a toggle we also reset to 'all'
    this._currentCategoryNameFilter = (categoryName == null || categoryName === '' || !categoryExists || this._currentCategoryNameFilter === categoryName)
      ? 'all'
      : categoryName;

    this._categoriesFilters = this._categoriesFilters.map((category) => {
      return {
        categoryName: category.categoryName,
        toggled: (this._currentCategoryNameFilter !== 'all') && (this._currentCategoryNameFilter === category.categoryName),
      };
    });

    this._productsByCategoriesFiltered = this._getProductsByCurrentCategory();
    this.search(this._previousSearch);

    this._host.requestUpdate();
  }

  /**
   * @param {Product[]} products
   * @param {string[]} searchTerms
   * @returns {Product[]|[]}
   */
  _filterProducts (products, searchTerms) {
    return products.filter((product) => {
      const keywords = product?.keywords?.map(({ value }) => value) ?? [];

      const someText = [
        product.name,
        product.description ?? '',
        ...keywords,
      ];

      return someText.some((text) => {
        return searchTerms.some((input) => {
          return text.toLowerCase().includes(input);
        });
      });
    });

  }

  _getProductsByCurrentCategory () {
    return (this._currentCategoryNameFilter !== 'all')
      ? this._productsByCategories.filter(({ categoryName }) => categoryName === this._currentCategoryNameFilter)
      : this._productsByCategories;
  }

}
