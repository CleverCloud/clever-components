export interface EventWithTarget<T extends EventTarget> extends GenericEventWithTarget<Event, T> {

}

export type GenericEventWithTarget<E extends Event, T extends EventTarget> = E & {
  target: T;
}
