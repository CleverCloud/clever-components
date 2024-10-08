export type EventWithTarget<
  T extends EventTarget = HTMLElement | SVGElement,
  U extends EventTarget = null | HTMLElement | SVGElement,
> = GenericEventWithTarget<Event, T, U>;

export type GenericEventWithTarget<
  E extends Event,
  T extends EventTarget = HTMLElement | SVGElement,
  U extends EventTarget = null | HTMLElement | SVGElement,
> = E & {
  target: T;
  currentTarget: U;
};
