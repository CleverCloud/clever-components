interface Metric {
  // Timestamp in ms
  timestamp: number,
  // Value is a percentage (e.g: '14.02')
  value: string,
}

interface MetricsData {
  cpuData: Metric[];
  memData: Metric[];
}

interface TileMetricsStateLoading {
  state: 'loading';
}

interface TileMetricsStateError {
  state: 'error';
}

interface TileMetricsStateEmpty {
  state: 'empty';
}

interface TileMetricsStateLoaded {
  state: 'loaded';
  value: MetricsData;
}

export type TileMetricsState = TileMetricsStateLoading | TileMetricsStateError | TileMetricsStateLoaded | TileMetricsStateEmpty;
