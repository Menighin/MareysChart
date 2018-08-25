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
for (let i = 0; i < 200; i++) {
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