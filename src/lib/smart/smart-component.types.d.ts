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

export interface SmartComponentCoreDefinition<C extends keyof HTMLElementTagNameMap> {
  selector: `${C}${string}`;
  params?: Record<string, SmartDefinitionParam>;
  onConnect?: (container: SmartContainer, component: HTMLElementTagNameMap[C]) => void;
  onContextUpdate?: (container: SmartContainer, component: HTMLElementTagNameMap[C], context: SmartContext) => void;
  onDisconnect?: (container: SmartContainer, component: HTMLElementTagNameMap[C]) => void;
}

export interface SmartComponentDefinition<C extends keyof HTMLElementTagNameMap> {
  selector: `${C}${string}`;
  params: Record<string, SmartDefinitionParam>;
  onContextUpdate: (args: OnContextUpdateArgs<C>) => void | Promise<void>;
}

type CcComponent = keyof HTMLElementTagNameMap & `cc-${string}`;

export type defineSmartComponent = <ComponentTagName extends CcComponent>(definition: {
  selector: ComponentTagName | `${ComponentTagName}[${string}]`;
  params: Record<string, SmartDefinitionParam>;
  onContextUpdate: (args: OnContextUpdateArgs<HTMLElementTagNameMap[ComponentTagName]>) => void | Promise<void>;
}) => void;

export interface SmartDefinitionParam<TypeHint = unknown> {
  type: TypeHint;
  optional?: boolean;
}

export type SmartContext = Record<string, any>;

type GlobalCcEvent = {
  [P in keyof GlobalEventHandlersEventMap]: GlobalEventHandlersEventMap[P] extends CcEvent<any> ? P : never;
}[keyof GlobalEventHandlersEventMap];

export type OnEventCallback = <E extends GlobalCcEvent>(
  eventName: E,
  listener: (
    detail: GlobalEventHandlersEventMap[E] extends CcEvent<infer D> ? D : never,
    event: GlobalEventHandlersEventMap[E],
  ) => void,
) => void;

export type UpdateComponentCallback<C extends SmartComponent> = <P extends keyof C, V extends C[P]>(
  propertyName: P,
  property: CallbackOrObject<V>,
) => void;

export interface OnContextUpdateArgs<C extends HTMLElementTagNameMap[keyof HTMLElementTagNameMap]> {
  container: SmartContainer;
  component: C;
  context: SmartContext;
  signal: AbortSignal;
  onEvent: OnEventCallback;
  updateComponent: UpdateComponentCallback<C>;
}

export type CallbackOrObject<T> = T | ((property: T) => void);
