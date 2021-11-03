import { closestIndexTo } from 'date-fns';

export const getClosestCurrentPrediction = (predictions, date) => {
  let predictionDates = predictions.map(
    (prediction) => new Date(prediction.Time)
  );
  const index = closestIndexTo(date, predictionDates);
  return predictions[index];
};

export const getCurrentDisplayValues = (predictions, date) => {
  const prediction = getClosestCurrentPrediction(predictions, date);
  const data = {};
  data.rotation = getCurrentRotation(prediction);
  data.speed = prediction.Velocity_Major;
  data.scale = Math.abs(data.speed);
  return data;
};

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

export const getClosestTidePrediction = (predictions, date) => {
  let predictionDates = predictions.map((prediction) => new Date(prediction.t));
  const index = closestIndexTo(date, predictionDates);
  return predictions[index];
};
export const getTideDisplayValue = (predictions, date) => {
  const prediction = getClosestTidePrediction(predictions, date);
  return prediction.v;
};
