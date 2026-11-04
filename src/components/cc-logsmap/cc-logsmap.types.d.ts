export interface PointsOptions {
  spreadDuration?: boolean | number; // Spread points appearance over a time window (in ms)
}

export interface LogsmapPoint {
  lat: number; // Latitude
  lon: number; // Longitude
  count?: number; // Number of occurrences for this location (default: 1)
  delay?: number; // How long the point needs to stay (in ms), (default: 1000)
  tooltip?: string; // Tooltip when the point is hovered
}

export interface DisplayedLogsmapPoint {
  lat: number;
  lon: number;
  count: number;
  tooltip?: string;
}
