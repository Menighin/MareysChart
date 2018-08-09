'user strict';

const STATION_FONTS = "12px Lucida Console";
const X_AXIS_HEIGHT = 60;
const Y_AXIS_WIDTH_PAN = 20;
const Y_AXIS_LEFT_MARGIN = 5;
const Y_AXIS_TOP_MARGIN = 15;

class MareysAxis {

    constructor(id, mareysChart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = mareysChart;
        this.stations = mareysChart.data.stations;
        this.timeWindow = mareysChart.options.timeWindow;

        // Processing some properties that need to be calculated only once
        this._calculateHelpers();
    }

    /**
     * Initialize and recalculate properties that will be used to draw
     * but doesn't need to be calculated on every frame
     */
    _calculateHelpers() {
        let ctx = this.div.getContext('2d');
        ctx.font = STATION_FONTS;
        this.largestStation = this.stations.reduce((previous, s) => {

            let station = { 
                label: s.label,
                width: ctx.measureText(s.label).width,
                length: s.label.length
            };

            return previous.width > station.width ? previous : station
        }, {length: 0, width: 0});
    }


    draw() {
        this._drawStations();
        this._drawTime();
    }

    /**
     * Draw the Y Axis, the stations
     */
    _drawStations() {
        let ctx = this.chart.canvas.ctx;
        let width = this.chart.canvas.w;
        let maxDist = this.stations.last().dist;
        var drawingArea = this._getGridDrawingArea();
        let yFactor = (drawingArea.y2 - drawingArea.y1) / maxDist;


        ctx.font = STATION_FONTS;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#aaa';

        this.chart.data.stations.forEach(s => {

            let y = Y_AXIS_TOP_MARGIN + s.dist * yFactor;
            
            // Draw label
            ctx.fillText(s.label, Y_AXIS_LEFT_MARGIN, y);

            // Draw the horizontal lines for station
            ctx.beginPath();
            ctx.moveTo(this.largestStation.width + Y_AXIS_WIDTH_PAN, y - 3);
            ctx.lineTo(drawingArea.x2, y - 3);
            ctx.stroke();
        });
    }

    /**
     * Draw the X Axis, the time axis
     */
    _drawTime() {
        let ctx = this.chart.canvas.ctx;
        let timeWindow = this.timeWindow;
        let totalMinutes = (timeWindow.end.getTime() - timeWindow.start.getTime()) / (1000 * 60) / 15;
        let height = this.chart.canvas.h - X_AXIS_HEIGHT;
        let width = this.chart.canvas.w;
        var drawingArea = this._getGridDrawingArea();
        let xFactor = (drawingArea.x2 - drawingArea.x1) / totalMinutes;

        for (let i = 0; i <= totalMinutes; i++) {
            
            let x = this.largestStation.width + Y_AXIS_WIDTH_PAN + i * xFactor;

            // Draw vertical lines
            ctx.beginPath();
            ctx.moveTo(x, height + Y_AXIS_TOP_MARGIN - 3)
            ctx.lineTo(x, Y_AXIS_TOP_MARGIN - 3);
            ctx.stroke();

        }
    }

    _getGridDrawingArea() {
        let height = this.chart.canvas.h;
        let width = this.chart.canvas.w;

        return {
            y1: Y_AXIS_TOP_MARGIN - 3,
            y2: height + Y_AXIS_TOP_MARGIN - X_AXIS_HEIGHT - 3,
            x1: this.largestStation.width + Y_AXIS_WIDTH_PAN,
            x2: width
        }
    }
}

export default MareysAxis;