import { produce } from './immer.js';
import { defineSmartComponentCore } from './smart-manager.js';

const META = Symbol('META');

/**
 * @typedef {Element} SmartContainer
 * @param {object} context
 */

/**
 * @typedef {object|((property: object) => void)} CallbackOrObject
 */

/**
 * @param {object} definition
 * @param {string} definition.selector
 * @param {object} definition.params
 * @param {({
 *   container?: SmartContainer,
 *   component?: Element,
 *   context?: object,
 *   onEvent?: (type: string, listener: (detail: object) => void) => void,
 *   updateComponent?: (
 *     type: string,
 *     callbackOrObject: CallbackOrObject,
 *   ) => void,
 *   signal?: AbortSignal,
 * }) => void} definition.onContextUpdate
 * @param {AbortSignal} [signal]
 */
export function defineSmartComponent (definition, signal) {

  defineSmartComponentCore({
    selector: definition.selector,
    params: definition.params,
    onConnect (container, component) {
      if (component[META] == null) {
        component[META] = new Map();
      }
      // Prepare a metadata object specific to this component and this definition
      component[META].set(definition, {});
    },
    onContextUpdate (container, component, context) {

      // Don't trigger the high level onContextUpdate if one of the params is null
      const someContextParamsAreNull = Object
        .keys(definition.params)
        .some((name) => context[name] == null);
      if (someContextParamsAreNull) {
        return;
      }

      // Get the metadata object specific to this component and this definition
      const meta = component[META].get(definition);

      // Abort controller linked to the signal sent to the last onContextUpdate (if any)
      meta.abortController?.abort();
      // Prepare a new controller triggered when the context is updated or the component disconnected
      meta.abortController = new AbortController();

      const signal = meta.abortController.signal;

      // Prepare a helper function to attach event listeners on the component
      // and make sure they're removed if the signal is aborted
      function onEvent (type, listener) {
        component.addEventListener(type, (e) => {
          listener(e.detail);
        }, { signal });
      }

      // Prepare a helper function to update a component (via immer if necessary)
      // We use an even target as an indirection so we can
      // * ask for updates via un event
      // * listen for the event to apply the update
      // * remove the listener and don't apply the update if the signal is aborted
      const target = new EventTarget();

      target.addEventListener('update-component', (event) => {
        const { property, callbackOrObject } = event.data;
        if (typeof callbackOrObject === 'function') {
          if (component[property] != null) {
            component[property] = produce(component[property], callbackOrObject);
          }
        }
        else {
          component[property] = callbackOrObject;
        }
      }, { signal });

      function updateComponent (property, callbackOrObject) {
        const event = new Event('update-component');
        event.data = { property, callbackOrObject };
        target.dispatchEvent(event);
      }

      definition.onContextUpdate({ container, component, context, onEvent, updateComponent, signal });
    },
    onDisconnect (container, component) {
      component[META].get(definition).abortController?.abort();
      component[META].delete(definition);
    },
  });
}
