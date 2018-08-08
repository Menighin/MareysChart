import CanvasRenderer from './CanvasRenderer';
import InteractionModule from './InteractionModule';

class MareysChart {

    constructor(id, stations, options) {
        this.container = id;
        this.stations = stations;
        this.options = options;
        this.scale = 1;

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
        let ctx = this.canvasRenderer.ctx;

        ctx.font = "12px Arial";
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#aaa';
        
        let heightNeeded = this.stations.length * this.minStationHeight;

        let x = 5;
        let y = 15;

        this.stations.forEach(s => {
            ctx.fillText(s.label, x, y);

            let textWidth = ctx.measureText(s.label).width;

            ctx.beginPath();
            ctx.moveTo(textWidth + 15, y - 3);
            ctx.lineTo(this.w, y - 3);
            ctx.stroke();

            y += this.minStationHeight;
        });

    }

    

}

export default MareysChart;