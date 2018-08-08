import Hammer from 'hammerjs';
import Utils from './Utils';

class InteractionModule {

    constructor(id, chart) {
        this.canvas = document.querySelector(`#${id}`);
        this.chart = chart;
        this.hammer = new Hammer(this.canvas);
        this.drag = {};
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
            this.chart.scale -= 1;
        }
    }


    onDragStart(evt) {
        this.drag.pointer = this.getPointer(evt.center);
        this.drag.initialTranslation = Object.assign({}, this.chart.translation);
    }

    onDrag(evt) {
        let pointer = this.getPointer(evt.center);

        let diffX = pointer.x - this.drag.pointer.x;
        let diffY = pointer.y - this.drag.pointer.y;

        this.chart.translation = {x:this.drag.initialTranslation.x + diffX, y:this.drag.initialTranslation.y + diffY};
    }

    onDragEnd(evt) {

    }


    /**
    * Get the pointer location from a touch location
    * @param {{x: number, y: number}} touch
    * @return {{x: number, y: number}} pointer
    * @private
    */
    getPointer(touch) {
        return {
            x: touch.x - Utils.getAbsoluteLeft(this.canvas),
            y: touch.y - Utils.getAbsoluteTop(this.canvas)
        };
    }

}


export default InteractionModule;