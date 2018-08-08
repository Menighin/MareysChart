import Hammer from 'hammerjs';
import Utils from './Utils';

class InteractionModule {

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
        this.hammer = new Hammer(this.div);
        this.drag = {};
        this.touch = {};
        this._bindEvents();
    }

    _bindEvents() {
        this.div.addEventListener('mousewheel', (evt) => {this.onMouseWheel(evt)});

        this.hammer.on('hammer.input', (event) => {this.onTouch(event)});
        this.hammer.on('panstart',     (event) => {this.onDragStart(event)});
        this.hammer.on('panmove',      (event) => {this.onDrag(event)});
        this.hammer.on('panend',       (event) => {this.onDragEnd(event)});
        
    }

    /**
     * On start of a touch gesture, store the pointer
     * @param {Event}  evt   The event
     * @private
     */
    onTouch(evt) {
        if (evt.isFirst)
            this.touch.pointer = this.getPointer(evt.center);
    }

    onMouseWheel(evt) {
        let pointer = this.getPointer(this.div);

        let delta = 0;
        if (evt.wheelDelta) { /* IE/Opera. */
            delta = evt.wheelDelta / 120;
        }
        else if (evt.detail) { /* Mozilla case. */
            // In Mozilla, sign of delta is different than in IE.
            // Also, delta is multiple of 3.
            delta = -evt.detail / 3;
        }

        // If delta is nonzero, handle it.
        // Basically, delta is now positive if wheel was scrolled up,
        // and negative, if wheel was scrolled down.
        if (delta !== 0) {
            // calculate the new scale
            let scale = this.chart.view.scale;
            let zoom = delta * (this.chart.options.interaction.zoomSpeed / 10);
            if (delta < 0) {
                zoom = zoom / (1 - zoom);
            }
            scale *= (1 + zoom);

            // Calculate the pointer location
            let pointer = this.getPointer({x: evt.clientX, y: evt.clientY});

            // Apply the new scale
            this.zoom(scale, pointer);
        }

        // Prevent default actions caused by mouse wheel.
        event.preventDefault();
    }

    zoom(scale, pointer) {

        console.log(scale);
        console.log(pointer);
        console.log('---');

        let scaleOld = this.chart.view.scale;
        if (scale < 0.00001) {
            scale = 0.00001;
        }
        if (scale > 10) {
            scale = 10;
        }

        let translation = this.chart.view.translation;

        let scaleFrac = scale / scaleOld;
        let tx = (1 - scaleFrac) * pointer.x + translation.x * scaleFrac;
        let ty = (1 - scaleFrac) * pointer.y + translation.y * scaleFrac;

        this.chart.view.scale = scale;
        this.chart.view.translation = {x:tx, y:ty};

    }

    onDragStart(evt) {
        this.drag.initialTranslation = Object.assign({}, this.chart.view.translation);
        this.drag.dragging = true;
    }

    onDrag(evt) {
        let pointer = this.getPointer(evt.center);
        let diffX = pointer.x - this.touch.pointer.x;
        let diffY = pointer.y - this.touch.pointer.y;

        this.chart.view.translation = {x:this.drag.initialTranslation.x + diffX, y:this.drag.initialTranslation.y + diffY};
    }

    onDragEnd(evt) {
        this.drag.dragging = false;
    }


    /**
    * Get the pointer location from a touch location
    * @param {{x: number, y: number}} touch
    * @return {{x: number, y: number}} pointer
    * @private
    */
    getPointer(touch) {
        return {
            x: touch.x - Utils.getAbsoluteLeft(this.div),
            y: touch.y - Utils.getAbsoluteTop(this.div)
        };
    }

}


export default InteractionModule;