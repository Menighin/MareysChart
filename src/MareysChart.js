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

    constructor(id, stations, trains, options) {

        // Create the prototypes
        Prototypes.bind();

        this.div = id;

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

        // Define the view
        this.view = new View(id, this);

        // Define selection module to handle selections
        this.selectionModule = new SelectionModule(id, this);

        // Bind interactions
        this.interactionModule = new InteractionModule(id, this);

        // Initialize the canvas rendering
        this.canvasRenderer = new CanvasRenderer(id, this);

        // Start drawing
        this.canvasRenderer.initDrawing();
    }

    draw() {
        // Draw the axis
        this.axis.draw();

        // Draw the trains
        MareysTrain.drawTrains(this);
    } 

    /**
     * Handle the mouse move event with the hover effect
     * @param {Object} pointer 
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleMouseMove(pointer) {
        this.selectionModule.handleHoverEvent(pointer);
    }

    /**
     * Handle the mouse click event to select a train
     * @param {Object} pointer
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer  
     */
    handleMouseClick(pointer) {
        this.selectionModule.handleMouseClick(pointer);
    }
}

export default MareysChart;