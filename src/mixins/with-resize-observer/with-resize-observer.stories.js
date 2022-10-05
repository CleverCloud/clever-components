import '../../components/cc-expand/cc-expand.js';
import { html, LitElement } from 'lit';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';
import { withResizeObserver } from './with-resize-observer.js';
import docsPage from './with-resize-observer.md';
// import { action } from '@storybook/addon-actions';
const action = () => () => {
};

class WithHtml extends withResizeObserver(window.HTMLElement) {
  static get properties () {
    return {
      breakpoints: { type: Object },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [75, 150, 225],
    };
  }

  onResize ({ width }) {
    action('resize HTMLElement')(`width: ${width}`);
  }
}

window.customElements.define('html-element', WithHtml);

class WithLit extends withResizeObserver(LitElement) {
  static get properties () {
    return {
      breakpoints: { type: Object },
    };
  }

  constructor () {
    super();
    this.breakpoints = {
      width: [75, 150, 225],
    };
  }

  onResize ({ width }) {
    action('resize LitElement')(`width: ${width}`);
  }

  render () {
    return html`
      <slot></slot>
    `;
  }
}

window.customElements.define('lit-element', WithLit);

export default {
  title: '🔀 Mixins/withResizeObserver()',
  parameters: { docs: { page: docsPage.parameters.docs.page } },
};

export const defaultStory = () => {
  const storyDom = document.createElement('div');
  storyDom.innerHTML = `
    
    <style>
      html,
      body {
        background-color: #fff;
      }
      body {
        margin: 1em;
      }
      table {
        border-collapse: collapse;
        margin-bottom: 1em;
      }
      table,
      th,
      td {
        border: 1px solid #bbb;
        padding: 0.5em;
      }
      th {
        background-color: #f5f5f5;
        font-weight: normal;
      }
      td:nth-child(2),
      td:nth-child(3) {
        font-family: monospace;
        white-space: pre
      }
      
      .color {
        border-radius: 0.25em;
        display: inline-block;
        height: 1em;
        margin-right: 0.5em;
        vertical-align: middle;
        width: 1em;
      }
      
      pre {
        background-color: #f5f5f5;
        border-radius: 0.25em;
        padding: 1em;
      }
      
      .attributes {
        color: blue;
        font-weight: bold;
      }
      
      .container {
        border: 1px solid #000;
        box-sizing: border-box;
        display: inline-block;
        padding: 1em;
        overflow: hidden;
      }
      
      .container[w-lt-75] {
        background: lime;
      }

      .container[w-gte-75][w-lt-150] {
        background: orange;
      }
      
      .container[w-gte-150][w-lt-225] {
        background: deepskyblue;
      }
      
      .container[w-gte-225] {
        background: tomato;
      }
    </style>
    
    <!-- Should be a know but for now, HTML stories with knobs are reloaded on change -->
    <div class="title">Set container width here:</div>
    <div class="button"><cc-toggle value="50"></cc-toggle></div>
    
    <div class="title">Container uses <code>withResizeObserver()</code> with <code>breakpoints</code> [75, 150, 225] so <code>w-lt-*</code> and <code>w-gte-*</code> attributes are automatically set/removed like this:</div>
    <pre>&lt;div class="container" <span class="attributes"></span>>Lorem ipsum...&lt;/div></pre>

    <div class="title">This way, we can apply some styles depending on the width with attribute selectors (a bit like media queries):</div>
    <table>
      <tr><th>style                                                                     </th><th>breakpoints       </th><th>selector</th>
      <tr><td><div class="color" style="background-color: lime"></div>lime              </td><td>       width <  75</td><td>.container[w-lt-75] { /* ... */ }</td>
      <tr><td><div class="color" style="background-color: orange"></div>orange          </td><td> 75 <= width < 150</td><td>.container[w-gte-75][w-lt-150] { /* ... */ }</td>
      <tr><td><div class="color" style="background-color: deepskyblue"></div>deepskyblue</td><td>150 <= width < 225</td><td>.container[w-gte-150][w-lt-225] { /* ... */ }</td>
      <tr><td><div class="color" style="background-color: tomato"></div>tomato          </td><td>225 <= width      </td><td>.container[w-gte-225] { /* ... */ }</td>
    </table>
    
    <div class="title">Containers: with HTMLElement & with LitElement:</div>
    <html-element class="container" style="width: 50px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Quisque bibendum odio at nibh finibus, eu lacinia ante aliquam.
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
      Curabitur nec sollicitudin augue.
    </html-element>
    <lit-element class="container" style="width: 50px">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Quisque bibendum odio at nibh finibus, eu lacinia ante aliquam.
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
      Curabitur nec sollicitudin augue.
    </lit-element>
  `;

  storyDom.querySelector('cc-toggle').choices = Array.from(new Array(5)).map((a, i) => {
    const width = String((i + 1) * 50);
    return { label: width + 'px', value: width };
  });

  storyDom.addEventListener('cc-toggle:input', ({ detail: value }) => {
    Array.from(storyDom.querySelectorAll('.container')).forEach((container) => {
      container.style.width = value + 'px';
    });
  });

  const mo = new window.MutationObserver((mutationList, observer) => {
    storyDom.querySelector('.attributes').textContent = Array.from(
      storyDom.querySelector('.container').attributes,
    )
      .filter((attr) => attr.name.startsWith('w-'))
      .map((attr) => attr.name + '=""')
      .join(' ');
  });
  mo.observe(storyDom.querySelector('.container'), { attributes: true });

  return storyDom;
};

export const liveResize = () => {
  const storyDom = document.createElement('div');
  storyDom.innerHTML = `
    
    <style>
      html,
      body {
        background-color: #fff;
      }
      body {
        margin: 1em;
      }
      .container {
        border: 1px solid #000;
        box-sizing: border-box;
        display: inline-block;
        padding: 1rem;
        overflow: hidden;
      }
      
      .container[w-lt-200] {
        background: lime;
      }

      .container[w-gte-200][w-lt-500] {
        background: orange;
      }
      
      .container[w-gte-500][w-lt-800] {
        background: darkolivegreen;
      }
      
      .container[w-gte-800][w-lt-1000] {
        background: deepskyblue;
      }
      
      .container[w-gte-1000] {
        background: tomato;
      }
    </style>
    
    <p>Resize me and see my background color changing when reaching breakpoints: [200, 500, 800, 1000]</p>
    
    <lit-element class="container" breakpoints='{"width": [200, 500, 800, 1000]}'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Quisque bibendum odio at nibh finibus, eu lacinia ante aliquam.
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
      Curabitur nec sollicitudin augue.
    </lit-element>
  `;

  return storyDom;
};

enhanceStoriesNames({ defaultStory, liveResize });
