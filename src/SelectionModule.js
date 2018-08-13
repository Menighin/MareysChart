'use strict';

class SelectionModule {

    get hoveredAnchorPoint() { return this._hoveredAnchorPoint; }
    set hoveredAnchorPoint(hoveredAnchorPoint) { this._hoveredAnchorPoint = hoveredAnchorPoint; }

    get hoveredTrainId() { return this._hoveredTrainId; }
    set hoveredTrainId(id) { this._hoveredTrainId = id; }

    get selectedTrainsIds() { return this._selectedTrainsIds; }
    set selectedTrainsIds(ids) { this._selectedTrainsIds = ids; }
    
    constructor(id, chart) {
        this.id = id;
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
    }

    /**
     * Handles the hover event
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleHoverEvent(pointer) {
        let elementsAtPonter = this.getElementsAt(pointer);
        let hoveredTrains = elementsAtPonter.trains;
        let hoveredAnchorPoints = elementsAtPonter.anchorPoints;

        // Setting the right mouse pointer
        if (hoveredAnchorPoints.any())
            this.div.style.cursor = 'move';
        else if (hoveredTrains.any())
            this.div.style.cursor = 'pointer';
        else
            this.div.style.cursor = 'auto';

        if (hoveredAnchorPoints.any()) {
            this.hoveredAnchorPoint = hoveredAnchorPoints.last();
            this.hoveredTrainId = undefined;
        } else {
            this.hoveredAnchorPoint = undefined;
            
            if (hoveredTrains.any()) {
                this.hoveredTrainId = hoveredTrains.last().id;
            }
            else {
                this.hoveredTrainId = undefined;
            }
        }

    }

    /**
     * Handle mouse click event
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates} pointer 
     */
    handleMouseClick(pointer) {
        let clickedTrains = this.getTrainsAt(pointer);

        if (clickedTrains.length > 0) {
            this.selectedTrainsIds = clickedTrains.map(t => t.id);
        }
        else 
            this.selectedTrainsIds = undefined;
    }

    /**
     * Returns all the elements located on the given pointer
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Array.<Object>} - Object containing {trains, anchorPoints} 
     */    
    getElementsAt(pointer) {
        let elements = {
            trains: [],
            anchorPoints: []
        };
        
        this.chart.data.trains.forEach(t => {
            if (t.intersectsWith(pointer)) {
                elements.trains.push(t);

                if (this.selectedTrainsIds && this.selectedTrainsIds.last() == t.id) {
                    t.anchorPoints.forEach(a => {
                        if (a.isMouseOver(pointer))
                        elements.anchorPoints.push(a);
                    });
                }
            }
        });
        return elements;
    }
    
    /**
     * Returns a list of trains located on the pointer
     * @param {Object} pointer - The pointer object
     * @param {Object} pointer.client - The coordinates {x, y} on the div
     * @param {Object} pointer.canvas - The coordinates {x, y} translated to canvas coordinates
     * @returns {Array.<MareysTrain>} - The trains that are on this coordinates
     */
    getTrainsAt(pointer) {
        return this.getElementsAt(pointer).trains;
    }

    getAnchorPointsAt(pointer) {
        return this.getElementsAt(pointer).anchorPoints;
    }
}

export default SelectionModule;