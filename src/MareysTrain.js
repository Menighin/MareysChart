'use strict';

class MareysTrain {

    constructor(chart, id, group, label, schedule) {
        this.chart = chart;
        this.id = id;
        this.group = group;
        this.label = label;
        this.schedule = schedule;
    }

    /**
     * Cast a list of trains, passed as input to this component,
     * into a list of MareysTrain
     * @param train list of trains {id, group, label, schedule}
     * @returns {Array.<MareysTrain>}
     */
    static castToMareysTrains(chart, trains) {
        let mareysTrains = [];

        trains.forEach(t => {
            mareysTrains.push(new MareysTrain(chart, t.id, t.group, t.label, t.schedule));
        });

        return mareysTrains;
    }

    draw() {
        let ctx = this.chart.canvas.ctx;
        let drawingArea = this.chart.axis._getGridDrawingArea();
        let timeWindow = this.chart.options.timeWindow;

        let maxDist = this.chart.data.stations.last().dist;
        let totalMinutes = (timeWindow.end.getTime() - timeWindow.start.getTime()) / (1000 * 60);
        let xFactor = (drawingArea.x2 - drawingArea.x1) / totalMinutes;
        let yFactor = (drawingArea.y2 - drawingArea.y1) / maxDist;

        ctx.lineWidth = 3;
        ctx.strokeStyle = 'tomato';

        ctx.beginPath();
        ctx.moveTo(drawingArea.x1 + xFactor * this.schedule[0].time.diffMinutesWith(timeWindow.start), drawingArea.y1 + yFactor * this.schedule[0].dist);

        this.schedule.forEach((s, i) => {
            if (i == 0) return;

            ctx.lineTo(drawingArea.x1 + xFactor * s.time.diffMinutesWith(timeWindow.start), drawingArea.y1 + yFactor * s.dist);
        });

        ctx.stroke();

    }

}

export default MareysTrain;