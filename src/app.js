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

let d1 = new Date();
let d2 = new Date(d1.getTime() + 1000 * 60 * 60);
let d3 = new Date(d2.getTime() + 1000 * 60 * 260);

let trains = [
    {
        id: 't1',
        group: 'g1',
        schedule: [
            {
                time: d1,
                dist: 0,
            },
            {
                time: d2,
                dist: 15,
            },
            {
                time: d3,
                dist: 20
            }
        ]
    },
    {
        id: 't2',
        group: 'g2',
        schedule: [
            {
                time: d1,
                dist: 20,
            },
            {
                time: d2,
                dist: 33,
            },
            {
                time: d3,
                dist: 70
            }
        ]
    }
]

new MareysChart('marey', stations, trains);