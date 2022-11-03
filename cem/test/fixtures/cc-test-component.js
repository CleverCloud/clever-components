import { LitElement } from 'lit-element';

/**
 * @typedef {import('./cc-test-component.types.js').Foo} Foo
 * @typedef {import('./cc-test-component.types.js').Bar} Bar
 * @typedef {import('./cc-test-component.types.js').TheInterface} TheInterface
 * @typedef {import('./cc-test-component.types.js').TheType} TheType
 * @typedef {import('./cc-test-component.types.js').UnionFoo} TupleFoo
 * @typedef {import('./cc-test-component.types.js').UnionBar} TupleBar
 * @typedef {import('./cc-test-component.types.js').PrivateInterface} PrivateInterface
 * @tyedef {import('./cc-test-component.types.js').ShouldBeIgnored} ShouldBeIgnored
 * @typedef {import('../common.types.js').Common} Common
 */

/**
 * lorem ipsum...
 */
export class CcTestComponent extends LitElement {

  constructor () {
    super();

    /** @type {Foo|Bar} - lorem ipsum.  */
    this.union = null;

    /** @type {TheInterface} - lorem ipsum.  */
    this.interface = null;

    /** @type {TheType} - lorem ipsum.  */
    this.typeDeclaration = null;

    /** @type {Array<Foo>} - lorem ipsum.  */
    this.specialArray = null;

    /** @type {Array} - lorem ipsum.  */
    this.specialEmptyArray = null;

    /** @type {Array<string>} - lorem ipsum.  */
    this.specialArrayString = null;

    /** @type {Foo[]} - lorem ipsum.  */
    this.array = null;

    /** @type {[number, TupleFoo, string, TupleBar]} - lorem ipsum.  */
    this.tuple = null;

    /** @type {PrivateInterface} - lorem ipsum.  */
    this._private = null;

  }

}
