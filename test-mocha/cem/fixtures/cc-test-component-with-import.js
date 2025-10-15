import { LitElement } from 'lit';

/**
 * @import {Foo, Bar} from './cc-test-component.types.js'
 * @import {TheInterface} from './cc-test-component.types.js'
 * @import {TheType} from './cc-test-component.types.js'
 */

/**
 * Test component using @import syntax instead of @typedef
 */
// eslint-disable-next-line wc/define-tag-after-class-definition
export class CcTestComponentWithImport extends LitElement {
  constructor() {
    super();

    /** @type {Foo|Bar} - lorem ipsum.  */
    this.union = null;

    /** @type {TheInterface} - lorem ipsum.  */
    this.interface = null;

    /** @type {TheType} - lorem ipsum.  */
    this.typeDeclaration = null;
  }
}
