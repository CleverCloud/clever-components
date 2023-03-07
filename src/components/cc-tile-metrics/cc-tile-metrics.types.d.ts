interface Metric {
  // Timestamp in ms
  timestamp: number,
  // Value is a percentage (e.g: 14.02)
  value: number,
}

interface MetricsData {
  cpuData: Metric[];
  memData: Metric[];
}

interface MetricsStateLoading {
  state: 'loading';
}

interface MetricsStateError {
  state: 'error';
}

interface MetricsStateEmpty {
  state: 'empty';
}

interface MetricsStateLoaded {
  state: 'loaded';
  value: MetricsData;
}

export type MetricsState = MetricsStateLoading | MetricsStateError | MetricsStateLoaded | MetricsStateEmpty;
