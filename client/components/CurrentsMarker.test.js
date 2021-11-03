import {
  getCurrentDisplayValues,
  getClosestCurrentPrediction,
} from '../helpers/markers';

let predictions;
let closestPrediction;

beforeEach(() => {
  closestPrediction = {
    Type: 'flood',
    meanFloodDir: 61,
    Bin: '26',
    meanEbbDir: 239,
    Time: '2021-11-06 11:18',
    Depth: '19',
    Velocity_Major: 2.7,
  };

  predictions = [
    {
      Type: 'slack',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 02:48',
      Depth: '19',
      Velocity_Major: 0.04,
    },
    {
      Type: 'ebb',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 05:30',
      Depth: '19',
      Velocity_Major: -2.58,
    },
    {
      Type: 'slack',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 08:24',
      Depth: '19',
      Velocity_Major: 0.03,
    },
    {
      Type: 'flood',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 11:18',
      Depth: '19',
      Velocity_Major: 2.7,
    },
    {
      Type: 'slack',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 13:30',
      Depth: '19',
      Velocity_Major: -0.07,
    },
    {
      Type: 'ebb',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 17:06',
      Depth: '19',
      Velocity_Major: -4.73,
    },
    {
      Type: 'slack',
      meanFloodDir: 61,
      Bin: '26',
      meanEbbDir: 239,
      Time: '2021-11-06 21:42',
      Depth: '19',
      Velocity_Major: 0.05,
    },
  ];
});

afterEach(() => {});

describe('Current Markers process API data correctly', () => {
  it('returns closest Current prediction to timestamp', () => {
    const correctDate = new Date('2021-11-06T18:00:00.000Z');

    const closest = getClosestCurrentPrediction(predictions, correctDate);
    expect(closest.Time).toBe(closestPrediction.Time);
  });

  it('returns display values for Current Marker', () => {
    const correctDate = new Date('2021-11-06T18:00:00.000Z');
    const { speed, rotation, scale } = getCurrentDisplayValues(
      predictions,
      correctDate
    );

    expect(speed).toBeCloseTo(2.7);
    expect(rotation).toBe(61);
    expect(scale).toBeCloseTo(2.7);
  });
});
