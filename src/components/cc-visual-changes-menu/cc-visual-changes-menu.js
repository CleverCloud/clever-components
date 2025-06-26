// TODO
// Global metadata at the top (TODO: maybe add the number of failures)
//
// menu
//   - list of categories (component tag name)
//     - for each category, list of stories
//        - for each story, viewport (LINK)
// details summary for each browser
//
//
// (optional) router for shared links => parse path, if
// (optional) save viewed to local storage
// (optional) next / prev

import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixArrowDownSLine as iconArrowDown,
  iconRemixArrowRightSLine as iconArrowRight,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToHuman } from '../../lib/change-case.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../cc-visual-changes-report-entry/cc-visual-changes-report-entry.types.js').VisualChangesTestResult} VisualChangesTestResult
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLAnchorElement>} HTMLAnchorEvent
 */

export class CcVisualChangesMenu extends LitElement {
  static get properties() {
    return {
      testResults: { type: Array, attribute: 'test-results' },
      _openCategory: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {VisualChangesTestResult[]} */
    this.testResults = null;
    /** @type {{ component: string, story: string }} */
    this._openCategory = { component: null, story: null };
  }

  /**
   * Builds a hierarchical menu structure from the test results.
   *
   * @param {VisualChangesTestResult[]} results
   */
  _getMenuEntries(results) {
    const components = [];
    const byComponent = {};

    for (const result of results) {
      if (!byComponent[result.componentTagName]) {
        byComponent[result.componentTagName] = {
          componentTagName: result.componentTagName,
          stories: {},
          storyList: [],
        };
        components.push(byComponent[result.componentTagName]);
      }

      const componentEntry = byComponent[result.componentTagName];

      if (!componentEntry.stories[result.storyName]) {
        componentEntry.stories[result.storyName] = { storyName: result.storyName, viewports: [] };
        componentEntry.storyList.push(componentEntry.stories[result.storyName]);
      }

      componentEntry.stories[result.storyName].viewports.push({
        viewportType: result.viewportType,
        browserName: result.browserName,
        id: result.id,
      });
    }
    // Flatten stories for each component
    components.forEach((c) => {
      c.stories = c.storyList;
      delete c.storyList;
    });
    return components;
  }

  _toggleComponent(componentTagName) {
    if (this._openCategory.component === componentTagName) {
      this._openCategory = { ...this._openCategory, component: null };
    } else {
      console.log({ ...this._openCategory, component: componentTagName });
      this._openCategory = { ...this._openCategory, component: componentTagName };
    }
  }

  _toggleStory(storyName) {
    if (this._openCategory.story === storyName) {
      this._openCategory = { ...this._openCategory, story: null };
    } else {
      this._openCategory = { ...this._openCategory, story: storyName };
    }
  }

  render() {
    const menuEntries = this._getMenuEntries(this.testResults || []);
    console.log(this.testResults);
    return html`
      <ul>
        ${menuEntries.map(({ componentTagName, stories }) => {
          const open = this._openCategory.component === componentTagName;
          console.log({ componentTagName, stories });
          return html`
            <li>
              <button
                class="toggle-btn"
                @click="${() => this._toggleComponent(componentTagName)}"
                aria-expanded="${open}"
                aria-controls="stories-${componentTagName}"
              >
                <cc-icon .icon="${iconArrowDown}"></cc-icon>
                <span>${componentTagName}</span>
              </button>
              <ul id="stories-${componentTagName}" class="story-level ${classMap({ hidden: !open })}">
                ${stories.map(({ storyName, viewports }) => {
                  const isStoryOpen = this._openCategory.story === storyName;
                  console.log({ storyName });
                  return html`<li>
                    <button
                      class="toggle-btn"
                      @click="${() => this._toggleStory(storyName)}"
                      aria-expanded="${isStoryOpen}"
                      aria-controls="stories-${storyName}"
                    >
                      <cc-icon .icon="${iconArrowDown}"></cc-icon>
                      <span>${enhanceStoryName(camelCaseToHuman(storyName))}</span>
                    </button>
                    <ul class="viewport-level ${classMap({ hidden: !isStoryOpen })}">
                      ${viewports.map(
                        ({ viewportType, browserName, id }) => html`
                          <li class="viewport-browser">
                            <a href="${id}"
                              >${viewportType} - ${browserName} <cc-icon .icon="${iconArrowRight}"></cc-icon
                            ></a>
                          </li>
                        `,
                      )}
                    </ul>
                  </li>`;
                })}
              </ul>
            </li>
          `;
        })}
      </ul>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          border-right: solid 1px var(--cc-color-border-neutral-weak);
          height: 100%;
        }

        cc-icon {
          flex: 0 0 auto;
        }

        ul,
        li {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        ul {
          display: block;
          height: 100%;
        }

        .toggle-btn {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          padding: 0.2em 0.5em;
          display: flex;
          align-items: center;
          gap: 0.5em;
          width: 100%;
          padding: 0.5em 1em;
        }

        a:focus-visible,
        .toggle-btn:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
          border-radius: var(--cc-border-radius-default);
        }

        .toggle-btn cc-icon {
          transition: transform 0.3s;
        }

        .toggle-btn[aria-expanded='true'] cc-icon {
          transform: rotate(180deg);
        }

        .toggle-btn:hover cc-icon {
          transform: rotate(90deg);
        }

        .story-level {
          margin-left: 1.5em;
        }

        .viewport-level {
          margin-left: 3.5em;
        }

        a {
          display: block;
          padding: 0.5em;
          text-transform: capitalize;
          display: flex;
          align-items: center;
          text-decoration: none;
          color: var(--cc-color-text-default);
        }

        .hidden {
          visibility: hidden;
          height: 0;
        }
      `,
    ];
  }
}

customElements.define('cc-visual-changes-menu', CcVisualChangesMenu);
