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

describe('', function () {

  /** @type {Stub} */
  let requestUpdateSpy;

  /** @type {ProductsController} */
  let productsCrtl;

  beforeEach(() => {
    requestUpdateSpy = hanbi.spy();

    // @ts-expect-error - TypeScript wants a CcProductList however it's not relevant here.
    productsCrtl = new ProductsController({
      requestUpdate: requestUpdateSpy.handler,
    });
  });

  describe('search() method', function () {
    it('should request host update', function () {

      productsCrtl.categoryDataList = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two' }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
      ];

      productsCrtl.search('aaa');

      expect(requestUpdateSpy.callCount).to.equal(1);
    });

    it('should return all products matching with name', function () {

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('AwEsOmE');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ];

      productsCrtl.search('one three');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

    it('should return all products matching with name (match keyword and multiple spaces)', function () {

      productsCrtl.categoryDataList = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'one' }),
            generateProduct({ name: 'two' }),
            generateProduct({ name: 'three' }),
          ],
        },
      ];

      productsCrtl.search('one  three');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('two three');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa one' }),
            generateProduct({ name: 'aaa two', description: undefined }),
            generateProduct({ name: 'aaa three' }),
          ],
        },
      ];

      productsCrtl.search('aaa');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('two three');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.search('hidden');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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
      productsCrtl.categoryDataList = [
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

      productsCrtl.search(null);

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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
      productsCrtl.categoryDataList = [
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

      productsCrtl.search('');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('aaa');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
        {
          categoryName: 'aaa',
          products: [
            generateProduct({ name: 'aaa two' }),
          ],
        },
      ]);

    });

    it('should return all the products is the category doesn\'t exist', function () {
      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('foobar');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory(null);

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('aaa');
      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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
      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory(null);
      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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
      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('aaa');
      productsCrtl.search('');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('aaa');
      productsCrtl.search('not relevant search');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal([]);
    });

    it(`should return an a product list with the search if the category is not okay and the search is relevant`, function () {

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('not relevant');
      productsCrtl.search('two');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory(null);
      productsCrtl.search('');

      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.categoryDataList = [
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

      productsCrtl.filterCategory('aaa');
      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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
      productsCrtl.search('two');
      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.search('');
      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.filterCategory('all');
      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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

      productsCrtl.search('two');
      expect(productsCrtl.getCategoryDataList()).to.deep.equal(
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
