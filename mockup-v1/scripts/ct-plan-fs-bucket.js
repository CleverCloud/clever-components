import { LitElement, html, css } from 'lit';
import { iconRemixStickyNoteLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'More informations',
};

export class CtPlanFsBucket extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <p>Cellar add-on pricing is based on storage. Check our simulator on our
          <a href="https://www.clever-cloud.com/pricing/" target="_blank">pricing page</a>.</p>

        <p>Learn more about File System Buckets on our <a href="https://developers.clever-cloud.com/doc/addons/fs-bucket/" target="_blank">documentation page</a>.</p>

        <p>
          <cc-notice intent="warning" message="Back-ups are not included in the public cloud offer. You can still do them manually."></cc-notice>
          <br>
          <cc-notice intent="warning" message="FSBuckets are not available for Docker applications because of security concerns."></cc-notice>
        </p>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        p {
          margin-block: 0.5em;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-fs-bucket', CtPlanFsBucket);
