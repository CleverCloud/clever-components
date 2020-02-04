import '../atoms/cc-input-text.js';
import '../molecules/cc-block-section.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import backupSvg from './backup.svg';
import { ccLink, linkStyles } from '../templates/cc-link.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A components to display backups available for an add-on
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
 *   restoreCommand: string,
 *   esAddonBackupRepositoryUrl?: string,
 *   list: Backup[],
 * }
 * ```
 *
 * ```js
 * interface Backup {
 *   createdAt: Date,
 *   expiresAt: Date
 *   url: string,
 * }
 * ```
 *
 * @prop {BackupDetails} backups - Sets the different details about an add-on and its backup.
 * @prop {Boolean} error - Displays an error message.
 */

export class CcAddonBackups extends LitElement {

  static get properties () {
    return {
      backups: { type: Object, attribute: false },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonBackups () {
    const backup = { createdAt: new Date(), expiresAt: new Date() };
    return {
      addon: '',
      list: new Array(5).fill(backup),
      restoreCommand: '',
    };
  }

  _getDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.description.es-addon');
      default:
        return new Array(140).fill('?').join('');
    }
  }

  _getBackupText (createdAt, expiresAt) {
    return (expiresAt != null)
      ? i18n('cc-addon-backups.text', { createdAt, expiresAt })
      : i18n('cc-addon-backups.text.user-defined-retention', { createdAt });
  }

  _getBackupLink (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.link.es-addon');
      default:
        return new Array(16).fill('?').join('');
    }
  }

  _getAutomaticRestoreDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.automatic-restore.es-addon', {
          href: (this.backups != null) ? this.backups.esAddonBackupRepositoryUrl : '',
        });
      default:
        return new Array(110).fill('?').join('');
    }
  }

  _getManualRestoreDescription (providerId) {
    switch (providerId) {
      case 'es-addon':
        return i18n('cc-addon-backups.manual-restore.es-addon');
      default:
        return new Array(90).fill('?').join('');
    }
  }

  render () {

    const skeleton = (this.backups == null);
    const { providerId, list: backups, restoreCommand } = skeleton ? CcAddonBackups.skeletonBackups : this.backups;
    const hasData = (!this.error && (backups.length > 0));
    const emptyData = (!this.error && (backups.length === 0));

    return html`

      <cc-block>
        <div slot="title">${i18n('cc-addon-backups.title')}</div>
        
        ${hasData ? html`
          <div><span class=${classMap({ skeleton })}>${this._getDescription(providerId)}</span></div>
          
          ${backups.map(({ createdAt, url, expiresAt }) => html`
            <div class="backup">
              <span class="backup-icon"><img src=${backupSvg} alt=""></span>
              <span class="backup-text">
                <span class="backup-text-details ${classMap({ skeleton })}">${this._getBackupText(createdAt, expiresAt)}</span>
                ${ccLink(url, this._getBackupLink(providerId), skeleton)}
              </span>
            </div>
          `)}
        ` : ''}
        
        ${emptyData ? html`
          <div class="cc-block_empty-msg">${i18n('cc-addon-backups.empty')}</div>
        ` : ''}
        
        ${this.error ? html`
          <cc-error>${i18n('cc-addon-backups.loading-error')}</cc-error>
        ` : ''}
      </cc-block>
      
      ${!this.error ? html`
        <cc-block state="close">
          <div slot="title">${i18n('cc-addon-backups.restore')}</div>
          
          <cc-block-section>
            <div slot="title">${i18n('cc-addon-backups.automatic-restore')}</div>
            <div><span class=${classMap({ skeleton })}>${this._getAutomaticRestoreDescription(providerId)}</span></div>
          </cc-block-section>
          
          <cc-block-section>
            <div slot="title">${i18n('cc-addon-backups.manual-restore')}</div>
            <div><span class=${classMap({ skeleton })}>${this._getManualRestoreDescription(providerId)}</span></div>
            <cc-input-text readonly clipboard multi ?skeleton=${skeleton} value="${ifDefined(restoreCommand)}"></cc-input-text>
          </cc-block-section>
        </cc-block>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: grid;
          grid-gap: 1rem;
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

        cc-input-text {
          margin: 0;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-backups', CcAddonBackups);
