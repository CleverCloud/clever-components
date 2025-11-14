import { isStringEmpty } from '../../lib/utils.js';

/**
 * @import { ProductsCategory as ProductsByCategory, Product, CategoryFilter } from './cc-product-list.types.js'
 * @import { CcProductList } from './cc-product-list.js'
 */

export class ProductsController {
  /**
   * @param {CcProductList} host
   */
  constructor(host) {
    /** @type {CcProductList} The host. */
    this._host = host;

    /** @type {ProductsByCategory[]} The initial products category list. */
    this._productsByCategories = [];

    /** @type {CategoryFilter[]} Categories and their current state.  */
    this._categoriesFilters = [];

    /** @type {string|null} Current category selected.  */
    this._currentCategoryNameFilter = null;

    /** @type {string|null} Current text filter.  */
    this._currentTextFilter = '';
  }

  /**
   * Returns a filtered list of the products with the filters applied.
   *
   * @returns {ProductsByCategory[]}
   */
  getFilteredProductsByCategories() {
    const productsByCategoriesToggled = this._getProductsByCurrentCategory();
    const textFilterFormatted = this._currentTextFilter?.toLowerCase().trim();

    if (isStringEmpty(textFilterFormatted)) {
      return productsByCategoriesToggled;
    }

    const searchTerms = textFilterFormatted.split(' ').filter((i) => i !== '');

    return productsByCategoriesToggled
      .map((productsByCategory) => ({
        ...productsByCategory,
        products: this._filterProducts(productsByCategory.products, searchTerms),
      }))
      .filter((productsByCategory) => productsByCategory.products.length > 0);
  }

  /**
   * @param {ProductsByCategory[]} productsByCategories
   */
  set productsByCategories(productsByCategories) {
    this._productsByCategories = productsByCategories;
    this._categoriesFilters = this._productsByCategories.map(({ categoryName }) => ({ categoryName, toggled: false }));
    this._currentCategoryNameFilter = 'all';
  }

  getCategories() {
    return this._categoriesFilters;
  }

  getCurrentCategory() {
    return this._currentCategoryNameFilter;
  }

  /**
   *
   * @param {string|null} textFilter
   */
  set textFilter(textFilter) {
    this._currentTextFilter = textFilter ?? '';

    this._host.requestUpdate();
  }

  /**
   * @param {string} categoryName
   */
  toggleCategoryFilter(categoryName) {
    const categoryExists = this._categoriesFilters.find((cat) => cat.categoryName === categoryName) != null;

    // If we don't have a category or it doesn't exist we reset the category to 'all'
    // If we're being given the current category as it acts as a toggle we also reset to 'all'
    this._currentCategoryNameFilter =
      categoryName == null || categoryName === '' || !categoryExists || this._currentCategoryNameFilter === categoryName
        ? 'all'
        : categoryName;

    this._categoriesFilters = this._categoriesFilters.map((category) => {
      return {
        categoryName: category.categoryName,
        toggled: this._currentCategoryNameFilter !== 'all' && this._currentCategoryNameFilter === category.categoryName,
      };
    });

    this._host.requestUpdate();
  }

  /**
   * @param {Product[]} products
   * @param {string[]} searchTerms
   * @returns {Product[]|[]}
   */
  _filterProducts(products, searchTerms) {
    return products.filter((product) => {
      const productSearchTerms = product?.searchTerms ?? [];

      const someText = [product.name, product.description ?? '', ...productSearchTerms];

      return someText.some((text) => {
        return searchTerms.some((input) => {
          return text.toLowerCase().includes(input);
        });
      });
    });
  }

  _getProductsByCurrentCategory() {
    return this._currentCategoryNameFilter !== 'all'
      ? this._productsByCategories.filter(({ categoryName }) => categoryName === this._currentCategoryNameFilter)
      : this._productsByCategories;
  }
}
