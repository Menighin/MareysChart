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
        dist: 55
    },
    {
        label: 'Station Echo',
        dist: 63
    },
    {
        label: 'Station Foxtrot',
        dist: 100
    },
    {
        label: 'Station Golf',
        dist: 120
    },
];


let fifteenMinutes = 1000 * 60 * 15;

let start = new Date();
start = new Date(start.getTime() - 1000 * 60 * 60 * 12);

if (start.getTime() % fifteenMinutes !== 0)
    start = new Date(start.getTime() + (fifteenMinutes - start.getTime() % fifteenMinutes));

let end = new Date(start.getTime() + 1000 * 60 * 60 * 24);

let trains = [{
    id: 't1',
    group: 'g1',
    schedule: [
        {
            time: start,
            dist: 0
        },
        {
            time: new Date(start.getTime() + 1000 * 60 * 60 * 3),
            dist: 55
        },
        {
            time: new Date(start.getTime() + 1000 * 60 * 60 * 6),
            dist: 100
        },
    ]
}];

// for (let i = 0; i < 40; i++) {
//     let train = {
//         id: `t${i}`,
//         group: `g${i}`,
//         schedule: []
//     };

//     stations.forEach(s => {
//         train.schedule.push({
//             time:  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
//             dist: s.dist
//         });
//     });

//     trains.push(train);
// }

new MareysChart('marey', stations, trains);