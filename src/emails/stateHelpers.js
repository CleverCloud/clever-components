/**
 * @returns StateFactory<D>
 * @template D
 */
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
 * @param {{state: State<D>}} component
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
