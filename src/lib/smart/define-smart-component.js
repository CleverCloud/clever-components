import { produce } from '../immer.js';
import { defineSmartComponentCore } from './smart-manager.js';
import { META } from './smart-symbols.js';

/**
 * @typedef {import('./smart-component.types.js').SmartContainer} SmartContainer
 * @typedef {import('./smart-component.types.js').SmartComponent} SmartComponent
 * @typedef {import('./smart-component.types.js').SmartContext} SmartContext
 * @typedef {import('./smart-component.types.js').OnEventCallback} OnEventCallback
 */

/** @type {import('./smart-component.types.js').defineSmartComponent} */
export function defineSmartComponent(definition) {
  defineSmartComponentCore({
    selector: definition.selector,
    params: definition.params,
    /**
     * @param {SmartContainer} _container
     * @param {T} component
     */
    onConnect(_container, component) {
      if (component[META] == null) {
        component[META] = new Map();
      }
      // Prepare a metadata object specific to this component and this definition
      component[META].set(definition, {});
    },
    /**
     * @param {SmartContainer} container
     * @param {T} component
     * @param {SmartContext} context
     */
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
      function onEvent(eventName, listener) {
        component.addEventListener(
          eventName,
          (event) => {
            // @ts-ignore
            listener(event.detail, event);
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
          const event = /** @type {UpdateComponentEvent<T>} */ (e);

          if (typeof event.property === 'function') {
            if (component[event.propertyName] != null) {
              component[event.propertyName] = produce(component[event.propertyName], event.property);
            }
          } else {
            component[event.propertyName] = event.property;
          }
        },
        { signal },
      );

      /** @type {import('./smart-component.types.js').UpdateComponentCallback<T>} */
      function updateComponent(propertyName, property) {
        /** @type {UpdateComponentEvent<T>} */
        const event = new UpdateComponentEvent(propertyName, property);
        target.dispatchEvent(event);
      }

      definition.onContextUpdate({
        container,
        component,
        context,
        onEvent,
        updateComponent,
        signal,
      });
    },
    /**
     * @param {SmartContainer} _container
     * @param {T} component
     */
    onDisconnect(_container, component) {
      component[META].get(definition).abortController?.abort();
      component[META].delete(definition);
    },
  });
}

/**
 * @template {SmartComponent} C
 */
class UpdateComponentEvent extends Event {
  /**
   * @param {keyof C} propertyName
   * @param {import('./smart-component.types.d.ts').CallbackOrObject<any>} property
   */
  constructor(propertyName, property) {
    super('update-component');
    this.propertyName = propertyName;
    this.property = property;
  }
}
