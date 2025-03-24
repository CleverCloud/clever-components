import { CcEvent } from '../events.js';
import { COMPONENTS, CURRENT_CONTEXT, LAST_CONTEXT, META } from './smart-symbols.js';

interface SmartContainerComponentsMap<T extends SmartComponent>
  extends Map<SmartComponentCoreDefinition<T>, Array<SmartComponent>> {
  get<K extends T>(k: SmartComponentCoreDefinition<K>): Array<K> | undefined;
  set<K extends T>(key: SmartComponentCoreDefinition<K>, value: Array<K>): this;
  has<K extends T>(k: SmartComponentCoreDefinition<K>): boolean;
  delete<K extends T>(k: SmartComponentCoreDefinition<K>): boolean;
}

export interface SmartContainer extends Element {
  [COMPONENTS]?: SmartContainerComponentsMap<SmartComponent>;
  [CURRENT_CONTEXT]?: SmartContext;
  context: Object;
  parentContext: Object;
}

export interface SmartComponent extends Element {
  [LAST_CONTEXT]?: SmartContext;
  [META]?: Map<SmartComponentDefinition<this>, { abortController?: AbortController }>;
}

export interface SmartComponentCoreDefinition<T extends SmartComponent> {
  selector: string;
  params?: Record<string, SmartDefinitionParam>;
  onConnect?: (container: SmartContainer, component: T) => void;
  onContextUpdate?: (container: SmartContainer, component: T, context: SmartContext) => void;
  onDisconnect?: (container: SmartContainer, component: T) => void;
}

export interface SmartComponentDefinition<C extends SmartComponent> {
  selector: string;
  params: Record<string, SmartDefinitionParam>;
  onContextUpdate: (args: OnContextUpdateArgs<C>) => void | Promise<void>;
}

export interface SmartDefinitionParam<TypeHint = unknown> {
  type: TypeHint;
  optional?: boolean;
}

export type SmartContext = Record<string, any>;

export type OnEventCallback = <
  ThisEventType extends keyof HTMLElementEventMap | keyof DocumentEventMap | keyof WindowEventMap,
>(
  type: ThisEventType,
  listener: (event: EventFromEventType<ThisEventType>) => void,
) => void;

type EventFromEventType<ThisEventType> = ThisEventType extends keyof HTMLElementEventMap
  ? HTMLElementEventMap[ThisEventType]
  : ThisEventType extends keyof DocumentEventMap
    ? DocumentEventMap[ThisEventType]
    : ThisEventType extends keyof WindowEventMap
      ? WindowEventMap[ThisEventType]
      : never;

export type OnNewEventCallback = <D, E extends CcEvent<D>>(
  eventClass: Clazz<E>,
  listener: (detail: (typeof event)['detail'], event: InstanceType<typeof eventClass>) => void,
) => void;

export type UpdateComponentCallback<C extends SmartComponent> = <P extends keyof C, V extends C[P]>(
  propertyName: P,
  property: CallbackOrObject<V>,
) => void;

export interface OnContextUpdateArgs<C extends SmartComponent> {
  container: SmartContainer;
  component: C;
  context: SmartContext;
  signal: AbortSignal;
  onEvent: OnEventCallback;
  onNewEvent: OnNewEventCallback;
  updateComponent: UpdateComponentCallback<C>;
}

export type CallbackOrObject<T> = T | ((property: T) => void);

interface Clazz<T> {
  new (...args: any[]): T;
}
