/**
 * @typedef {import('./cc-product-list.types.js').CategoryData} CategoryData
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

    /** @type {CategoryData[]} The initial category data list. */
    this._categoryDataList = [];

    /** @type {CategoryData[]} category data list filtered by the category selected nor with the input */
    this._currentCategoryDataList = [];

    /** @type {CategoryFilter[]}  */
    this._categoriesFilters = [];

    /** @type {'all'|string}  */
    this._currentCategoryNameFilter = 'all';
  }

  getCategoryDataList () {
    return this._currentCategoryDataList;
  }

  /**
   * @param {CategoryData[]} categoryDataList
   */
  set categoryDataList (categoryDataList) {

    this._categoryDataList = categoryDataList;
    this._currentCategoryDataList = this._categoryDataList;
    this._categoriesFilters = this._categoryDataList.map(({ categoryName }) => ({ categoryName, toggled: false }));
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

    // @type {ProductSection[]}
    const currentCategoryProductsList = this._getProductsByCurrentCategory();

    if (searchInput == null || searchInput === '') {
      this._currentCategoryDataList = currentCategoryProductsList;
      this._host.requestUpdate();
      return;
    }

    const searchTerms = searchInput
      .toLowerCase()
      .trim()
      .split(' ')
      .filter((i) => i !== '');

    this._currentCategoryDataList = currentCategoryProductsList
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

    this._currentCategoryDataList = this._getProductsByCurrentCategory();

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
      ? this._categoryDataList.filter(({ categoryName }) => categoryName === this._currentCategoryNameFilter)
      : this._categoryDataList;
  }

}
