'use strict';

class SelectionModule {

    constructor(id, chart) {
        this.id = id;
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
    }

    /**
     * 
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