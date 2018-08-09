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
]

new MareysChart('marey', stations);