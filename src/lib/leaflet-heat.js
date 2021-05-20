// This import will setup the global object "L" representing Leaflet
import './leaflet-pre-heat.js';
// This import will use the global object "L" and add the "heatLayer" function on it
import 'leaflet.heat';

// And now we can "properly" export the "heatLayer" function
export const leafletHeatLayer = globalThis.L.heatLayer;
