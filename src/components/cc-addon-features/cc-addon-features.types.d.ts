import { IconModel } from '../common.types.js';

export type AddonFeaturesState = AddonFeaturesStateLoaded | AddonFeaturesStateLoading | AddonFeaturesStateError;

export interface AddonFeature {
  name: string;
  value: string;
}

export interface AddonFeaturesStateLoaded {
  type: 'loaded';
  features: AddonFeature[];
}

export interface AddonFeaturesStateLoading {
  type: 'loading';
}

export interface AddonFeaturesStateError {
  type: 'error';
}

export interface AddonFeatureWithIcon extends AddonFeature {
  icon?: IconModel;
}
