'use strict';

class Canvas {

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.ctx = this.div.getContext("2d");
        this.w = this.div.clientWidth;
        this.h = this.div.clientHeight;
        this.chart = chart;
    }

    /**
     * Convert the X coordinate in DOM-space (coordinate point in browser relative to the container div) to
     * the X coordinate in canvas-space (the simulation sandbox, which the camera looks upon)
     * @param {number} x
     * @returns {number}
     * @private
     */
    _XconvertDOMtoCanvas(x) {
        return (x - this.chart.camera.translation.x) / this.chart.camera.scale;
    }

    /**
     * Convert the X coordinate in canvas-space (the simulation sandbox, which the camera looks upon) to
     * the X coordinate in DOM-space (coordinate point in browser relative to the container div)
     * @param {number} x
     * @returns {number}
     * @private
     */
    _XconvertCanvasToDOM(x) {
        return x * this.chart.camera.scale + this.chart.camera.translation.x;
    }

    /**
     * Convert the Y coordinate in DOM-space (coordinate point in browser relative to the container div) to
     * the Y coordinate in canvas-space (the simulation sandbox, which the camera looks upon)
     * @param {number} y
     * @returns {number}
     * @private
     */
    _YconvertDOMtoCanvas(y) {
        return (y - this.chart.camera.translation.y) / this.chart.camera.scale;
    }

    /**
     * Convert the Y coordinate in canvas-space (the simulation sandbox, which the camera looks upon) to
     * the Y coordinate in DOM-space (coordinate point in browser relative to the container div)
     * @param {number} y
     * @returns {number}
     * @private
     */
    _YconvertCanvasToDOM(y) {
        return y * this.chart.camera.scale + this.chart.camera.translation.y;
    }

    /**
     * Converts a given point in the canvas to a point in DOM
     * @param {point} pos
     * @returns {point}
     */
    canvasToDOM(pos) {
        return {x: this._XconvertCanvasToDOM(pos.x), y: this._YconvertCanvasToDOM(pos.y)};
    }

    /**
     * Converts a given point in the DOM to a point in the canvas
     * @param {point} pos
     * @returns {point}
     */
    DOMtoCanvas(pos) {
        return {x: this._XconvertDOMtoCanvas(pos.x), y: this._YconvertDOMtoCanvas(pos.y)};
    }

    isPointVisible(point) {
        let domPoint = this.canvasToDOM(point);

        return domPoint.x >= 0 && domPoint.y >= 0 && domPoint.x <= this.chart.camera.viewport.w && domPoint.y <= this.chart.camera.viewport.h;
    }

}

export default Canvas;