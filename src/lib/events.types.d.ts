export type EventWithTarget<T extends EventTarget> = GenericEventWithTarget<Event, T>

export type GenericEventWithTarget<E extends Event, T extends EventTarget> = E & { target: T }
