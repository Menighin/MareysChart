'use strict';

import MareysTrain from './MareysTrain';
import MareysConflictPoint from './MareysConflictPoint';
// import CONFLICT_RADIUS from './MareysConflictPoint';
const CONFLICT_RADIUS = 10;

/**
 * Responsible for calculating, drawing and interacting with conflict points
 */
class MareysConflictModule {

    get conflicts()  { return this._conflicts; }
    set conflicts(c) { this._conflicts = c; }

    get conflictsByTrainId() { return this._conflictsByTrainId; }
    set conflictsByTrainId(cbti) { this._conflictsByTrainId = cbti; }

    get conflictsByPoint() { return this._conflictsByPoint; }
    set conflictsByPoint(count) { this._conflictsByPoint = count; }

    constructor(chart) {

        this.chart = chart;

        // Calculate conflicts points
        this._calculateConflictPoints();
    }

    _cmp(x, y = 0.0, tol = -0.000000001) {
        return (x <= y + tol) ? (x + tol <= y) ? -1 : 0 : 1;
    }

    _cw(a, b, c) {
        return this._cmp((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) < 0;
    }

    _segmentIntercept(p1, p2, p3, p4) {
        return this._cw(p1, p2, p3) != this._cw(p1, p2, p4) && this._cw(p3, p4, p1) != this._cw(p3, p4, p2);
    }

    /**
     * Calculates the conflict points in this Marey's Chart
     */
    _calculateConflictPoints() {
        let conflictsByTrainId = {};
        let conflictsByPoint = {};
        const listTrains = this.chart.data.trains;

        console.time('conflitos');
        const segments = [];
        listTrains.forEach((train, j) => {
            conflictsByTrainId[train.id] = {}
            for(let i=0; i<train.schedule.length-1; i++) {
                let x1 = train.schedule[i].time.getTime();
                let x2 = train.schedule[i + 1].time.getTime();

                if(x1 < x2) {
                    segments.push({
                        p1: [x1, train.schedule[i].dist],
                        p2: [x2, train.schedule[i + 1].dist],
                        trainId: train.id
                    });
                }
                else {
                    segments.push({
                        p1: [x2, train.schedule[i].dist],
                        p2: [x1, train.schedule[i + 1].dist],
                        trainId: train.id
                    });
                }
            }
        });

        segments.sort((a, b) => {
            if(a.p1[0] == b.p1[0])
                return a.p2[0] < b.p2[0] ? -1 : 1;
            return a.p1[0] < b.p1[0] ? -1 : 1;
        });

        for(let i = 0; i < segments.length; i++) {
            for(let j = i+1; j < segments.length; j++) {
                if(segments[i].trainId === segments[j].trainId)
                    continue;

                if(segments[j].p1[0] > segments[i].p2[0])
                    break;
                if(this._segmentIntercept(segments[i].p1, segments[i].p2, segments[j].p1, segments[j].p2)) {
                    let slope1 = (segments[i].p2[1] - segments[i].p1[1]) / (segments[i].p2[0] - segments[i].p1[0]);
                    let slope2 = (segments[j].p2[1] - segments[j].p1[1]) / (segments[j].p2[0] - segments[j].p1[0]);
                    let line1Equation = (x) => slope1 * (x - segments[i].p1[0]) + segments[i].p1[1];

                    let conflictTime = ((slope1 * segments[i].p1[0] - slope2 * segments[j].p1[0] - segments[i].p1[1] + segments[j].p1[1]) / (slope1 - slope2));
                    let conflictDist = line1Equation(conflictTime);

                    let t1 = segments[i].trainId;
                    let t2 = segments[j].trainId;

                    // Safe checks for undefined
                    if (!conflictsByTrainId[t1])
                    conflictsByTrainId[t1] = {};

                    if (!conflictsByTrainId[t1][t2])
                        conflictsByTrainId[t1][t2] = [];
                        
                    if (!conflictsByTrainId[t2])
                        conflictsByTrainId[t2] = {};

                    if (!conflictsByTrainId[t2][t1])
                        conflictsByTrainId[t2][t1] = [];
                
                    let conflict = new MareysConflictPoint(this.chart, conflictTime, conflictDist, t1, t2);

                    // Saving conflicts by train
                    conflictsByTrainId[t1][t2].push(conflict);
                    conflictsByTrainId[t2][t1].push(conflict);

                    if (!conflictsByPoint[conflict.id])
                        conflictsByPoint[conflict.id] = conflict;
                    else
                        conflictsByPoint[conflict.id].addTrainId(conflict);
                }
            }
        }
        console.timeEnd('conflitos');


        console.time('conflitos2');
        // Filtering out points that are not really conflicts 
        // due to train lines rules
        Object.keys(conflictsByPoint).forEach(pointId => {
            let c = conflictsByPoint[pointId];
            
            // Finding the conflict rule for to see if this is a conflict indeed
            // e.g.: having crossing points in two-way tracks are ok
            let conflictRule = 1; // Default: one line only
            for(let i = 0; i < this.chart.trainLines.length; i++) {
                let line = this.chart.trainLines[i];
                if (c.distance >= line.from && c.distance <= line.to) {
                    conflictRule = line.nLines;
                    break;
                }
            }
            
            // If the conflict rule says it's ok to have this conflict,
            // delete it from the list of conflicts
            if (c.numConflicts <= conflictRule)
                delete conflictsByPoint[pointId];
            else {
                // console.log(conflictsByPoint[pointId]);
                // console.log(`Rule: ${conflictRule} | Conflicts: ${conflictsByPoint[pointId].length}`);
                // console.log("-------------");
            }

        });
        console.timeEnd('conflitos2');
        
        this.conflictsByTrainId = conflictsByTrainId;
        this.conflictsByPoint = conflictsByPoint;
        this.conflicts = Object.values(conflictsByPoint);
    }

    /**
     * Draw the conflict points
     */
    draw() {
        let ctx = this.chart.canvas.ctx;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';

        this.conflicts.forEach(conflict => {
            ctx.moveTo(conflict.x, conflict.y);
            ctx.arc(conflict.x, conflict.y, CONFLICT_RADIUS, 0, 2 * Math.PI);
        });

        ctx.fill();
    }

    /**
     * Returns a list of conflicts located on the pointer
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Array.<MareysConflictPoint>} - The trains that are on this coordinates
     */
    getConflictsAt(pointer) {

        if (!this.conflicts) return [];

        let result = [];

        this.conflicts.forEach(c => {
            if (c.isMouseOver(pointer))
                result.push(c);
        });
        
        return result;
    }
}

export default MareysConflictModule;