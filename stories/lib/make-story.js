// TRICK_START: if we import translation files statically here, storybook gets reloaded when translations are updated :p
import '../../components/translations/translations.en.js';
import '../../components/translations/translations.fr.js';
// TRICK_END
import { decorate } from '@storybook/addon-actions';
import * as blockPreview from '@storybook/components/dist/blocks/Preview.js';
import { sequence } from './sequence.js';

// NOTE: Those dirty injects are work in progress

// Force html in preview examples
const oldPreview = blockPreview.Preview;
blockPreview.Preview = (pppp) => {
  return oldPreview({ ...pppp, language: 'html', isExpanded: false });
};

const customEvent = decorate([(args) => {
  return [JSON.stringify(args[0].detail)];
}]);

export function makeStory (...configs) {

  const { name, docs, css, component, dom, items: rawItems = [{}], events = [], simulations = [] } = Object.assign({}, ...configs);

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

    events.forEach((e) => {
      container.addEventListener(e, customEvent.action(e));
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
          if (typeof value === 'object' && Array.isArray(value)) {
            return `.${name}='${JSON.stringify(value)}'`;
          }
          if (typeof value === 'object') {
            return `.${name}='${JSON.stringify(value)}'`;
          }
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

  storyFn.story = {
    docs,
    css,
    component,
    items,
    parameters: {
      docs: {
        storyDescription: (docs || '').trim(),
      },
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
