import '../cc-button/cc-button.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';

const backupSvg = new URL('../../assets/backup.svg', import.meta.url).href;
const closeSvg = new URL('../../assets/close.svg', import.meta.url).href;

/** @type {BackupDetails} */
const SKELETON_BACKUPS = {
  providerId: '',
  passwordForCommand: '',
  list: new Array(5).fill({ createdAt: new Date(), expiresAt: new Date() }),
};

/**
 * @typedef {import('./cc-addon-backups.types.js').BackupDetails} BackupDetails
 * @typedef {import('./cc-addon-backups.types.js').Backup} Backup
 * @typedef {import('./cc-addon-backups.types.js').OverlayType} OverlayType
 */

/**
 * A components to display backups available for an add-on.
 *
 * ## Details
 *
 * * When `backups` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * @cssdisplay grid
 */
export class CcAddonBackups extends LitElement {

  static get properties () {
    return {
      backups: { type: Object },
      error: { type: Boolean },
      _overlay: { type: String, attribute: false },
      _selectedBackup: { type: Object, attribute: false },
    };
  }

  constructor () {
    super();

    /** @type {BackupDetails|null} Sets the different details about an add-on and its backup. */
    this.backups = null;

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {OverlayType|null} */
    this._overlay = null;

    /** @type {Element|null} */
    this._overlayTarget = null;

    /** @type {Backup|null} */
    this._selectedBackup = null;
  }

  _getDescription (providerId) {
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
      default:
        return fakeString(150);
    }
  }

  _getBackupText ({ createdAt, expiresAt }) {
    return (expiresAt != null)
      ? i18n('cc-addon-backups.text', { createdAt, expiresAt })
      : i18n('cc-addon-backups.text.user-defined-retention', { createdAt });
  }

  _getBackupLink (providerId) {
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
      default:
        return fakeString(18);
    }
  }

  _displaySectionWithService (providerId) {
    switch (providerId) {
      case 'es-addon':
        return true;
      case 'es-addon-old':
        return false;
      default:
        return false;
    }
  }

  _getRestoreWithServiceTitle (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.title.es-addon');
      default:
        return fakeString(20);
    }
  }

  _getRestoreWithServiceDescription (providerId, href) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.restore.with-service.description.es-addon', { href });
      default:
        return fakeString(80);
    }
  }

  _getManualRestoreDescription (providerId) {
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

  _getDeleteWithServiceTitle (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.delete.with-service.title.es-addon');
      default:
        return fakeString(20);
    }
  }

  _getDeleteWithServiceDescription (providerId, href) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.delete.with-service.description.es-addon', { href });
      default:
        return fakeString(80);
    }
  }

  _getManualDeleteDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
      case 'es-addon-old':
        return i18n('cc-addon-backups.delete.manual.description.es-addon');
      default:
        return fakeString(70);
    }
  }

  // TODO: When we open the overlay in a long list, it may be far from the link we clicked
  // Because we focus in both ways (open & close), part of the modal is visible
  // This could be solved with some offsetTop and positionning magic but it's not easy to do it properly and it's not a very common case.
  // For now, we help the focus with some scroll into view.

  /**
   * @param {OverlayType} type
   * @param {Backup} backup
   */
  _onOpenOverlay (e, type, backup) {
    this._overlay = type;
    this._selectedBackup = backup;
    // Remember the target so we can focus back on it after the overlay is closed
    this._overlayTarget = e.target;
    this.updateComplete.then(() => {
      this.shadowRoot.querySelector('.overlay cc-button').focus();
      this.shadowRoot.querySelector('.overlay').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  _onCloseOverlay () {
    this._overlay = null;
    this._selectedBackup = null;
    this.updateComplete.then(() => {
      this._overlayTarget.focus();
      this._overlayTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this._overlayTarget = null;
    });
  }

  render () {

    const skeleton = (this.backups == null);
    const backupDetails = skeleton ? SKELETON_BACKUPS : this.backups;
    const { providerId, list: backups, passwordForCommand } = backupDetails;
    const hasData = (!this.error && (backups.length > 0));
    const emptyData = (!this.error && (backups.length === 0));

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-addon-backups.title')}</div>

        ${hasData ? html`
          <div><span class=${classMap({ skeleton })}>${this._getDescription(providerId)}</span></div>

          <div class="backup-list">
            ${backupDetails.list.map((backup) => html`
              <div class="backup">
                <span class="backup-icon"><img src=${backupSvg} alt=""></span>
                <span class="backup-text">
                  <span class="backup-text-details ${classMap({ skeleton })}">${this._getBackupText(backup)}</span>
                  <br>
                  ${ccLink(this._overlay == null ? backup.url : null, this._getBackupLink(providerId), skeleton)}
                  <cc-button link ?disabled=${this._overlay != null} ?skeleton=${skeleton} @cc-button:click=${(e) => this._onOpenOverlay(e, 'restore', backup)}>${i18n('cc-addon-backups.restore.btn')}</cc-button>
                  ${backup.deleteCommand != null ? html`
                    <cc-button link ?disabled=${this._overlay != null} ?skeleton=${skeleton} @cc-button:click=${(e) => this._onOpenOverlay(e, 'delete', backup)}>${i18n('cc-addon-backups.delete.btn')}</cc-button>
                  ` : ''}
                </span>
              </div>
            `)}
          </div>
        ` : ''}

        ${emptyData ? html`
          <div class="cc-block_empty-msg">${i18n('cc-addon-backups.empty')}</div>
        ` : ''}

        ${this.error ? html`
          <cc-error>${i18n('cc-addon-backups.loading-error')}</cc-error>
        ` : ''}

        <!-- The restore and delete overlays are quite similar but's it's easier to read with a big if and some copy/paste than 8 ifs -->
        ${this._overlay === 'restore' ? html`
          <div slot="overlay">
            <cc-block class="overlay">
              <div slot="title">${i18n('cc-addon-backups.restore', this._selectedBackup)}</div>
              <cc-button
                slot="button"
                image=${closeSvg}
                hide-text
                outlined
                primary
                @cc-button:click=${this._onCloseOverlay}
              >${i18n('cc-addon-backups.close-btn')}</cc-button>

              ${this._displaySectionWithService(providerId) ? html`
                <cc-block-section>
                  <div slot="title">${this._getRestoreWithServiceTitle(providerId)}</div>
                  <div>${this._getRestoreWithServiceDescription(providerId, this._selectedBackup.url)}</div>
                </cc-block-section>
              ` : ''}

              <cc-block-section>
                <div slot="title">${i18n('cc-addon-backups.restore.manual.title')}</div>
                <div>${this._getManualRestoreDescription(providerId)}</div>
                ${this._selectedBackup.restoreCommand != null ? html`
                  <cc-input-text readonly clipboard value="${this._selectedBackup.restoreCommand}"></cc-input-text>
                  <div>${i18n('cc-addon-backups.command-password')}</div>
                  <cc-input-text readonly clipboard secret value=${passwordForCommand}></cc-input-text>
                ` : ``}
              </cc-block-section>
            </cc-block>
          </div>
        ` : ''}

        ${this._overlay === 'delete' ? html`
          <div slot="overlay">
            <cc-block class="overlay">
              <div slot="title">${i18n('cc-addon-backups.delete', this._selectedBackup)}</div>
              <cc-button
                slot="button"
                image=${closeSvg}
                hide-text
                outlined
                primary
                @cc-button:click=${this._onCloseOverlay}
              >${i18n('cc-addon-backups.close-btn')}</cc-button>

              ${this._displaySectionWithService(providerId) ? html`
                <cc-block-section>
                  <div slot="title">${this._getDeleteWithServiceTitle(providerId)}</div>
                  <div>${this._getDeleteWithServiceDescription(providerId, this._selectedBackup.url)}</div>
                </cc-block-section>
              ` : ''}

              <cc-block-section>
                <div slot="title">${i18n('cc-addon-backups.delete.manual.title')}</div>
                <div>${this._getManualDeleteDescription(providerId)}</div>
                <cc-input-text readonly clipboard value="${this._selectedBackup.deleteCommand}"></cc-input-text>
                <div>${i18n('cc-addon-backups.command-password')}</div>
                <cc-input-text readonly clipboard secret value=${passwordForCommand}></cc-input-text>
              </cc-block-section>
            </cc-block>
          </div>
        ` : ''}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: grid;
          grid-gap: 1em;
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
          flex: 0 0 auto;
          height: 1.5em;
          width: 1.5em;
        }

        .backup-icon img {
          display: block;
          height: 100%;
          width: 100%;
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
          box-shadow: 0 0 1em rgba(0, 0, 0, 0.4);
          margin: 2em;
          max-width: 80%;
        }

        .cc-link,
        cc-button[link] {
          margin-right: 0.5em;
          vertical-align: baseline;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace, monospace);
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-backups', CcAddonBackups);
