export interface WebFeatures {
  baselineFeatures: Feature[];
  bcdFeatures: Feature[];
}

export interface Feature {
  featureId: string;
  requiredStatus: 'widely' | 'newly';
}

export interface BaselineFeatureData {
  baseline: {
    high_date: string;
    low_date: string;
    status: string;
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
      version_added?: string | false | null;
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

type BcdBrowserCompatInfo = {
  [Key in 'chrome' | 'firefox' | 'safari']: {
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
