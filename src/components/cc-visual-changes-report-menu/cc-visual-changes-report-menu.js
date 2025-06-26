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
  iconRemixArrowLeftSLine as iconArrowLeft,
  iconRemixArrowRightSLine as iconArrowRight,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToHuman } from '../../lib/change-case.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('../cc-visual-changes-report-entry/cc-visual-changes-report-entry.types.js').VisualChangesTestResult} VisualChangesTestResult
 * @typedef {import('../../lib/events.types.js').EventWithTarget<HTMLAnchorElement>} HTMLAnchorEvent
 * @typedef {import('lit').PropertyValues<CcVisualChangesReportMenu>} CcVisualChangesReportMenuPropertyValues
 */

export class CcVisualChangesReportMenu extends LitElement {
  static get properties() {
    return {
      activeTestResultId: { type: String, attribute: 'active-test-result-id' },
      testResults: { type: Array, attribute: 'test-results' },
      _menuEntries: { type: Array, state: true },
      _openCategory: { type: Object, state: true },
      _sortedTestResultsIds: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {VisualChangesTestResult['id']} */
    this.activeTestResultId = null;

    /** @type {VisualChangesTestResult[]} */
    this.testResults = [];

    /** @type {{ component: string, story: string }} */
    this._openCategory = { component: null, story: null };

    /** @type {Array<any>}  */
    this._menuEntries = [];

    /** @type {Array<VisualChangesTestResult['id']>} */
    this._sortedTestResultsIds = [];
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
      c.stories = c.storyList.sort((a, b) => {
        if (a.storyName === 'defaultStory' && b.storyName !== 'defaultStory') {
          return -1;
        }
        if (a.storyName !== 'defaultStory' && b.storyName === 'defaultStory') {
          return 1;
        }
        return a.storyName.localeCompare(b.storyName);
      });
      delete c.storyList;
    });
    return components;
  }

  /** @param {string} componentTagName */
  _toggleComponent(componentTagName) {
    if (this._openCategory.component === componentTagName) {
      this._openCategory = { ...this._openCategory, component: null };
    } else {
      this._openCategory = { ...this._openCategory, component: componentTagName };
    }
  }

  /** @param {string} storyName */
  _toggleStory(storyName) {
    if (this._openCategory.story === storyName) {
      this._openCategory = { ...this._openCategory, story: null };
    } else {
      this._openCategory = { ...this._openCategory, story: storyName };
    }
  }

  /** @param {CcVisualChangesReportMenuPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('activeTestResultId') || changedProperties.has('testResults')) {
      const activeTestResult = this.testResults.find((testResult) => this.activeTestResultId === testResult.id);
      if (activeTestResult != null) {
        this._openCategory = { component: activeTestResult.componentTagName, story: activeTestResult.storyName };
      }
    }

    if (changedProperties.has('testResults')) {
      this._menuEntries = this._getMenuEntries(this.testResults || []);
      this._sortedTestResultsIds = this._menuEntries.flatMap((menuEntry) =>
        menuEntry.stories.flatMap((story) => story.viewports).flatMap(({ id }) => id),
      );
    }
  }

  /**
   * Returns the previous and next test result IDs, wrapping around if needed.
   */
  _getPrevNextTestResultIds() {
    const activeTestResultIndex = this._sortedTestResultsIds.indexOf(this.activeTestResultId);
    const total = this._sortedTestResultsIds.length;
    const previousTestResultIndex = (activeTestResultIndex - 1 + total) % total;
    const nextTestResultIndex = (activeTestResultIndex + 1) % total;
    return {
      previousTestResultId: this._sortedTestResultsIds[previousTestResultIndex],
      nextTestResultId: this._sortedTestResultsIds[nextTestResultIndex],
    };
  }

  render() {
    if (this.testResults.length === 0) {
      return '';
    }

    const { previousTestResultId, nextTestResultId } = this._getPrevNextTestResultIds();
    return html`
      <ul class="quick-nav">
        <li>
          <a href="/test-result/${previousTestResultId}">
            <cc-icon .icon="${iconArrowLeft}"></cc-icon>
            <span>Previous</span>
          </a>
        </li>
        <li>
          <a href="/test-result/${nextTestResultId}"><span>Next</span> <cc-icon .icon="${iconArrowRight}"></cc-icon></a>
        </li>
      </ul>
      <ul class="component-tag-names">
        ${this._menuEntries.map(({ componentTagName, stories }) => {
          const open = this._openCategory.component === componentTagName;
          return html`
            <li class="component-tag-name ">
              <button
                class="toggle-btn"
                @click="${() => this._toggleComponent(componentTagName)}"
                aria-expanded="${open}"
                aria-controls="stories-${componentTagName}"
              >
                <cc-icon .icon="${iconArrowDown}"></cc-icon>
                <span>${componentTagName}</span>
              </button>
              <ul
                id="stories-${componentTagName} "
                class="story-level ${classMap({ hidden: !open, 'component-tag-name--active': open })}"
              >
                ${stories.map(({ storyName, viewports }) => {
                  const isStoryOpen = this._openCategory.story === storyName;
                  return html`<li class="story-name">
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
                            <a
                              class="test-result-entry ${classMap({
                                'test-result-entry--active': this.activeTestResultId === id,
                              })}"
                              href="/test-result/${id}"
                            >
                              ${viewportType} - ${browserName} <cc-icon .icon="${iconArrowRight}"></cc-icon>
                            </a>
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
          text-align: start;
        }

        .component-tag-name > .toggle-btn {
          padding: 1em;
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

        .component-tag-names {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .component-tag-name {
          transition: background-color 0.3s;
        }

        .component-tag-name--active {
          transition: background-color 0.3s;
          background-color: var(--cc-color-bg-neutral-alt);
        }

        .story-name {
          padding: 0.5em;
        }

        .story-name:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral);
        }

        .story-level {
          padding: 0.5em 1em;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .viewport-level {
          padding: 0.5em 0;
        }

        .test-result-entry {
          padding: 0.5em 0.5em;
          margin-left: 1.5em;
          text-transform: capitalize;
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-decoration: none;
          color: var(--cc-color-text-default);
        }

        .test-result-entry:hover {
          text-decoration: underline;
        }

        .test-result-entry--active {
          color: var(--cc-color-text-inverted);
          background-color: var(--cc-color-bg-primary);
          border-radius: var(--cc-border-radius-small);
        }

        .hidden {
          display: none;
        }

        .quick-nav {
          display: flex;
          padding: 1em;
          gap: 1em;
        }

        .quick-nav li {
          flex: 1 1 0;
        }

        .quick-nav a {
          text-decoration: none;
          display: flex;
          justify-content: space-between;
          gap: 0.5em;
          align-items: center;
          background-color: var(--cc-color-bg-primary);
          color: var(--cc-color-text-inverted);
          padding: 0.5em;
          flex: 1 1 0;
          border-radius: var(--cc-border-radius-default);
        }

        .quick-nav a:focus {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }
      `,
    ];
  }
}

customElements.define('cc-visual-changes-report-menu', CcVisualChangesReportMenu);
