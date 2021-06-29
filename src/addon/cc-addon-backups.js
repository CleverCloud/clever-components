import '../atoms/cc-button.js';
import '../atoms/cc-input-text.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { fakeString } from '../lib/fake-strings.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const backupSvg = new URL('../assets/backup.svg', import.meta.url).href;
const closeSvg = new URL('../assets/close.svg', import.meta.url).href;

const SKELETON_BACKUPS = {
  providerId: '',
  passwordForCommand: '',
  list: new Array(5).fill({ createdAt: new Date(), expiresAt: new Date() }),
};

/**
 * A components to display backups available for an add-on
 *
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-addon-backups.js)
 *
 * ## Details
 *
 * * When `backups` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface BackupDetails {
 *   providerId: string,
 *   passwordForCommand: string,
 *   list: Backup[],
 * }
 * ```
 *
 * ```js
 * interface Backup {
 *   createdAt: Date,
 *   expiresAt: Date
 *   url: string,
 *   restoreCommand: string,
 *   deleteCommand: string,
 * }
 * ```
 *
 * ## Images
 *
 * | | |
 * |-------|------|
 * | <img src="assets/backup.svg" style="height: 1.5rem; vertical-align: middle"> | <code>backup.svg</code>
 * | <img src="assets/close.svg" style="height: 1.5rem; vertical-align: middle"> | <code>close.svg</code>
 *
 * @cssdisplay grid
 *
 * @prop {BackupDetails} backups - Sets the different details about an add-on and its backup.
 * @prop {Boolean} error - Displays an error message.
 */
export class CcAddonBackups extends LitElement {

  static get properties () {
    return {
      // TODO: Maybe we could split backups.providerId and backups.list
      backups: { type: Object },
      error: { type: Boolean },
      _overlay: { type: String, attribute: false },
      _selectedBackup: { type: Object, attribute: false },
    };
  }

  constructor () {
    super();
    this.error = false;
    this._overlay = null;
    this._selectedBackup = null;
  }

  _getDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.description.es-addon');
      case 'es-addon-old':
        return i18n('cc-addon-backups.description.es-addon-old');
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
    const { providerId, list: backups, passwordForCommand } = skeleton ? SKELETON_BACKUPS : this.backups;
    const hasData = (!this.error && (backups.length > 0));
    const emptyData = (!this.error && (backups.length === 0));

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-addon-backups.title')}</div>
        
        ${hasData ? html`
          <div><span class=${classMap({ skeleton })}>${this._getDescription(providerId)}</span></div>
          
          <div class="backup-list">
            ${backups.map((backup) => html`
              <div class="backup">
                <span class="backup-icon"><img src=${backupSvg} alt=""></span>
                <span class="backup-text">
                  <span class="backup-text-details ${classMap({ skeleton })}">${this._getBackupText(backup)}</span>
                  <br>
                  ${ccLink(this._overlay == null ? backup.url : null, this._getBackupLink(providerId), skeleton)}
                  <cc-button link ?disabled=${this._overlay != null} ?skeleton=${skeleton} @cc-button:click=${(e) => this._onOpenOverlay(e, 'restore', backup)}>${i18n('cc-addon-backups.restore.btn')}</cc-button>
                  <cc-button link ?disabled=${this._overlay != null} ?skeleton=${skeleton} @cc-button:click=${(e) => this._onOpenOverlay(e, 'delete', backup)}>${i18n('cc-addon-backups.delete.btn')}</cc-button>
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
                <cc-input-text readonly clipboard value="${this._selectedBackup.restoreCommand}"></cc-input-text>
                <div>${i18n('cc-addon-backups.command-password')}</div>
                <cc-input-text readonly clipboard secret value=${passwordForCommand}></cc-input-text>
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
          grid-gap: 1rem;
          line-height: 1.5;
        }

        .backup-list {
          display: grid;
          grid-gap: 1.5rem;
        }

        .backup {
          display: flex;
          line-height: 1.5rem;
        }

        .backup-icon,
        .backup-text {
          margin-right: 0.5rem;
        }

        .backup-icon {
          flex: 0 0 auto;
          height: 1.5rem;
          width: 1.5rem;
        }

        .backup-icon img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .backup-text {
          color: #555;
        }

        .backup-text-details:not(.skeleton) strong {
          color: #000;
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }

        .overlay {
          box-shadow: 0 0 1rem #aaa;
          margin: 2rem;
          max-width: 80%;
        }

        .cc-link,
        cc-button[link] {
          margin-right: 0.5rem;
          vertical-align: baseline;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-backups', CcAddonBackups);
