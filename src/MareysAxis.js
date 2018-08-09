'user strict';

class MareysAxis {

    constructor(id, mareysChart) {
        this.div = id;
        this.chart = mareysChart;
    }

    draw() {
        this._drawStations();
    }

    _drawStations() {
        let ctx = this.chart.canvas.ctx;

        ctx.font = "12px Arial";
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#aaa';
        
        let heightNeeded = this.chart.data.stations.length * 30;

        let x = 5;
        let y = 15;

        this.chart.data.stations.forEach(s => {
            ctx.fillText(s.label, x, y);

            let textWidth = ctx.measureText(s.label).width;

            ctx.beginPath();
            ctx.moveTo(textWidth + 15, y - 3);
            ctx.lineTo(this.chart.canvas.w, y - 3);
            ctx.stroke();

            y += 30;
        });
    }
}

export default MareysAxis;