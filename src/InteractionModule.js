import Hammer from 'hammerjs';
import Utils from './Utils';

class InteractionModule {

    get drag()     { return this._drag; }
    set drag(drag) { this._drag = drag; }

    get touch()      { return this._touch; }
    set touch(touch) { this._touch = touch; }

    get mousePos()         { return this._mousePos; }
    set mousePos(mousePos) { this._mousePos = mousePos; }

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
        this.hammer = new Hammer(this.div);
        this.hammer.add( new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }) );
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
            this.touch = this.getPointer(evt.center);
        }
    }

    /**
     * Handler for mouse move event
     * @param {Event} evt 
     */
    onMouseMove(evt) {
        if (!this.drag.dragging) {
            this.mousePos = this.getPointer({x:event.clientX, y:event.clientY});
            this.chart.handleMouseMove(this.mousePos);
        }
    }

    /**
     * Handler for mouse click event
     * @param {Event} evt 
     */
    onMouseClick(evt) {
        let pointer = this.getPointer(evt.center);
        this.chart.handleMouseClick(pointer);
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
            let scale = this.chart.camera.scale;
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

        let clientPointer = pointer.client;

        let scaleOld = this.chart.camera.scale;
        if (scale < 0.00001) {
            scale = 0.00001;
        }
        if (scale > 10) {
            scale = 10;
        }

        let translation = this.chart.camera.translation;

        let scaleFrac = scale / scaleOld;
        let tx = (1 - scaleFrac) * clientPointer.x + translation.x * scaleFrac;
        let ty = (1 - scaleFrac) * clientPointer.y + translation.y * scaleFrac;

        this.chart.camera.scale = scale;
        this.chart.camera.translation = {x:tx, y:ty};
    }

    /**
     * Handler for start drag event
     * @param {Event} evt 
     */
    onDragStart(evt) {
        console.log('startou');
        this.drag.initialTranslation = Object.assign({}, this.chart.camera.translation);
        this.drag.dragging = true;
        this.drag.elements = this.chart.selectionModule.getElementsAt(this.touch);
    }

    /**
     * Handler for drag event
     * @param {Event} evt 
     */
    onDrag(evt) {
        console.log('arrastou');
        let pointer = this.getPointer(evt.center);

        // If the chart doesn't handle the drag event,
        // handle it by dragging the whole canvas around (default)
        if (!this.chart.handleDragEvent(pointer)) {
            let diff = Utils.diffPoints(pointer.client, this.touch.client);
    
            this.chart.camera.translation = {
                x: this.drag.initialTranslation.x + diff.x, 
                y: this.drag.initialTranslation.y + diff.y
            };
        }
    }

    /**
     * Handler for dragEnd event
     * @param {Event} evt 
     */
    onDragEnd(evt) {
        let pointer = this.getPointer(evt.center);
        this.chart.handleDragEndEvent(pointer);
        this.drag.dragging = false;
    }

    /**
    * Get the pointer location from a touch location
    * @param {{x: number, y: number}} touch
    * @return {{x: number, y: number}} pointer
    * @private
    */
    getPointer(touch) {
        let clientPointer = {
            x: touch.x - Utils.getAbsoluteLeft(this.div),
            y: touch.y - Utils.getAbsoluteTop(this.div)
        };
        let canvasPointer = this.chart.canvas.DOMtoCanvas(clientPointer);
        return {
            client: clientPointer,
            canvas: canvasPointer
        };
    }

}


export default InteractionModule;