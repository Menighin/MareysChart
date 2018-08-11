import Hammer from 'hammerjs';
import Utils from './Utils';

class InteractionModule {

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
        this.hammer = new Hammer(this.div);
        this.drag = {};
        this.touch = {};
        this.mousePos = {};
        this._bindEvents();
    }

    _bindEvents() {

        this.div.addEventListener('mousewheel',  (event) => {this.onMouseWheel(event)});
        this.div.addEventListener('mousemove',   (event) => {this.onMouseMove(event)});
        this.div.addEventListener('mouseclick',  (event) => {this.onMouseClick(event)});

        this.hammer.on('hammer.input', (event) => {this.onTouch(event)});
        this.hammer.on('panstart',     (event) => {this.onDragStart(event)});
        this.hammer.on('panmove',      (event) => {this.onDrag(event)});
        this.hammer.on('panend',       (event) => {this.onDragEnd(event)});
        this.hammer.on('tap',          (event) => {this.onMouseClick(event)});
        
    }

    /**
     * On start of a touch gesture, store the pointer
     * @param {Event}  evt   The event
     * @private
     */
    onTouch(evt) {
        if (evt.isFirst) {
            let pointer = this.getPointer(evt.center);
            let canvasPointer = this.chart.canvas.DOMtoCanvas(pointer);
            this.touch.pointer = pointer;
            this.touch.canvasPointer = canvasPointer;
        }
    }

    /**
     * Handler for mouse move event
     * @param {Event} evt 
     */
    onMouseMove(evt) {
        let pointer = this.getPointer({x:event.clientX, y:event.clientY});
        let canvasPos = this.chart.canvas.DOMtoCanvas(pointer);
        this.mousePos = {
            client: pointer,
            canvas: canvasPos
        };

        this.chart.handleMouseMove(this.mousePos);
    }

    /**
     * Handler for mouse click event
     * @param {Event} evt 
     */
    onMouseClick(evt) {
        let pointer = this.getPointer(evt.center);
        let canvasPos = this.chart.canvas.DOMtoCanvas(pointer);
        let clickPos = {
            client: pointer,
            canvas: canvasPos
        };

        this.chart.handleMouseClick(clickPos);
    }

    /**
     * Handler for mouse wheel
     * @param {Event} evt 
     */
    onMouseWheel(evt) {
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

    /**
     * Set the view scale according to mouse wheel
     * @param {Number} scale 
     * @param {Object} pointer 
     */
    zoom(scale, pointer) {

        let scaleOld = this.chart.view.scale;
        if (scale < 0.00001) {
            scale = 0.00001;
        }
        if (scale > 10) {
            scale = 10;
        }

        let preScaleDragPointer = undefined;
        if (this.drag !== undefined) {
            if (this.drag.dragging === true) {
                preScaleDragPointer = this.canvas.DOMtoCanvas(this.touch.pointer);
            }
        }

        let translation = this.chart.view.translation;

        let scaleFrac = scale / scaleOld;
        let tx = (1 - scaleFrac) * pointer.x + translation.x * scaleFrac;
        let ty = (1 - scaleFrac) * pointer.y + translation.y * scaleFrac;

        this.chart.view.scale = scale;
        this.chart.view.translation = {x:tx, y:ty};

        if (preScaleDragPointer != undefined) {
            let postScaleDragPointer = this.canvas.canvasToDOM(preScaleDragPointer);
            this.touch.pointer.x = postScaleDragPointer.x;
            this.touch.pointer.y = postScaleDragPointer.y;
        }

    }

    /**
     * Handler for start drag event
     * @param {Event} evt 
     */
    onDragStart(evt) {
        this.drag.initialTranslation = Object.assign({}, this.chart.view.translation);
        this.drag.dragging = true;
    }

    /**
     * Handler for drag event
     * @param {Event} evt 
     */
    onDrag(evt) {
        let pointer = this.getPointer(evt.center);
        let diff =  {
            x: pointer.x - this.touch.pointer.x,
            y: pointer.y - this.touch.pointer.y
        };

        this.chart.canvas.DOMtoCanvas(pointer)

        this.chart.view.translation = {x:this.drag.initialTranslation.x + diff.x, y:this.drag.initialTranslation.y + diff.y};
    }

    /**
     * Handler for dragEnd event
     * @param {Event} evt 
     */
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