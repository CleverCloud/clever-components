import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixArrowRightSLine as iconChevron } from '../../assets/cc-remix.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';
import '../cc-notice/cc-notice.js';

/**
 * @import { HomepageTemplateProjectState, TemplateProject } from './cc-homepage-template-project.types.js';
 */

/** @type {TemplateProject[]} */
const SKELETON_PROJECTS = new Array(5).fill({ name: fakeString(10), description: fakeString(40), href: '' });

/**
 * A component displaying a list of pre-built template projects.
 *
 * @cssdisplay block
 */
export class CcHomepageTemplateProject extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {HomepageTemplateProjectState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  render() {
    const skeleton = this.state.type === 'loading';
    const projects = this.state.type === 'loaded' ? this.state.projects : SKELETON_PROJECTS;

    return html`
      <div class="wrapper">
        <div class="title">${i18n('cc-homepage-template-project.title')}</div>
        ${this.state.type === 'error'
          ? html` <cc-notice intent="warning" message="${i18n('cc-homepage-template-project.error')}"></cc-notice> `
          : ''}
        ${this.state.type === 'loaded'
          ? html`
              <ul class="project-list ${classMap({ skeleton })}">
                ${projects.map((project) => this._renderProjectRow(project))}
              </ul>
            `
          : ''}
      </div>
    `;
  }

  /**
   * @param {TemplateProject} project
   * @returns {import('lit').TemplateResult}
   */
  _renderProjectRow(project) {
    return html`
      <li>
        <a href="${project.href}" class="project-row">
          <div class="project-info">
            <span class="project-name">${project.name}</span>
            <span class="project-description">${project.description}</span>
          </div>
          <cc-icon class="chevron" .icon=${iconChevron} size="md"></cc-icon>
        </a>
      </li>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          border: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          gap: 1.25em;
          padding: 2em 1.25em;
        }

        .title {
          color: var(--cc-color-text-primary-strongest, #000);
          font-size: 1.2em;
          font-weight: bold;
          margin: 0 0.75em;
        }

        .project-list {
          display: flex;
          flex-direction: column;
          gap: 0.3em;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .project-row {
          align-items: center;
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          gap: 1em;
          padding: 0.6em 0.8em;
          text-decoration: none;
        }

        .project-row:hover {
          background: linear-gradient(90deg, rgb(56 49 241 / 20%) 0%, rgb(135 46 237 / 20%) 100%);
        }

        .project-row:focus-visible {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .project-list.skeleton {
          cursor: progress;
        }

        .project-list.skeleton .project-row {
          pointer-events: none;
        }

        .project-list.skeleton .project-name,
        .project-list.skeleton .project-description {
          background-color: #bbb;
          color: transparent;
        }

        .project-info {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 0.15em;
          min-width: 0;
        }

        .project-name {
          color: #1e2939;
          font-weight: bold;
        }

        .project-description {
          color: var(--cc-color-text-weak, #555);
          font-size: 0.85em;
        }

        .chevron {
          --cc-icon-color: var(--cc-color-text-weak, #555);
        }

        .project-row:hover .chevron {
          --cc-icon-color: var(--cc-color-text-primary-strongest, #000);
        }
      `,
    ];
  }
}

window.customElements.define('cc-homepage-template-project', CcHomepageTemplateProject);
