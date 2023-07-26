export class LogsList {

  constructor (updateCallback) {
    this._updateCallback = updateCallback;
    this._limit = Infinity;
    this._filterCallback = () => true;
    this._logsAfterLimit = [];
    this._logsAfterLimitAndFilter = [];
  }

  getList () {
    return this._logsAfterLimitAndFilter;
  }

  clear () {
    this._logsAfterLimit = [];
    this._logsAfterLimitAndFilter = [];
    this._updateCallback();
  }

  append (newLogs) {
    this._updateList({ newLogs });
  }

  setLimit (limit) {
    const isNumber = (typeof limit === 'number') && !Number.isNaN(limit);
    this._limit = isNumber ? limit : Infinity;
    this._updateList();
  }

  setFilter (filter) {

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

  _updateList (options = {}) {

    const newLogs = options.newLogs ?? [];
    const forceFilter = options.forceFilter ?? false;

    // Appended logs length may be above limit
    const logsToAdd = (newLogs.length > this._limit)
      ? newLogs.slice(newLogs.length - this._limit)
      : newLogs;

    // If limit is reached, let's try to see what to remove and what to keep
    const newLength = this._logsAfterLimit.length + logsToAdd.length;
    const sliceIndex = (newLength >= this._limit)
      ? newLength - this._limit
      : 0;

    const logsToRemove = this._logsAfterLimit.slice(0, sliceIndex);
    const logsToKeep = this._logsAfterLimit.slice(sliceIndex);

    this._logsAfterLimit = [...logsToKeep, ...logsToAdd];

    if (forceFilter) {
      this._logsAfterLimitAndFilter = this._logsAfterLimit.filter(this._filterCallback);
    }
    else {
      // We filter the logs to remove so we can know how many to remove from the filtered list
      const logsToRemoveFiltered = logsToRemove.filter(this._filterCallback);
      // No need to filter the logs we want to keep
      const logsToKeepFiltered = this._logsAfterLimitAndFilter.slice(logsToRemoveFiltered.length);
      // Only need to filter the new logs
      const logsToAddFiltered = logsToAdd.filter(this._filterCallback);

      this._logsAfterLimitAndFilter = [...logsToKeepFiltered, ...logsToAddFiltered];
    }

    this._updateCallback();
  }
}
