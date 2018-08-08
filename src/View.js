'use strict';

class View {

    constructor(id, chart) {
        this.div = document.querySelector(`#${id}`);
        this.chart = chart;
        this.scale = 1;
        this.translation = {x: 0, y: 0};
    }

    

}

export default View;