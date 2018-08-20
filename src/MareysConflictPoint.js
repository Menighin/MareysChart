'use strict';

import Utils from './Utils';

const CONFLICT_RADIUS = 10;

class MareysConflictPoint {

    get id()  { return this._id; }
    set id(i) { this._id = i; }

    get time()  { return this._time; }
    set time(t) { this._time = t; }

    get distance()  { return this._distance; }
    set distance(d) { this._distance = d; }

    get x()  { return this._x; }
    set x(x) { this._x = x; }

    get y()  { return this._y; }
    set y(y) { this._y = y; }
    
    get trainsIds()  { return this._trainsIds; }
    set trainsIds(t) { this._trainsIds = t; }

    get numConflicts() { return Object.keys(this._trainsIds).length; }

    constructor(chart, time, distance, t1, t2) {
        this.chart = chart;
        this.time = time;
        this.distance = distance;
        this.trainsIds = {};
        this.trainsIds[t1] = 1;
        this.trainsIds[t2] = 2;
        this.x = this.chart.axis.valueToXAxis(time);
        this.y = this.chart.axis.valueToYAxis(distance);

        this.id = `${this.x}-${this.y}`;
    }

    /**
     * Adds the given train ID to the list of trains conflicting
     * @param {String | MareysConflictPoint} id - The id of the train to be added or a whole MareysConflictPoint to be merged
     */
    addTrainId(id) {
        if (id instanceof MareysConflictPoint) {
            Object.keys(id.trainsIds).forEach(trainId => this.trainsIds[trainId] = 1);
        }
        else 
            this.trainsIds[id] = 1;
    }

    /**
     * Returns wheter the mouse is hovering this anchor point
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Boolean} - Whether mouse is hovering this point
     */
    isMouseOver(pointer) {
        let distToPoint = Utils.getDistanceBetweenPoints(pointer.canvas, {x: this.x, y: this.y});
        return distToPoint <= CONFLICT_RADIUS + 3;
    }

}

export default MareysConflictPoint;
