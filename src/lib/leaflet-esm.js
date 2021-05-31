/*

We want to use the ESM version of Leaflet so we can treeshake what we don't use.
When we tried that, we discovered that some parts of the code we need were removed by the treeshaking process.

We did a lot of experiments and we discovered that some modules inside Leaflet have side effects.

Take a look at `node_modules/leaflet/src/layer/Tooltip.js` for example.
You will notice that this module exports the `Tooltip` class and the `tooltip` function.
But below that, there are a few calls that have side effects.
Calling `SomeClass.include()` actually patch `SomeClass` to add new methods.
This is described in `node_modules/leaflet/src/core/Class.js`.
The class `Class` has other methods like this one that will patch the original class.

In our use case, it seems like we're missing:

* zoom controls
* tooltips
* the `getRenderer` function but we're not sure why

This is why we import them explicitly here.
This is also why we have special rules in `rollup/rollup-common.js` at `treeshakeOptions` for those files.

*/

import 'leaflet/src/control/index.js';
import 'leaflet/src/layer/vector/Renderer.getRenderer.js';
import 'leaflet/src/layer/Tooltip.js';

export * from 'leaflet/src/Leaflet.js';
export { HeatLayer } from './leaflet-heat.js';
