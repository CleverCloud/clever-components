import { ZoneStateLoaded } from '../cc-zone/cc-zone.types.js';
import { AddonPlan, AddonProvider } from '../common.types.js';

export type CcAddonHeaderState =
  | CcAddonHeaderStateLoading
  | CcAddonHeaderStateLoaded
  | CcAddonHeaderStateError
  | CcAddonHeaderStateRestarting
  | CcAddonHeaderStateRebuilding;

interface BaseProperties {
  providerId: string;
  providerLogoUrl: string;
  name: string;
  id: string;
  zone: ZoneStateLoaded;
}

interface OptionalProperties {
  logsUrl?: string;
  openLinks?: Array<OpenLink>;
  actions?: {
    restart: boolean;
    rebuildAndRestart: boolean;
  };
  productStatus?: string;
  deploymentStatus?: DeploymentStatus;
  configLink?: string;
}

interface OpenLink {
  url: string;
  name: string;
}

export type DeploymentStatus = 'deploying' | 'active' | 'failed';

export interface CcAddonHeaderStateLoading extends OptionalProperties {
  type: 'loading';
}

export interface CcAddonHeaderStateLoaded extends BaseProperties, OptionalProperties {
  type: 'loaded';
}

export interface CcAddonHeaderStateError {
  type: 'error';
}

export interface CcAddonHeaderStateRestarting extends BaseProperties, OptionalProperties {
  type: 'restarting';
}

export interface CcAddonHeaderStateRebuilding extends BaseProperties, OptionalProperties {
  type: 'rebuilding';
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

export type Addon = BaseProperties & OptionalProperties;
