import MareysChart from './MareysChart';

let stations = [
    {
        label: 'Station Alpha',
        dist: 20
    },
    {
        label: 'Station Beta',
        dist: 15
    },
    {
        label: 'Station Zero',
        dist: 0
    },
    {
        label: 'Station Charlie',
        dist: 33
    },
    {
        label: 'Station Delta',
        dist: 70
    },
];

let start = new Date();
let end = new Date(start.getTime() + 1000 * 60 * 60 * 24);

let trains = [];

for (let i = 0; i < 100; i++) {
    let train = {
        id: `t${i}`,
        group: `g${i}`,
        schedule: []
    };

    stations.forEach(s => {
        let date =
        train.schedule.push({
            time:  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
            dist: s.dist
        });
    });

    trains.push(train);
}

new MareysChart('marey', stations, trains);