import CanvasRenderer from './CanvasRenderer';
import InteractionModule from './InteractionModule';
import Canvas from './Canvas';
import View from './View';

'user strict';

class MareysChart {

    constructor(id, stations, options) {
        this.container = id;
        this.stations = stations;
        this.options = {
            interaction: {
                zoomSpeed: 1
            }
        };

        // Define canvas for this chart
        this.canvas = new Canvas(id, this);

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
        this._drawStations();
    }

    _drawStations() {
        let ctx = this.canvas.ctx;

        ctx.font = "12px Arial";
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#aaa';
        
        let heightNeeded = this.stations.length * 30;

        let x = 5;
        let y = 15;

        this.stations.forEach(s => {
            ctx.fillText(s.label, x, y);

            let textWidth = ctx.measureText(s.label).width;

            ctx.beginPath();
            ctx.moveTo(textWidth + 15, y - 3);
            ctx.lineTo(this.canvas.w, y - 3);
            ctx.stroke();

            y += 30;
        });

    }

    

}

export default MareysChart;