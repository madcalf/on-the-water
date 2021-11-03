import { closestIndexTo } from 'date-fns';

export const getCurrentDisplayValues = (predictions, timestamp) => {
  let predictionDates = predictions.map(
    (prediction) => new Date(prediction.Time)
  );
  const index = closestIndexTo(timestamp, predictionDates);

  const prediction = predictions[index];
  const data = {};
  data.rotation = getCurrentRotation(prediction);
  data.speed = getCurrentSpeed(prediction);
  data.scale = Math.abs(data.speed);
  return data;
};

export const getCurrentSpeed = (prediction) => {
  const speed = prediction.Velocity_Major;
  return Number.parseFloat(speed).toPrecision(2);
};

// Getting the direction for rotation based on
// Velocity_Major.
export const getCurrentRotation = (prediction) => {
  if (prediction.Velocity_Major > 0.2) {
    return prediction.meanFloodDir;
  } else if (prediction.Velocity_Major < -0.2) {
    return prediction.meanEbbDir;
  } else {
    // It's slack. Not sure what rotation we should return here...
    // return error code and deal with it at the call site
    return -1;
  }
};
