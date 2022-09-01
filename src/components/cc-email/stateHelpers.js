/**
 * @returns StateFactory<D>
 * @template D
 */
import { innerListStateHelper, innerStateHelper } from './innerStateHelper.js';
import { get } from './objectHelper.js';

export function stateFactory () {
  return {
    loading () {
      return {
        type: 'loading',
      };
    },
    error () {
      return {
        type: 'error',
      };
    },
    data (data) {
      return {
        type: 'loaded',
        data,
      };
    },
  };
}

/**
 *
 * @param {StateHolder<D>} component
 * @return {StateMutator<D>}
 * @template D
 */
export function createStateMutator (component) {
  const factory = stateFactory();
  return {
    loading () {
      component.state = factory.loading();
    },
    error () {
      component.state = factory.error();
    },
    data (data) {
      if (typeof data === 'function') {
        this.data(data(component.state.data));
      }
      else {
        component.state = factory.data(data);
      }
    },
  };
}

/**
 *
 * @param {StateHolder<D>} component
 * @return {StateHelper<D>}
 * @template D
 */
export function createStateHelper (component) {
  return {
    component,
    mutator: createStateMutator(component),
    getDataAt (path) {
      if (component.state.type === 'loaded') {
        return get(component.state.data, path);
      }
    },
    getData () {
      if (component.state.type === 'loaded') {
        return component.state.data;
      }
    },
    createInnerStateHelper (path) {
      return innerStateHelper(this, path);
    },
    createInnerListStateHelper (path) {
      return innerListStateHelper(this, path);
    },
  };
}
