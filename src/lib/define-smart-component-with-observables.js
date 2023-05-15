import { Subject } from './observables.js';
import { defineSmartComponentCore } from './smart-manager.js';

const META = Symbol('META');

/**
 * @typedef {import('rxjs').Subject} Subject
 */

/**
 * @typedef {Element} SmartContainer
 * @param {object} context
 */

/**
 * @param {object} definition
 * @param {string} definition.selector
 * @param {object} [definition.params]
 * @param {(container: SmartContainer, component: Element, context$: Observable<object>, signal: AbortSignal) => void} definition.onConnect
 * @param {AbortSignal} [signal]
 */
export function defineSmartComponentWithObservables (definition, signal) {

  defineSmartComponentCore({
    selector: definition.selector,
    params: definition.params,
    onConnect (container, component) {

      const context$ = new Subject();
      const disconnectionController = new AbortController();

      if (component[META] == null) {
        component[META] = new Map();
      }
      component[META].set(definition, { context$, disconnectionController });

      definition.onConnect(container, component, context$, disconnectionController.signal);
    },
    onContextUpdate (container, component, context) {
      component[META].get(definition).context$.next(context);
    },
    onDisconnect (container, component) {
      component[META].get(definition).disconnectionController.abort();
      component[META].delete(definition);
    },
  }, signal);
}
