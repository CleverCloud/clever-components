/*
Copyright (c) 2015, Vladimir Agafonkin
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

// Original source at https://github.com/mourner/simpleheat/blob/gh-pages/simpleheat.js

const DEFAULT_RADIUS = 25;

const DEFAULT_GRADIENT = {
  0.4: 'blue',
  0.6: 'cyan',
  0.7: 'lime',
  0.8: 'yellow',
  1.0: 'red',
};

export class Simpleheat {

  constructor (canvas) {

    this._canvas = canvas = (typeof canvas === 'string') ? document.getElementById(canvas) : canvas;

    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;

    this._max = 1;
    this._data = [];
  }

  data (data) {
    this._data = data;
    return this;
  }

  max (max) {
    this._max = max;
    return this;
  }

  add (point) {
    this._data.push(point);
    return this;
  }

  clear () {
    this._data = [];
    return this;
  }

  radius (r, blur = 15) {

    // create a grayscale blurred circle image that we'll use for drawing points
    const circle = this._circle = this._createCanvas();
    const ctx = circle.getContext('2d');
    const r2 = this._r = r + blur;

    circle.width = circle.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = 'black';

    ctx.beginPath();
    ctx.arc(-r2, -r2, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  }

  resize () {
    this._width = this._canvas.width;
    this._height = this._canvas.height;
  }

  gradient (grad) {
    // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
    const canvas = this._createCanvas();
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (const i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this._grad = ctx.getImageData(0, 0, 1, 256).data;

    return this;
  }

  draw (minOpacity) {
    if (!this._circle) {
      this.radius(DEFAULT_RADIUS);
    }
    if (!this._grad) {
      this.gradient(DEFAULT_GRADIENT);
    }

    const ctx = this._ctx;

    ctx.clearRect(0, 0, this._width, this._height);

    // draw a grayscale heatmap by putting a blurred circle at each data point
    for (let i = 0, len = this._data.length, p; i < len; i++) {
      p = this._data[i];
      ctx.globalAlpha = Math.min(Math.max(p[2] / this._max, minOpacity === undefined ? 0.05 : minOpacity), 1);
      ctx.drawImage(this._circle, p[0] - this._r, p[1] - this._r);
    }

    // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
    const colored = ctx.getImageData(0, 0, this._width, this._height);
    this._colorize(colored.data, this._grad);
    ctx.putImageData(colored, 0, 0);

    return this;
  }

  _colorize (pixels, gradient) {
    let j;
    for (let i = 0; i < pixels.length; i += 4) {
      // get gradient color from opacity value
      j = pixels[i + 3] * 4;

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  }

  _createCanvas () {
    if (typeof document !== 'undefined') {
      return document.createElement('canvas');
    }
    else {
      // create a new canvas instance in node.js
      // the canvas class needs to have a default constructor without any parameter
      return new this._canvas.constructor();
    }
  }
}
