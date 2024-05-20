import { Zone } from '../common.types.js';

export type AddonLinkedAppsState = AddonLinkedAppsStateLoading | AddonLinkedAppsStateLoaded | AddonLinkedAppsStateError;

export interface AddonLinkedAppsStateLoading {
  type: 'loading';
}

export interface AddonLinkedAppsStateLoaded {
  type: 'loaded';
  linkedApplications: Array<LinkedApplication>;
}

export interface AddonLinkedAppsStateError {
  type: 'error';
}

export interface LinkedApplication {
  name: string;
  link: string;
  variantName: string;
  variantLogoUrl: string;
  zone: Zone;
}
