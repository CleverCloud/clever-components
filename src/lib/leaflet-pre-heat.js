import { Bounds, Browser, DomUtil, Layer, point, setOptions } from './leaflet-esm.js';

// "leaflet.heat" requires Leaflet to be available as a global object named "L"
// It only needs those functions and classes
globalThis.L = { Layer, setOptions, DomUtil, Browser, point, Bounds };
