import { Subject } from './observables.js';
import { defineComponent } from './smart-manager.js';

const META = Symbol('META');

/**
 * @typedef SmartComponentDefinitionWithObservables
 * @property {String} selector
 * @property {Object} params
 * @property {Function} onConnect
 */

/**
 * @param {SmartComponentDefinitionWithObservables} definition
 * @param {AbortSignal?} signal
 */
export function defineComponentWithObservables (definition, signal) {

  defineComponent({
    selector: definition.selector,
    params: definition.params,
    onConnect (container, component) {

      const context$ = new Subject();
      const disconnectionController = new AbortController();

      if (component[META] == null) {
        component[META] = new Map();
      }
      component[META].set(definition, { context$, disconnectionController });

      definition.onConnect(container, component, context$, disconnectionController);
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
