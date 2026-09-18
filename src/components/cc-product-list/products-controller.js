import { isStringEmpty } from '../../lib/utils.js';

/**
 * @import { ProductsCategory as ProductsByCategory, Product, CategoryFilter } from './cc-product-list.types.js'
 * @import { CcProductList } from './cc-product-list.js'
 */

/**
 * Returns the key used to filter a category: its id, or its name when it has no id.
 *
 * An empty id is treated as no id: `setCategoryFilter` reads an empty key as "no filter", so such a
 * category would be impossible to select.
 *
 * @param {ProductsByCategory} category
 * @returns {string}
 */
function getCategoryKey(category) {
  return isStringEmpty(category.id) ? category.categoryName : category.id;
}

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
    this._currentCategoryKey = null;

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
    // The key is resolved once here so that nothing else has to know how it is built.
    this._categoriesFilters = this._productsByCategories.map((category) => ({
      key: getCategoryKey(category),
      categoryName: category.categoryName,
      toggled: false,
    }));
    this._currentCategoryKey = 'all';
  }

  getCategories() {
    return this._categoriesFilters;
  }

  getCurrentCategory() {
    return this._currentCategoryKey;
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
   * @param {string|null} categoryKey the category id, or its name when it has no id
   */
  setCategoryFilter(categoryKey) {
    const categoryExists = this._categoriesFilters.find((cat) => cat.key === categoryKey) != null;

    // If we don't have a category or it doesn't exist we reset the category to 'all'
    this._currentCategoryKey = isStringEmpty(categoryKey) || !categoryExists ? 'all' : categoryKey;

    this._categoriesFilters = this._categoriesFilters.map((category) => {
      return {
        ...category,
        toggled: this._currentCategoryKey !== 'all' && this._currentCategoryKey === category.key,
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
    return this._currentCategoryKey !== 'all'
      ? this._productsByCategories.filter((category) => getCategoryKey(category) === this._currentCategoryKey)
      : this._productsByCategories;
  }
}
