import CanvasRenderer from './CanvasRenderer';
import InteractionModule from './InteractionModule';
import Canvas from './Canvas';
import View from './View';
import MareysAxis from './MareysAxis';
import Prototypes from './Prototypes';
import MareysTrain from './MareysTrain';

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
            trainsById: {}
        };

        this.data.trains.forEach(t => {
            this.data.trainsById[t.id] = t;
        });

        this.options = {
            interaction: {
                zoomSpeed: 1
            },
            timeWindow: {
                start: new Date(),
                end: new Date().addDays(1)
            }
        };
        this.options.timeWindow.totalMinutes = (this.options.timeWindow.end.getTime() - this.options.timeWindow.start.getTime()) / (1000 * 60);

        // Define canvas for this chart
        this.canvas = new Canvas(id, this);

        // Defining the axis
        this.axis = new MareysAxis(id, this);

        // Define the view
        this.view = new View(id, this);

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
        MareysTrain.drawTrains(this, this.data.trains);
    } 

    handleMouseMove() {

    }

}

export default MareysChart;