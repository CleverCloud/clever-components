import { Zone } from '@clevercloud/client/cc-api-commands/zone/zone.types.js';

export type CcAddonHeaderState =
  | CcAddonHeaderStateLoading
  | CcAddonHeaderStateLoaded
  | CcAddonHeaderStateError
  | CcAddonHeaderStateRestarting
  | CcAddonHeaderStateRebuilding;

export interface AddonHeaderBaseProperties {
  providerId: string;
  providerLogoUrl: string;
  name: string;
  id: string;
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
  configLink?: {
    href: string;
    fileName: string;
  };
  zone?: Zone;
}

interface OpenLink {
  url: string;
  name: string;
}

export type DeploymentStatus = 'deploying' | 'active' | 'failed' | 'deleted';

export interface CcAddonHeaderStateLoading extends OptionalProperties {
  type: 'loading';
}

export interface CcAddonHeaderStateLoaded extends AddonHeaderBaseProperties, OptionalProperties {
  type: 'loaded';
}

export interface CcAddonHeaderStateError {
  type: 'error';
}

export interface CcAddonHeaderStateRestarting extends AddonHeaderBaseProperties, OptionalProperties {
  type: 'restarting';
}

export interface CcAddonHeaderStateRebuilding extends AddonHeaderBaseProperties, OptionalProperties {
  type: 'rebuilding';
}

export type Addon = AddonHeaderBaseProperties & OptionalProperties;
