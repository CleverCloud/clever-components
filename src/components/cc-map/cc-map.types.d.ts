import { Marker, PointExpression } from 'src/lib/leaflet/leaflet-esm.js';
import { Point } from '../common.types.js';

export interface CachedPoint {
  point: Point;
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
