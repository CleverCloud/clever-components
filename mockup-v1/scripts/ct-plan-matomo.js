import { LitElement, html, css } from 'lit';
import { iconRemixStickyNoteLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'How Matomo works?',
};

export class CtPlanMatomo extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <p>When you subscribe the Matomo add-on, we automatically set up a PHP instance based on the latest Matomo release. It comes with the required MySQL database and an optional Redis cache. Total cost is the total runtime cost of those three services.</p>
        
        <p class="addons-images">
          <img src="https://assets.clever-cloud.com/logos/php.svg" alt=""/>
          <img src="https://assets.clever-cloud.com/logos/mysql.svg" alt=""/>
          <img src="https://assets.clever-cloud.com/logos/redis.svg" alt=""/>
        </p>
        
        <p>We have chosen to let you see and manage these companion add-ons in the Console so that you could adjust them to your needs. You can change their settings and use the Clever Cloud ability to migrate from an S flavored database or cache to an L or XL if required. You can also activate auto-scalability (horizontal and/or vertical scaling).</p>

        <p>Learn more about Matomo on <a href="https://developers.clever-cloud.com/doc/addons/matomo/" target="_blank">our documentation page</a>.</p>
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
          line-height: 1.625;
        }
        
        .addons-images {
          display: inline-flex;
          justify-content: center;
          column-gap: 1em;
        }

        .addons-images img {
          height: 4em;
          width: 4em;
          border-radius: 4px;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-matomo', CtPlanMatomo);
