import { html, render } from 'lit';
import { iconRemixHome_3Line as iconHouse } from '../../assets/cc-remix.icons.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-breadcrumbs.js';

export default {
  tags: ['autodocs'],
  title: '🧬 Molecules/<cc-breadcrumbs>',
  component: 'cc-breadcrumbs',
};

/**
 * @typedef {import('./cc-breadcrumbs.js').CcBreadcrumbs} CcBreadcrumbs
 */

const conf = {
  component: 'cc-breadcrumbs',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcBreadcrumbs>[]} */
  items: [
    {
      items: [{ value: 'first' }, { value: 'second' }, { value: 'third' }],
    },
  ],
});

export const withIconStory = makeStory(conf, {
  /** @type {Partial<CcBreadcrumbs>[]} */
  items: [
    {
      items: [{ value: 'home', icon: iconHouse }, { value: 'first' }, { value: 'second' }, { value: 'third' }],
    },
  ],
});

export const withSmallContainerStory = makeStory(conf, {
  dom: /** @param {HTMLElement} container */ (container) => {
    let width = '25';

    /**
     * @param {Event & { target: { value: string }}} e
     */
    function _onChange(e) {
      width = e.target.value;
      refresh();
    }

    const items = [{ value: 'home', icon: iconHouse }, { value: 'first' }, { value: 'second' }, { value: 'third' }];

    function refresh() {
      render(
        html`
          <div class="main">
            <div class="form">
              <label for="width">Width: (${width}%)</label>
              <input type="range" id="width" .value=${String(width)} min="3" max="100" @input=${_onChange} />
            </div>
            <cc-breadcrumbs .items=${items} style="width:${width}%"></cc-breadcrumbs>
          </div>
        `,
        container,
      );
    }

    refresh();
  },
  // language=CSS
  css: `
    cc-breadcrumbs {
      border: 2px solid #ccc;
    }
    .main {
      display: flex;
      flex-direction: column;
      gap: 1em;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 0.25em;
      align-items: start;
    }
  `,
});
