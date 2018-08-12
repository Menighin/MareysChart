import MareysAnchorPoint from "./MareysAnchorPoint";

'use strict';

const MOUSE_DISTANCE_TOLERANCE = 4;

class MareysTrain {

    get id() { return this._id; }
    set id(id) { this._id = id; }

    get group()      { return this._group; }
    set group(group) { this._group = group; }

    get label()      { return this._label; }
    set label(label) { this._label = label; }

    get schedule()         { return this._schedule; }
    set schedule(schedule) { this._schedule = schedule; }

    /** @property {Array.<{x, y}>} - List of points*/
    get points()       { return this._points ? this._points : this._calculatePoints(); }
    set points(points) { this._points = points; }

    /** @property {Object} - points as a dictionary [x, y] */
    get pointsDict() { return this._pointsDict ? this._pointsDict : this._calculatePointsDict(); }
    set pointsDict(pointsDict) { this._pointsDict = pointsDict}

    get anchorPoints()            { return this._achorPoints ? this._anchorPoints : this._calculateAnchorPoints(); }
    set anchorPoints(achorPoints) { this._achorPoints = achorPoints; }

    constructor(chart, id, group, label, schedule) {
        this.chart = chart;
        this.options = chart.options;
        this.id = id;
        this.group = group;
        this.label = label;
        this.schedule = schedule.sort((a, b) => a.time - b.time);
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

        // Drawing anchor points
        if (lastSelectedTrainId) {
            trainsById[lastSelectedTrainId]._drawAnchorPoints();
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
     * Draw the anchor points for this train
     */
    _drawAnchorPoints() {
        let ctx = this.chart.canvas.ctx;

        // Draw the not active anchor points
        ctx.beginPath();
        ctx.fillStyle = 'cyan';
        this.anchorPoints.filter(a => !a.isActive).forEach(a => a.draw(ctx));
        ctx.fill();

        // Draw the active anchor points
        ctx.beginPath();
        ctx.fillStyle = 'green';
        this.anchorPoints.filter(a => a.isActive).forEach(a => a.draw(ctx));
        ctx.fill();
    }

    /**
     * Draws this train's lines
     */
    _drawLine() {
        let ctx = this.chart.canvas.ctx;

        // Defining coordinates of points
        let points = this.points;
       
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
        let points = this.points;

        // Drawing dots
        points.forEach((p, i) => {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
        });
    }

    /**[
     * Turn this train's schedule into points to be drawn and store it
     * This should be calculated just once for each train and then saved for performance reasons
     * @param {Boolean} [force = false] - If this should be calculated whether it already has a value or not
     * @returns {Array} - Calculated points
     */
    _calculatePoints(force = false) {
        if (!this._points || force) {
            let axis = this.chart.axis;

            // Defining coordinates of points
            this._points = [];
            this.schedule.forEach(s => {
                this._points.push({
                    x: Math.round(axis.drawing.area.x1 + axis.drawing.xFactor * s.time.diffMinutesWith(axis.timeWindow.start)), 
                    y: Math.round(axis.drawing.area.y1 + axis.drawing.yFactor * s.dist)
                });
            });
        }

        return this._points;
    }

    /**
     * Construct a dictionary of points [x, y] for this train
     * Useful for lookpus O(1)
     * @param {Boolean} [force = false] - If this should be calculated whether it already has a value or not
     */
    _calculatePointsDict(force = false) {
        if (!this._pointsDict || force) {
            let points = this.points;

            this._pointsDict = {};
            points.forEach(p => this._pointsDict[p.x] = p.y);
        }

        return this._pointsDict;
    }

    _calculateAnchorPoints(force = false) {

        if (!this._anchorPoints || force) {
            let axis = this.chart.axis;
            this._anchorPoints = [];
            for (let i = 0; i < this.schedule.length - 1; i++) {
                
                // Define the points of the line
                let p1 = { 
                    x: this.schedule[i].time,
                    xMillis: this.schedule[i].time.getTime(),
                    y: this.schedule[i].dist
                };

                let p2 = {
                    x: this.schedule[i + 1].time,
                    xMillis: this.schedule[i + 1].time.getTime(),
                    y: this.schedule[i + 1].dist
                };

                // Calculating the line equation
                let slope = (p2.y - p1.y) / (p2.xMillis - p1.xMillis);

                let lineEquation = (x) => slope * (x - p1.x) + p1.y;

                // Calculates for every 15 minutes the position of the anchor
                let fifteenMinutes = 1000 * 60 * 15;

                let timeToCheck = p1.xMillis;
                
                if (timeToCheck % fifteenMinutes !== 0)
                    timeToCheck = p1.xMillis + (fifteenMinutes - p1.xMillis % fifteenMinutes);

                while (timeToCheck <= p2.xMillis) {
                    let datetime = new Date(timeToCheck);
                    let dist = lineEquation(timeToCheck);
                    let x = Math.round(axis.drawing.area.x1 + axis.drawing.xFactor * datetime.diffMinutesWith(axis.timeWindow.start));
                    let y = Math.round(axis.drawing.area.y1 + axis.drawing.yFactor * dist);

                    this._anchorPoints.push(new MareysAnchorPoint(
                        this.id,
                        x,
                        y,
                        datetime,
                        dist,
                        this.pointsDict[x] && this.pointsDict[x] === y 
                    ));

                    timeToCheck += fifteenMinutes;
                }
            }
        }

        return this._anchorPoints;
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
        let points = this.points;

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