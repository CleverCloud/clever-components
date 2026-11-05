import { Marker, PointExpression } from 'src/lib/leaflet/leaflet-esm.js';

export interface MapPoint {
  // Optional identifier, sent back within the marker events
  name?: string;
  // Latitude
  lat: number;
  // Longitude
  lon: number;
  // Custom element used to display the marker
  marker: MapMarker;
  // Tooltip when the point is hovered: some text or a custom element
  tooltip?: string | MapTooltip | null;
  zIndexOffset?: number;
}

export interface MapMarker {
  // The HTML tag name used for the marker
  tag: string;
  // Additional specific properties for the marker custom element
  [p: string]: any;
}

export interface MapTooltip {
  // The HTML tag name used for the tooltip
  tag: string;
  // Additional specific properties for the tooltip custom element
  [p: string]: any;
}

export interface CachedPoint {
  point: MapPoint;
  marker: Marker & {
    tag?: string;
    tooltip?: string | { tag: string };
  };
  iconElement: MapIconElement;
}

export interface MapIconElement extends HTMLElement {
  size: PointExpression;
  anchor: PointExpression;
  tooltip: PointExpression;
}
