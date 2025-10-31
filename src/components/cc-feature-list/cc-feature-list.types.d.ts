export type FeatureListState = FeatureListStateLoaded | FeatureListStateLoading | FeatureListStateError;

type FeatureStatus = 'alpha' | 'beta' | 'preview' | '';

export interface Feature {
  id: string;
  name: string;
  description: string;
  options: { label: string; value: string }[];
  value: string;
  status: FeatureStatus;
  documentationLink: string;
  feedbackLink: string;
}

export interface FeatureListStateLoaded {
  type: 'loaded';
  features: Feature[];
}

export interface FeatureListStateLoading {
  type: 'loading';
}

export interface FeatureListStateError {
  type: 'error';
}
