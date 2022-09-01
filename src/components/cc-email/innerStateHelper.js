import { set, unset } from './objectHelper.js';

const dataPath = (path) => `${path}.data`;
const statePath = (path) => `${path}.state`;

/**
 *
 * @param {StateHelper<D>} stateHelper
 * @param {string} path
 * @return {InnerStateHelper<D, S>}
 * @template D, S
 */
export function innerStateHelper (stateHelper, path) {
  const dp = dataPath(path);
  const sp = statePath(path);

  return {
    create (data, state = 'idle') {
      return { data, state };
    },
    get () {
      return stateHelper.getDataAt(path);
    },
    getData () {
      return stateHelper.getDataAt(dp);
    },
    getState () {
      return stateHelper.getDataAt(sp);
    },
    set (data, state = 'idle') {
      stateHelper.mutator.data((oldData) => set(oldData, path, this.create(data, state)));
    },
    setData (data) {
      stateHelper.mutator.data((oldData) => set(oldData, dp, data));
    },
    setState (state) {
      stateHelper.mutator.data((oldData) => set(oldData, sp, state));
    },
    resetState () {
      this.setState('idle');
    },
  };
}

/**
 *
 * @param {StateHelper<D>} stateHelper
 * @param {string} path
 * @return {InnerListStateHelper<D, S>}
 * @template D, S
 */
export function innerListStateHelper (stateHelper, path) {
  return {
    create (data, state = 'idle') {
      return data.map((d) => ({ data: d, state }));
    },
    forItem (indexOrPredicate) {
      const itemPath = findItemPath(stateHelper, path, indexOrPredicate);
      if (itemPath != null) {
        return innerStateHelper(stateHelper, itemPath);
      }
      throw new Error(`no item found for path ${itemPath}`);
    },
    remove (indexOrPredicate) {
      const itemPath = findItemPath(stateHelper, path, indexOrPredicate);
      if (itemPath != null) {
        stateHelper.mutator.data((oldData) => unset(oldData, itemPath));
      }
    },
    // todo: add() function may also be useful
  };
}

function findItemPath (stateHelper, listPath, indexOrPredicate) {
  if (typeof indexOrPredicate === 'function') {
    return itemPathByPredicate(stateHelper, listPath, indexOrPredicate);
  }
  return itemPathByIndex(listPath, indexOrPredicate);
}

function itemPathByIndex (listPath, index) {
  if (index < 0) {
    return undefined;
  }
  return `${listPath}[${index}]`;
}

function itemPathByPredicate (stateHelper, listPath, predicate) {
  return itemPathByIndex(
    listPath,
    (stateHelper.getDataAt(listPath) || []).findIndex((item, index) => predicate(item.data, index)),
  );
}
