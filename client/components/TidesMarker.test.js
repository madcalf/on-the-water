import {
  getClosestTidePrediction,
  getTideDisplayValue,
} from '../helpers/markers';

let predictions;
let closestPrediction;

beforeEach(() => {
  // initialize the prediction data
  closestPrediction = {
    t: '2021-11-06 12:40',
    v: '6.807',
    type: 'H',
  };

  predictions = [
    {
      t: '2021-11-06 01:38',
      v: '5.140',
      type: 'H',
    },
    {
      t: '2021-11-06 06:22',
      v: '2.349',
      type: 'L',
    },
    {
      t: '2021-11-06 12:40',
      v: '6.807',
      type: 'H',
    },
    {
      t: '2021-11-06 19:24',
      v: '-1.318',
      type: 'L',
    },
  ];
});

afterEach(() => {});

describe('Tide markers process API data correctly', () => {
  it('returns closest Tide prediction to specified date', () => {
    const correctDate = new Date('2021-11-06T18:00:00.000Z');
    const closest = getClosestTidePrediction(predictions, correctDate);
    expect(closest.t).toBe(closestPrediction.t);
  });

  it('returns display value for Tide Marker ', () => {
    const correctDate = new Date('2021-11-06T18:00:00.000Z');
    const height = getTideDisplayValue(predictions, correctDate);
    expect(height).toBe('6.807');
  });
});
