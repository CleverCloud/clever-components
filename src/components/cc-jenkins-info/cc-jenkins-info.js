import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const JENKINS_LOGO_URL = 'https://assets.clever-cloud.com/logos/jenkins.svg';
const JENKINS_DOCUMENTATION = 'https://www.clever-cloud.com/doc/deploy/addon/jenkins/';

/**
 * @typedef {import('./cc-jenkins-info.types.js').Versions} Versions
 */

/**
 * A component to display various informations (Documentation, access, updates, ...) for a Jenkins service.
 *
 * @cssdisplay block
 */
export class CcJenkinsInfo extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      jenkinsLink: { type: String, attribute: 'jenkins-link' },
      jenkinsManageLink: { type: String, attribute: 'jenkins-manage-link' },
      versions: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Display an error message. */
    this.error = false;

    /** @type {string|null} Provides the HTTP link of the Jenkins service. */
    this.jenkinsLink = null;

    /** @type {string|null} Provides the HTTP link of the Jenkins management interface. */
    this.jenkinsManageLink = null;

    /** @type {Versions|null} Provides the current and available version of the Jenkins add-on. */
    this.versions = null;
  }

  render () {
    const versions = this.versions ?? {};
    const hasNewVersion = versions.current !== versions.available;

    if (this.error) {
      return html`<cc-notice intent="warning" message="${i18n('cc-jenkins-info.error')}"></cc-notice>`;
    }

    return html`

      <cc-block ribbon=${i18n('cc-jenkins-info.info')} no-head>
          <div class="info-text">${i18n('cc-jenkins-info.text')}</div>

          <cc-block-section>
            <div slot="title">${i18n('cc-jenkins-info.open-jenkins.title')}</div>
            <div slot="info">${i18n('cc-jenkins-info.open-jenkins.text')}</div>
            <div class="one-line-form">
              ${ccLink(this.jenkinsLink, html`
                <cc-img src="${JENKINS_LOGO_URL}"></cc-img><span class="${classMap({ skeleton: (this.jenkinsLink == null) })}">${i18n('cc-jenkins-info.open-jenkins.link')}</span>
              `)}
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-jenkins-info.documentation.title')}</div>
            <div slot="info">${i18n('cc-jenkins-info.documentation.text')}</div>
            <div class="one-line-form">
              ${ccLink(JENKINS_DOCUMENTATION, html`
                <cc-icon size="lg" .icon=${iconInfo}></cc-icon><span>${i18n('cc-jenkins-info.documentation.link')}</span>
              `)}
            </div>
          </cc-block-section>

          <cc-block-section>
            <div slot="title">${i18n('cc-jenkins-info.update.title')}</div>
            <div slot="info">${i18n('cc-jenkins-info.update.text')}</div>
            <div class="one-line-form">
              ${ccLink(this.jenkinsManageLink, html`
                <cc-icon size="lg" .icon=${iconInfo}></cc-icon>
                <span class="${classMap({ skeleton: (this.versions == null) })}">
                  ${hasNewVersion ? i18n('cc-jenkins-info.update.new-version', { version: versions.available }) : i18n('cc-jenkins-info.update.up-to-date')}
                </span>
              `)}
            </div>
          </cc-block-section>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      linkStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1em;

          display: block;
        }

        .cc-link {
          display: flex;
          align-items: center;
        }

        cc-img {
          width: 1.5em;
          height: 1.5em;
          flex: 0 0 auto;
          margin-right: 0.5em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        cc-icon {
          flex: 0 0 auto;
          margin-right: 0.5em;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-jenkins-info', CcJenkinsInfo);
