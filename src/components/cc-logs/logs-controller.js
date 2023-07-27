export class LogsController {

  constructor (host) {
    this._host = host;
    this._logs = [];
    this._limit = Infinity;
  }

  set limit (limit) {
    const isNumber = (typeof limit === 'number') && !Number.isNaN(limit);
    this._limit = isNumber ? limit : Infinity;
    this._updateList();
  }

  getList () {
    return this._logs.slice();
  }

  clear () {
    this._logs = [];
    this._updateList();
  }

  append (newLogs) {
    this._updateList({ newLogs });
  }

  _updateList (options = {}) {

    const newLogs = options.newLogs ?? [];

    // Appended logs length may be above limit
    const logsToAdd = (newLogs.length > this._limit)
      ? newLogs.slice(newLogs.length - this._limit)
      : newLogs.slice();

    // If limit is reached, let's try to see what to remove and what to keep
    const newLength = this._logs.length + logsToAdd.length;
    const sliceIndex = (newLength >= this._limit)
      ? newLength - this._limit
      : 0;

    this._logs.splice(0, sliceIndex);
    this._logs.push(...logsToAdd);

    this._host.requestUpdate();
  }
}
