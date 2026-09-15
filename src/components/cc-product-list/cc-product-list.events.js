import { CcEvent } from '../../lib/events.js';

/**
 * @import { ProductListFilter } from './cc-product-list.types.js'
 */

/**
 * Dispatched when the text filter or the category filter changes.
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
