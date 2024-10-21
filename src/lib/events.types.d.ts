export type EventWithTarget<T extends EventTarget, U extends EventTarget = null | Element> = GenericEventWithTarget<
  Event,
  T,
  U
>;

export type GenericEventWithTarget<
  E extends Event,
  T extends EventTarget,
  U extends EventTarget = null | Element,
> = E & {
  target: T;
  currentTarget: U;
};
