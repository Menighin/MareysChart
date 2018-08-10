import MareysChart from "./MareysChart";

'use strict';

class MareysTrain {

    constructor(chart, id, group, label, schedule) {
        this.chart = chart;
        this.id = id;
        this.group = group;
        this.label = label;
        this.schedule = schedule.sort((a, b) => a.time - b.time);
        this.points = undefined; // This is calculated after and stored
    }

    /**
     * Cast a list of trains, passed as input to this component,
     * into a list of MareysTrain
     * @param train list of trains {id, group, label, schedule}
     * @returns {Array.<MareysTrain>}
     */
    static castToMareysTrains(chart, trains) {
        let mareysTrains = [];

        trains.forEach(t => {
            mareysTrains.push(new MareysTrain(chart, t.id, t.group, t.label, t.schedule));
        });

        return mareysTrains;
    }

    /**
     * Static method to draw all the lines and dots of trains
     * @param {MareysChart} chart 
     * @param {Array.<MareysTrain>} trains 
     */
    static drawTrains(chart, trains) {
        let ctx = chart.canvas.ctx;

        // Drawing trains
        // Drawing lines
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'tomato';
        trains.forEach(t => {
            t._drawLine();
        });
        ctx.stroke();

        // Drawing dots
        ctx.beginPath();
        ctx.fillStyle = '#e5593f';
        trains.forEach(t => {
            t._drawDot();
        });
        ctx.fill();
    }

    /**
     * Draws this train's lines
     */
    _drawLine() {
        let ctx = this.chart.canvas.ctx;

        // Defining coordinates of points
        let points = this._getPointsToDraw();
       
        // Drawing line
        ctx.moveTo(points[0].x, points[0].y);

        points.forEach((p, i) => {
            if (i == 0) return;

            ctx.lineTo(p.x, p.y);
        });
    }

    /**
     * Draw this train's dots
     */
    _drawDot() {
        let ctx = this.chart.canvas.ctx;
        ctx.fillStyle = '#e5593f';

        // Defining coordinates of points
        let points = this._getPointsToDraw();

        // Drawing dots
        points.forEach((p, i) => {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        });
    }

    /**
     * Turn this train's schedule into points to be drawn
     * This should be calculated just once for each train and then saved for performance reasons
     * @returns {Array.<{x, y>}} Points
     */
    _getPointsToDraw() {
        if (!this.points) {
            let axis = this.chart.axis;

            // Defining coordinates of points
            this.points = [];
            this.schedule.forEach(s => {
                this.points.push({
                    x: Math.round(axis.drawing.area.x1 + axis.drawing.xFactor * s.time.diffMinutesWith(axis.timeWindow.start)), 
                    y: Math.round(axis.drawing.area.y1 + axis.drawing.yFactor * s.dist)
                });
            });
        }

        return this.points;
    }


    intersectsWith(point) {
        
    }

}

export default MareysTrain;