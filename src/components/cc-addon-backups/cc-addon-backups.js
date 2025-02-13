import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { iconRemixHistoryLine as iconBackup, iconRemixCloseLine as iconClose } from '../../assets/cc-remix.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/** @type {Backup} */
const SKELETON_BACKUP = {
  createdAt: new Date().toString(),
  expiresAt: new Date().toString(),
  url: '',
  deleteCommand: 'skeleton',
};
const SKELETON_BACKUPS = {
  /** @type {'skeleton'} */
  providerId: 'skeleton',
  backups: [SKELETON_BACKUP, SKELETON_BACKUP, SKELETON_BACKUP, SKELETON_BACKUP, SKELETON_BACKUP],
};

/**
 * @typedef {import('./cc-addon-backups.types.js').Backup} Backup
 * @typedef {import('./cc-addon-backups.types.js').OverlayType} OverlayType
 * @typedef {import('./cc-addon-backups.types.js').AddonBackupsState} AddonBackupsState
 * @typedef {import('./cc-addon-backups.types.js').AddonBackupsStateLoaded} AddonBackupsStateLoaded
 * @typedef {import('./cc-addon-backups.types.js').AddonBackupsStateLoading} AddonBackupsStateLoading
 * @typedef {import('./cc-addon-backups.types.js').ProviderId} ProviderId
 * @typedef {import('../cc-button/cc-button.js').CcButton} CcButton
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcButton>} CcButtonClickEvent
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A components to display backups available for an add-on.
 *
 * ## Details
 *
 * * If the retention is not standard (customized by the user), the `expiresAt` backup property should be nullish
 *
 * @cssdisplay block
 */
export class CcAddonBackups extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _overlayType: { type: String, state: true },
      _selectedBackup: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {AddonBackupsState} Sets the state of the component. */
    this.state = {
      type: 'loading',
    };

    /** @type {CcButton|null} */
    this._overlayTriggeringButton = null;

    /** @type {OverlayType|null} */
    this._overlayType = null;

    /** @type {Backup|null} */
    this._selectedBackup = null;
  }

  /**
   * @param {ProviderId} providerId
   * @returns {boolean}
   * @private
   */
  _displaySectionWithService(providerId) {
    switch (providerId) {
      case 'es-addon':
        return true;
      case 'es-addon-old':
        return false;
      default:
        return false;
    }
  }

  /**
   * @param {ProviderId|'skeleton'} providerId
   * @returns {string}
   * @private
   */
  _getBackupLink(providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.link.es-addon');
      case 'es-addon-old':
        return i18n('cc-addon-backups.link.es-addon-old');
      case 'postgresql-addon':
        return i18n('cc-addon-backups.link.postgresql-addon');
      case 'mysql-addon':
        return i18n('cc-addon-backups.link.mysql-addon');
      case 'mongodb-addon':
        return i18n('cc-addon-backups.link.mongodb-addon');
      case 'redis-addon':
        return i18n('cc-addon-backups.link.redis-addon');
      case 'jenkins':
        return i18n('cc-addon-backups.link.jenkins');
      case 'skeleton':
        return fakeString(18);
    }
  }

  /**
   *
   * @param {Backup} backup
   * @returns {Node}
   * @private
   */
  _getBackupText({ createdAt, expiresAt }) {
    return expiresAt != null
      ? i18n('cc-addon-backups.text', { createdAt, expiresAt })
      : i18n('cc-addon-backups.text.user-defined-retention', { createdAt });
  }

  /**
   * @param {ProviderId} providerId
   * @returns {string|Node}
   * @private
   */
  _getDescription(providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.description.es-addon');
      case 'es-addon-old':
        return i18n('cc-addon-backups.description.es-addon-old');
      case 'postgresql-addon':
        return i18n('cc-addon-backups.description.postgresql-addon');
      case 'mysql-addon':
        return i18n('cc-addon-backups.description.mysql-addon');
      case 'mongodb-addon':
        return i18n('cc-addon-backups.description.mongodb-addon');
      case 'redis-addon':
        return i18n('cc-addon-backups.description.redis-addon');
      case 'jenkins':
        return i18n('cc-addon-backups.description.jenkins');
    }
  }

  /**
   * @param {ProviderId} providerId
   * @returns {string|Node}
   * @private
   */
  _getManualDeleteDescription(providerId) {
    switch (providerId) {
      case 'es-addon':
      case 'es-addon-old':
        return i18n('cc-addon-backups.delete.manual.description.es-addon');
      default:
        return fakeString(70);
    }
  }

  /**
   * @param {ProviderId} providerId
   * @returns {string|Node}
   * @private
   */
  _getManualRestoreDescription(providerId) {
    switch (providerId) {
      case 'es-addon':
      case 'es-addon-old':
        return i18n('cc-addon-backups.restore.manual.description.es-addon');
      case 'postgresql-addon':
        return i18n('cc-addon-backups.restore.manual.description.postgresql-addon');
      case 'mysql-addon':
        return i18n('cc-addon-backups.restore.manual.description.mysql-addon');
      case 'mongodb-addon':
        return i18n('cc-addon-backups.restore.manual.description.mongodb-addon');
      case 'redis-addon':
        return i18n('cc-addon-backups.restore.manual.description.redis-addon');
      case 'jenkins':
        return i18n('cc-addon-backups.restore.manual.description.jenkins');
      default:
        return fakeString(70);
    }
  }

  /**
   * @param {ProviderId} providerId
   * @param {string} href
   * @returns {string|Node}
   * @private
   */
  _getRestoreWithServiceDescription(providerId, href) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.description.es-addon', { href });
      default:
        return fakeString(80);
    }
  }

  /**
   * @param {ProviderId} providerId
   * @returns {string}
   * @private
   */
  _getRestoreWithServiceTitle(providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.title.es-addon');
      default:
        return fakeString(20);
    }
  }

  /** @private */
  _onCloseOverlay() {
    this._overlayType = null;
    this._selectedBackup = null;
    this.updateComplete.then(() => {
      this._overlayTriggeringButton.focus();
      this._overlayTriggeringButton = null;
    });
  }

  /**
   * @param {OverlayType} type
   * @param {Backup} backup
   * @private
   */
  _onOpenOverlay(type, backup) {
    /** @param {CcButtonClickEvent} e */
    return (e) => {
      this._overlayType = type;
      this._selectedBackup = backup;
      // Remember the target so we can focus back on it after the overlay is closed
      this._overlayTriggeringButton = e.target;
      this.updateComplete.then(() => {
        /** @type {CcButton} */
        const closeButton = this.shadowRoot.querySelector('.overlay cc-button');
        closeButton.focus();
      });
    };
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-backups.title')}</div>
        ${this.state.type === 'error'
          ? html`
              <cc-notice
                slot="content"
                intent="warning"
                message="${i18n('cc-addon-backups.loading-error')}"
              ></cc-notice>
            `
          : ''}
        ${this.state.type === 'loading' ? this._renderLoading(this.state) : ''}
        ${this.state.type === 'loaded' ? this._renderLoaded(this.state) : ''}
      </cc-block>
    `;
  }

  /**
   * @param {AddonBackupsStateLoading} state
   * @returns {TemplateResult}
   * @private
   */
  _renderLoading(state) {
    return html`
      <div slot="content">
        <span class="skeleton"> ${fakeString(150)} </span>
      </div>
      ${this._renderBackups(state, false)}
    `;
  }

  /**
   * @param {AddonBackupsStateLoaded} state
   * @returns {TemplateResult}
   * @private
   */
  _renderLoaded(state) {
    const hasData = state.backups.length > 0;
    const isBlurred = this._overlayType === 'restore' || this._overlayType === 'delete';

    return html`
      <div slot="content" class=${classMap({ blurred: isBlurred })}>${this._getDescription(state.providerId)}</div>

      ${!hasData ? html` <div slot="content" class="empty-msg">${i18n('cc-addon-backups.empty')}</div> ` : ''}
      ${hasData ? this._renderBackups(state, isBlurred) : ''}
      ${this._overlayType === 'restore' ? this._renderRestoreOverlay(state.providerId, state.passwordForCommand) : ''}
      ${this._overlayType === 'delete' ? this._renderDeleteOverlay(state.providerId, state.passwordForCommand) : ''}
    `;
  }

  /**
   * @param {AddonBackupsStateLoaded | AddonBackupsStateLoading} state
   * @param {boolean} isBlurred
   * @private
   */
  _renderBackups(state, isBlurred) {
    const skeleton = state.type === 'loading';
    const areBtnsDisabled = state.type === 'loading' || this._overlayType != null;

    const data = state.type === 'loaded' ? state : SKELETON_BACKUPS;
    return html`
      <div slot="content" class="backup-list ${classMap({ blurred: isBlurred })}">
        ${data.backups.map(
          (backup) => html`
            <div class="backup">
              <span class="backup-icon"><cc-icon .icon=${iconBackup} size="lg"></cc-icon></span>
              <span class="backup-text">
                <span class="backup-text-details ${classMap({ skeleton })}">${this._getBackupText(backup)}</span>
                <br />
                ${ccLink(this._overlayType == null ? backup.url : null, this._getBackupLink(data.providerId), skeleton)}
                <cc-button
                  link
                  ?disabled=${areBtnsDisabled}
                  ?skeleton=${skeleton}
                  @cc-button:click=${this._onOpenOverlay('restore', backup)}
                >
                  ${i18n('cc-addon-backups.restore.btn')}
                </cc-button>
                ${backup.deleteCommand != null
                  ? html`
                      <cc-button
                        link
                        ?disabled=${areBtnsDisabled}
                        ?skeleton=${skeleton}
                        @cc-button:click=${this._onOpenOverlay('delete', backup)}
                      >
                        ${i18n('cc-addon-backups.delete.btn')}
                      </cc-button>
                    `
                  : ''}
              </span>
            </div>
          `,
        )}
      </div>
    `;
  }

  /**
   * @param {ProviderId} providerId
   * @param {string} passwordForCommand
   * @returns {TemplateResult}
   * @private
   */
  _renderRestoreOverlay(providerId, passwordForCommand) {
    return html`
      <!-- The restore and delete overlays are quite similar but's it's easier to read with a big if and some copy/paste than 8 ifs -->
      <cc-block slot="content" class="overlay">
        <div slot="header-title">${i18n('cc-addon-backups.restore', this._selectedBackup)}</div>
        <div slot="header-right">
          <cc-button
            class="overlay-close-btn"
            .icon=${iconClose}
            hide-text
            outlined
            primary
            @cc-button:click=${this._onCloseOverlay}
            >${i18n('cc-addon-backups.close-btn')}</cc-button
          >
        </div>

        ${this._displaySectionWithService(providerId)
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${this._getRestoreWithServiceTitle(providerId)}</div>
                <div>${this._getRestoreWithServiceDescription(providerId, this._selectedBackup.url)}</div>
              </cc-block-section>
            `
          : ''}

        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-addon-backups.restore.manual.title')}</div>
          <div>${this._getManualRestoreDescription(providerId)}</div>
          ${this._selectedBackup.restoreCommand != null
            ? html`
                <cc-input-text readonly clipboard value="${this._selectedBackup.restoreCommand}"></cc-input-text>
                <div>${i18n('cc-addon-backups.command-password')}</div>
                <cc-input-text readonly clipboard secret value=${passwordForCommand}></cc-input-text>
              `
            : ''}
        </cc-block-section>
      </cc-block>
    `;
  }

  /**
   * @param {ProviderId} providerId
   * @param {string} passwordForCommand
   * @returns {TemplateResult}
   * @private
   */
  _renderDeleteOverlay(providerId, passwordForCommand) {
    return html`
      <cc-block slot="content" class="overlay">
        <div slot="header-title">${i18n('cc-addon-backups.delete', this._selectedBackup)}</div>
        <div slot="header-right">
          <cc-button
            class="overlay-close-btn"
            .icon=${iconClose}
            hide-text
            outlined
            primary
            @cc-button:click=${this._onCloseOverlay}
            >${i18n('cc-addon-backups.close-btn')}</cc-button
          >
        </div>

        ${this._displaySectionWithService(providerId)
          ? html`
              <cc-block-section slot="content-body">
                <div slot="title">${i18n('cc-addon-backups.delete.with-service.title.es-addon')}</div>
                <div>
                  ${i18n('cc-addon-backups.delete.with-service.description.es-addon', {
                    href: this._selectedBackup.url,
                  })}
                </div>
              </cc-block-section>
            `
          : ''}

        <cc-block-section slot="content-body">
          <div slot="title">${i18n('cc-addon-backups.delete.manual.title')}</div>
          <div>${this._getManualDeleteDescription(providerId)}</div>
          <cc-input-text readonly clipboard value="${this._selectedBackup.deleteCommand}"></cc-input-text>
          <div>${i18n('cc-addon-backups.command-password')}</div>
          <cc-input-text readonly clipboard secret value=${passwordForCommand}></cc-input-text>
        </cc-block-section>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
          line-height: 1.5;
        }

        .backup-list {
          display: grid;
          grid-gap: 1.5em;
        }

        .backup {
          display: flex;
          line-height: 1.5em;
        }

        .backup-icon,
        .backup-text {
          margin-right: 0.5em;
        }

        .backup-icon {
          --cc-icon-color: #012a51;
        }

        .backup-text {
          color: var(--cc-color-text-weak);
        }

        .backup-text-details:not(.skeleton) strong {
          color: var(--cc-color-text-strongest, #000);
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }

        .overlay {
          box-shadow: 0 0 1em rgb(0 0 0 / 40%);
          left: 50%;
          max-height: 80vh;
          max-width: 50em;
          overflow: auto;
          padding-inline: 0;
          position: fixed;
          transform: translateX(-50%);
          width: 90%;
          /* temporary fix until we rely on the dialog element and the top layer */
          z-index: 9999;
        }

        .overlay-close-btn {
          --cc-icon-size: 1.4em;
        }

        .blurred {
          filter: blur(5px);
        }

        .cc-link,
        cc-button[link] {
          margin-right: 0.5em;
          vertical-align: baseline;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-backups', CcAddonBackups);
