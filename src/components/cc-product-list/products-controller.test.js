/**
 * @import { Product } from './cc-product-list.types.js'
 * @import { Mock } from 'vitest'
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductsController } from './products-controller.js';

/**
 * @param {Partial<Product>} product
 * @returns {Product}
 */
function generateProduct({ name = '', description = '', searchTerms = [] }) {
  return {
    name,
    description,
    iconUrl: 'https://example.com/icon.png',
    url: 'https://example.com',
    searchTerms,
  };
}

describe('ProductsController()', function () {
  /** @type {Mock<() => void>} */
  let requestUpdateSpy;

  /** @type {ProductsController} */
  let productsCtrl;

  beforeEach(() => {
    requestUpdateSpy = vi.fn();

    // @ts-expect-error - TypeScript wants a CcProductList however it's not relevant here.
    productsCtrl = new ProductsController({
      requestUpdate: requestUpdateSpy,
    });
  });

  describe('search() method', function () {
    it('should request host update', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'aaa';

      expect(requestUpdateSpy.mock.calls.length).toBe(1);
    });

    it('should return all products matching with name', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb one' }),
            generateProduct({ name: 'bbb two' }),
            generateProduct({ name: 'bbb three' }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({ name: 'aaa 111' }),
            generateProduct({ name: 'aaa 222' }),
            generateProduct({ name: 'aaa 333' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ]);
    });

    it('should return all products matching with name (and case insensitive)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'Some awesome word!' }),
            generateProduct({ name: 'foo' }),
            generateProduct({ name: 'Some AWESOME word!' }),
            generateProduct({ name: 'bar' }),
            generateProduct({ name: 'Some aWeSoMe word!' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'AwEsOmE';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'Some awesome word!' }),
            generateProduct({ name: 'Some AWESOME word!' }),
            generateProduct({ name: 'Some aWeSoMe word!' }),
          ],
        },
      ]);
    });

    it('should return all products matching with name (match keyword)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'one three';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'one' }), generateProduct({ name: 'three' })],
        },
      ]);
    });

    it('should return all products if nothing but one or multiple whitespaces are provided', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ];

      productsCtrl.textFilter = '   ';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ]);
    });

    it('should return all products matching with name (match keyword and multiple spaces)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ];

      productsCtrl.textFilter = ' one  three ';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'one' }), generateProduct({ name: 'three' })],
        },
      ]);
    });

    it('should return all products matching with description', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa', description: 'one' }),
            generateProduct({ name: 'aaa', description: 'two' }),
            generateProduct({ name: 'aaa', description: 'three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb', description: 'one' }),
            generateProduct({ name: 'bbb', description: 'two' }),
            generateProduct({ name: 'bbb', description: 'three' }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({ name: 'aaa', description: '111' }),
            generateProduct({ name: 'aaa', description: '222' }),
            generateProduct({ name: 'aaa', description: '333' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa', description: 'two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb', description: 'two' })],
        },
      ]);
    });

    it('should return all products matching with description (match keyword)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa', description: 'one' }),
            generateProduct({ name: 'aaa', description: 'two' }),
            generateProduct({ name: 'aaa', description: 'three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb', description: 'one' }),
            generateProduct({ name: 'bbb', description: 'two' }),
            generateProduct({ name: 'bbb', description: 'three' }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({ name: 'aaa', description: '111' }),
            generateProduct({ name: 'aaa', description: '222' }),
            generateProduct({ name: 'aaa', description: '333' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'two three';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa', description: 'two' }),
            generateProduct({ name: 'aaa', description: 'three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb', description: 'two' }),
            generateProduct({ name: 'bbb', description: 'three' }),
          ],
        },
      ]);
    });

    it('should not throw an error if a description is null', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two', description: undefined }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
      ];

      productsCtrl.textFilter = 'aaa';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two', description: undefined }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
      ]);
    });

    it('should return all products matching with searchTerms', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });

    it('should return all products matching with searchTerms (match keyword)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.textFilter = 'two three';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);
    });

    it('should return all products matching with searchTerms (hidden)', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['hidden'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['hidden'],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.textFilter = 'hidden';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['hidden'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['hidden'],
            }),
          ],
        },
      ]);
    });

    it('should return all the products if null is provided', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb one' }),
            generateProduct({ name: 'bbb two' }),
            generateProduct({ name: 'bbb three' }),
          ],
        },
      ];

      productsCtrl.textFilter = null;

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb one' }),
            generateProduct({ name: 'bbb two' }),
            generateProduct({ name: 'bbb three' }),
          ],
        },
      ]);
    });

    it('should return all the products if an empty string is provided', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb one' }),
            generateProduct({ name: 'bbb two' }),
            generateProduct({ name: 'bbb three' }),
          ],
        },
      ];

      productsCtrl.textFilter = '';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb one' }),
            generateProduct({ name: 'bbb two' }),
            generateProduct({ name: 'bbb three' }),
          ],
        },
      ]);
    });
  });

  describe('filterCategory()', function () {
    it('should return the corresponding products if the category exists', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.toggleCategoryFilter('aaa');

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
      ]);
    });

    it("should return all the products is the category doesn't exist", function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.toggleCategoryFilter('foobar');

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ]);
    });

    it('should return the default product list for an empty category', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.toggleCategoryFilter('');

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ]);
    });

    it('should return the default product list for a null category', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.toggleCategoryFilter(null);

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ]);
    });
  });

  describe('filterCategory() then search()', function () {
    it('should return the correct filter and search if everything is correct', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter('aaa');
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });

    it('should return a search with the initial product list (all) if the category is incorrect', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter(null);
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });

    it('should return all the products from a filtered category even if the search is empty', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter('aaa');
      productsCtrl.textFilter = '';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);
    });

    it(`should return an empty product list if the category is okay and the search doesn't provide anything relevant`, function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter('aaa');
      productsCtrl.textFilter = 'not relevant search';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([]);
    });

    it(`should return an a product list with the search if the category is not okay and the search is relevant`, function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter('not relevant');
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });

    it(`should return the initial product list if the category is incorrect and if the search is empty`, function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter(null);
      productsCtrl.textFilter = '';

      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);
    });

    it('simulation with multiple search and filters', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.textFilter = 'unknown';
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([]);
      productsCtrl.toggleCategoryFilter('bbb');
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([]);
      productsCtrl.textFilter = 'two';
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });

    it('simulation with multiple filters and search', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategoryFilter('aaa');
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);
      productsCtrl.textFilter = 'two';
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);

      productsCtrl.textFilter = '';
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);

      productsCtrl.toggleCategoryFilter('all');
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['one'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['three'],
            }),
          ],
        },
      ]);

      productsCtrl.textFilter = 'two';
      expect(productsCtrl.getFilteredProductsByCategories()).toEqual([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              searchTerms: ['two'],
            }),
          ],
        },
      ]);
    });
  });
});
