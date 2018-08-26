import CanvasRenderer from './CanvasRenderer';
import InteractionModule from './InteractionModule';
import Canvas from './Canvas';
import CameraModule from './CameraModule';
import MareysAxis from './MareysAxis';
import Prototypes from './Prototypes';
import MareysTrain from './MareysTrain';
import SelectionModule from './SelectionModule';
import Tooltip from './Tooltip';
import MareysConflictModule from './MareysConflictModule';

'user strict';

class MareysChart {

    get container() { return this._container; }
    set container(c) { this._container = c; }

    get data() { return this._data; }
    set data(data) { this._data = data; }
    
    get trainLines() { return this._trainLines; }
    set trainLines(trainLines) { this._trainLines = trainLines; }

    get options() { return this._options; }
    set options(o) { this._options = o; }

    constructor(id, stations, trains, trainLines, options) {
        this.container = document.getElementById(id);

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

        // Define the camera
        this.camera = new CameraModule(id, this);

        // Define selection module to handle selections
        this.selectionModule = new SelectionModule(id, this);

        // Bind interactions
        this.interactionModule = new InteractionModule(id, this);

        // Initialize the canvas rendering
        this.canvasRenderer = new CanvasRenderer(id, this);        

        // Initialize the conflict module
        this.conflictModule = new MareysConflictModule(this);

        // Creates the tooltip
        this.tooltip = new Tooltip(this);

        // Start drawing
        this.canvasRenderer.initDrawing();
    }

    draw() {
        // Draw the axis grid before drawing the trains
        this.axis.drawGrid();

        // Draw the trains
        MareysTrain.drawTrains(this);

        // Draw the axis on top in order to be alwas visible
        this.axis.drawAxis();

        // Draw the conflicts
        //this.conflictModule.draw();
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
}

export default MareysChart;