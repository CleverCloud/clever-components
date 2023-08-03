import { LitElement } from 'lit-element';

/**
 * @typedef {import('./cc-test-component.types.js').Foo} Foo
 * @typedef {import('./cc-test-component.types.js').Bar} Bar
 * @typedef {import('./cc-test-component.types.js').TheInterface} TheInterface
 * @typedef {import('./cc-test-component.types.js').TheType} TheType
 * @typedef {import('./cc-test-component.types.js').UnionFoo} TupleFoo
 * @typedef {import('./cc-test-component.types.js').UnionBar} TupleBar
 * @typedef {import('./cc-test-component.types.js').PrivateInterface} PrivateInterface
 * @typedef {import('./cc-test-component.types.js').CustomEventFoo} CustomEventFoo
 * @typedef {import('./cc-test-component.types.js').CustomEventBar} CustomEventBar
 * @tyedef {import('./cc-test-component.types.js').ShouldBeIgnored} ShouldBeIgnored
 * @typedef {import('../common.types.js').Common} Common
 */

/**
 * lorem ipsum...
 *
 * @event {CustomEvent<CustomEventFoo>} event - A custom event
 * @event {CustomEvent<CustomEventFoo>} event - Another custom event with same type
 * @event {CustomEvent<CustomEventBar>} event - Another custom event with another type
 * @event {CustomEvent<Array<CustomEventBaz>>} event - Another custom event with another type nested into an Array
 * @event {CustomEvent<String>} event - Should be ignored (String is a built-in type that doesn't need to be described)
 * @event {CustomEvent<Date>} event - Should be ignored (Date is a built-in type that doesn't need to be described)
 * @event {CustomEvent<number>} event - Should be ignored (number is primitive)
 * @event {CustomEvent<string>} event - Should be ignored (string is primitive)
 * @event {CustomEvent} event - Should be ignored (CustomEvent without generic type)
 * @event {} event - Should be ignored (empty type defined)
 * @event event - Should be ignored (no type defined)
 * @event {CustomType<CustomEventType>} event - Should be ignored (not a CustomEvent type)
 * @evet {CustomEvent<CustomEventType>} event - Should be ignored (wrong tag name)
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
