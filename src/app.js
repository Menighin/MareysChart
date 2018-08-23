import MareysChart from './MareysChart';

let stations = [
    {
        label: 'Station Zero',
        dist: 0
    },
    {
        label: 'Station Alpha',
        dist: 15
    },
    {
        label: 'Station Beta',
        dist: 20
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
    {
        label: 'Station Hotel',
        dist: 130
    },
    {
        label: 'Station India',
        dist: 140
    },
    {
        label: 'Station Juliett',
        dist: 155
    },
    {
        label: 'Station Kilo',
        dist: 170
    },
    {
        label: 'Station Lima',
        dist: 201
    },
    {
        label: 'Station Mike',
        dist: 220
    },
    {
        label: 'Station November',
        dist: 230
    },
    {
        label: 'Station Oscar',
        dist: 240
    },
    {
        label: 'Station Papa',
        dist: 255
    },
    {
        label: 'Station Quebec',
        dist: 270
    },
    {
        label: 'Station Romeo',
        dist: 290
    },
];


stations = [];
let distAux = 0;
for (let i = 0; i < 600; i++) {
    stations.push({
        label: `Station ${i}`,
        dist: distAux
    });
    if (i % 3 == 0) distAux += 30;
    else if (i % 2 == 0) distAux += 20;
    else distAux += 10;
}


let fifteenMinutes = 1000 * 60 * 15;

let start = new Date();
start = new Date(start.getTime() - 1000 * 60 * 60 * 12);

if (start.getTime() % fifteenMinutes !== 0)
    start = new Date(start.getTime() + (fifteenMinutes - start.getTime() % fifteenMinutes));

let end = new Date(start.getTime() + 1000 * 60 * 60 * 24);

let trains = [];

//trains = [
    // {
    //     id: 't1',
    //     group: 'g1',
    //     schedule: [
    //         {
    //             time: start,
    //             dist: 0
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 3),
    //             dist: 55
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 6),
    //             dist: 100
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 9),
    //             dist: 23
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 11),
    //             dist: 1
    //         },
    //     ]
    // },
    // {
    //     id: 't2',
    //     group: 'g2',
    //     schedule: [
    //         {
    //             time: start,
    //             dist: 100
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 3),
    //             dist: 75
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 6),
    //             dist: 0
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 8),
    //             dist: 66
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 10),
    //             dist: 123
    //         },
    //     ]
    // },
    // {
    //     id: 't3',
    //     group: 'g2',
    //     schedule: [
    //         {
    //             time: start,
    //             dist: 64
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 3),
    //             dist: 64
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 6),
    //             dist: 64
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 8),
    //             dist: 64
    //         },
    //         {
    //             time: new Date(start.getTime() + 1000 * 60 * 60 * 10),
    //             dist: 64
    //         },
    //     ]
    // }
// ];


// trains = [
//     {
//         id: 't1',
//         group: 'g1',
//         schedule: [{"time": new Date("2018-08-16T14:15:00.000Z"),"dist":120},{"time": new Date("2018-08-16T15:00:00.000Z"),"dist":55},{"time": new Date("2018-08-16T15:45:00.000Z"),"dist":20},{"time": new Date("2018-08-16T15:45:00.000Z"),"dist":33},{"time": new Date("2018-08-17T03:30:00.000Z"),"dist":63},{"time": new Date("2018-08-17T04:30:00.000Z"),"dist":15},{"time": new Date("2018-08-17T08:00:00.000Z"),"dist":100},{"time": new Date("2018-08-17T11:30:00.000Z"),"dist":0}]
//     },
//     {
//         id: 't2',
//         group: 'g2',
//         schedule: [{"time": new Date("2018-08-16T19:15:00.000Z"),"dist":20},{"time": new Date("2018-08-17T00:30:00.000Z"),"dist":63},{"time": new Date("2018-08-17T02:15:00.000Z"),"dist":120},{"time": new Date("2018-08-17T03:00:00.000Z"),"dist":33},{"time": new Date("2018-08-17T05:15:00.000Z"),"dist":55},{"time": new Date("2018-08-17T05:15:00.000Z"),"dist":100},{"time": new Date("2018-08-17T08:45:00.000Z"),"dist":15},{"time": new Date("2018-08-17T13:30:00.000Z"),"dist":0}]
//     }
// ];

let currTime = new Date(start.getTime());

for (let i = 0; i < 200; i++) {
    let train = {
        id: `t${i}`,
        group: `g${i}`,
        schedule: []
    };

    if (i % 2 === 0) {
        stations.forEach((s, j) => {
            let time = new Date(currTime.getTime() + (1000 * 60 * 5 * j));

            train.schedule.push({
                time: time,
                dist: s.dist
            });
        });
        if (i == 0) console.log(train);
    } 
    else {
        for (let j = stations.length - 1, k = 0; j >= 0; j--, k++) {
            let s = stations[j];

            let time = new Date(currTime.getTime() + (1000 * 60 * 5 * k));

            train.schedule.push({
                time: time,
                dist: s.dist
            });
        }
        currTime = new Date(start.getTime() + 1000 * 60 * 5 * (i + 1));
        // if (currTime.getTime() + 1000 * 60 * 2 * stations.length > end.getTime()) currTime = new Date(start.getTime() + 1000 * 60 * 5 * (i + 1));
    }

    trains.push(train);
    
}

let trainLines = [
    {
        from: 0,
        to: 75,
        nLines: 2
    }
];

new MareysChart('marey', stations, trains, trainLines);