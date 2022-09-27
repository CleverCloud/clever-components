export interface SmartContainer<Context> {
  context: Context;
}

export interface SmartComponentDefinition<Component, Context> {
  onContextUpdate: (container: SmartContainer<Context>, component: Component, context: Context) => void
}
