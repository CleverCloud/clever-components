export type WebFeaturesTrackerState =
  | WebFeaturesTrackerStateLoaded
  | WebFeaturesTrackerStateLoading
  | WebFeaturesTrackerStateError;

export interface WebFeaturesTrackerStateLoaded {
  type: 'loaded';
  webFeatures: FormattedFeature[];
}

type SkeletonWebFeature = Pick<
  FormattedFeature,
  'featureId' | 'featureName' | 'comment' | 'category' | 'canBeUsedWithPolyfill' | 'isProgressiveEnhancement'
>;

export interface WebFeaturesTrackerStateLoading {
  type: 'loading';
  webFeatures: SkeletonWebFeature[];
}

export interface WebFeaturesTrackerStateError {
  type: 'error';
}

export type FeatureStatus = 'widely' | 'newly' | 'limited';

export interface WebFeatures {
  baselineFeatures: FeatureJson[];
  bcdFeatures: FeatureJson[];
}

export interface FeatureJson {
  featureId: string;
  isProgressiveEnhancement: boolean;
  /** Set to true if this feature is not widely supported but its use is permitted if a polyfill is provided. */
  canBeUsedWithPolyfill: boolean;
  category: 'JS' | 'CSS' | 'HTML';
  comment?: string;
}

export interface FormattedFeature {
  featureId: string;
  featureName: string;
  currentStatus: FeatureStatus;
  isProgressiveEnhancement: boolean;
  /** Set to true if this feature is not widely supported but its use is permitted if a polyfill is provided. */
  canBeUsedWithPolyfill: boolean;
  comment?: string;
  category: 'JS' | 'CSS' | 'HTML';
  canBeUsed: boolean;
  chromeSupport: BrowserSupported | BrowserUnsupported;
  firefoxSupport: BrowserSupported | BrowserUnsupported;
  safariSupport: BrowserSupported | BrowserUnsupported;
}

export interface BrowserSupported {
  isSupported: true;
  version: string;
  releaseDate: Date;
}

export interface BrowserUnsupported {
  isSupported: false;
}

export interface BaselineFeatureData {
  baseline: {
    high_date: string;
    low_date: string;
    status: 'widely' | 'newly' | 'limited';
  };
  browser_implementations: {
    chrome: {
      date: string;
      status: string;
      version: string;
    };
    edge: {
      date: string;
      status: string;
      version: string;
    };
    firefox: {
      date: string;
      status: string;
      version: string;
    };
    safari: {
      date: string;
      status: string;
      version: string;
    };
  };
  feature_id: string;
  name: string;
  spec: {
    links: {
      link: string;
    }[];
  };
  usage: {
    chromium: Record<string, any>;
  };
}

export interface BcdFeatureCompatInfo {
  description?: string;
  mdn_url?: string;
  spec_url?: string | string[];
  status?: {
    experimental: boolean;
    standard_track: boolean;
    deprecated: boolean;
  };
  support: {
    chrome?: {
      version_added: string | false;
      version_removed?: string;
      notes?: string;
      prefix?: string;
      alternative_name?: string;
      flags?: {
        type: string;
        name: string;
        value_to_set?: string;
      }[];
    };
    firefox?: {
      version_added?: string | false | null;
      version_removed?: string;
      notes?: string;
    };
    safari?: {
      version_added?: string | false | null;
      version_removed?: string;
      notes?: string;
    };
  };
}

type Browser = 'chrome' | 'firefox' | 'safari';

export type BcdBrowserInfo = {
  [Key in Browser]: {
    name: string;
    type: string;
    accepts_flags: boolean;
    accepts_webextensions: boolean;
    releases: {
      [version: string]: {
        release_date: string;
        release_notes: string;
        status: string;
      };
    };
  };
};
