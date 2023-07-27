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

  findByIndex (index) {
    return this._logsAfterLimitAndFilter[index];
  }

  // Only if IDs are sorted
  findIndexById (id) {
    return findByDichotomy(this._logsAfterLimitAndFilter, id);
  }

  // Only if IDs are sorted
  getRange (startId, endId) {
    const indexes = [this.findIndexById(startId), this.findIndexById(endId)].sort();
    return this._logsAfterLimitAndFilter
      .slice(...indexes)
      .map((log) => log.id);
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
      : newLogs.slice();

    // If limit is reached, let's try to see what to remove and what to keep
    const newLength = this._logsAfterLimit.length + logsToAdd.length;
    const sliceIndex = (newLength >= this._limit)
      ? newLength - this._limit
      : 0;

    const logsToRemove = this._logsAfterLimit.splice(0, sliceIndex);

    this._logsAfterLimit.push(...logsToAdd);

    if (forceFilter) {
      this._logsAfterLimitAndFilter = this._logsAfterLimit.filter(this._filterCallback);
    }
    else {
      // We filter the logs to remove so we can know how many to remove from the filtered list
      const logsToRemoveFiltered = logsToRemove.filter(this._filterCallback);
      // No need to filter the logs we want to keep
      this._logsAfterLimitAndFilter.splice(0, logsToRemoveFiltered.length);
      // Only need to filter the new logs
      const logsToAddFiltered = logsToAdd.filter(this._filterCallback);

      this._logsAfterLimitAndFilter.push(...logsToAddFiltered);
    }

    this._updateCallback();
  }
}

function findByDichotomy (list, id) {
  let minIndex = 0;
  let maxIndex = list.length;
  if (maxIndex === 0) {
    return null;
  }
  while (maxIndex > minIndex + 1) {
    const index = Math.floor((minIndex + maxIndex) / 2);
    if (list[index].id > id) {
      maxIndex = index;
    }
    else {
      minIndex = index;
    }
  }
  return minIndex;
}
