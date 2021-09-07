/*
Copyright (c) 2014, Vladimir Agafonkin
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// Original source at https://github.com/Leaflet/Leaflet.heat/blob/gh-pages/src/HeatLayer.js

import { Bounds, Browser, DomUtil, Layer, point, setOptions, Util } from './leaflet-esm.js';
import { Simpleheat } from './simpleheat.js';

export const HeatLayer = Layer.extend({

  initialize (latlngs, options) {
    this._latlngs = latlngs;
    setOptions(this, options);
  },

  setLatLngs (latlngs) {
    this._latlngs = latlngs;
    return this.redraw();
  },

  addLatLng (latlng) {
    this._latlngs.push(latlng);
    return this.redraw();
  },

  setOptions (options) {
    setOptions(this, options);
    if (this._heat) {
      this._updateOptions();
    }
    return this.redraw();
  },

  redraw () {
    if (this._heat && !this._frame && this._map && !this._map._animating) {
      this._frame = Util.requestAnimFrame(this._redraw, this);
    }
    return this;
  },

  onAdd (map) {
    this._map = map;

    if (!this._canvas) {
      this._initCanvas();
    }

    if (this.options.pane) {
      this.getPane().appendChild(this._canvas);
    }
    else {
      map._panes.overlayPane.appendChild(this._canvas);
    }

    map.on('moveend', this._reset, this);

    if (map.options.zoomAnimation && Browser.any3d) {
      map.on('zoomanim', this._animateZoom, this);
    }

    this._reset();
  },

  onRemove (map) {
    if (this.options.pane) {
      this.getPane().removeChild(this._canvas);
    }
    else {
      map.getPanes().overlayPane.removeChild(this._canvas);
    }

    map.off('moveend', this._reset, this);

    if (map.options.zoomAnimation) {
      map.off('zoomanim', this._animateZoom, this);
    }
  },

  addTo (map) {
    map.addLayer(this);
    return this;
  },

  _initCanvas () {
    const canvas = this._canvas = DomUtil.create('canvas', 'leaflet-heatmap-layer leaflet-layer');

    const originProp = DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    canvas.style[originProp] = '50% 50%';

    const size = this._map.getSize();
    canvas.width = size.x;
    canvas.height = size.y;

    const animated = this._map.options.zoomAnimation && Browser.any3d;
    DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));

    this._heat = new Simpleheat(canvas);
    this._updateOptions();
  },

  _updateOptions () {
    this._heat.radius(this.options.radius ?? this._heat.defaultRadius, this.options.blur);

    if (this.options.gradient) {
      this._heat.gradient(this.options.gradient);
    }
    if (this.options.max) {
      this._heat.max(this.options.max);
    }
  },

  _reset () {
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    DomUtil.setPosition(this._canvas, topLeft);

    const size = this._map.getSize();

    if (this._heat._width !== size.x) {
      this._canvas.width = this._heat._width = size.x;
    }
    if (this._heat._height !== size.y) {
      this._canvas.height = this._heat._height = size.y;
    }

    this._redraw();
  },

  _redraw () {
    if (!this._map) {
      return;
    }

    const data = [];
    const r = this._heat._r;
    const size = this._map.getSize();
    const bounds = new Bounds(point([-r, -r]), size.add([r, r]));
    const max = (this.options.max == null) ? 1 : this.options.max;
    const maxZoom = (this.options.maxZoom == null) ? this._map.getMaxZoom() : this.options.maxZoom;
    const v = 1 / Math.pow(2, Math.max(0, Math.min(maxZoom - this._map.getZoom(), 12)));
    const cellSize = r / 2;
    const grid = [];
    const panePos = this._map._getMapPanePos();
    const offsetX = panePos.x % cellSize;
    const offsetY = panePos.y % cellSize;

    let i;
    let len;
    let p;
    let cell;
    let x;
    let y;
    let j;
    let len2;
    let k;

    for (i = 0, len = this._latlngs.length; i < len; i++) {
      p = this._map.latLngToContainerPoint(this._latlngs[i]);
      if (bounds.contains(p)) {
        x = Math.floor((p.x - offsetX) / cellSize) + 2;
        y = Math.floor((p.y - offsetY) / cellSize) + 2;

        const alt = this._getAlt(i);
        k = alt * v;

        grid[y] = grid[y] || [];
        cell = grid[y][x];

        if (!cell) {
          grid[y][x] = [p.x, p.y, k];
        }
        else {
          // x
          cell[0] = (cell[0] * cell[2] + p.x * k) / (cell[2] + k);
          // y
          cell[1] = (cell[1] * cell[2] + p.y * k) / (cell[2] + k);
          // cumulated intensity value
          cell[2] += k;
        }
      }
    }

    for (i = 0, len = grid.length; i < len; i++) {
      if (grid[i]) {
        for (j = 0, len2 = grid[i].length; j < len2; j++) {
          cell = grid[i][j];
          if (cell) {
            data.push([
              Math.round(cell[0]),
              Math.round(cell[1]),
              Math.min(cell[2], max),
            ]);
          }
        }
      }
    }

    this._heat.data(data).draw(this.options.minOpacity);

    this._frame = null;
  },

  _getAlt (i) {
    if (this._latlngs[i].alt != null) {
      return this._latlngs[i].alt;
    }
    if (this._latlngs[i][2] != null) {
      return +this._latlngs[i][2];
    }
    return 1;
  },

  _animateZoom (e) {
    const scale = this._map.getZoomScale(e.zoom);
    const offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(this._map._getMapPanePos());
    DomUtil.setTransform(this._canvas, offset, scale);
  },
});
