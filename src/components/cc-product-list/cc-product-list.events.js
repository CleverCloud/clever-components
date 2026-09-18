import { CcEvent } from '../../lib/events.js';

/**
 * @import { ProductListFilter } from './cc-product-list.types.js'
 */

/**
 * Dispatched when the text filter or the category filter changes.
 * `categoryFilter` is the category the list applies: its id, or its name when it has no id, and `null` for all categories.
 * It is `null` when the `categoryFilter` property matches no category.
 * @extends {CcEvent<ProductListFilter>}
 */
export class CcProductListFilterChangeEvent extends CcEvent {
  static TYPE = 'cc-product-list-filter-change';

  /**
   * @param {ProductListFilter} detail
   */
  constructor(detail) {
    super(CcProductListFilterChangeEvent.TYPE, detail);
  }
}
