export type GrafanaInfoState = GrafanaInfoStateLoading | GrafanaInfoStateLoadingError | GrafanaInfoStateLoaded;

interface GrafanaInfoStateLoading {
  type: "loading";
}

interface GrafanaInfoStateLoadingError {
  type: "error";
}

interface GrafanaInfoStateLoaded {
  type: "loaded";
  info: GrafanaInfo;
}

type GrafanaInfo = GrafanaInfoEnabled | GrafanaInfoEnabledWithError | GrafanaInfoDisabled;

interface GrafanaInfoEnabled {
  status: "enabled";
  link?: string;
  action?: "disabling" | "resetting";
}

interface GrafanaInfoEnabledWithError {
  status: "enabled";
}

interface GrafanaInfoDisabled {
  status: "disabled";
  action?: "enabling";
}
