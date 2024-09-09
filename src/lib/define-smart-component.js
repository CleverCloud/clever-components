import { produce } from './immer.js';
import { defineSmartComponentCore } from './smart-manager.js';
import { META } from './smart-symbols.js';

/**
 * @typedef {import('./smart-component.types.js').SmartContainer} SmartContainer
 * @typedef {import('./smart-component.types.js').SmartComponent} SmartComponent
 * @typedef {import('./smart-component.types.js').SmartComponentDefinition} SmartComponentDefinition
 * @typedef {import('./smart-component.types.js').SmartContext} SmartContext
 * @typedef {import('./smart-component.types.js').OnEventCallback} OnEventCallback
 * @typedef {import('./smart-component.types.js').CallbackOrObject} CallbackOrObject
 * @typedef {import('./smart-component.types.js').UpdateComponentCallback} UpdateComponentCallback
 */

/**
 *
 * @param {SmartComponentDefinition} definition
 */
export function defineSmartComponent(definition) {
  defineSmartComponentCore({
    selector: definition.selector,
    params: definition.params,
    onConnect(_container, component) {
      if (component[META] == null) {
        component[META] = new Map();
      }
      // Prepare a metadata object specific to this component and this definition
      component[META].set(definition, {});
    },
    onContextUpdate(container, component, context) {
      // Don't trigger the high level onContextUpdate if one of the params is null (unless it is optional)
      const someContextParamsAreNull = Object.entries(definition.params)
        .filter(([, param]) => param.optional !== true)
        .map(([name]) => name)
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

      /** @type {OnEventCallback} */
      function onEvent(type, listener) {
        component.addEventListener(
          type,
          (e) => {
            const event = /** @type {CustomEvent} */ (e);
            listener(event.detail);
          },
          { signal },
        );
      }

      // Prepare a helper function to update a component (via immer if necessary)
      // We use an even target as an indirection so we can
      // * ask for updates via un event
      // * listen for the event to apply the update
      // * remove the listener and don't apply the update if the signal is aborted
      const target = new EventTarget();

      target.addEventListener(
        'update-component',
        (e) => {
          const event = /** @type {UpdateComponentEvent} */ (e);
          handleUpdateComponent(component, event.property, event.callbackOrObject);
        },
        { signal },
      );

      /** @type {UpdateComponentCallback} */
      function updateComponent(property, callbackOrObject) {
        const event = new UpdateComponentEvent(property, callbackOrObject);
        target.dispatchEvent(event);
      }

      definition.onContextUpdate({ container, component, context, onEvent, updateComponent, signal });
    },
    onDisconnect(_container, component) {
      component[META].get(definition).abortController?.abort();
      component[META].delete(definition);
    },
  });
}

class UpdateComponentEvent extends Event {
  /**
   * @param {string} property
   * @param {CallbackOrObject} callbackOrObject
   */
  constructor(property, callbackOrObject) {
    super('update-component');
    this.property = property;
    this.callbackOrObject = callbackOrObject;
  }
}

/**
 *
 * @param {SmartComponent} component
 * @param {string} property
 * @param {CallbackOrObject} callbackOrObject
 */
function handleUpdateComponent(component, property, callbackOrObject) {
  const c = /** @type {{[p:property]: any}} */ (component);
  if (typeof callbackOrObject === 'function') {
    if (c[property] != null) {
      c[property] = produce(c[property], callbackOrObject);
    }
  } else {
    c[property] = callbackOrObject;
  }
}
