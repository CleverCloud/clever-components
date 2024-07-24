import { css, html, LitElement } from 'lit';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-redis-explorer/cc-redis-explorer.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import { sandboxStyles } from '../sandbox-styles.js';

class CcRedis extends LitElement {
  static get properties() {
    return {
      _redisUrl: { type: String, state: true },
    };
  }

  constructor() {
    super();

    this._redisUrl = 'redis://:a3DqKHACCTd405oX90q@bopsiwrfx543hievv2fb-redis.services.clever-cloud.com:3861';
  }

  _onRedisUrlChange() {}

  render() {
    const context = {
      url: 'http://localhost:8002',
      backendUrl: this._redisUrl,
    };

    return html`
      <div class="ctrl-top" style="align-items: normal">
        <cc-input-text
          inline
          label="Redis URL"
          value=${this._redisUrl}
          @cc-input-text:input=${this._onRedisUrlChange}
        ></cc-input-text>
      </div>

      <div>
        <cc-smart-container .context=${context}>
          <cc-redis-explorer></cc-redis-explorer>
        </cc-smart-container>
      </div>
    `;
  }

  // async firstUpdated(changedProperties) {
  //   const response = await fetch('http://localhost:8002/command/get', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Cc-Backend-Url': this._redisUrl,
  //     },
  //     body: JSON.stringify(['key']),
  //   });
  //   return response.json();
  // }

  static get styles() {
    return [
      sandboxStyles,
      css`
        :host {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-explorer-sandbox', CcRedis);
