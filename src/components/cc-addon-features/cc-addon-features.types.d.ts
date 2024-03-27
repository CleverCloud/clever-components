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
