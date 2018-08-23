'user strict';

class CanvasRenderer {

    constructor(id, chart) {
        this.canvas = document.querySelector(`#${id}`);
        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;
        this.chart = chart;
        this.drawing = false;
    }

    initDrawing() {
        this._draw();
    }

    _draw() {
        if (!this.drawing) {
            this.drawing = true;

            let ctx = this.chart.canvas.ctx;

            ctx.clearRect(0, 0, this.w, this.h);

            ctx.save();
            ctx.translate(this.chart.camera.translation.x, this.chart.camera.translation.y);
            ctx.scale(this.chart.camera.scale, this.chart.camera.scale);

            this.chart.draw();

            ctx.restore();
            this.drawing = false;
            requestAnimationFrame(this._draw.bind(this));
        }
    }

}

export default CanvasRenderer;