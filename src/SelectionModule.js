'use strict';

class SelectionModule {

    constructor(id, chart) {
        this.id = id;
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
    }

    get hoveredTrainId() { return this._hoveredTrainId; }
    set hoveredTrainId(id) { this._hoveredTrainId = id; }

    get selectedTrainsIds() { return this._selectedTrainsIds; }
    set selectedTrainsIds(ids) { this._selectedTrainsIds = ids; }
    
    /**
     * Handles the hover event
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleHoverEvent(pointer) {
        let hoveredTrains = this.getTrainsAt(pointer);

        if (hoveredTrains.length > 0)
            this.hoveredTrainId = hoveredTrains.last().id;
        else
            this.hoveredTrainId = undefined;
    }

    /**
     * Handle mouse click event
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleMouseClick(pointer) {
        let clickedTrains = this.getTrainsAt(pointer);

        if (clickedTrains.length > 0)
            this.selectedTrainsIds = clickedTrains.map(t => t.id);
        else 
            this.selectedTrainsIds = undefined;
    }

    /**
     * Returns a list of trains located on the pointer
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Array.<MareysTrain>} - The trains that are on this coordinates
     */
    getTrainsAt(pointer) {
        let trains = [];
        this.chart.data.trains.forEach(t => {
            if (t.intersectsWith(pointer)) {
                trains.push(t);
            }
        });

        return trains;
    }

   

}

export default SelectionModule;