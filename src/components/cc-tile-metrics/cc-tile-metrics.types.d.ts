export type TileMetricsMetricsState = TileMetricsMetricsStateLoading | TileMetricsMetricsStateError | TileMetricsMetricsStateLoaded | TileMetricsMetricsStateEmpty;

export interface TileMetricsMetricsStateLoaded {
  type: 'loaded';
  metricsData: MetricsData;
}

export interface TileMetricsMetricsStateLoading {
  type: 'loading';
}

export interface TileMetricsMetricsStateError {
  type: 'error';
}

export interface TileMetricsMetricsStateEmpty {
  type: 'empty';
}

export interface Metric {
  // Timestamp in ms
  timestamp: number;
  // Value is a percentage (e.g: 14.02)
  value: number;
}

export interface MetricsData {
  cpuMetrics: Metric[];
  memMetrics: Metric[];
}

export type TileMetricsGrafanaLinkState = TileMetricsGrafanaLinkStateLoaded | TileMetricsGrafanaLinkStateLoading;

export interface TileMetricsGrafanaLinkStateLoaded {
  type: 'loaded';
  link: string;
}

export interface TileMetricsGrafanaLinkStateLoading {
  type: 'loading';
}

// this is what we retrieve directly from the API
export interface RawMetric {
  data: { timestamp: number, value: string }[],
  name: 'mem' | 'cpu', 
  resource: string, 
  unit: string,
}
