import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';
import { format, addMinutes, closestIndexTo } from 'date-fns';

const CurrentsMarker = (props) => {
  // console.log('Marker', props);

  // hooks
  const map = useMap();

  // rotation of marker icon
  const [rotation, setRotation] = useState(0);

  // json prediction data on MAX/SLACK interval.
  // For popup display
  const [predictions, setPredictions] = useState(null);

  // predictions on 6 minute interval (Harmonic stations
  // only). For rotations
  const [predictionsLong, setPredictionsLong] = useState(null);

  // formatted table of predictions data
  const [currentsTable, setCurrentsTable] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // set values for marker icon
  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(props.station.id);

  Icon.Default.imagePath = 'leaflet-images/';

  // dev hack that allows retrieving the 6 min intervals
  // that are blocked by CORS restriction
  const CORS_DEV_PREFIX = 'https://cors-anywhere.herokuapp.com/';

  /* 
  using divIcon so we can embed an SVG. This will allow
  us to rotate via css or apply other styling as needed.
  Note: the icon size below appears to be ignored or
  maybe overridden by the css or the svg directly?
   */
  const icon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    html: `<div>${iconSvg} <span class="current-marker-label">${rotation}</span></div>`,
  });

  const fetchPredictionsShort = async () => {
    try {
      const dateStr = `${props.date}`;
      const rangeStr = `24`;
      // load the display data
      let interval = 'MAX_SLACK';
      let requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${props.station.id}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

      // dev hack around the CORS issue with the 6 minute interval request
      if (interval === '6') {
        requestUrl = `${CORS_DEV_PREFIX}${requestUrl}`;
      }
      console.log('fetching... interval:', interval);
      const { data } = await axios.get(requestUrl);
      setPredictions(data.current_predictions.cp);
    } catch (err) {
      console.log('Problem loading or setting currents data', err);
    }
  };

  const fetchPredictionsLong = async (interval) => {
    try {
      const dateStr = `${props.date}`;
      const rangeStr = `24`;

      let interval = '6';
      let requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${dateStr}&range=${rangeStr}&station=${props.station.id}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;

      // dev hack around the CORS issue with the 6 minute interval request
      if (interval === '6') {
        requestUrl = `${CORS_DEV_PREFIX}${requestUrl}`;
      }
      const { data } = await axios.get(requestUrl);
      setPredictionsLong(data.current_predictions.cp);
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

  useEffect(() => {
    try {
      // if we have the 6 minute intervals use those, otherwise use the MAX_SLACK
      let thesePredictions = predictionsLong ? predictionsLong : predictions;
      if (thesePredictions) {
        // map each prediction's time to array of date objects.
        let predictionTimes = thesePredictions.map(
          (station) => new Date(station.Time)
        );

        // find closest time in predictions to the selected time
        // note time from slider is a number 0-1440,
        // representing minutes in a 24 span
        const currentDateTime = addMinutes(new Date(props.date), props.time);
        const index = closestIndexTo(currentDateTime, predictionTimes);

        // get prediction data at that index
        const prediction = thesePredictions[index];

        // update marker direction based on this prediction
        const direction = getRotationDir(prediction);
        if (direction !== -1) {
          setRotation(direction);
        }
      }
    } catch (err) {
      console.error(
        `ERROR ${station.id} ${station.type} has no data or Velocity_Major??`,
        err
      );
    }
  }, [props.time, predictions]);

  // Update all markers prediction data whenever the date is changed
  useEffect(() => {
    // all markers get the MAX_SLACK data for popup view
    fetchPredictionsShort();

    // if it's a harmonic station, also get the detailed
    // interval data for marker rotation
    if (props.station.type === 'H') {
      fetchPredictionsLong();
    }
  }, [props.date]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      setCurrentsTable(predictions);
    }
  }, [predictions]);

  // update the marker rotation when new rotation value is set
  useEffect(() => {
    const svg = document.querySelector(`#arrow-${station.id}`);
    if (svg) {
      svg.style.transform = `rotate(${rotation}deg)`;
    }
    if (station.id === 'SFB1201') {
      if (svg) {
        console.log(
          `${station.id} setting rotation to ${rotation}? svg: ${svg} ${svg.style.transform}`
        );
      } else {
        console.log(`${station.id} no svg to target yet`);
      }
    }
  }, [rotation]);

  // props: {station: {position: [lat,lon], stationId: xx, stationName: xx, url:??}}
  return (
    <Marker
      // eventHandlers={{ click: () => fetchData('6') }}
      position={station.position}
      icon={icon}
    >
      <Popup className="kp-popup" maxHeight={300}>
        <h3 className="kp-popup-header">
          {station.id} {title}
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

const mapStateToProps = (state) => {
  return { date: state.date, time: state.time.ms };
};

export default connect(mapStateToProps)(CurrentsMarker);
