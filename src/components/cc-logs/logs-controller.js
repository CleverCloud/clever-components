export class LogsController {

  constructor (host) {
    this._host = host;
    this._logs = [];
    this._logsFiltered = [];
    this._limit = Infinity;
    this._filterCallback = () => true;
  }

  set limit (limit) {
    const isNumber = (typeof limit === 'number') && !Number.isNaN(limit);
    this._limit = isNumber ? limit : Infinity;
    this._updateList();
  }

  set filter (filter) {

    const filterValuesByMetadataName = {};
    if (Array.isArray(filter)) {
      for (const predicate of filter) {
        if (filterValuesByMetadataName[predicate.metadata] == null) {
          filterValuesByMetadataName[predicate.metadata] = [];
        }
        filterValuesByMetadataName[predicate.metadata].push(predicate.value);
      }
    }
    const filterValuesByMetadataNameEntries = Object.entries(filterValuesByMetadataName);

    this._filterCallback = (log) => {
      // NOTE: [].every() is always true, whatever the callback
      return filterValuesByMetadataNameEntries.every(([metadata, values]) => {
        const logMetadata = log.metadata.find((m) => m.name === metadata);
        return values.includes(logMetadata?.value);
      });
    };

    this._updateList({ forceFilter: true });
  }

  getList () {
    return this._logsFiltered.slice();
  }

  clear () {
    this._logs = [];
    this._logsFiltered = [];
    this._updateList();
  }

  append (newLogs) {
    this._updateList({ newLogs });
  }

  _updateList (options = {}) {

    const newLogs = options.newLogs ?? [];
    const forceFilter = options.forceFilter ?? false;

    // Appended logs length may be above limit
    const logsToAdd = (newLogs.length > this._limit)
      ? newLogs.slice(newLogs.length - this._limit)
      : newLogs.slice();

    // If limit is reached, let's try to see what to remove and what to keep
    const newLength = this._logs.length + logsToAdd.length;
    const sliceIndex = (newLength >= this._limit)
      ? newLength - this._limit
      : 0;

    const logsToRemove = this._logs.splice(0, sliceIndex);

    this._logs.push(...logsToAdd);

    if (forceFilter) {
      this._logsFiltered = this._logs.filter(this._filterCallback);
    }
    else {
      // We filter the logs to remove so we can know how many to remove from the filtered list
      const logsToRemoveFiltered = logsToRemove.filter(this._filterCallback);
      // No need to filter the logs we want to keep
      this._logsFiltered.splice(0, logsToRemoveFiltered.length);
      // Only need to filter the new logs
      const logsToAddFiltered = logsToAdd.filter(this._filterCallback);

      this._logsFiltered.push(...logsToAddFiltered);
    }

    this._host.requestUpdate();
  }
}
