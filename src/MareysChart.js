import CanvasRenderer from './CanvasRenderer';
import InteractionModule from './InteractionModule';
import Canvas from './Canvas';
import View from './View';
import MareysAxis from './MareysAxis';
import Prototypes from './Prototypes';
import MareysTrain from './MareysTrain';
import SelectionModule from './SelectionModule';

'user strict';

class MareysChart {

    get data() { return this._data; }
    set data(data) { this._data = data; }
    
    get trainLines() { return this._trainLines; }
    set trainLines(trainLines) { this._trainLines = trainLines; }

    get options() { return this._options; }
    set options(o) { this._options = o; }

    get conflictsByTrainId() { return this._conflictsByTrainId; }
    set conflictsByTrainId(cbti) { this._conflictsByTrainId = cbti; }

    get conflictsByPoint() { return this._conflictsByPoint; }
    set conflictsByPoint(count) { this._conflictsByPoint = count; }

    constructor(id, stations, trains, trainLines, options) {

        // Create the prototypes
        Prototypes.bind();

        // Creating the data object
        this.data = {
            stations: stations.sort((a, b) => a.dist - b.dist),
            trains: MareysTrain.castToMareysTrains(this, trains),
            trainsById: {},
            anchorPoints: [],
            hoverTrainId: undefined,
            selectedTrainIds: undefined
        };

        this.data.trains.forEach(t => {
            this.data.trainsById[t.id] = t;
        });

        let fifteenMinutes = 1000 * 60 * 15;

        let start = new Date();
        start = new Date(start.getTime() - 1000 * 60 * 60 * 12);

        if (start.getTime() % fifteenMinutes !== 0)
            start = new Date(start.getTime() + (fifteenMinutes - start.getTime() % fifteenMinutes));

        let end = new Date(start.getTime() + 1000 * 60 * 60 * 24);

        this.options = {
            interaction: {
                zoomSpeed: 1
            },
            timeWindow: {
                start: start,
                end: end
            },
            selection: {
                hoverColor: '#BADA55',
                selectColor: 'deepskyblue',
                selectDimColor: '#ccc'
            }
        };
        this.options.timeWindow.totalMinutes = (this.options.timeWindow.end.getTime() - this.options.timeWindow.start.getTime()) / (1000 * 60);
        
        // Define canvas for this chart
        this.canvas = new Canvas(id, this);
        
        // Defining the axis
        this.axis = new MareysAxis(id, this);
        
        // Save the train lines for conflict rules
        this.trainLines = trainLines
            .sort((a, b) => a.from - b.from)
            .map(line => {
                return {
                    from: line.from,
                    to: line.to,
                    nLines: line.nLines,
                    fromY: this.axis.valueToYAxis(line.from),
                    toY: this.axis.valueToYAxis(line.to)
                }
            });

        // Define the view
        this.view = new View(id, this);

        // Define selection module to handle selections
        this.selectionModule = new SelectionModule(id, this);

        // Bind interactions
        this.interactionModule = new InteractionModule(id, this);

        // Initialize the canvas rendering
        this.canvasRenderer = new CanvasRenderer(id, this);

        // Calculates the conflict points
        this._calculateConflictPoints();

        // Start drawing
        this.canvasRenderer.initDrawing();
    }

    draw() {
        // Draw the axis
        this.axis.draw();

        // Draw the trains
        MareysTrain.drawTrains(this);

        // Draw the conflicts
        this._drawConflicts();
    } 

    _drawConflicts() {
        let ctx = this.canvas.ctx;

        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';

        Object.keys(this.conflictsByPoint).forEach(pointId => {
            let conflict = this.conflictsByPoint[pointId].first();
            ctx.moveTo(conflict.x, conflict.y);
            ctx.arc(conflict.x, conflict.y, 10, 0, 2 * Math.PI);
        });

        ctx.fill();
    }

    /**
     * Handles the mouse move event with the hover effect
     * @param {Object} pointer 
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleMouseMove(pointer) {
        this.selectionModule.handleHoverEvent(pointer);
    }

    /**
     * Handles the mouse click event to select a train
     * @param {Object} pointer
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer  
     */
    handleMouseClick(pointer) {
        this.selectionModule.handleMouseClick(pointer);
    }

    /**
     * Handles the drag event
     * @param {Object} pointer
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer
     * @returns {Boolean} - Whether the chart handled the event or not  
     */
    handleDragEvent(pointer) {
        let elements = this.interactionModule.drag.elements;
        
        if (elements.anchorPoints.any()) {
            let anchorPoint = elements.anchorPoints.last();

            this.data.trainsById[anchorPoint.trainId].draggingAnchorPoint(anchorPoint, pointer);

            return true;
        }
        return false;
    }

    /**
     * Handles the drag end event
     * @param {Object} pointer
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer
     */
    handleDragEndEvent(pointer) {
        let elements = this.interactionModule.drag.elements;
        
        if (elements.anchorPoints.any()) {
            let anchorPoint = elements.anchorPoints.last();
            this.data.trainsById[anchorPoint.trainId].saveVirtualTrain(anchorPoint, pointer);
        }
    }

    /**
     * Calculates the conflict points in this Marey's Chart
     */
    _calculateConflictPoints() {
        let conflictsByTrainId = {};
        let conflictsByPoint = {};

        for (let i = 0; i < this.data.trains.length; i++) {
            for (let j = i + 1; j < this.data.trains.length; j++) {
                let t1 = this.data.trains[i];
                let t2 = this.data.trains[j];
                
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
                            x: this.axis.valueToXAxis(c.time),
                            y: this.axis.valueToYAxis(c.dist)
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
            for(let i = 0; i < this.trainLines.length; i++) {
                let line = this.trainLines[i];
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
                console.log(conflictsByPoint[pointId]);
                console.log(`Rule: ${conflictRule} | Conflicts: ${conflictsByPoint[pointId].length}`);
                console.log("-------------");
            }

        });
        
        this.conflictsByTrainId = conflictsByTrainId;
        this.conflictsByPoint = conflictsByPoint;
    }
}

export default MareysChart;