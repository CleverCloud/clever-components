import { groupBy } from '../../lib/utils.js';

export class LogsList {

  constructor (updateCallback) {
    this._updateCallback = updateCallback;
    this.filter = [];
    this.limit = null;
    // TODO rename this
    this._logs = [];
    this._filteredLogs = [];
    this._filterPredicate = null;
  }

  clear () {
    this._logs = [];
    this._filteredLogs = [];
    this._updateCallback();
  }

  append (logs) {
    this._logs = [...this._logs, ...logs];
    if (this._applyLimit()) {
      this._applyFilter();
    }
    else {
      this._filteredLogs = [...this._filteredLogs, ...this._filter(this.filter, logs)];
    }
    this._updateCallback();
  }

  getList () {
    return this._filteredLogs;
  }

  setLimit (limit) {
    this.limit = limit;
    this._applyLimit();
    this._updateCallback();
  }

  setFilter (filter) {
    this.filter = filter;
    this._filterPredicate = this._createFilterPredicate(this.filter);
    this._applyFilter();
    this._updateCallback();
  }

  _applyLimit () {
    if (this.limit == null || this.limit === -1) {
      return false;
    }
    const offset = this._logs.length - this.limit;
    if (offset <= 0) {
      return false;
    }

    this._logs = this._logs.slice(offset);

    return true;
  }

  _applyFilter () {
    this._filteredLogs = this._filter(this.filter, this._logs);
  }

  _filter (filter, logs) {
    if (!this._hasFilter()) {
      return logs;
    }

    return logs.filter(this._filterPredicate);
  }

  _hasFilter () {
    return this._filterPredicate != null;
  }

  _createFilterPredicate (filter) {
    if (filter == null || filter.length === 0) {
      return null;
    }

    /**
     * @param {Array<function(log: Log): boolean>} predicates
     * @return {function(log: Log): boolean}
     */
    const and = (predicates) => {
      return (log) => {
        for (const predicate of predicates) {
          if (!predicate(log)) {
            return false;
          }
        }
        return true;
      };
    };

    /**
     * @param {Array<function(log: Log): boolean>} predicates
     * @return {function(log: Log): boolean}
     */
    const or = (predicates) => {
      return (log) => {
        for (const predicate of predicates) {
          if (predicate(log)) {
            return true;
          }
        }
        return false;
      };
    };

    /**
     *
     * @param filter
     * @return {function(log: Log): boolean}
     */
    const predicate = (filter) => (log) => {
      const logMetadata = log.metadata.find((m) => m.name === filter.metadata);
      return logMetadata?.value === filter.value;
    };

    const filtersGroups = Object.values(groupBy(filter, 'metadata'));

    return and(filtersGroups.map((filters) => or(filters.map((filter) => predicate(filter)))));
  }

}
