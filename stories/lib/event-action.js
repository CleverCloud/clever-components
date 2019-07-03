import { decorate } from '@storybook/addon-actions';

const customEvent = decorate([(args) => {
  return [JSON.stringify(args[0].detail)];
}]);

export function withCustomEventActions (...eventNames) {
  return (storyFn) => {
    return () => customEvent.withActions(...eventNames)(storyFn);
  };
}
