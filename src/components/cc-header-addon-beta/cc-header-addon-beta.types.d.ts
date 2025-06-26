import { Addon, AddonPlan, AddonProvider } from '../common.types.js';

export type CcHeaderAddonBetaState = CcHeaderAddonBetaStateLoaded | CcHeaderAddonBetaStateError;

export interface CcHeaderAddonBetaStateLoaded extends Addon {
  type: 'loaded';
}

export interface CcHeaderAddonBetaStateError {
  type: 'error';
}

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
