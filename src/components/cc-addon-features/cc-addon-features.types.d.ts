import {IconModel} from "../common.types";

export type AddonFeaturesState = AddonFeaturesStateLoaded | AddonFeaturesStateLoading | AddonFeaturesStateError;

interface AddonFeature {
  name: string;
  value: string;
}

interface AddonFeaturesStateLoaded {
  type: 'loaded';
  features: AddonFeature[];
}

interface AddonFeaturesStateLoading {
  type: 'loading';
}

interface AddonFeaturesStateError {
  type: 'error';
}

export interface AddonFeatureWithIcon extends AddonFeature {
  icon?: IconModel;
}
