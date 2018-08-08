import Hammer from 'hammerjs';

class InteractionModule {

    constructor(id, chart) {
        this.canvas = document.querySelector(`#${id}`);
        this.chart = chart;
        this.hammer = new Hammer(this.canvas);
        this._bindEvents();
    }

    _bindEvents() {
        this.canvas.addEventListener('mousewheel', (evt) => {this.onMouseWheel(evt)});

        this.hammer.on('panstart',  (event) => {this.onDragStart(event)});
        this.hammer.on('panmove',   (event) => {this.onDrag(event)});
        this.hammer.on('panend',    (event) => {this.onDragEnd(event)});
    }

    onMouseWheel(evt) {
        if (evt.wheelDelta > 0) {
            this.chart.scale++;
        }
        else if (evt.wheelDelta < 0) {
            this.chart.scale -= 0.1;
        }
    }

    onDragStart(evt) {

    }

    onDrag(evt) {

    }

    onDragend(evt) {

    }


    /**
    * Get the pointer location from a touch location
    * @param {{x: number, y: number}} touch
    * @return {{x: number, y: number}} pointer
    * @private
    */
    getPointer(touch) {
        return {
            x: touch.x - util.getAbsoluteLeft(this.canvas.frame.canvas),
            y: touch.y - util.getAbsoluteTop(this.canvas.frame.canvas)
        };
    }

}


export default InteractionModule;