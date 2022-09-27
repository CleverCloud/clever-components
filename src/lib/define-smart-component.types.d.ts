export interface SmartContainer<Context> extends Element {
  context: Context;
}

export interface SmartComponentDefinition<Component extends Element, Params extends Record<string, any>, Events extends Record<string, any>> {
  selector: string;
  params: Record<keyof Params, { type: any }>;
  onContextUpdate: (o: {
    container?: SmartContainer<Record<keyof Params, any>>,
    component?: Component,
    onEvent?: <EventName extends keyof Events>(
      type: EventName,
      listener: (detail: Events[EventName]) => void,
    ) => void,
    updateComponent?: <PropertyType extends keyof Component>(
      property: PropertyType,
      callbackOrObject: ((draft: Component[PropertyType]) => void) | Component[PropertyType],
    ) => void,
    context?: Record<keyof Params, any>,
    signal?: AbortSignal,
  }) => void
}
