export type GrafanaInfoState = GrafanaInfoStateLoading | GrafanaInfoStateLoadingError | GrafanaInfoStateLoaded;

export interface GrafanaInfoStateLoading {
  type: 'loading';
}

export interface GrafanaInfoStateLoadingError {
  type: 'error';
}

export interface GrafanaInfoStateLoaded {
  type: 'loaded';
  info: GrafanaInfo;
}

export type GrafanaInfo = GrafanaInfoEnabled | GrafanaInfoDisabled;

export interface GrafanaInfoEnabled {
  status: 'enabled';
  link?: string;
  action?: 'disabling' | 'resetting' | null;
}

export interface GrafanaInfoDisabled {
  status: 'disabled';
  action?: 'enabling' | null;
}
