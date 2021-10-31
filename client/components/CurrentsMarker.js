import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';
import { format, closestIndexTo } from 'date-fns';
import { scaleLinear } from 'd3-scale';
import { setMarker } from '../store';

const CurrentsMarker = ({
  station,
  date,
  adjustedDate,
  marker,
  selectMarker,
}) => {
  const map = useMap();

  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [scale, setScale] = useState(0);
  const [selected, setselected] = useState(false);

  // json prediction data on MAX/SLACK interval.
  // For popup display
  const [predictions, setPredictions] = useState(null);

  // predictions data on 6 minute interval (Harmonic stations
  // only). For rotations
  const [predictionsLong, setPredictionsLong] = useState(null);

  // formatted table of predictions data
  const [currentsTable, setCurrentsTable] = useState(null);

  // set values for marker icon
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(station.id);

  const icon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [16, 0],
    iconSize: L.point(32, 32),
    html: `<div class=${
      selected ? 'marker-container selected-marker' : 'marker-container'
    }><div style="transform: rotate(${rotation}deg) scale(${Math.abs(
      speed
    )})" transform-origin="center bottom" >${iconSvg}</div><span class="current-marker-label stroke-text">${speed}</span></div>`,
  });

  const fetchPredictions = async (interval) => {
    try {
      const dateStr = format(date, 'yyyyMMdd');
      const rangeStr = `24`;

      const { data } = await axios.get(
        `/api/currents/${station.id}/${dateStr}/${rangeStr}/${interval}`
      );
      setPredictions(data.current_predictions.cp);
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  // if we make this a Material UI data grid, we can use
  // the json directly without having to convert to
  // table
  const makeTable = (data) => {
    return (
      <table>
        <tbody>
          <tr>
            <th scope="col">Time (LST/LDT)</th>
            <th scope="col">Min/Max</th>
            <th scope="col">Speed (knots)</th>
          </tr>
          {data.map((prediction, index) => {
            return (
              <tr key={index}>
                <td>{prediction.Time}</td>
                <td>{prediction.Type}</td>
                <td>{prediction.Velocity_Major}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const handleClick = () => {
    selectMarker(station.id);
  };
  // get the direction for rotation based on Velocity_Major
  // value in prediction
  const getRotationDir = (prediction) => {
    if (prediction.Velocity_Major > 0.5) {
      return prediction.meanFloodDir;
    } else if (prediction.Velocity_Major < -0.5) {
      return prediction.meanEbbDir;
    } else {
      // It's slack. Not sure what rotation we should return here...
      // return error code and deal with it at the call site
      return -1;
    }
  };

  const getSpeed = (prediction) => {
    return prediction.Velocity_Major;
  };

  const getScale = scaleLinear().domain([0, 3]).range([0, 1.0]);

  useEffect(() => {
    try {
      // if we have the 6 minute intervals use those, otherwise use the MAX_SLACK
      let thesePredictions = predictionsLong ? predictionsLong : predictions;
      if (thesePredictions && thesePredictions.length > 0) {
        // map each prediction's time to array of date objects.
        let predictionDates = thesePredictions.map(
          (station) => new Date(station.Time)
        );

        // find closest time in predictions to the selected time
        const index = closestIndexTo(adjustedDate, predictionDates);

        // get prediction data at that index
        const prediction = thesePredictions[index];
        if (prediction) {
          // update marker direction based on this prediction
          const direction = getRotationDir(prediction);
          if (direction !== -1) {
            setRotation(direction);
            setSpeed(getSpeed(prediction));
            setScale(getScale(prediction.Velocity_Major));
          }
        }
      }
    } catch (err) {
      console.error(
        `ERROR ${station.id} ${station.type} has no data or Velocity_Major??`,
        err
      );
    }
  }, [adjustedDate, predictions]);

  // Update all markers prediction data whenever the date is changed
  useEffect(() => {
    // all markers get the MAX_SLACK data for popup view
    fetchPredictions('MAX_SLACK');

    // if it's a harmonic station, also get the detailed
    // interval data for marker rotation
    if (station.type === 'H') {
      fetchPredictions('6');
    }
  }, [date]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      setCurrentsTable(predictions);
    }
  }, [predictions]);

  useEffect(() => {
    setselected(marker === station.id);
  }, [marker]);

  return (
    predictions && (
      <Marker
        eventHandlers={{ click: () => handleClick() }}
        className="marker-class"
        position={station.position}
        icon={icon}
      >
        <Popup className="kp-popup" maxWidth={500} maxHeight={300}>
          <h3 className="kp-popup-header">
            {station.id} {title} CURRENT
          </h3>
          <p className="kp-popup-text">{subtitle}</p>
          <p className="kp-popup-text">
            {station.type === 'H' ? 'Harmonic' : 'Subordinate'}
          </p>
          {currentsTable ? makeTable(currentsTable) : "Can't show the data"}
        </Popup>
      </Marker>
    )
  );
};

const mapState = (state) => {
  return {
    date: state.date,
    adjustedDate: state.adjustedDate,
    marker: state.marker,
  };
};

const mapDispatch = (dispatch) => {
  return {
    selectMarker: (stationId) => dispatch(setMarker(stationId)),
  };
};

export default connect(mapState, mapDispatch)(CurrentsMarker);
