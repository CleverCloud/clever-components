import { CcEvent } from './events.js';

export interface Clazz<T> {
  new (...args: any[]): T;
}

export type SuperEventFunction = <E extends CcEvent>(
  eventClass: Clazz<E>,
  listener: (event: InstanceType<typeof eventClass>) => void,
) => void;
