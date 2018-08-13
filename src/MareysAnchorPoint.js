import Utils from "./Utils";

'use strict';

const ANCHOR_POINT_RADIUS = 3;

/**
 * Represents an anchor point that can be dragged on a train line
 */
class MareysAnchorPoint {
    
    get id()   { return this._id; }
    set id(id) { this._id = id; }

    get trainId()        { return this._trainId; }
    set trainId(trainId) { this._trainId = trainId; }
    
    get x()  { return this._x; }
    set x(x) { this._x = x; }
    
    get y()  { return this._y; }
    set y(y) { this._y = y; }
    
    get dist()     { return this._dist; }
    set dist(dist) { this._dist = dist; }
    
    get time()     { return this._time; }
    set time(time) { this._time = time; }

    get isActive()         { return this._isActive; }
    set isActive(isActive) { this._isActive = isActive; }

    constructor(trainId, x, y, time, dist, isActive = false) {
        this.id = `${trainId}-${x}-${y}`;
        this.trainId = trainId;
        this.x = x;
        this.y = y;
        this.dist = dist;
        this.time = time;
        this.isActive = isActive;
    }

    /**
     * Draws this anchor point on the context passed
     * @param {Object} ctx - The c ontext to be drawn
     */
    draw(ctx) {
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, ANCHOR_POINT_RADIUS, 0, 2 * Math.PI);
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
        return distToPoint <= ANCHOR_POINT_RADIUS + 3;
    }
}

export default MareysAnchorPoint;