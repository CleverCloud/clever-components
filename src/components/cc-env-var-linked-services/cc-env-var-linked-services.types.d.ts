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
  services: Array<LinkedService>;
}

interface EnvVarLinkedServicesStateError {
  type: 'error';
}

export type EnvVarLinkedServicesType = 'addon' | 'app';

export interface LinkedService {
  id: string;
  name: string;
  variables: Array<EnvVar>;
}
