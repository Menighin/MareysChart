
class MareysChart {

    constructor(container, stations, options) {
        this.container = container;
        this.stations = stations;
        this.options = options;
        this.canvas = document.querySelector(`#${container}`);
        this.ctx = this.canvas.getContext('2d');
        this.w = this.canvas.clientWidth;
        this.h = this.canvas.clientHeight;

        this.hammer = new Hammer(this.canvas);

        this.canvas.addEventListener('mousewheel', (evt) => {this.onMouseWheel(evt)});

        this.minStationHeight = 30;
        this.scale = 1;

        this._draw();

    }

    _draw() {

        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.scale(this.scale, this.scale);
        this.scale = 1;

        this._drawStations();

        requestAnimationFrame(this._draw.bind(this));
    }

    _drawStations() {
        let ctx = this.ctx;

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

    onMouseWheel(evt) {
        if (evt.wheelDelta > 0) {
            this.scale++;
        }
        else if (evt.wheelDelta < 0) {
            this.scale -= 0.1;
        }
    }

}