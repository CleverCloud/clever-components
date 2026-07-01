export type FeatureListState = FeatureListStateLoaded | FeatureListStateLoading | FeatureListStateError;

export type FeatureStatus = 'alpha' | 'beta' | 'preview';

export type FeatureDisplayMode = 'toggle' | 'select';

export interface Feature {
  id: string;
  name: string;
  description: string;
  options: { label: string; value: string }[];
  value: string;
  /** Defaults to `'toggle'`. Use `'select'` when there are too many options to display them as a toggle. */
  displayMode?: FeatureDisplayMode;
  status?: FeatureStatus;
  documentationLink?: string;
  feedbackLink?: string;
}

export interface FeatureListStateLoaded {
  type: 'loaded';
  featureList: Feature[];
}

export interface FeatureListStateLoading {
  type: 'loading';
}

export interface FeatureListStateError {
  type: 'error';
}
