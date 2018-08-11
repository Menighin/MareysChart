'use strict';

const MOUSE_DISTANCE_TOLERANCE = 4;

class MareysTrain {

    constructor(chart, id, group, label, schedule) {
        this.chart = chart;
        this.options = chart.options;
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
     * @param {MareysChart} chart - The MareysChart instance
     */
    static drawTrains(chart) {
        let ctx = chart.canvas.ctx;
        let trains = chart.data.trains;
        let selectionOptions = chart.options.selection;
        let trainsById = chart.data.trainsById;
        let hoveredTrainId = chart.selectionModule.hoveredTrainId;
        let selectedTrainsIds = chart.selectionModule.selectedTrainsIds;
        let lastSelectedTrainId = selectedTrainsIds ? selectedTrainsIds.last() : undefined;

        // Drawing trains
        // Drawing commom lines
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = selectedTrainsIds ? selectionOptions.selectDimColor : 'tomato';
        trains.forEach(t => {
            if (t.id != hoveredTrainId && t.id != lastSelectedTrainId)
                t._drawLine();
        });
        ctx.stroke();
        
        // Drawing hover lines
        if (hoveredTrainId) {
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = selectionOptions.hoverColor;
            trainsById[hoveredTrainId]._drawLine();
            ctx.stroke();
        }
        
        // Drawing selected train
        if (lastSelectedTrainId) {
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = selectionOptions.selectColor;
            trainsById[lastSelectedTrainId]._drawLine();
            ctx.stroke();
        }
        // Drawing dots
        // ctx.beginPath();
        // ctx.fillStyle = '#e5593f';
        // trains.forEach(t => {
        //     t._drawDot();
        // });
        // ctx.fill();
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

    _linePointNearestMouse(line, x, y) {
        let lerp = (a, b, x) => a + x * (b - a);
        let dx = line.x2 - line.x1;
        let dy = line.y2 - line.y1;
        let t = ((x - line.x1) * dx + (y - line.y1) * dy) / (dx * dx + dy * dy);
        let lineX = lerp(line.x1, line.x2, t);
        let lineY = lerp(line.y1, line.y2, t);
        return { x: lineX, y: lineY };
    };

    /**
     * Returns whether the giving pointer is intersecting with a train line or not
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Boolean} - If the train is intersecting with the pointer or not
     */
    intersectsWith(pointer) {
        let points = this._getPointsToDraw();

        if (points.length <= 1) return false;

        for (let i = 0; i < points.length - 1; i++) {

            let line = {
                x1: points[i].x,
                y1: points[i].y,
                x2: points[i + 1].x,
                y2: points[i + 1].y
            };

            if(pointer.canvas.x < line.x1 || pointer.canvas.x > line.x2) {
                continue;
            }

            let linePoint = this._linePointNearestMouse(line, pointer.canvas.x, pointer.canvas.y);
            let dx = pointer.canvas.x - linePoint.x;
            let dy = pointer.canvas.y - linePoint.y;
            let distance = Math.abs(Math.sqrt(dx * dx + dy * dy));

            if (distance <= MOUSE_DISTANCE_TOLERANCE) return true;
        }

        return false;

    }

}

export default MareysTrain;