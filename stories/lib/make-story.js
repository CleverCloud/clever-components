// TRICK_START: if we import translation files statically here, storybook gets reloaded when translations are updated :p
import '../../src/translations/translations.en.js';
import '../../src/translations/translations.fr.js';
// TRICK_END
import { decorate } from '@storybook/addon-actions';
import { sequence } from './sequence.js';

const customEvent = decorate([(args) => {
  return [JSON.stringify(args[0].detail)];
}]);

const markdownDocs = {};

export function setMarkdownDocs (component, md) {
  markdownDocs[component] = md;
}

export function makeStory (...configs) {

  const { name, docs, css, component, dom, items: rawItems = [{}], simulations = [] } = Object.assign({}, ...configs);

  const items = (typeof rawItems === 'function')
    ? rawItems()
    : rawItems;

  const storyFn = (aa) => {

    const container = document.createElement('div');
    const shadow = container.attachShadow({ mode: 'open' });

    if (css != null) {
      const styles = document.createElement('style');
      styles.innerHTML = css;
      shadow.appendChild(styles);
    }

    if (dom != null) {
      const wrapper = document.createElement('div');
      shadow.appendChild(wrapper);
      dom(wrapper);
      return container;
    }
    const items = (typeof rawItems === 'function')
      ? rawItems()
      : rawItems;

    const components = items.map((props) => {
      let element = document.createElement(component);
      element = assignPropsToElement(element, props);
      shadow.appendChild(element);
      return element;
    });

    sequence(async (wait) => {
      for (const { delay, callback } of simulations) {
        await wait(delay);
        callback(components);
      }
    });

    const customElementsJson = window.__STORYBOOK_CUSTOM_ELEMENTS__;
    const { events = [] } = customElementsJson.tags.find((tag) => tag.name === component);
    events.forEach(({ name: eventName }) => {
      container.addEventListener(eventName, customEvent.action(eventName));
    });

    return container;
  };

  const generatedSource = () => items
    .map(({ innerHTML = '', ...props }) => {

      const allPropertiesAndAttributes = Object.entries(props)
        .map(([name, value]) => {
          if (value === true) {
            return `${name}`;
          }
          if (typeof value === 'string' || typeof value === 'number') {
            return `${name}=${JSON.stringify(String(value))}`;
          }
          if (typeof value === 'object') {
            return `${name}='${JSON.stringify(value)}'`;
          }
          return null;
        })
        .filter((a) => a != null);

      const attrsAndProps = allPropertiesAndAttributes.length > 0
        ? ' ' + allPropertiesAndAttributes.join(' ')
        : '';

      return `<${component}${attrsAndProps}>${innerHTML}</${component}>`;
    })
    .join('\n');

  const domSource = () => {
    const container = document.createElement('div');
    dom(container);
    return container.innerHTML
      .replace(/<!---->/g, '')
      .trim();
  };

  const mdxSource = (dom != null)
    ? domSource()
    : generatedSource();

  let notes;
  if (component != null && markdownDocs[component] != null) {
    notes = markdownDocs[component];
  }
  else {
    notes = `
# ${component}

No markdown documentation could be found for this component.

Don't forget to run:
      
\`\`\`bash
npm run components:docs
\`\`\`
`.trim();
  }

  storyFn.story = {
    docs,
    css,
    component,
    items,
    parameters: {
      docs: {
        storyDescription: (docs || '').trim(),
      },
      notes,
      // Dirty way to ovveride the contnet of the "show code" block
      mdxSource,
    },
  };

  if (name != null) {
    storyFn.story.name = name;
  }

  return storyFn;
}

export function storyWait (delay, callback) {
  return { delay, callback };
}

function assignPropsToElement (element, props = {}) {
  Object.entries(props).forEach(([name, value]) => {
    if (name === 'style' || name === 'class') {
      element.setAttribute(name, value);
    }
    if (name === 'children') {
      value().forEach((child) => element.appendChild(child));
    }
    else {
      element[name] = value;
    }
  });
  return element;
}

export function createStoryItem (storyFn, props = {}, itemIndex = 0) {
  const story = storyFn.story;
  const element = document.createElement(story.component);
  assignPropsToElement(element, story.items[itemIndex]);
  assignPropsToElement(element, props);
  return element;
}
