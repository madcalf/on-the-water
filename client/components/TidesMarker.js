import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import { format, addMinutes, closestIndexTo } from 'date-fns';
import { setMarker } from '../store';

const TidesMarker = ({ station, date, adjustedDate, marker, selectMarker }) => {
  const map = useMap();

  // rotation of marker icon
  const [isLoading, setIsLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [scale, setScale] = useState(0);
  const [selected, setselected] = useState(false);
  const [height, setHeight] = useState(0);

  // json prediction data on HI/LOW interval.
  // For popup display
  const [predictions, setPredictions] = useState(null);

  // formatted table of predictions data
  const [tideTable, setTidesTable] = useState(null);

  // set values for marker icon
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');

  Icon.Default.imagePath = 'leaflet-images/';
  const iconUrl = Icon.Default.imagePath + 'tide_low.png';

  const icon = L.divIcon({
    iconSize: L.point(15, 15),
    iconAnchor: [0, 0],
    className: 'my-div-icon',
    html: `<div class=${
      selected ? 'selected-marker' : ''
    } "tide-marker-container"><img src='${iconUrl}' alt='tide-marker' /><span class="tide-marker-label stroke-text">${height}</span></div>`,
  });

  const fetchPredictions = async () => {
    try {
      const dateStr = format(date, 'yyyyMMdd');
      const rangeStr = `24`;
      const interval = `hilo`;

      const { data } = await axios.get(
        `/api/tides/${station.id}/${dateStr}/${rangeStr}/${interval}`
      );
      setPredictions(data.predictions);
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
            <th scope="col">Hi/Low</th>
            <th scope="col">Feet(MLLW) </th>
          </tr>
          {data.map((prediction, index) => {
            return (
              <tr key={index}>
                <td>{prediction.t}</td>
                <td>{prediction.type}</td>
                <td>{prediction.v}</td>
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

  useEffect(() => {
    try {
      if (predictions && predictions.length > 0) {
        // map each prediction's time to array of date objects.
        let predictionTimes = predictions.map((station) => new Date(station.t));

        // find closest time in predictions to the selected time
        const index = closestIndexTo(adjustedDate, predictionTimes);

        // get prediction data at that index
        const prediction = predictions[index];
        if (prediction) {
          // update marker height based on this prediction
          const height = prediction.v;
          setHeight(height);
        }
      }
    } catch (err) {
      console.error(
        `ERROR ${station.id} ${station.type} has no data or "v"??`,
        err
      );
    }
  }, [adjustedDate, date, predictions]);

  // Update all markers prediction data whenever the date is changed
  useEffect(() => {
    fetchPredictions();
  }, [date]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      setTidesTable(predictions);
    }
  }, [predictions]);

  useEffect(() => {
    setselected(marker === station.id);
  }, [marker]);

  return (
    predictions &&
    predictions.length && (
      <Marker
        eventHandlers={{ click: () => handleClick() }}
        className="marker-class"
        position={station.position}
        icon={icon}
      >
        <Popup className="kp-popup" maxWidth={500} maxHeight={300}>
          <h3 className="kp-popup-header">
            {station.id} {title}
          </h3>
          <p className="kp-popup-text">{subtitle}</p>
          <p className="kp-popup-text">
            TIDE {station.type === 'H' ? 'Harmonic' : 'Subordinate'}
          </p>
          {tideTable ? makeTable(tideTable) : "Can't show the data"}
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

export default connect(mapState, mapDispatch)(TidesMarker);
