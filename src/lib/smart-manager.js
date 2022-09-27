import { objectEquals } from './utils.js';

// In the global space of this module (for any module importing it), we maintain:
// * a rootContext object
// * a smartContainers Set with all containers currently in the page
// * a smartComponentDefinitions Set with all definitions currently in the page

// On each container, we maintain:
// * a Map on container[COMPONENTS] with all components keyed by definition object
// * an object with the current context on container[CURRENT_CONTEXT]

// On each component, we maintain:
// * an object with the last context on component[LAST_CONTEXT]

/**
 * @typedef {Element} SmartContainer
 * @property {object} context
 */

/**
 * @typedef {object} SmartComponentDefinition
 * @property {string} selector
 * @property {Context} [params]
 * @property {(container: SmartContainer, component: Element) => void} [onConnect]
 * @property {(container: SmartContainer, component: Element, context: object) => void} [onContextUpdate]
 * @property {(container: SmartContainer, component: Element) => void} [onDisconnect]
 */

let rootContext = {};

/** @type {Set<SmartContainer>} */
const smartContainers = new Set();

/** @type {Set<SmartComponentDefinition<?,?>>} */
const smartComponentDefinitions = new Set();

/** @type {WeakMap<SmartContainer, Map<SmartComponentDefinition<?,?>, Element[]>>} */
const containerComponents = new WeakMap();

/** @type {WeakMap<SmartContainer, object>} */
const containerCurrentContext = new WeakMap();

/** @type {WeakMap<Element, object>} */
const componentLastContext = new WeakMap();

/**
 * @param {SmartContainer} container
 * @param {AbortSignal} signal
 */
export function observeContainer (container, signal) {

  containerComponents.set(container, new Map());
  smartContainers.add(container);

  // TODO: Seems like debouncing this reduces the number of call but is it really necessary?
  const mutationObserver = new MutationObserver(() => updateEverything());
  mutationObserver.observe(container, { childList: true, subtree: true, attributes: true, attributeOldValue: true });

  signal.addEventListener('abort', () => {

    mutationObserver.disconnect();
    smartContainers.delete(container);

    // Properly disconnect components
    containerComponents.get(container).forEach((allComponents, definition) => {
      allComponents.forEach((component) => disconnectComponent(container, definition, component));
    });
    containerComponents.delete(container);
    containerCurrentContext.delete(container);

  }, { once: true });
}

// NOTE: The function below has some repetition with the SmartComponentDefinition typedef at the beginning of the file
// It is necessary because TypeScript has difficulties with JSDoc and generics

/**
 * @template {Record<string, {type: object}>} Context
 * @template {Record<keyof Context, any>} FilteredContext
 * @param {object} definition
 * @param {string} definition.selector
 * @param {Context} [definition.params]
 * @param {(container: SmartContainer, component: Element) => void} [definition.onConnect]
 * @param {(container: SmartContainer, component: Element, context: FilteredContext) => void} [definition.onContextUpdate]
 * @param {(container: SmartContainer, component: Element) => void} [definition.onDisconnect]
 * @param {AbortSignal} [signal]
 */
export function defineSmartComponentCore (definition, signal) {

  smartComponentDefinitions.add(definition);
  updateEverything();

  if (signal != null) {
    signal.addEventListener('abort', () => {

      smartComponentDefinitions.delete(definition);

      // Properly disconnect components
      smartContainers.forEach((container) => {
        const allComponents = containerComponents.get(container).get(definition) ?? [];
        allComponents.forEach((component) => disconnectComponent(container, definition, component));
        containerComponents.get(container).delete(definition);
      });

    }, { once: true });
  }
}

function updateEverything () {

  /** @type {[SmartContainer, SmartComponentDefinition<?,?>, Element][]} */
  const allDisconnectedComponents = [];
  /** @type {[SmartContainer, SmartComponentDefinition<?,?>, Element][]} */
  const allConnectedComponents = [];
  /** @type {[SmartContainer, SmartComponentDefinition<?,?>, Element][]} */
  const allIdleComponents = [];

  smartContainers.forEach((container) => {
    smartComponentDefinitions.forEach((definition) => {

      /** @type {Element[]} */
      const allDefinitionComponents = Array.from(container.querySelectorAll(definition.selector))
        .filter((c) => closestParent(c, 'cc-smart-container') === container);

      const previousComponents = containerComponents.get(container).get(definition) ?? [];
      containerComponents.get(container).set(definition, allDefinitionComponents);

      // connected
      allDefinitionComponents
        .filter((component) => !previousComponents.includes(component))
        .forEach((component) => allConnectedComponents.push([container, definition, component]));

      // idle
      allDefinitionComponents
        .filter((component) => previousComponents.includes(component))
        .forEach((component) => allIdleComponents.push([container, definition, component]));

      // disconnected
      previousComponents
        .filter((component) => !allDefinitionComponents.includes(component))
        .forEach((component) => allDisconnectedComponents.push([container, definition, component]));
    });
  });

  allDisconnectedComponents.forEach(([container, definition, component]) => disconnectComponent(container, definition, component));

  allConnectedComponents.forEach(([container, definition, component]) => connectComponent(container, definition, component));

  [...allConnectedComponents, ...allIdleComponents].forEach(([container, definition, component]) => updateComponentContext(container, definition, component));
}

/**
 * @param {SmartContainer} container
 * @param {Object} context
 */
export function updateContext (container, context) {
  containerCurrentContext.set(container, context);
  updateEverything();
}

/**
 * @param {Object} context
 */
export function updateRootContext (context) {
  rootContext = context;
  updateEverything();
}

/**
 * @template Context
 * @param {SmartContainer} container
 * @param {SmartComponentDefinition<?,?>} definition
 * @param {Element} component
 */
function connectComponent (container, definition, component) {
  componentLastContext.set(component, {});
  definition.onConnect?.(container, component);
}

/**
 * @param {SmartContainer} container
 * @param {SmartComponentDefinition<?,?>} definition
 * @param {Element} component
 */
function updateComponentContext (container, definition, component) {
  const currentContext = { ...rootContext, ...containerCurrentContext.get(container) };
  const filteredContext = filterContext(currentContext, definition.params);
  if (objectEquals(componentLastContext.get(component), filteredContext)) {
    return;
  }
  componentLastContext.set(component, filteredContext);
  definition.onContextUpdate?.(container, component, filteredContext);
}

/**
 * @param {SmartContainer} container
 * @param {SmartComponentDefinition<?,?>} definition
 * @param {Element} component
 */
function disconnectComponent (container, definition, component) {
  componentLastContext.delete(component);
  definition.onDisconnect?.(container, component);
}

// LOW LEVEL HELPERS

/**
 * @param {Element} element
 * @param {String} selector
 * @return {Element}
 */
function closestParent (element, selector) {
  return element.parentElement.closest(selector);
}

/**
 * @param {Record<string, any>|null} source
 * @param {Record<string, any>|null} keyObject
 * @return {Record<string, any>}
 */
function filterContext (source, keyObject) {
  if (source == null) {
    return {};
  }
  if (keyObject == null) {
    return source;
  }
  const newEntries = Object.keys(keyObject)
    .map((name) => [name, source[name]])
    .filter(([name, value]) => value !== undefined);
  return Object.fromEntries(newEntries);
}
