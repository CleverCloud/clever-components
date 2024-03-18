import { html, LitElement, css } from 'lit';
import '../cc-block/cc-block.js';
import '../cc-block-section/cc-block-section.js';

/**
 * @typedef {import('./cc-dns-troubleshoot.types.js').DnsInfo} DnsInfo
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
      return html`The CNAME record is set configured properly`;
    }
  }

  /**
   * est ce qu'on a un cname ?
   *   - Si oui, est-ce qu'il est ok?
   *     - Si non => Diag
   *   - Si non => A records
   * est ce qu'on a des A Records ?
   *   - Si non ?
   */
  render () {
    const hasCname = this.actualDnsInfo.cname != null;
    return html`
      <cc-block>
        <div slot="title">DNS Configuration Troubleshooting</div>
        <cc-block-section>
          <div slot="title">Diagnostic Summary</div>
          <div>
            ${hasCname ? this._getCnameDiag() : ''}
          </div>
        </cc-block-section>
        <cc-block-section>
          <div slot="title">Diagnostic Details</div>
          <div>
            <p>Expected CNAME: ${this.expectedDnsInfo.cname}</p>
            <p>Expected A RECORDS:</p>
            <ul>
              ${this.expectedDnsInfo.aRecords.map((aRecord) => html`
              <li>${aRecord}</li>
              `)}
            </ul>
          </div>
          <div>
            <p>Actual CNAME: ${this.actualDnsInfo.cname}</p>
            <p>Actual A RECORDS:</p>
            <ul>
              ${this.actualDnsInfo.aRecords.map((aRecord) => html`
              <li>${aRecord}</li>
              `)}
            </ul>
          </div>
        </cc-block-section>
      </cc-block>
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
      `,
    ];
  }
}

window.customElements.define('cc-dns-troubleshoot', CcDnsTroubleShoot);
