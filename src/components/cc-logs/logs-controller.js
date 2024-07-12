/**
 * @typedef {import('./cc-logs.types.js').Log} Log
 * @typedef {import('./cc-logs.types.js').LogFilter} LogFilter
 * @typedef {import('./cc-logs.types.js').MetadataFilter} MetadataFilter
 * @typedef {import('./cc-logs.types.js').LogMessageFilter} LogMessageFilter
 * @typedef {import('./cc-logs.types.js').LogMessageFilterMode} LogMessageFilterMode
 * @typedef {import('./cc-logs.js').CcLogs} CcLogs
 */

import { parseRegex } from '../../lib/regex-parse.js';
import { isStringEmpty } from '../../lib/utils.js';

const truePredicate = () => true;
const falsePredicate = () => false;

/**
 * Controls the logic of the cc-logs component.
 */
export class LogsController {
  /**
   * @param {CcLogs} host
   */
  constructor(host) {
    /** @type {CcLogs} The host. */
    this._host = host;
    /** @type {Array<Log>} The full logs list. This is where the limit is applied. */
    this._logs = [];
    /** @type {Array<Log>} The list of logs after limiting and filtering. */
    this._logsFiltered = [];
    /** @type {number} The maximum number of logs that will be handled in memory. When limit is reached, the FIFO pattern will be used. */
    this._limit = Infinity;
    /** @type {(log: Log) => boolean} The filter function. */
    this._filterCallback = truePredicate;
    /** @type {Set<Log>} The selected logs. */
    this._selection = new Set();
    /** @type {Log|null} The last selected log or null if none. */
    this._selectionLast = null;
    /** @type {number|null} The index of the focused log. */
    this._focusedIndex = null;
  }

  set limit(limit) {
    const isNumber = typeof limit === 'number' && !Number.isNaN(limit);
    const newLimit = isNumber ? limit : Infinity;

    if (newLimit !== this._limit) {
      this._limit = isNumber ? limit : Infinity;
      this._updateList();
    }
  }

  /**
   * @param {LogFilter} filter
   */
  set filter(filter) {
    if (filter == null) {
      this._filterCallback = truePredicate;
    } else {
      const matchesMessage = this._getMessageFilterCallback(filter.message);
      const matchesMetadata = this._getMetadataFilterCallback(filter.metadata);
      this._filterCallback = (log) => matchesMessage(log) && matchesMetadata(log);
    }

    this._updateList({ forceFilter: true });
  }

  /**
   * @return {Array<Log>} The limited and filtered array of logs.
   */
  getList() {
    return this._logsFiltered;
  }

  /**
   * @return {number} The length of the limited and filtered array of logs.
   */
  get listLength() {
    return this._logsFiltered.length;
  }

  /**
   * @param {Array<Log>} newLogs The array of logs to append.
   */
  append(newLogs) {
    this._updateList({ newLogs });
  }

  clear() {
    this._logs = [];
    this._logsFiltered = [];
    this._selection.clear();
    this._updateList();
    this.clearFocus();
  }

  // region selection

  /**
   * @param {number} filteredIndex index of the log to select.
   */
  select(filteredIndex) {
    const log = this._getLogByFilteredIndex(filteredIndex);
    if (log != null) {
      this._selection = new Set([log]);
    } else {
      this._selection = new Set();
    }
    this._selectionLast = log;

    this._host.requestUpdate();
    this._host._onSelectionChanged();
  }

  /**
   * Toggles selection of the log at the given index:
   *
   * If log is already selected, it will be removed from selection.
   * If log is not selected, it will be added to the selection.
   *
   * @param {number} filteredIndex
   */
  toggleSelection(filteredIndex) {
    const log = this._getLogByFilteredIndex(filteredIndex);
    if (log == null) {
      return;
    }
    if (this._selection.has(log)) {
      this._selection.delete(log);
      this._selectionLast = Array.from(this._selection).pop();
    } else {
      this._selection.add(log);
      this._selectionLast = this._logsFiltered[filteredIndex];
    }
    this._host.requestUpdate();
    this._host._onSelectionChanged();
  }

  /**
   * @param {number} filteredIndex
   * @param {'replace'|'append'} mode
   */
  extendSelection(filteredIndex, mode) {
    if (this._selection.size === 0) {
      this.select(filteredIndex);
      return;
    }

    const logA = this._selectionLast ?? Array.from(this._selection).pop();
    const indexA = this._logsFiltered.indexOf(logA);
    const indexB = filteredIndex;
    const fromIndex = Math.min(indexA, indexB);
    const toIndex = Math.max(indexA, indexB);
    const range = this._logsFiltered.slice(Math.max(0, fromIndex), toIndex + 1);

    if (mode === 'replace') {
      this._selection.clear();
    }

    range.forEach((log) => this._selection.add(log));

    this._host.requestUpdate();
    this._host._onSelectionChanged();
  }

  clearSelection() {
    this._selection.clear();
    this._selectionLast = null;
    this._host.requestUpdate();
    this._host._onSelectionChanged();
  }

  selectAll() {
    if (this._logsFiltered.length > 0) {
      this._selection = new Set(this._logsFiltered);
      this._selectionLast = this._logsFiltered[this._logsFiltered.length - 1];
      this._host.requestUpdate();
      this._host._onSelectionChanged();
    }
  }

  /**
   * @return {number} The length of the selection
   */
  get selectionLength() {
    return this._selection.size;
  }

  /**
   * @param {number} filteredIndex
   * @return {boolean} Whereas the given index points on a log that is in selection.
   */
  isSelected(filteredIndex) {
    const log = this._getLogByFilteredIndex(filteredIndex);
    return this._selection.has(log);
  }

  /**
   * @return {boolean} Whereas the selection is empty.
   */
  isSelectionEmpty() {
    return this._selection.size === 0;
  }

  /**
   * @return {Array<Log>} The selected logs in the right order: in the log order and not in the selection order.
   */
  getSelectedLogs() {
    return this._logs.filter((log) => this._selection.has(log));
  }

  // endregion

  // region focus

  /**
   * By default, calling focus() will notify the host with `_onFocusedLogChange` with the new focused index.
   * When the component receives the focus, it needs to call this method but doesn't need to be notified back.
   *
   * @param {number|null} filteredIndex the index of the log to focus
   * @param {boolean} [notifyHost = true] Whether to notify the host when the focused index has changed
   */
  focus(filteredIndex, notifyHost = true) {
    if (filteredIndex != null && (filteredIndex < 0 || filteredIndex > this._logsFiltered.length - 1)) {
      return;
    }
    if (this._focusedIndex !== filteredIndex) {
      this._focusedIndex = filteredIndex;
      if (notifyHost) {
        this._host._onFocusedLogChange(filteredIndex);
      }
    }
  }

  /**
   * @param {'up'|'down'} direction
   * @param {{first: number, last: number}} [visibleRange]
   */
  moveFocus(direction, visibleRange) {
    if (this._focusedIndex != null) {
      if (direction === 'up' && this._focusedIndex > 0) {
        this.focus(this._focusedIndex - 1);
      }
      if (direction === 'down' && this._focusedIndex < this._logsFiltered.length - 1) {
        this.focus(this._focusedIndex + 1);
      }
    } else if (visibleRange != null) {
      if (direction === 'up') {
        this.focus(visibleRange.last);
      }
      if (direction === 'down') {
        this.focus(visibleRange.first);
      }
    }
  }

  /**
   * By default, calling clearFocus() will notify the host with `_onFocusedLogChange` with the new focused index.
   * When the component receives the focus, it needs to call this method but doesn't need to be notified back.
   *
   * @param {boolean} [notifyHost = true] Whether to notify the host when the focused index has changed
   */
  clearFocus(notifyHost = true) {
    this.focus(null, notifyHost);
  }

  /**
   * @param {{first: number, last: number}} range
   */
  isFocusedIndexInRange({ first, last }) {
    return this._focusedIndex != null && this._focusedIndex >= first && this._focusedIndex <= last;
  }

  // endregion

  /**
   * @param {number} filteredIndex
   * @return {Log}
   */
  _getLogByFilteredIndex(filteredIndex) {
    return this._logsFiltered[filteredIndex];
  }

  /**
   * @param {{[newLogs]: Array<Log>, [forceFilter]: boolean}} [options={}]
   */
  _updateList(options = {}) {
    const newLogs = options.newLogs ?? [];
    const forceFilter = options.forceFilter ?? false;

    let selectionHasChanged = false;
    const removeFromSelection = (log) => {
      selectionHasChanged = this._selection.delete(log) || selectionHasChanged;
    };

    // Appended logs length may be above limit
    const logsToAdd = newLogs.length > this._limit ? newLogs.slice(newLogs.length - this._limit) : newLogs.slice();

    // If limit is reached, let's try to see what to remove and what to keep
    const newLength = this._logs.length + logsToAdd.length;
    const sliceIndex = newLength >= this._limit ? newLength - this._limit : 0;

    const logsToRemove = this._logs.splice(0, sliceIndex);

    this._logs.push(...logsToAdd);

    if (forceFilter) {
      this._logsFiltered = [];

      this._logs.forEach((log) => {
        if (this._filterCallback(log)) {
          this._logsFiltered.push(log);
        } else {
          removeFromSelection(log);
        }
      });

      // Applying a new filter requires a user interaction and will (almost always) imply a focus change
      // That's why we don't want to try an "expensive" indexOf call in this critical function
      this.clearFocus();
    } else {
      // We filter the logs to remove, so we can know how many to remove from the filtered list
      const logsToRemoveFiltered = logsToRemove.filter(this._filterCallback);
      // No need to filter the logs we want to keep
      this._logsFiltered.splice(0, logsToRemoveFiltered.length);
      // Only need to filter the new logs
      const logsToAddFiltered = logsToAdd.filter(this._filterCallback);

      this._logsFiltered.push(...logsToAddFiltered);

      // Handle focused log
      if (this._focusedIndex != null && logsToRemoveFiltered.length > 0) {
        if (this._focusedIndex > logsToRemoveFiltered.length) {
          this.focus(this._focusedIndex - logsToRemoveFiltered.length);
        } else {
          this.clearFocus();
        }
      }
    }

    logsToRemove.forEach(removeFromSelection);
    if (!this._selection.has(this._selectionLast)) {
      this._selectionLast = null;
    }

    this._host.requestUpdate();
    if (selectionHasChanged) {
      this._host._onSelectionChanged();
    }
  }

  /**
   *
   * @param {Array<MetadataFilter>} metadataFilter
   * @return {((log: Log) => boolean)}
   */
  _getMetadataFilterCallback(metadataFilter) {
    if (metadataFilter == null || metadataFilter.length === 0) {
      return truePredicate;
    }

    /** @type {{[key: string]: Array<string>}} */
    const filterValuesByMetadataName = {};
    if (Array.isArray(metadataFilter)) {
      for (const predicate of metadataFilter) {
        if (filterValuesByMetadataName[predicate.metadata] == null) {
          filterValuesByMetadataName[predicate.metadata] = [];
        }
        filterValuesByMetadataName[predicate.metadata].push(predicate.value);
      }
    }
    const filterValuesByMetadataNameEntries = Object.entries(filterValuesByMetadataName);

    return (log) => {
      // NOTE: [].every() is always true, whatever the callback
      return filterValuesByMetadataNameEntries.every(([metadata, values]) => {
        const logMetadata = log.metadata.find((m) => m.name === metadata);
        return values.includes(logMetadata?.value);
      });
    };
  }

  /**
   * @param {LogMessageFilter} messageFilter
   * @return {((log: Log) => boolean)}
   */
  _getMessageFilterCallback(messageFilter) {
    if (messageFilter == null || isStringEmpty(messageFilter.value)) {
      return truePredicate;
    }

    if (messageFilter.type === 'strict') {
      return (log) => log.message.includes(messageFilter.value);
    }

    if (messageFilter.type === 'regex') {
      try {
        const regex = parseRegex(messageFilter.value);
        return (log) => log.message.match(regex) != null;
      } catch (e) {
        return falsePredicate;
      }
    }

    const tokens = messageFilter.value
      .trim()
      .toLowerCase()
      .split(' ')
      .filter((t) => t.length > 0);

    return (log) => {
      const message = log.message.toLowerCase();
      return tokens.every((token) => message.includes(token));
    };
  }
}
