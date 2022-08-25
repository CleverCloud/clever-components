export interface HeatmapPoint {
  lat: number,   // Latitude
  lon: number,   // Longitude
  count: number, // Number of occurences for this location
}

export interface Marker {
  tag: string,              // The HTML tag name used for the marker
  // Additional specific properties for the marker custom element.
}

export type MapModeType = "points" | "heatmap";

export type MarkerStateType = "default" | "hovered" | "selected";

export interface Point {
  lat: number,             // Latitude
  lon: number,             // Longitude
  count?: number,          // Number of occurences for this location (default: 1)
  delay?: number | string, // How long the point needs to stay (in ms), 'none' for a fixed point, (default: 1000)
  tooltip?: string,        // Tooltip when the point is hovered
  marker?: Marker,
}

export interface PointsOptions {
  spreadDuration?: boolean | number, // Spread points appearance over a time window (in ms)
}

export interface Tooltip {
  tag: string,              // The HTML tag name used for the tooltip
  // Additional specific properties for the tooltip custom element.
}

