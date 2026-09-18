/**
 * @import { Product } from './cc-product-list.types.js'
 * @import { Stub } from 'hanbi'
 */

import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
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
  /** @type {Stub<() => void>} */
  let requestUpdateSpy;

  /** @type {ProductsController} */
  let productsCtrl;

  beforeEach(() => {
    requestUpdateSpy = hanbi.spy();

    // @ts-expect-error - TypeScript wants a CcProductList however it's not relevant here.
    productsCtrl = new ProductsController({
      requestUpdate: requestUpdateSpy.handler,
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

      expect(requestUpdateSpy.callCount).to.equal(1);
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('aaa');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('foobar');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter(null);

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

    it('should keep the category applied when the same category is set again', function () {
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

      productsCtrl.setCategoryFilter('aaa');
      productsCtrl.setCategoryFilter('aaa');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
      ]);
    });

    it('should expose the resolved key and nothing the product list only needs', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          icon: 'aaa-icon',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          categoryName: 'bbb',
          icon: 'bbb-icon',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.setCategoryFilter('aaa');

      expect(productsCtrl.getCategories()).to.deep.equal([
        { key: 'aaa', categoryName: 'aaa', toggled: true },
        { key: 'bbb', categoryName: 'bbb', toggled: false },
      ]);
    });
  });

  describe('filterCategory() with category ids', function () {
    it('should return the corresponding products if the category id exists', function () {
      productsCtrl.productsByCategories = [
        {
          id: 'aaa-id',
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          id: 'bbb-id',
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.setCategoryFilter('bbb-id');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
        {
          id: 'bbb-id',
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ]);
      expect(productsCtrl.getCategories()).to.deep.equal([
        { key: 'aaa-id', categoryName: 'aaa', toggled: false },
        { key: 'bbb-id', categoryName: 'bbb', toggled: true },
      ]);
    });

    it('should be able to filter a category keyed all', function () {
      productsCtrl.productsByCategories = [
        {
          id: 'all',
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          id: 'bbb-id',
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.setCategoryFilter('all');

      expect(productsCtrl.getCurrentCategory()).to.equal('all');
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
        {
          id: 'all',
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
      ]);
    });

    it('should fall back to the category name if the category id is empty', function () {
      productsCtrl.productsByCategories = [
        {
          id: '',
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
        },
        {
          id: 'bbb-id',
          categoryName: 'bbb',
          products: [generateProduct({ name: 'bbb two' })],
        },
      ];

      productsCtrl.setCategoryFilter('aaa');

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
        {
          id: '',
          categoryName: 'aaa',
          products: [generateProduct({ name: 'aaa two' })],
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

      productsCtrl.setCategoryFilter('aaa');
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter(null);
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('aaa');
      productsCtrl.textFilter = '';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('aaa');
      productsCtrl.textFilter = 'not relevant search';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([]);
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

      productsCtrl.setCategoryFilter('not relevant');
      productsCtrl.textFilter = 'two';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter(null);
      productsCtrl.textFilter = '';

      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([]);
      productsCtrl.setCategoryFilter('bbb');
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([]);
      productsCtrl.textFilter = 'two';
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter('aaa');
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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

      productsCtrl.setCategoryFilter(null);
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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
      expect(productsCtrl.getFilteredProductsByCategories()).to.deep.equal([
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
