'user strict';

const STATION_FONTS = '12px Lucida Console';
const STROKE_COLOR = '#ccc';
const STROKE_COLOR_HIGHLIGHT = '#aaa';
const X_AXIS_HEIGHT = 60;
const Y_AXIS_WIDTH_PAN = 20;
const Y_AXIS_LEFT_MARGIN = 5;
const Y_AXIS_TOP_MARGIN = 15;
const X_AXIS_MARGIN_TOP = 15;

/** Class to deal with drawing the axis and calculating the drawing area and drawing factors */
class MareysAxis {

    get timeWindow()           { return this._timeWindow; }
    set timeWindow(timeWindow) { this._timeWindow = timeWindow; }

    /**
     *  @property {Object} drawing - Drawing object containing {area, xFactor, yFactor}
    */
    get drawing()        { return this._drawing; }
    set drawing(drawing) { this._drawing = drawing; }

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
        let height = this.chart.canvas.h;
        let width = this.chart.canvas.w;

        ctx.font = STATION_FONTS;
        this.largestStation = this.stations.reduce((previous, s) => {

            let station = { 
                label: s.label,
                width: ctx.measureText(s.label).width,
                length: s.label.length
            };

            return previous.width > station.width ? previous : station
        }, {length: 0, width: 0});

        this.drawing = {
            area: {
                y1: Y_AXIS_TOP_MARGIN - 3,
                y2: height + Y_AXIS_TOP_MARGIN - X_AXIS_HEIGHT - 3,
                x1: this.largestStation.width + Y_AXIS_WIDTH_PAN,
                x2: width
            },
        };
        this.drawing.xFactor = (this.drawing.area.x2 - this.drawing.area.x1) / this.timeWindow.totalMinutes;
        this.drawing.yFactor = (this.drawing.area.y2 - this.drawing.area.y1) / this.stations.last().dist;
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

        ctx.font = STATION_FONTS;
        ctx.lineWidth = 1;
        ctx.strokeStyle = STROKE_COLOR;

        ctx.beginPath();
        this.chart.data.stations.forEach(s => {

            let y = Math.round(Y_AXIS_TOP_MARGIN + s.dist * this.drawing.yFactor);
            
            // Draw label
            ctx.fillText(s.label, Y_AXIS_LEFT_MARGIN, y);

            // Draw the horizontal lines for station
            ctx.moveTo(this.drawing.area.x1, y - 3);
            ctx.lineTo(this.drawing.area.x2, y - 3);
        });

        ctx.stroke();
    }

    /**
     * Draw the X Axis, the time axis
     */
    _drawTime() {
        let ctx = this.chart.canvas.ctx;

        let startDate = this.timeWindow.start;

        ctx.font = STATION_FONTS;

        let lines = [];
        let highlightLines = [];

        // Generating lines & drawing labels
        for (let i = 0; i <= this.timeWindow.totalMinutes; i++) {

            let x = Math.round(this.largestStation.width + Y_AXIS_WIDTH_PAN + i * this.drawing.xFactor);

            if (i % 15 == 0 && i % 60 !== 0) {
                lines.push({
                    x1: x,
                    y1: this.drawing.area.y2,
                    x2: x,
                    y2: this.drawing.area.y1
                });
            }

            if (i % 60 === 0) {
                highlightLines.push({
                    x1: x,
                    y1: this.drawing.area.y2,
                    x2: x,
                    y2: this.drawing.area.y1
                });
            }

            // Draw labels
            if (i > 0 && i % 60 == 0) {
                let label = startDate.toMareysAxisString();
                let labelWidth = ctx.measureText(label).width;
                ctx.fillText(label, x - labelWidth / 2, this.drawing.area.y2 + X_AXIS_MARGIN_TOP);
            }

            startDate = startDate.addMinutes(1);
        }

        // Drawing grid
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = STROKE_COLOR;
        lines.forEach(l => {
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
        });
        ctx.stroke();

        // Drawing highlithed grid
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = STROKE_COLOR_HIGHLIGHT;
        highlightLines.forEach(l => {
            ctx.moveTo(l.x1, l.y1);
            ctx.lineTo(l.x2, l.y2);
        });
        ctx.stroke();

    }

}

export default MareysAxis;