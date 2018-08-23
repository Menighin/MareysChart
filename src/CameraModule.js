'use strict';

class CameraModule {

    get scale()  { return this._scale; }
    set scale(s) { this._scale = s; }

    get translation()  { return this._translation; }
    set translation(t) { this._translation = t; }

    get viewport()  { return this._viewport; }
    set viewport(v) { this._viewport = v; }

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
        this.scale = 1;
        this.translation = {x: 0, y: 0};
        this.viewport = {w: this.div.clientWidth, h: this.div.clientHeight};
    }

}

export default CameraModule;