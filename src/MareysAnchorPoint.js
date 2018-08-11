'use strict';

/**
 * Represents an anchor point that can be dragged on a train line
 */
class MareysAnchorPoint {
    
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

    constructor(trainId, x, y, dist, time) {
        this.trainId = trainId;
        this.x = x;
        this.y = y;
        this.dist = dist;
        this.time = time;
    }
}

export default MareysAnchorPoint;