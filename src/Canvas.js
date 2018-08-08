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
        return (x - this.chart.view.translation.x) / this.chart.view.scale;
    }

    /**
     * Convert the X coordinate in canvas-space (the simulation sandbox, which the camera looks upon) to
     * the X coordinate in DOM-space (coordinate point in browser relative to the container div)
     * @param {number} x
     * @returns {number}
     * @private
     */
    _XconvertCanvasToDOM(x) {
        return x * this.chart.view.scale + this.chart.view.translation.x;
    }

    /**
     * Convert the Y coordinate in DOM-space (coordinate point in browser relative to the container div) to
     * the Y coordinate in canvas-space (the simulation sandbox, which the camera looks upon)
     * @param {number} y
     * @returns {number}
     * @private
     */
    _YconvertDOMtoCanvas(y) {
        return (y - this.chart.view.translation.y) / this.chart.view.scale;
    }

    /**
     * Convert the Y coordinate in canvas-space (the simulation sandbox, which the camera looks upon) to
     * the Y coordinate in DOM-space (coordinate point in browser relative to the container div)
     * @param {number} y
     * @returns {number}
     * @private
     */
    _YconvertCanvasToDOM(y) {
        return y * this.chart.view.scale + this.chart.view.translation.y;
    }


    /**
     * @param {point} pos
     * @returns {point}
     */
    canvasToDOM (pos) {
        return {x: this._XconvertCanvasToDOM(pos.x), y: this._YconvertCanvasToDOM(pos.y)};
    }

    /**
     *
     * @param {point} pos
     * @returns {point}
     */
    DOMtoCanvas (pos) {
        return {x: this._XconvertDOMtoCanvas(pos.x), y: this._YconvertDOMtoCanvas(pos.y)};
    }

}

export default Canvas;