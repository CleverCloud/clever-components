import { EnvVar } from '../common.types.js';

export type EnvVarLinkedServicesState =
  | EnvVarLinkedServicesStateLoading
  | EnvVarLinkedServicesStateLoaded
  | EnvVarLinkedServicesStateError;

interface EnvVarLinkedServicesStateLoading {
  type: 'loading';
}

interface EnvVarLinkedServicesStateLoaded {
  type: 'loaded';
  servicesStates: Array<LinkedServiceState>;
}

interface EnvVarLinkedServicesStateError {
  type: 'error';
}

type EnvVarLinkedServicesType = 'addon' | 'app';

export type LinkedServiceState = LinkedServiceStateLoading | LinkedServiceStateLoaded | LinkedServiceStateError;

interface LinkedServiceStateLoading {
  type: 'loading';
  name: string;
}

export interface LinkedServiceStateLoaded {
  type: 'loaded';
  name: string;
  variables: Array<EnvVar>;
}

interface LinkedServiceStateError {
  type: 'error';
  name: string;
}
