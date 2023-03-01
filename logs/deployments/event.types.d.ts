export interface DeploymentEvent {
  applicationId: string,
  deploymentId: string,
  instanceId: string,
  instanceType: 'run' | 'build',
  timestamp: number,
  step: string,
  phase: 'start' | 'end' | 'info',
  code?: string,
  args?: Object,
}

export type ScenarioEntry = Omit<DeploymentEvent, 'applicationId' | 'deploymentId' | 'instanceId' | 'instanceType' | 'timestamp'>;

export type LogEventNodeType = 'step' | 'info';

export interface LogEventNode {
  name: string,
  path: string,
  level: number,
  type: LogEventNodeType,
}

export interface StepNode extends LogEventNode {
  type: 'step',
  startEvent: DeploymentEvent,
  endEvent?: DeploymentEvent,
  children: Array<LogEventNode>,
}

export interface InfoNode extends LogEventNode {
  type: 'info',
  event: DeploymentEvent,
}
