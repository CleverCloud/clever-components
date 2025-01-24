// @ts-ignore not worth helping TS understand this is valid since we don't need to type check this module

import customElementsManifest from '../../../dist/custom-elements.json';
import { setLanguage } from '../../lib/i18n/i18n.js';
import { sequence } from './sequence.js';

/**
 * @typedef {import('./custom-elements-manifest.types.js').CustomElementsManifest} CustomElementsManifest
 * @typedef {import('../../components/cc-beta/cc-beta.js').CcBeta} CcBeta
 * @typedef {import('@storybook/web-components').StoryFn} StoryFn
 * @typedef {import('lit').CSSResult} CSSResult
 */

/**
 * Creates a story with the given configuration options
 *
 * @template {keyof HTMLElementTagNameMap} ComponentTagName
 *
 * @param {import('./make-story.types.js').MakeStoryOptions<ComponentTagName>} config The story configuration
 * @returns {import('./make-story.types.js').AnnotatedStoryFunction<ComponentTagName>} The story function
 */
export function makeStory({
  argTypes,
  beta,
  component,
  css,
  displayMode,
  docs,
  dom,
  items: rawItems = [],
  name,
  onUpdateComplete,
  simulations = [],
}) {
  // In some rare conditions, we need to instanciate the items on story rendering (and each time it renders)
  const items = typeof rawItems === 'function' ? rawItems() : rawItems;

  /** @type {import('./make-story.types.js').AnnotatedStoryFunction<ComponentTagName>} */
  const storyFn = (storyArgs, { globals }) => {
    setLanguage(globals.locale);

    // We create a shadow tree so we can add some custom isolated CSS for each stories
    const container = document.createElement('div');
    // We use this for i18n HMR
    container.classList.add('story-shadow-container');
    container.setAttribute('display-mode', displayMode);
    const shadow = container.attachShadow({ mode: 'open' });

    // If we have some custom CSS we add it in the shadow tree
    if (css != null) {
      const styles = document.createElement('style');
      styles.innerHTML = css.toString();
      shadow.appendChild(styles);
    }

    // In some rare conditions, it's easier to provide the DOM directly instead of the items based on the component
    if (dom != null) {
      const wrapper = document.createElement('div');
      shadow.appendChild(wrapper);
      dom(wrapper);
      return betaContainer(container, beta);
    }

    // Setup the components and inject args
    const components = items.map((props, i) => {
      let element = document.createElement(component);
      if (i === 0) {
        element = assignPropsToElement(element, { ...props, ...storyArgs });
      } else {
        element = assignPropsToElement(element, { ...props });
      }
      return element;
    });
    components.forEach((c, index) => {
      shadow.appendChild(c);
      if (onUpdateComplete != null && 'updateComplete' in c) {
        c.updateComplete.then(() => {
          onUpdateComplete(c, index);
        });
      }
    });

    // Run the sequence if we have simulations
    sequence(async (wait) => {
      for (const { delay, callback } of simulations) {
        await wait(delay);
        callback(components);
      }
    });

    // Listen for events and trigger actions
    /** @type {CustomElementsManifest} */
    (customElementsManifest).modules
      .flatMap((mod) => mod.declarations)
      .find((declaration) => declaration.tagName === component)
      ?.events?.forEach((e) => {
        const eventName = e.name;

        // actions callbacks are provided on the storyArgs object but their names differ from our events
        // our events => "cc-component:event-name"
        // the equivalent callback name => "onCcComponentEventName"
        const actionCallback = Object.entries(storyArgs).find(([eventNameCamelCase]) => {
          return normalize(eventNameCamelCase) === 'on' + normalize(eventName);
        })?.[1];

        if (actionCallback != null) {
          container.addEventListener(eventName, (e) => {
            if (e instanceof CustomEvent) {
              actionCallback(JSON.stringify(e.detail));
            }
          });
        }
      });

    return betaContainer(container, beta);
  };

  // We use the values of the first item for the args
  storyFn.args = { ...items[0] };

  storyFn.parameters = {
    docs: {
      description: {
        story: (docs ?? '').trim(),
      },
      source: {
        code: getSourceCode(component, items, dom),
      },
    },
  };

  storyFn.argTypes = argTypes;
  storyFn.docs = docs;
  storyFn.css = css;
  storyFn.component = component;
  storyFn.items = items;

  if (name != null) {
    storyFn.storyName = name;
  }

  return storyFn;
}

/**
 * Normalizes a string by converting it to lowercase and removing hyphens and colons
 *
 * @param {string} text - The text to normalize
 * @returns {string} The normalized text with all lowercase characters and no hyphens or colons
 */
function normalize(text) {
  return text.toLowerCase().replace(/[-:]/g, '');
}

/**
 * Generates HTML source code for a component based on provided items or DOM
 *
 * @template {keyof HTMLElementTagNameMap} ComponentTagName
 * @template {HTMLElementTagNameMap[ComponentTagName]} Component
 *
 * @param {ComponentTagName} component - The component tag name
 * @param {Partial<Component>[]} items - Array of item objects containing props and innerHTML
 * @param {((container: HTMLDivElement) => void) | null} dom - Optional function to manipulate container DOM directly
 * @returns {string} The generated HTML source code
 */
function getSourceCode(component, items, dom) {
  if (dom != null) {
    const container = document.createElement('div');
    dom(container);
    return container.innerHTML.replace(/<!---->/g, '').trim();
  }

  return items
    .map(({ innerHTML = '', ...props }) => {
      const attributes = Object.entries(props)
        .map(([name, value]) => {
          // We should rely on the official attribute name but for now it's good enough
          const attrName = name.replace(/[A-Z]/g, (a) => '-' + a.toLowerCase());
          if (value === true) {
            return `${attrName}`;
          }
          if (typeof value === 'string' || typeof value === 'number') {
            return `${attrName}=${JSON.stringify(String(value))}`;
          }
          if (typeof value === 'object') {
            return `${attrName}='${JSON.stringify(value)}'`;
          }
          return null;
        })
        .filter((a) => a != null);

      return `<${component}${formatAttributes(attributes)}>${innerHTML}</${component}>`;
    })
    .join('\n');
}

/**
 * Formats an array of HTML attributes into a string
 * @param {string[]} attributes - Array of HTML attribute strings
 * @returns {string} Formatted string of attributes, either inline or multiline depending on length
 */
function formatAttributes(attributes) {
  if (attributes.length === 0) {
    return '';
  }

  const isTooLong = attributes.join(' ').length > 80;
  if (isTooLong) {
    return '\n' + attributes.map((a) => `  ${a}`).join('\n') + '\n';
  } else {
    return ' ' + attributes.join(' ');
  }
}

/**
 * Creates a story simulation step with a delay and callback
 *
 * @type {import('./make-story.types.js').StoryWait<HTMLElement>}
 */
export function storyWait(delay, callback) {
  return { delay, callback };
}

/**
 * Assigns properties to a DOM element
 *
 * @template {Element} ElementToAssign
 *
 * @param {ElementToAssign} element - The DOM element to assign properties to
 * @param {Partial<ElementToAssign>} props - An object containing properties to assign
 * @returns {ElementToAssign} The element with assigned properties
 */
function assignPropsToElement(element, props = {}) {
  /** @type {import('../../components/common.types.js').Entries<typeof props>} */
  (Object.entries(props)).forEach(([name, value]) => {
    if ((name === 'style' || name === 'class') && typeof value === 'string') {
      element.setAttribute(name, value);
    }
    if (name === 'children' && typeof value === 'function') {
      value()
        .map(
          /** @param {Element} child */
          (child) => {
            if (typeof child === 'string') {
              const template = document.createElement('template');
              template.innerHTML = child;
              return template.content.cloneNode(true);
            }
            return child;
          },
        )
        .forEach(
          /** @param {Element} child */
          (child) => {
            element.appendChild(child);
          },
        );
    } else {
      element[name] = value;
    }
  });
  return element;
}

/**
 * Creates a story item with specified properties and index
 *
 * @template {keyof HTMLElementTagNameMap} ComponentTagName
 * @template {import('./make-story.types.js').AnnotatedStoryFunction<ComponentTagName>} StoryFn
 *
 * @param {StoryFn} storyFn - The story function containing component and items
 * @param {Partial<HTMLElementTagNameMap[ComponentTagName]>} props - Properties to apply to the element
 * @param {number} itemIndex - Index of the item to create (defaults to 0)
 * @returns {HTMLElementTagNameMap[ComponentTagName]} The created story item element
 */
export function createStoryItem(storyFn, props = {}, itemIndex = 0) {
  const element = document.createElement(storyFn.component);
  assignPropsToElement(element, storyFn.items[itemIndex]);
  assignPropsToElement(element, props);
  return element;
}

/**
 * @template {HTMLElement} T
 * @param {T} container
 * @param {boolean} isBeta
 * @returns {T | CcBeta}
 */
const betaContainer = (container, isBeta) => {
  if (isBeta) {
    import('../../components/cc-beta/cc-beta.js');
    const ccBeta = document.createElement('cc-beta');
    ccBeta.appendChild(container);
    return ccBeta;
  }
  return container;
};
