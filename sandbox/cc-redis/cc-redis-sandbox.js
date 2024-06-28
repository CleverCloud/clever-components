import { css, html, LitElement } from 'lit';
import { sandboxStyles } from '../sandbox-styles.js';

class CcRedis extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

  }

  render () {
    return html`
      <div class="ctrl-top" style="align-items: normal">
        
      </div>
      
      <div></div>
    `;
  }

  async firstUpdated (changedProperties) {
    const response = await fetch('http://localhost:8002/command/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cc-Backend-Url': 'redis://:a3DqKHACCTd405oX90q@bopsiwrfx543hievv2fb-redis.services.clever-cloud.com:3861',
      },
      body: JSON.stringify(['key']),
    });
    return response.json();
  }

  static get styles () {
    return [
      sandboxStyles,
      css`
        :host {
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
        }
      `,
    ];
  }
}

window.customElements.define('cc-redis-sandbox', CcRedis);
