'user strict';

class CanvasRenderer {

    constructor(id, chart) {
        this.canvas = document.querySelector(`#${id}`);
        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;
        this.chart = chart;
    }

    initDrawing() {
        this._draw();
    }

    _draw() {
        let ctx = this.chart.canvas.ctx;

        ctx.clearRect(0, 0, this.w, this.h);

        ctx.save();
        ctx.scale(this.chart.view.scale, this.chart.view.scale);
        ctx.translate(this.chart.view.translation.x, this.chart.view.translation.y);

        // console.log(this.chart.scale);

        this.chart.draw();

        ctx.restore();
        requestAnimationFrame(this._draw.bind(this));
    }

}


export default CanvasRenderer;