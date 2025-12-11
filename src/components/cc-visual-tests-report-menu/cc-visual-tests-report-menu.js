import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArrowDownSLine as iconArrowDown,
  iconRemixArrowLeftSLine as iconArrowLeft,
  iconRemixArrowRightSLine as iconArrowRight,
} from '../../assets/cc-remix.icons.js';
import { camelCaseToSpacedCapitalized, kebabCase } from '../../lib/change-case.js';
import { isVisibleInContainer } from '../../lib/utils.js';
import { enhanceStoryName } from '../../stories/lib/story-names.js';
import '../cc-icon/cc-icon.js';

/**
 * @import { VisualTestResult } from '../cc-visual-tests-report/visual-tests-report.types.js'
 * @import { VisualTestsReportMenuEntries } from './cc-visual-tests-report-menu.types.js'
 * @import { PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component that displays a menu for the visual tests report.
 *
 * ## Details
 *
 * It allows navigating through components, stories, and viewports.
 * This component takes an array of visual test results and organizes them into a hierarchical, collapsible menu.
 * It also provides "Previous" and "Next" buttons for quick navigation between test results.
 *
 * @cssdisplay grid
 */
export class CcVisualTestsReportMenu extends LitElement {
  static get properties() {
    return {
      activeTestResultId: { type: String, attribute: 'active-test-result-id' },
      testsResults: { type: Array, attribute: 'tests-results' },
      _activeMenuEntry: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {VisualTestResult['id']} */
    this.activeTestResultId = null;

    /** @type {VisualTestResult[]} */
    this.testsResults = [];

    /** @type {{ component: string, story: string }} */
    this._activeMenuEntry = { component: null, story: null };

    /** @type {VisualTestsReportMenuEntries}  */
    this._menuEntries = [];

    /** @type {Array<VisualTestResult['id']>} */
    this._testsResultsIds = [];

    /** @type {Ref<HTMLUListElement>} */
    this._componentListRef = createRef();
  }

  /**
   * Sorts test results by component, story, viewport type (desktop first), then browser name.
   *
   * @param {VisualTestResult[]} results
   * @returns {VisualTestResult[]}
   */
  _sortTestResults(results) {
    return [...results].sort((a, b) => {
      const componentCompare = a.componentTagName.localeCompare(b.componentTagName);
      if (componentCompare !== 0) {
        return componentCompare;
      }

      const storyCompare = a.storyName.localeCompare(b.storyName);
      if (storyCompare !== 0) {
        return storyCompare;
      }

      if (a.viewportType !== b.viewportType) {
        return a.viewportType === 'desktop' ? -1 : 1;
      }

      return a.browserName.localeCompare(b.browserName);
    });
  }

  /**
   * Builds a hierarchical menu structure from the sorted test results.
   * This method assumes tests have been properly sorted first
   *
   * @param {VisualTestResult[]} sortedResults
   * @returns {VisualTestsReportMenuEntries}
   */
  _getMenuEntries(sortedResults) {
    /** @type {VisualTestsReportMenuEntries} */
    const menuEntries = [];
    let currentComponent = null;
    let currentStory = null;

    for (const result of sortedResults) {
      if (currentComponent == null || currentComponent.componentTagName !== result.componentTagName) {
        currentComponent = {
          componentTagName: result.componentTagName,
          stories: [],
        };
        currentStory = null;
        menuEntries.push(currentComponent);
      }

      if (currentStory == null || currentStory.storyName !== result.storyName) {
        currentStory = {
          storyName: result.storyName,
          viewports: [],
        };
        currentComponent.stories.push(currentStory);
      }

      currentStory.viewports.push({
        viewportType: result.viewportType,
        browserName: result.browserName,
        id: result.id,
      });
    }
    return menuEntries;
  }

  /** @param {string} componentTagName */
  _toggleComponent(componentTagName) {
    const isAlreadyActive = this._activeMenuEntry.component === componentTagName;
    this._activeMenuEntry = { component: isAlreadyActive ? null : componentTagName, story: null };
  }

  /** @param {string} kebabCasedStoryName */
  _toggleStory(kebabCasedStoryName) {
    const isAlreadyActive = this._activeMenuEntry.story === kebabCasedStoryName;
    this._activeMenuEntry = { ...this._activeMenuEntry, story: isAlreadyActive ? null : kebabCasedStoryName };
  }

  /** @param {PropertyValues<CcVisualTestsReportMenu>} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('testsResults') && this.testsResults.length > 0) {
      const sortedResults = this._sortTestResults(this.testsResults);

      this._testsResultsIds = sortedResults.map((result) => result.id);
      this._menuEntries = this._getMenuEntries(sortedResults);
    }

    if (changedProperties.has('activeTestResultId') || changedProperties.has('testsResults')) {
      const activeTestResult = this.testsResults.find((testResult) => this.activeTestResultId === testResult.id);
      if (activeTestResult != null) {
        this._activeMenuEntry = {
          component: activeTestResult.componentTagName,
          story: kebabCase(activeTestResult.storyName),
        };
      }

      this._setPreviousAndNextTestResultIds();
    }
  }

  /** @param {PropertyValues<CcVisualTestsReportMenu>} changedProperties */
  updated(changedProperties) {
    if (changedProperties.has('activeTestResultId') && this.activeTestResultId != null) {
      /**
       * Make sure the active link is visible
       * Useful in two cases:
       * - when the active link set from outside (router) is not one of the first links that are immediately visible,
       * - when using the prev / next links.
       */
      const activeLinkElement = this.shadowRoot.querySelector('.viewport-browser-list__item__link--active');
      if (activeLinkElement != null && !isVisibleInContainer(activeLinkElement, this._componentListRef.value)) {
        activeLinkElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  _setPreviousAndNextTestResultIds() {
    const activeTestResultIndex = this._testsResultsIds.indexOf(this.activeTestResultId);
    const nbOfTestResults = this._testsResultsIds.length;
    const previousTestResultIndex = (activeTestResultIndex - 1 + nbOfTestResults) % nbOfTestResults;
    const nextTestResultIndex = (activeTestResultIndex + 1) % nbOfTestResults;

    this._previousTestResultId = this._testsResultsIds[previousTestResultIndex];
    this._nextTestResultId = this._testsResultsIds[nextTestResultIndex];
  }

  render() {
    if (this.testsResults.length === 0) {
      return '';
    }

    return html`
      <ul class="quick-nav">
        <li>
          <a href="/test-result/${this._previousTestResultId}">
            <cc-icon .icon="${iconArrowLeft}"></cc-icon>
            <span>Previous</span>
          </a>
        </li>
        <li>
          <a href="/test-result/${this._nextTestResultId}">
            <span>Next</span>
            <cc-icon .icon="${iconArrowRight}"></cc-icon>
          </a>
        </li>
      </ul>
      <ul class="component-list" ${ref(this._componentListRef)}>
        ${this._menuEntries.map(({ componentTagName, stories }) => {
          const isMenuItemOpen = this._activeMenuEntry.component === componentTagName;
          return html`
            <li class="component-list__item">
              <button
                class="component-list__item__btn btn"
                @click="${() => this._toggleComponent(componentTagName)}"
                aria-expanded="${isMenuItemOpen}"
                aria-controls="stories-${componentTagName}"
              >
                <cc-icon .icon="${iconArrowDown}"></cc-icon>
                <span>${componentTagName}</span>
              </button>
              <ul id="stories-${componentTagName}" class="story-list" ?hidden="${!isMenuItemOpen}">
                ${stories.map(({ storyName, viewports }) =>
                  this._renderStoryLevelEntries({ componentTagName, storyName, viewports }),
                )}
              </ul>
            </li>
          `;
        })}
      </ul>
    `;
  }

  /**
   * @param {object} _
   * @param {string} _.componentTagName
   * @param {string} _.storyName
   * @param {Pick<VisualTestResult, 'viewportType' | 'browserName' | 'id'>[]} _.viewports
   *  */
  _renderStoryLevelEntries({ componentTagName, storyName, viewports }) {
    const kebabCasedStoryName = kebabCase(storyName);
    const isMenuItemOpen = this._activeMenuEntry.story === kebabCasedStoryName;
    const storyNameToDisplay = enhanceStoryName(camelCaseToSpacedCapitalized(storyName));

    return html`
      <li class="story-list__item">
        <button
          class="story-list__item__btn btn"
          @click="${() => this._toggleStory(kebabCasedStoryName)}"
          aria-expanded="${isMenuItemOpen}"
          aria-controls="${componentTagName}-${kebabCasedStoryName}"
        >
          <cc-icon .icon="${iconArrowDown}"></cc-icon>
          <span>${storyNameToDisplay}</span>
        </button>
        <ul id="${componentTagName}-${kebabCasedStoryName}" class="viewport-browser-list" ?hidden="${!isMenuItemOpen}">
          ${viewports.map(
            ({ viewportType, browserName, id }) => html`
              <li class="viewport-browser-list__item">
                <a
                  class="viewport-browser-list__item__link ${classMap({
                    'viewport-browser-list__item__link--active': this.activeTestResultId === id,
                  })}"
                  href="/test-result/${id}"
                >
                  <span>${viewportType} - ${browserName}</span>
                  <cc-icon .icon="${iconArrowRight}"></cc-icon>
                </a>
              </li>
            `,
          )}
        </ul>
      </li>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          grid-template-rows: auto 1fr;
        }

        cc-icon {
          flex: 0 0 auto;
        }

        ul,
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .quick-nav {
          display: flex;
          gap: 1em;
          padding: 1em;
        }

        .quick-nav li {
          flex: 1 1 0;
        }

        .quick-nav a {
          align-items: center;
          background-color: var(--cc-color-bg-primary, #3569aa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-inverted, #fff);
          display: flex;
          flex: 1 1 0;
          gap: 0.5em;
          justify-content: space-between;
          padding: 0.5em 1em;
          text-decoration: none;
        }

        .btn {
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          font: inherit;
          gap: 0.5em;
          padding: 0.2em 0.5em;
          text-align: start;
          width: 100%;
        }

        .btn cc-icon {
          transition: transform 0.3s;
        }

        .btn[aria-expanded='true'] cc-icon {
          transform: rotate(180deg);
        }

        .btn:hover cc-icon {
          transform: rotate(90deg);
        }

        .viewport-browser-list__item__link:focus-visible,
        .btn:focus-visible,
        .quick-nav a:focus {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #3569aa solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .component-list {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-gutter: stable;
        }

        .component-list__item {
          transition: background-color 0.3s;
        }

        .component-list__item__btn {
          padding: 1em;
        }

        .story-list:not([hidden]) {
          background-color: var(--cc-color-bg-neutral-alt, #e7e7e7);
          display: flex;
          flex-direction: column;
          padding: 0.5em 1em;
          transition: background-color 0.3s;
        }

        .story-list__item {
          padding: 0.5em;
        }

        .story-list__item:not(:last-of-type) {
          border-bottom: solid 1px var(--cc-color-border-neutral, #bfbfbf);
        }

        .viewport-browser-list {
          padding: 0.5em 0;
        }

        .viewport-browser-list__item__link {
          align-items: center;
          color: var(--cc-color-text-default, #262626);
          display: flex;
          justify-content: space-between;
          margin-left: 1.5em;
          padding: 0.5em;
          text-decoration: none;
          text-transform: capitalize;
        }

        .viewport-browser-list__item__link:hover {
          text-decoration: underline;
        }

        .viewport-browser-list__item__link--active {
          background-color: var(--cc-color-bg-primary, #3569aa);
          border-radius: var(--cc-border-radius-small, 0.15em);
          color: var(--cc-color-text-inverted, #fff);
        }
      `,
    ];
  }
}

customElements.define('cc-visual-tests-report-menu', CcVisualTestsReportMenu);
