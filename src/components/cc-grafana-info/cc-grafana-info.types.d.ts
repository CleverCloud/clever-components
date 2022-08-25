export type GrafanaErrorType = "loading" | "link-grafana" | false;

export type GrafanaStatusType = "enabled" | "disabled" | null;

export type GrafanaWaitingType = "resetting" | "disabling" | "enabling" | false;

export interface Statistics {
  privateActiveUsers: number,
  publicActiveUsers: number,
  storage: number,
  price: number,
}
