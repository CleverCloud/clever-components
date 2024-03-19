import { html, LitElement, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixCheckLine as iconValid,
  iconRemixErrorWarningLine as iconError,
} from '../../assets/cc-remix.icons.js';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';

/**
 * @typedef {import('./cc-dns-troubleshoot.types.js').DnsInfo} DnsInfo
 */

/**
 * toto
 *
 * @cssdisplay block
 */
export class CcDnsTroubleShoot extends LitElement {

  static get properties () {
    return {
      domain: { type: String },
      expectedDnsInfo: { type: Object, attribute: 'expected-dns-info' },
      actualDnsInfo: { type: Object, attribute: 'expected-dns-info' },
    };
  }

  constructor () {
    super();

    /** @type {string|null} ... */
    this.domain = null;

    /** @type {DnsInfo} ... */
    this.expectedDnsInfo = null;

    /** @type {DnsInfo} ... */
    this.actualDnsInfo = null;
  }

  _getCnameDiag () {
    /**
     * Cases:
     * - NO CNAME & NO A RECORDS
     * - NO CNAME BUT AT LEAST 1 A RECORD MATCHING
     * - NO CNAME BUT ALL A RECORDS MATCHING
     * - CNAME OK BUT AT LEAST 1 A RECORD NOT MATCHING
     * - NO CNAME & 1 A RECORD MISSING
     *
     * SPECIAL CASES: APEX DOMAIN => A RECORDS or redir, should we check for redirs? 🤔
     *
     */
    if (this.actualDnsInfo.cname != null && (this.actualDnsInfo.cname !== this.expectedDnsInfo.cname)) {
      return html`
        <p>Incorrect <code>CNAME</code> Record.</p>
        <p>Please set the <code>CNAME</code> to: <code>domain.par.clever-cloud.com.</code></p>
      `;
    }
    else {
      return html`The CNAME record is set properly`;
    }
  }

  _getARecordDiag () {
    const missingARecords = this.expectedDnsInfo.aRecords.filter((expectedARecord) => {
      const correspondingActualARecord = this.actualDnsInfo.aRecords.find((actualARecord) => expectedARecord === actualARecord);
      return correspondingActualARecord == null;
    });
    const wrongARecords = this.actualDnsInfo.aRecords.filter((actualARecord) => {
      const correspondingExpectedARecord = this.expectedDnsInfo.aRecords.find((expectedARecord) => actualARecord === expectedARecord);
      return correspondingExpectedARecord == null;
    });

    if (missingARecords.length === 0 && wrongARecords.length === 0) {
      return html`All <code>A Records</code> are set properly.`;
    }
    else {
      return html`
        ${missingARecords.length > 0 ? this._renderMissingARecordsDiag(missingARecords) : ''}
        ${wrongARecords.length > 0 ? this._renderWrongARecordsDiag(wrongARecords) : ''}
      `;
    }
  }

  _getCorrespondingRecord (expectedARecord) {
    return this.actualDnsInfo.aRecords.find((actualARecord) => actualARecord === expectedARecord);
  }

  render () {
    const hasCname = this.actualDnsInfo.cname != null;
    const isCnameIncorrect = this.expectedDnsInfo.cname !== this.actualDnsInfo.cname;

    return html`
      <cc-block>
        <div slot="title">DNS Configuration Troubleshooting</div>
        <cc-block-section>
          <div slot="title">Diagnostic Summary</div>
          <div>
            ${hasCname ? this._getCnameDiag() : ''}
            ${!hasCname ? this._getARecordDiag() : ''}
          </div>
        </cc-block-section>
        <cc-block-section>
          <div slot="title">Diagnostic Details</div>
          <table>
            <thead>
              <tr>
                <th scope="col">Record Type</th>
                <th scope="col">Expected Record values</th>
                <th scope="col">Actual Record values</th>
              </tr>
            </thead>
            <tbody>
              ${hasCname ? html`
                <tr>
                  <th>CNAME</th>
                  <td>${this.expectedDnsInfo.cname}</td>
                  <td class="${classMap({ error: isCnameIncorrect, valid: !isCnameIncorrect })}">
                    ${this.actualDnsInfo.cname}
                    <cc-icon .icon=${isCnameIncorrect ? iconError : iconValid}></cc-icon>
                  </td>
                </tr>
              ` : ''}
              ${this.expectedDnsInfo.aRecords.map((aRecord, index) => this._renderARecordRow(
                aRecord,
                index,
                this._getCorrespondingRecord(aRecord) ?? this.actualDnsInfo.aRecords[index],
              ))}
            </tbody>
          </table>
        </cc-block-section>
      </cc-block>
    `;
  }

  _renderARecordRow (aRecord, index, actualARecord) {
    const isARecordIncorrect = aRecord !== actualARecord;
    return html`
      <tr>
        <th scope="row">A RECORD #${index + 1}</th>
        <td>${aRecord}</td>
        <td class="${classMap({ error: isARecordIncorrect, valid: !isARecordIncorrect })}">
          ${actualARecord ?? 'no value'}
          <cc-icon .icon=${isARecordIncorrect ? iconError : iconValid}></cc-icon>
        </td>
      </tr>
    `;
  }

  _renderMissingARecordsDiag (missingARecords) {
    return html`
      <p>There are ${missingARecords.length} A Records missing.</p>
      <p>Please add <code>A Records</code> for the following values:</p>
      <ul>
        ${missingARecords.map((missingARecord) => html`
          <li>${missingARecord}</li>
        `)}
      </ul>
    `;
  }

  _renderWrongARecordsDiag (wrongARecords) {
    return html`
      <p>There are ${wrongARecords.length} <code>A Records</code> that should be removed:</p>
      <ul>
        ${wrongARecords.map((wrongARecord) => html`
        <li>${wrongARecord}</li>
        `)}
      </ul>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        p {
          margin: 0.5em;
        }

        code {
          display: inline-block;
          padding: 0.25em;
          border: 1px solid var(--cc-color-border-neutral-weak, #eee);
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          font-size: 0.9em;
          white-space: pre-wrap;
          word-break: break-all;
        }

        table {
          overflow: hidden;
          border-collapse: collapse;
          border-radius: 5px;
        }

        th,
        td {
          padding: 1em;
          text-align: left;
        }

        th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
        }

        td {
          background-color: var(--cc-color-bg-neutral);
          color: var(--cc-color-text-normal);
        }

        tr:not(:last-child) td {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
        }

        .error {
          color: var(--cc-color-text-danger);
          font-weight: bold;
        }

        .valid {
          color: var(--cc-color-text-success);
        }
      `,
    ];
  }
}

window.customElements.define('cc-dns-troubleshoot', CcDnsTroubleShoot);
