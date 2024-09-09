import { COMPONENTS, CURRENT_CONTEXT, LAST_CONTEXT, META } from './smart-symbols.js';

export interface SmartContainer extends Element {
  [COMPONENTS]?: Map<SmartComponentCoreDefinition, Array<SmartComponent>>;
  [CURRENT_CONTEXT]?: SmartContext;
}

export interface SmartComponent extends Element {
  [LAST_CONTEXT]?: SmartContext;
  [META]?: Map<SmartComponentDefinition, { abortController?: AbortController }>;
}

export interface SmartComponentCoreDefinition {
  selector: string;
  params?: Record<string, SmartDefinitionParam>;
  onConnect?: (container: SmartContainer, component: SmartComponent) => void;
  onContextUpdate?: (container: SmartContainer, component: SmartComponent, context: SmartContext) => void;
  onDisconnect?: (container: SmartContainer, component: SmartComponent) => void;
}

export interface SmartComponentDefinition {
  selector: string;
  params: Record<string, SmartDefinitionParam>;
  onContextUpdate: (args: OnContextUpdateArgs) => void | Promise<void>;
}

export interface SmartDefinitionParam<TypeHint = unknown> {
  type: TypeHint;
  optional?: boolean;
}

export type SmartContext = Record<string, any>;

export type OnEventCallback = (type: string, listener: (detail: any) => void) => void;

export type UpdateComponentCallback<T = unknown> = (propertyName: string, property: CallbackOrObject<T>) => void;

export interface OnContextUpdateArgs {
  container: SmartContainer;
  component: SmartComponent;
  context: SmartContext;
  signal: AbortSignal;
  onEvent: OnEventCallback;
  updateComponent: UpdateComponentCallback;
}

export type CallbackOrObject<T = unknown> = T | ((property: T) => void);
