import { AddonPlan, AddonProvider, Zone } from '../common.types.js';

export type CcHeaderAddonBetaState =
  | CcHeaderAddonBetaStateLoading
  | CcHeaderAddonBetaStateLoaded
  | CcHeaderAddonBetaStateError;

export interface CcHeaderAddonBetaStateLoading extends OptionalProperties {
  type: 'loading';
}

export interface CcHeaderAddonBetaStateLoaded extends OptionalProperties {
  type: 'loaded';
  providerName: string;
  providerLogoUrl: string;
  name: string;
  id: string;
  zone: Zone;
}

interface OptionalProperties {
  logsUrl?: string;
  openLinks?: Array<OpenLink>;
  actions?: {
    restart: boolean;
    rebuildAndRestart: boolean;
  };
}

interface OpenLink {
  url: string;
  name: string;
}

export interface CcHeaderAddonBetaStateError {
  type: 'error';
}

// We only need 'start' and 'restart'?
export type LastUserAction = 'start' | 'restart' | 'cancel' | 'stop';

export interface RawAddon {
  id: string;
  name: string;
  realId: string;
  region: string;
  zoneId: string;
  provider: AddonProvider;
  plan: AddonPlan;
  creationDate: number;
  configKeys: string[];
}
