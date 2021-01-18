import { useArgs } from '@web/storybook-prebuilt/addons.js';
import { getLanguage } from '../../src/lib/i18n.js';
import { getLangArgType, setUpdateArgsCallback, updateLang } from './i18n-control.js';
import { sequence } from './sequence.js';

const ceJson = window.__STORYBOOK_CUSTOM_ELEMENTS__;

export function makeStory (...configs) {

  const { name, docs, css, component, dom, items: rawItems = [{}], simulations = [] } = Object.assign({}, ...configs);

  const items = (typeof rawItems === 'function')
    ? rawItems()
    : rawItems;

  const storyFn = (storyArgs) => {

    updateLang(storyArgs.lang);
    // React hooks voodoo shit
    const [, updateArgs] = useArgs();
    setUpdateArgsCallback(updateArgs);

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

    const componentDefinition = ceJson.tags.find((c) => c.name === component);
    const componentEventNames = (componentDefinition != null && componentDefinition.events != null)
      ? componentDefinition.events.map((e) => e.name)
      : [];

    Object
      .entries(storyArgs)
      .filter(([eventName]) => componentEventNames.includes(eventName))
      .forEach(([eventName, callback]) => {
        container.addEventListener(eventName, (e) => callback(JSON.stringify(e.detail)));
      });

    return container;
  };

  const generatedSource = () => items
    .map(({ innerHTML = '', ...props }) => {

      const allPropertiesAndAttributes = Object.entries(props)
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

  storyFn.parameters = {
    docs: {
      description: {
        story: (docs || '').trim(),
      },
    },
    storySource: {
      source: mdxSource,
    },
    // Detect all *:* as events and refine in the story
    actions: {
      argTypesRegex: '.*:.*',
    },
  };

  storyFn.argTypes = {
    lang: getLangArgType(),
  };

  storyFn.args = {
    lang: getLanguage(),
  };

  storyFn.docs = docs;
  storyFn.css = css;
  storyFn.component = component;
  storyFn.items = items;

  if (name != null) {
    storyFn.storyName = name;
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
  const element = document.createElement(storyFn.component);
  assignPropsToElement(element, storyFn.items[itemIndex]);
  assignPropsToElement(element, props);
  return element;
}
