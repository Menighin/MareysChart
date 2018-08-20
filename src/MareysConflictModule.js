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

    /**
     * Calculates the conflict points in this Marey's Chart
     */
    _calculateConflictPoints() {
        let conflictsByTrainId = {};
        let conflictsByPoint = {};

        for (let i = 0; i < this.chart.data.trains.length; i++) {
            for (let j = i + 1; j < this.chart.data.trains.length; j++) {
                let t1 = this.chart.data.trains[i];
                let t2 = this.chart.data.trains[j];
                
                let conflicts = MareysTrain.getConflictsBetween(t1, t2);

                if (conflicts && conflicts.any()) {

                    // Safe checks for undefined
                    if (!conflictsByTrainId[t1.id])
                        conflictsByTrainId[t1.id] = {};

                    if (!conflictsByTrainId[t1.id][t2.id])
                        conflictsByTrainId[t1.id][t2.id] = [];
                        
                    if (!conflictsByTrainId[t2.id])
                        conflictsByTrainId[t2.id] = {};

                    if (!conflictsByTrainId[t2.id][t1.id])
                        conflictsByTrainId[t2.id][t1.id] = [];
                
                    // Calculating the plotting point
                    let conflictsPoints = conflicts.map(c => {
                        return new MareysConflictPoint(this.chart, c.time, c.dist, t1.id, t2.id);
                    });

                    // Saving conflicts by train
                    conflictsByTrainId[t1.id][t2.id] = conflictsByTrainId[t1.id][t2.id].concat(conflictsPoints);
                    conflictsByTrainId[t2.id][t1.id] = conflictsByTrainId[t2.id][t1.id].concat(conflictsPoints);

                    // Counting conflicts by point
                    conflictsPoints.forEach(c => {
                        let pointId = c.id;
                        if (!conflictsByPoint[pointId])
                            conflictsByPoint[pointId] = c;
                        else
                            conflictsByPoint[pointId].addTrainId(c);
                    });
                }
            }
        }

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
        let result = [];

        this.conflicts.forEach(c => {
            if (c.isMouseOver(pointer))
                result.push(c);
        });
        
        return result;
    }
}

export default MareysConflictModule;