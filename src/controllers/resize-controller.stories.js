import { LitElement, css, html } from 'lit';
import '../components/cc-expand/cc-expand.js';
import { ResizeController } from './resize-controller.js';
import docStoryModule from './resize-controller.md';

const BREAKPOINTS = [200, 300, 400];

// eslint-disable-next-line wc/file-name-matches-element
class DemoResizeController extends LitElement {
  constructor() {
    super();

    this._teams = [
      {
        name: 'Hubert',
        team: 'Cat 😺',
      },
      {
        name: 'Mathieu',
        team: 'Cat 😺',
      },
      {
        name: 'Florian',
        team: 'Dog 🐶',
      },
      {
        name: 'Robert',
        team: 'Dog 🐶',
      },
      {
        name: 'Pierre',
        team: 'Frog 🐸',
      },
      {
        name: 'Hélène',
        team: 'Cat 😺',
      },
    ];

    /** @type {ResizeController} */
    this._resizeObserver = new ResizeController(this, {
      widthBreakpoints: BREAKPOINTS,
    });
  }

  render() {
    const { width: componentWidth } = this._resizeObserver;

    return html`
      <div class="wrapper">
        <p>I can track my own <code>width</code> and adapt my content to it:</p>
        <p>My current width is <code>${componentWidth}</code>.</p>

        ${componentWidth >= 458 ? this._fullWidthTable() : ''}
        ${componentWidth < 458 && componentWidth >= 300 ? this._narrowTable() : ''}
        ${componentWidth < 300 && componentWidth >= 200 ? this._list() : ''}
        ${componentWidth < 200
          ? html`<p>
              I am way too small to display anything interesting, <strong>please don't leave me like this</strong>.
            </p>`
          : ''}
      </div>
    `;
  }

  _fullWidthTable() {
    return html`
      <p>I am able to display a <strong>table with many columns</strong>.</p>
      <table>
        <caption>
          Team cat versus team dog within the frontend team
        </caption>
        <thead>
          <tr>
            ${this._teams.map(({ name }) => html` <th scope="col">${name}</th> `)}
          </tr>
        </thead>
        <tbody>
          <tr>
            ${this._teams.map(({ team }) => html` <td>${team}</td> `)}
          </tr>
        </tbody>
      </table>
    `;
  }

  _narrowTable() {
    return html`
      <p>I can adapt to display a <strong>table a few columns and many rows</strong>.</p>
      <table>
        <caption>
          Team cat versus team dog within the frontend team
        </caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Team</th>
          </tr>
        </thead>
        <tbody>
          ${this._teams.map(
            ({ name, team }) => html`
              <tr>
                <th scope="row">${name}</th>
                <td>${team}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }

  _list() {
    return html`
      <p>I can adapt to display a <strong>list</strong>.</p>
      <strong>Team cat versus team dog within the frontend team</strong>
      <dl>
        ${this._teams.map(
          ({ name, team }) => html`
            <div>
              <dt>${name}:</dt>
              <dd>${team}</dd>
            </div>
          `,
        )}
      </dl>
    `;
  }

  static get styles() {
    return [
      // Language CSS
      css`
        :host {
          box-sizing: border-box;
          display: block;
          padding: 1em;
        }

        :host([w-lt-200]) {
          background: tomato;
        }

        :host([w-gte-200][w-lt-300]) {
          background: orange;
        }

        :host([w-gte-300][w-lt-400]) {
          background: deepskyblue;
        }

        :host([w-gte-400]) {
          background: lime;
        }

        .wrapper {
          background-color: #eee;
          padding: 0.5em;
        }

        code {
          background-color: #585858;
          color: #fff;
          font-weight: bold;
          padding: 0.3em;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        td,
        th {
          border: solid 1px grey;
          padding: 0.5em;
        }

        dd,
        dt {
          margin: 0;
          padding: 0;
        }

        dl {
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          gap: 0.5em;
          margin-block: 1em;
          padding: 0;
        }

        dl div {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        dt {
          font-weight: bold;
        }
      `,
    ];
  }
}

window.customElements.define('demo-resize-controller', DemoResizeController);

export default {
  title: '🕹️ Controllers/ResizeController',
  tags: ['autodocs'],
  parameters: {
    docs: docStoryModule.parameters.docs,
  },
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
        padding: 1em;
      }

      cc-toggle {
        margin-bottom: 1em;
      }

      .attributes {
        color: blue;
        font-weight: bold;
      }

      table {
        margin-bottom: 1em;
        border-collapse: collapse;
      }

      table,
      th,
      td {
        padding: 0.5em;
        border: 1px solid #bbb;
      }

      th {
        background-color: #f5f5f5;
        font-weight: normal;
      }

      td:nth-child(2),
      td:nth-child(3) {
        font-family: monospace;
        white-space: pre;
      }

      .color {
        display: inline-block;
        width: 1em;
        height: 1em;
        margin-right: 0.5em;
        border-radius: var(--cc-border-radius-default, 0.25em);
        vertical-align: middle;
      }

      pre {
        padding: 1em;
        background-color: #f5f5f5;
        border-radius: var(--cc-border-radius-default, 0.25em);
      }

      demo-resize-controller {
        resize: horizontal;
        overflow: hidden;
      }
    </style>

    <div class="button"><cc-toggle legend="Set container width here:" value="125"></cc-toggle></div>

    <table>
      <tr><th>style                                                                     </th><th>breakpoints        </th><th>selector                                     </th></tr>
      <tr><td><div class="color" style="background-color: tomato"></div>tomato          </td><td>       width <  200</td><td>.container[w-lt-200] { /* ... */ }           </td></tr>
      <tr><td><div class="color" style="background-color: orange"></div>orange          </td><td> 200 <= width < 300</td><td>.container[w-gte-200][w-lt-300] { /* ... */ }</td></tr>
      <tr><td><div class="color" style="background-color: deepskyblue"></div>deepskyblue</td><td>300 <= width < 400 </td><td>.container[w-gte-300][w-lt-400] { /* ... */ }</td></tr>
      <tr><td><div class="color" style="background-color: lime"></div>lime              </td><td>400 <= width       </td><td>.container[w-gte-400] { /* ... */ }          </td></tr>
    </table>

    <div class="title">The Container uses the <code>ResizeController</code> with <code>breakpoints</code> [200, 300, 400] so <code>w-lt-*</code> and <code>w-gte-*</code> attributes are automatically set/removed like this:</div>
    <pre>&lt;demo-resize-controller <span class="attributes"></span>>Lorem ipsum...&lt;/div></pre>
    <demo-resize-controller style="width: 125px">
    </demo-resize-controller>
  `;

  storyDom.querySelector('cc-toggle').choices = Array.from(new Array(4)).map((a, i) => {
    const width = String((i + 1) * 125);
    return { label: width + 'px', value: width };
  });

  storyDom.addEventListener('cc-toggle:input', ({ detail: value }) => {
    const demoContainer = storyDom.querySelector('demo-resize-controller');
    demoContainer.style.width = value + 'px';
  });

  const mo = new window.MutationObserver(() => {
    storyDom.querySelector('.attributes').textContent = Array.from(
      storyDom.querySelector('demo-resize-controller').attributes,
    )
      .filter((attr) => attr.name.startsWith('w-'))
      .map((attr) => attr.name + '=""')
      .join(' ');
  });
  mo.observe(storyDom.querySelector('demo-resize-controller'), { attributes: true });

  return storyDom;
};
