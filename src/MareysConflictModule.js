'use strict';

import MareysTrain from './MareysTrain';

/**
 * Responsible for calculating, drawing and interacting with conflict points
 */
class MareysConflictModule {

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
                        return {
                            t1: t1.id,
                            t2: t2.id,
                            time: c.time,
                            dist: c.dist,
                            x: this.chart.axis.valueToXAxis(c.time),
                            y: this.chart.axis.valueToYAxis(c.dist)
                        };
                    });

                    // Saving conflicts by train
                    conflictsByTrainId[t1.id][t2.id] = conflictsByTrainId[t1.id][t2.id].concat(conflictsPoints);
                    conflictsByTrainId[t2.id][t1.id] = conflictsByTrainId[t2.id][t1.id].concat(conflictsPoints);

                    // Counting conflicts by point
                    conflictsPoints.forEach(c => {
                        let pointId = `${c.x}-${c.y}`;
                        if (!conflictsByPoint[pointId])
                            conflictsByPoint[pointId] = [];
                        conflictsByPoint[pointId].push(c);
                    });
                }
            }
        }

        // Filtering out points that are not really conflicts 
        // due to train lines rules
        Object.keys(conflictsByPoint).forEach(pointId => {
            let c = conflictsByPoint[pointId].first();
            
            // Finding the conflict rule for to see if this is a conflict indeed
            // e.g.: having crossing points in two-way tracks are ok
            let conflictRule = 1; // Default: one line only
            for(let i = 0; i < this.chart.trainLines.length; i++) {
                let line = this.chart.trainLines[i];
                if (c.dist >= line.from && c.dist <= line.to) {
                    conflictRule = line.nLines;
                    break;
                }
            }
            
            // If the conflict rule says it's ok to have this conflict,
            // delete it from the list of conflicts
            if (conflictsByPoint[pointId].length < conflictRule)
                delete conflictsByPoint[pointId];
            else {
                // console.log(conflictsByPoint[pointId]);
                // console.log(`Rule: ${conflictRule} | Conflicts: ${conflictsByPoint[pointId].length}`);
                // console.log("-------------");
            }

        });
        
        this.conflictsByTrainId = conflictsByTrainId;
        this.conflictsByPoint = conflictsByPoint;
    }

    /**
     * Draw the conflict points
     */
    draw() {
        let ctx = this.chart.canvas.ctx;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';

        Object.keys(this.conflictsByPoint).forEach(pointId => {
            let conflict = this.conflictsByPoint[pointId].first();
            ctx.moveTo(conflict.x, conflict.y);
            ctx.arc(conflict.x, conflict.y, 10, 0, 2 * Math.PI);
        });

        ctx.fill();
    }



}

export default MareysConflictModule;