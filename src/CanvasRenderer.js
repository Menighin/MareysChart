'user strict';

class CanvasRenderer {

    constructor(id, chart) {
        this.canvas = document.querySelector(`#${id}`);
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;
        this.chart = chart;
    }

    initDrawing() {
        this._draw();
    }

    _draw() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        this.ctx.save();
        this.ctx.scale(this.chart.scale, this.chart.scale);
        this.ctx.translate(this.chart.translation.x, this.chart.translation.y);

        // console.log(this.chart.scale);

        this.chart.draw();

        this.ctx.restore();
        requestAnimationFrame(this._draw.bind(this));
    }

}


export default CanvasRenderer;