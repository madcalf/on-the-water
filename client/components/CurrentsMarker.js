import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
// import { svgString } from '../../public/leaflet-images/new_arrow.svg';
// import arrow from '../images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';
import { format, addMinutes, closestIndexTo } from 'date-fns';
import { scaleLinear } from 'd3-scale';
import { setMarker } from '../store';

const CurrentsMarker = ({ station, date, time, marker, selectMarker }) => {
  // hooks
  const map = useMap();

  // rotation of marker icon
  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [scale, setScale] = useState(0);
  const [selected, setselected] = useState(false);

  // json prediction data on MAX/SLACK interval.
  // For popup display
  const [predictions, setPredictions] = useState(null);

  // predictions on 6 minute interval (Harmonic stations
  // only). For rotations
  const [predictionsLong, setPredictionsLong] = useState(null);

  // formatted table of predictions data
  const [currentsTable, setCurrentsTable] = useState(null);

  // set values for marker icon
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(station.id);

  Icon.Default.imagePath = '../images  '; //'leaflet-images/';

  // dev hack that allows retrieving the 6 min intervals
  // that are blocked by CORS restriction. Move these requests to backend?
  const CORS_DEV_PREFIX = 'https://cors-anywhere.herokuapp.com/';

  // if (station.type === 'H') {
  //   if (predictions) console.log('short', predictions.length);
  //   if (predictionsLong) console.log('long', predictionsLong.length);
  // }

  /* 
  using divIcon so we can embed an SVG. This will allow
  us to rotate via css or apply other styling as needed.
  Note: the icon size below appears to be ignored or
  maybe overridden by the css or the svg directly?
  For some reason applying scale, limits rotation to one direction
   */
  const icon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    html: `<div class=${
      selected ? 'selected-marker' : ''
    } marker-container"><div style="transform: rotate(${rotation}deg)" transform-origin="center bottom" >${iconSvg}</div><span class="current-marker-label stroke-text">${speed}</span></div>`,
  });

  const fetchPredictionsShort = async () => {
    try {
      const dateStr = `${date}`;
      const rangeStr = `24`;
      // load the display data
      let interval = 'MAX_SLACK';
      let requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${station.id}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

      // console.log('fetching... interval:', interval);
      const { data } = await axios.get(requestUrl);
      setPredictions(data.current_predictions.cp);
    } catch (err) {
      console.log('Problem loading or setting currents data', err);
    }
  };

  const fetchPredictionsLong = async (interval) => {
    try {
      const dateStr = `${date}`;
      const rangeStr = `24`;

      let interval = '6';
      let requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${station.id}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

      // dev hack around the CORS issue with the 6 minute interval request
      if (interval === '6') {
        requestUrl = `${CORS_DEV_PREFIX}${requestUrl}`;
        // requestUrl = `{requestUrl}`;
      }
      const { data } = await axios.get(requestUrl);
      console.log('data', data);
      // setPredictionsLong(data.current_predictions.cp);
    } catch (err) {
      console.log('Problem loading or setting currents data', err);
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
        let predictionTimes = thesePredictions.map(
          (station) => new Date(station.Time)
        );

        // find closest time in predictions to the selected time
        // note time from slider is a number 0-1440,
        // representing minutes in a 24 span
        const currentDateTime = addMinutes(new Date(date), time);
        const index = closestIndexTo(currentDateTime, predictionTimes);

        // get prediction data at that index
        const prediction = thesePredictions[index];
        if (prediction) {
          // update marker direction based on this prediction
          const direction = getRotationDir(prediction);
          if (direction !== -1) {
            setRotation(direction);
            setSpeed(getSpeed(prediction));
            setScale(getScale(prediction.Velocity_Major));
            // console.log('scale', scale);
          }
        }
      }
    } catch (err) {
      console.error(
        `ERROR ${station.id} ${station.type} has no data or Velocity_Major??`,
        err
      );
    }
  }, [time, predictions]);

  // Update all markers prediction data whenever the date is changed
  useEffect(() => {
    // all markers get the MAX_SLACK data for popup view
    fetchPredictionsShort();

    // if it's a harmonic station, also get the detailed
    // interval data for marker rotation
    if (station.type === 'H') {
      fetchPredictionsLong();
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

  // props: {station: {position: [lat,lon], stationId: xx, stationName: xx, url:??}}
  return (
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
  );
};

const mapState = (state) => {
  return {
    date: state.date,
    time: state.time.ms,
    marker: state.marker,
  };
};

const mapDispatch = (dispatch) => {
  return {
    selectMarker: (stationId) => dispatch(setMarker(stationId)),
  };
};

export default connect(mapState, mapDispatch)(CurrentsMarker);
