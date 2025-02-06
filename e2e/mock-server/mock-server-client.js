// @ts-ignore
import { request } from '@clevercloud/client/esm/request.fetch.js';

export class MockServerClient {
  /**
   * @param {string} host
   * @param {number} port
   */
  constructor(host = 'localhost', port = 1080) {
    this._host = host;
    this._port = port;
  }

  reset() {
    return request({
      url: this.#buildUrl('/reset'),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   *
   * @param {string} path
   * @param {object} response
   * @returns {Promise<string>}
   */
  addExpectation(path, response) {
    const body = {
      httpRequest: {
        path,
      },
      httpResponse: {
        body: response,
      },
    };

    return request({
      url: this.#buildUrl('/expectation'),
      method: 'PUT',
      body,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * @param {string} path
   * @returns {string}
   */
  #buildUrl(path) {
    return `http://${this._host}:${this._port}/mockserver${path}`;
  }
}
