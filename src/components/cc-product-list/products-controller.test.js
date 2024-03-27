/* eslint-env node, mocha */
/**
 * @typedef {import('./cc-product-list.types.js').Product} Product
 * @typedef {import('hanbi').Stub<() => void>} Stub
*/

import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { ProductsController } from './products-controller.js';

/**
 * @param {Partial<Product>} product
 * @returns {Product}
 */
function generateProduct ({
  name = '',
  description = '',
  keywords = [],
}) {
  return {
    name,
    description,
    iconUrl: 'https://example.com/icon.png',
    url: 'https://example.com',
    keywords,
  };
}

describe('ProductsController()', function () {

  /** @type {Stub} */
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

      productsCtrl.search('aaa');

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

      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'aaa two' }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({ name: 'bbb two' }),
            ],
          },
        ],
      );
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

      productsCtrl.search('AwEsOmE');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'Some awesome word!' }),
              generateProduct({ name: 'Some AWESOME word!' }),
              generateProduct({ name: 'Some aWeSoMe word!' }),
            ],
          },
        ],
      );
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

      productsCtrl.search('one three');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'one' }),
              generateProduct({ name: 'three' }),
            ],
          },
        ],
      );
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

      productsCtrl.search('   ');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'one' }),
              generateProduct({ name: 'two' }),
              generateProduct({ name: 'three' }),
            ],
          },
        ],
      );
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

      productsCtrl.search(' one  three ');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'one' }),
              generateProduct({ name: 'three' }),
            ],
          },
        ],
      );
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

      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({ name: 'aaa', description: 'two' }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({ name: 'bbb', description: 'two' }),
            ],
          },
        ],
      );
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

      productsCtrl.search('two three');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
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
        ],
      );
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

      productsCtrl.search('aaa');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
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

    it('should return all products matching with keywords', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
          {
            categoryName: 'ccc',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
        ],
      );
    });

    it('should return all products matching with keywords (match keyword)', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.search('two three');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),

            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),

            ],
          },
          {
            categoryName: 'ccc',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),

            ],
          },
        ],
      );
    });

    it('should return all products matching with keywords (hidden)', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'hidden', hidden: true }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'hidden', hidden: true }],
            }),

          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.search('hidden');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'hidden', hidden: true }],
              }),

            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'hidden', hidden: true }],
              }),
            ],
          },
        ],
      );
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

      productsCtrl.search(null);

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
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

      productsCtrl.search('');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
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
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ];

      productsCtrl.toggleCategory('aaa');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
      ]);

    });

    it('should return all the products is the category doesn\'t exist', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ];

      productsCtrl.toggleCategory('foobar');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ]);

    });

    it('should return the default product list for an empty category', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ];

      productsCtrl.toggleCategory('');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ]);
    });

    it('should return the default product list for a null category', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
        },
      ];

      productsCtrl.toggleCategory(null);

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({ name: 'bbb two' }),
          ],
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
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory('aaa');
      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa two',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
        ],
      );
    });

    it('should return a search with the initial product list (all) if the category is incorrect', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory(null);
      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa two',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },

        ],
      );
    });

    it('should return all the products from a filtered category even if the search is empty', function () {
      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory('aaa');
      productsCtrl.search('');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'one', hidden: false }],
              }),
              generateProduct({
                name: 'aaa two',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),
            ],
          },
        ],
      );
    });

    it(`should return an empty product list if the category is okay and the search doesn't provide anything relevant`, function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory('aaa');
      productsCtrl.search('not relevant search');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal([]);
    });

    it(`should return an a product list with the search if the category is not okay and the search is relevant`, function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory('not relevant');
      productsCtrl.search('two');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa two',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
            ],
          },

        ],
      );
    });

    it(`should return the initial product list if the category is incorrect and if the search is empty`, function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory(null);
      productsCtrl.search('');

      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'one', hidden: false }],
              }),
              generateProduct({
                name: 'aaa two',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'aaa',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'one', hidden: false }],
              }),
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'two', hidden: false }],
              }),
              generateProduct({
                name: 'bbb',
                description: 'desc',
                keywords: [{ value: 'three', hidden: false }],
              }),
            ],
          },
        ],
      );
    });

    it('simulation with multiple filters and search', function () {

      productsCtrl.productsByCategories = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
      ];

      productsCtrl.toggleCategory('aaa');
      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [{
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        }],
      );
      productsCtrl.search('two');
      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [{
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
          ],
        }],
      );

      productsCtrl.search('');
      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [{
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        }],
      );

      productsCtrl.toggleCategory('all');
      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [{
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'aaa',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'one', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'three', hidden: false }],
            }),
          ],
        },
        ],
      );

      productsCtrl.search('two');
      expect(productsCtrl.getProductsByCategories()).to.deep.equal(
        [{
          categoryName: 'aaa',
          products: [
            generateProduct({
              name: 'aaa two',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProduct({
              name: 'bbb',
              description: 'desc',
              keywords: [{ value: 'two', hidden: false }],
            }),
          ],
        },
        ],
      );
    });

  });

});
