import { Zone } from "../common.types";

export type AddonLinkedAppsState = AddonLinkedAppsStateLoading | AddonLinkedAppsStateLoaded | AddonLinkedAppsStateError;

interface AddonLinkedAppsStateLoading {
  type: 'loading';
}

interface AddonLinkedAppsStateLoaded {
  type: 'loaded';
  linkedApplications: Array<LinkedApplication>;
}

interface AddonLinkedAppsStateError {
  type: 'error';
}

export interface LinkedApplication {
  name: string;
  link: string;
  variantName?: string;
  variantLogoUrl?: string;
  zone?: Zone;
}
