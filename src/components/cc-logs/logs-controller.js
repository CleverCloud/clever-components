export class LogsController {

  constructor (host) {
    this._host = host;
    this._logs = [];
  }

  getList () {
    return this._logs.slice();
  }

  clear () {
    this._logs = [];
    this._host.requestUpdate();
  }

  append (newLogs) {
    this._logs.push(...newLogs);
    this._host.requestUpdate();
  }
}
