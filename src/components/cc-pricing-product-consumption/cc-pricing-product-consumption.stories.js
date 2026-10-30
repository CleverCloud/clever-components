import { baseCellar, baseFsBucket, baseHeptapod, basePulsar } from '../../stories/fixtures/consumption-plans.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-pricing-product-consumption.js';

export default {
  tags: ['autodocs'],
  title: '🛠 pricing/<cc-pricing-product-consumption>',
  component: 'cc-pricing-product-consumption',
};

const conf = {
  component: 'cc-pricing-product-consumption',
};

/**
 * @import { CcPricingProductConsumption } from './cc-pricing-product-consumption.js'
 */

export const defaultStory = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedWithFsBucket = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseFsBucket,
      },
    },
  ],
});

export const dataLoadedWithPulsar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...basePulsar,
      },
    },
  ],
});

export const dataLoadedWithHeptapod = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: {
        type: 'loaded',
        ...baseHeptapod,
      },
    },
  ],
});

export const dataLoadedWithNoAction = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      action: 'none',
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const dataLoadedWithDollars = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      currency: 'USD',
      state: {
        type: 'loaded',
        ...baseCellar,
      },
    },
  ],
});

export const simulationsWithCellar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...baseCellar,
        };
      },
    ),
  ],
});

export const simulationsWithFsBucket = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...baseFsBucket,
        };
      },
    ),
  ],
});

export const simulationsWithPulsar = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          ...basePulsar,
        };
      },
    ),
  ],
});

export const simulationsWithError = makeStory(conf, {
  /** @type {Array<Partial<CcPricingProductConsumption>>} */
  items: [
    {
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {Array<CcPricingProductConsumption>} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

// TEMP: demo of #1855, to remove before merging
export const tempFluidWidth = makeStory(conf, {
  tests: { accessibility: { enable: false }, visual: { enable: false } },
  dom: (container) => {
    container.innerHTML = `
      <style>
        .controls { align-items: center; display: flex; flex-wrap: wrap; gap: 0.5em; margin-bottom: 1em; }
        .readout { background: #f3f3f3; font-family: monospace; padding: 0.5em 1em; white-space: pre; }
        .grid { display: grid; grid-template-columns: 1fr; margin-block: 1em; outline: 2px dashed #36f; }
      </style>
      <div class="controls">
        <span>Container width:</span>
        <button data-width="1000">1000px</button>
        <button data-width="360">360px</button>
        <button data-width="300">300px</button>
        <input class="slider" type="range" min="250" max="1200" value="360" />
        <button class="recreate">Recreate the component</button>
      </div>
      <div class="readout"></div>
      <div class="grid"></div>
    `;

    const grid = container.querySelector('.grid');
    const slider = container.querySelector('.slider');
    const readout = container.querySelector('.readout');
    /** @type {CcPricingProductConsumption} */
    let component;

    const setWidth = (width) => {
      grid.style.width = `${width}px`;
      slider.value = width;
    };

    const createComponent = () => {
      component = document.createElement('cc-pricing-product-consumption');
      component.action = 'none';
      component.state = { type: 'loaded', ...basePulsar };
      grid.replaceChildren(component);
    };

    const updateReadout = () => {
      const body = component?.shadowRoot?.querySelector('.body');
      if (body != null) {
        const gridWidth = Math.round(grid.getBoundingClientRect().width);
        const contentWidth = body.scrollWidth;
        const mode = body.classList.contains('body--big') ? 'body--big (wide)' : 'body--small';
        readout.textContent = [
          `container width: ${gridWidth}px`,
          `content width:   ${contentWidth}px`,
          `component mode:  ${mode}`,
          `overflow:        ${Math.max(contentWidth - gridWidth, 0)}px`,
        ].join('\n');
      }
      requestAnimationFrame(updateReadout);
    };

    for (const button of container.querySelectorAll('[data-width]')) {
      button.addEventListener('click', () => setWidth(button.dataset.width));
    }
    slider.addEventListener('input', () => setWidth(slider.value));
    container.querySelector('.recreate').addEventListener('click', createComponent);

    setWidth(360);
    createComponent();
    updateReadout();
  },
});
