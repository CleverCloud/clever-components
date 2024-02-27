/* eslint-env node, mocha */

import { expect } from '@bundled-es-modules/chai';
import * as hanbi from 'hanbi';
import { ProductsController } from './products-controller.js';

function generateProduct (name = 'fake-name', description = 'fake description', keywords = [{
  value: 'fake-keyword', hidden: false,
}]) {
  return {
    name,
    description,
    icon: 'https://example.com',
    keywords,
  };
}

function generateProductFoo ({
  name = '',
  description = '',
  keywords = [],
}) {
  return {
    name,
    description,
    icon: 'https://example.com/icon.png',
    keywords,
  };
}

describe('', function () {

  let sqlProducts = {};
  let fakeProducts = {};

  let requestUpdateSpy;
  let productsListCrtl;

  beforeEach(() => {
    requestUpdateSpy = hanbi.spy();
    productsListCrtl = new ProductsController({
      requestUpdate: requestUpdateSpy.handler,
    });

    sqlProducts = {
      categoryName: 'database',
      products: [
        generateProduct('sql product'),
        generateProduct('', 'description has sql'),
        generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
        generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
        generateProduct(),
      ],
    };

    fakeProducts = {
      categoryName: 'fake-category',
      products: [generateProduct(), generateProduct(), generateProduct()],
    };

  });
  describe('searchProduct() method', function () {
    it('should request host update', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.search('sql');

      expect(requestUpdateSpy.callCount).to.equal(1);
    });

    it('should return all products matching with name', function () {

      productsListCrtl.productsList = [
        {
          categoryName: 'aaa',
          products: [
            generateProductFoo({ name: 'aaa one' }),
            generateProductFoo({ name: 'aaa two' }),
            generateProductFoo({ name: 'aaa three' }),
          ],
        },
        {
          categoryName: 'bbb',
          products: [
            generateProductFoo({ name: 'bbb one' }),
            generateProductFoo({ name: 'bbb two' }),
            generateProductFoo({ name: 'bbb three' }),
          ],
        },
        {
          categoryName: 'ccc',
          products: [
            generateProductFoo({ name: 'aaa 111' }),
            generateProductFoo({ name: 'aaa 222' }),
            generateProductFoo({ name: 'aaa 333' }),
          ],
        },
      ];

      productsListCrtl.search('two');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProductFoo({ name: 'aaa two' }),
            ],
          },
          {
            categoryName: 'bbb',
            products: [
              generateProductFoo({ name: 'bbb two' }),
            ],
          },
        ],
      );
    });

    it('should return all products matching with name (and case insensitive)', function () {

      productsListCrtl.productsList = [
        {
          categoryName: 'aaa',
          products: [
            generateProductFoo({ name: 'Some awesome word!' }),
            generateProductFoo({ name: 'foo' }),
            generateProductFoo({ name: 'Some AWESOME word!' }),
            generateProductFoo({ name: 'bar' }),
            generateProductFoo({ name: 'Some aWeSoMe word!' }),
          ],
        },
      ];

      productsListCrtl.search('AwEsOmE');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProductFoo({ name: 'Some awesome word!' }),
              generateProductFoo({ name: 'Some AWESOME word!' }),
              generateProductFoo({ name: 'Some aWeSoMe word!' }),
            ],
          },
        ],
      );
    });

    it('should return all products matching with name (match keyword)', function () {

      productsListCrtl.productsList = [
        {
          categoryName: 'aaa',
          products: [
            generateProductFoo({ name: 'one' }),
            generateProductFoo({ name: 'two' }),
            generateProductFoo({ name: 'three' }),
          ],
        },
      ];

      productsListCrtl.search('one three');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [
          {
            categoryName: 'aaa',
            products: [
              generateProductFoo({ name: 'one' }),
              generateProductFoo({ name: 'three' }),
            ],
          },
        ]
      );
    });

    it('should return all products containing `sql` on search with multiple product list', function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.search('sql');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [
          {
            categoryName: 'database',
            products: [
              generateProduct('sql product'),
              generateProduct('', 'description has sql'),
              generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
              generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
            ],
          },
          {
            categoryName: 'fake-category',
            products: [
              generateProduct('sql product'),
            ],
          },
        ],
      );
    });

    it('should return all the products who have a hidden keyword', function () {

      sqlProducts.products.push(generateProduct('', '', [{ value: 'hidden', hidden: true }]));

      fakeProducts.products.push(generateProduct('', '', [{ value: 'hidden', hidden: true }]));
      fakeProducts.products.push(generateProduct('', '', [{ value: 'it is not hidden', hidden: false }]));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.search('hidden');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [
          {
            categoryName: 'database',
            products: [
              generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
              generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
              generateProduct('', '', [{ value: 'hidden', hidden: true }]),
            ],
          },
          {
            categoryName: 'fake-category',
            products: [
              generateProduct('', '', [{ value: 'hidden', hidden: true }]),
              generateProduct('', '', [{ value: 'it is not hidden', hidden: false }]),
            ],
          },
        ],
      );
    });

    it('should return all the product if null is provided', function () {

      const pl = [sqlProducts, fakeProducts];

      productsListCrtl.productsList = pl;

      productsListCrtl.search(null);

      expect(productsListCrtl.getProductsList()).to.deep.equal(pl);
    });

    it('should return all the products if the search is empty',async function () {

      await new Promise(() => {

      });

      const pl = [sqlProducts, fakeProducts];

      productsListCrtl.productsList = pl;

      productsListCrtl.search('');

      expect(productsListCrtl.getProductsList()).to.deep.equal(pl);
    });
  });

  describe('filterCategory()', function () {
    it('should return a product list filtered with a correct given category', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('database');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts],
      );
    });

    it('should return the default product list for an unknown category', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('foobar');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts, fakeProducts],
      );
    });

    it('should return the default product list for an empty category', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts, fakeProducts],
      );
    });

    it('should return the default product list for a null category', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory(null);

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts, fakeProducts],
      );
    });
  });

  describe('filterCategory() then searchProduct()', function () {
    it('should return the correct filter and search if everything is correct', function () {

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('database');
      productsListCrtl.search('sql');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [{
          categoryName: 'database',
          products: [
            generateProduct('sql product'),
            generateProduct('', 'description has sql'),
            generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
            generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          ],
        }],
      );
    });

    it('should return a search with the initial product list (all) if the category is incorrect', function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory(null);
      productsListCrtl.search('sql');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [{
          categoryName: 'database',
          products: [
            generateProduct('sql product'),
            generateProduct('', 'description has sql'),
            generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
            generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          ],
        },
          {
            categoryName: 'fake-category',
            products: [generateProduct('sql product')],
          }],
      );
    });

    it('should return a filtered product list with the category, if the category is okay and the search is empty', function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('database');
      productsListCrtl.search('');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts],
      );
    });

    it.skip(`should return an empty product list if the category is okay and the search doesn't provide anything relevant`, function () {

      const sqlProducts = {
        categoryName: 'database',
        products: [
          generateProduct('sql product'),
          generateProduct('', 'description has sql'),
          generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
          generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          generateProduct(),
        ],
      };

      const fakeProducts = {
        categoryName: 'fake-category',
        products: [generateProduct(), generateProduct(), generateProduct(), generateProduct('sql product')],
      };

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('database');
      productsListCrtl.search('not relevant search');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [],
      );
    });

    it(`should return an a product list with the search if the category is not okay and the search is relevant`, function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory(null);
      productsListCrtl.search('sql');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [{
          categoryName: 'database',
          products: [
            generateProduct('sql product'),
            generateProduct('', 'description has sql'),
            generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
            generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          ],
        }, {
          categoryName: 'fake-category',
          products: [generateProduct('sql product')],
        }],
      );
    });

    it(`should return the initial product list if the category is incorrect and if the search is empty`, function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory(null);
      productsListCrtl.search('');

      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts, fakeProducts],
      );
    });

    it(`should work with multiple filter and search`, function () {

      fakeProducts.products.push(generateProduct('sql product'));

      productsListCrtl.productsList = [sqlProducts, fakeProducts];

      productsListCrtl.filterCategory('database');
      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts],
      );
      productsListCrtl.search('sql');
      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [{
          categoryName: 'database',
          products: [
            generateProduct('sql product'),
            generateProduct('', 'description has sql'),
            generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
            generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          ],
        }],
      );

      productsListCrtl.search('');
      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts],
      );

      productsListCrtl.filterCategory('all');
      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [sqlProducts, fakeProducts],
      );

      productsListCrtl.search('sql');
      expect(productsListCrtl.getProductsList()).to.deep.equal(
        [{
          categoryName: 'database',
          products: [
            generateProduct('sql product'),
            generateProduct('', 'description has sql'),
            generateProduct('', '', [{ value: 'sql keyword not hidden', hidden: false }]),
            generateProduct('', '', [{ value: 'sql keyword hidden', hidden: true }]),
          ],
        },
          {
            categoryName: 'fake-category',
            products: [generateProduct('sql product')],
          },
        ],
      );
    });

  });

});
