import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
import { format, addMinutes, closestIndexTo } from 'date-fns';
import { setMarker } from '../store';
import { getTidesIcon } from '../helpers/getSvg';
import {
  getTideDisplayValue,
  getClosestTidePrediction,
} from '../helpers/markers';

const TidesMarker = ({ station, date, adjustedDate, marker, selectMarker }) => {
  const map = useMap();

  // rotation of marker icon
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(0);
  const [selected, setselected] = useState(false);
  const [height, setHeight] = useState(0);

  // json prediction data on HI/LOW interval.
  // For popup display
  const [predictions, setPredictions] = useState(null);

  // formatted table of predictions data
  const [tideTable, setTidesTable] = useState(null);

  // set values for marker icon
  const name = station.name.split(',');
  const title = name.shift();
  const subtitle = name.join(',');

  const iconUrl = 'images/tide_low.png';

  const loadingIcon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [50, 50],
    iconSize: L.point(32, 32),
    html: `<div class="tide-marker-container loader"/>`,
  });

  const icon = L.divIcon({
    iconSize: L.point(15, 15),
    iconAnchor: [0, 15],
    className: 'my-div-icon',
    html: `<div class=${
      selected ? 'selected-marker' : ''
    } "tide-marker-container">${getTidesIcon()}<span class="tide-marker-label stroke-text">${height}</span></div>`,
  });

  const fetchPredictions = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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
      if (predictions?.length > 0) {
        let predictionTimes = predictions.map(
          (prediction) => new Date(prediction.t)
        );

        const height = getTideDisplayValue(predictions, adjustedDate);
        setHeight(height);
        console.log(station.id, 'tide value:', height);
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

  // ======= TEMP ======= //
  useEffect(() => {
    if (station.id === 'SFB1203') {
      console.log(`CurrentMarker ${station.id} mount`);
    }
  }, []);
  useEffect(() => {
    if (station.id === 'SFB1203') {
      console.count(`CurrentMarker ${station.id} render`);
    }
  });
  // ======= END TEMP ======= //

  return (
    <Marker
      eventHandlers={{ click: () => handleClick() }}
      className="marker-class"
      position={[station.lat, station.lng]}
      icon={isLoading ? loadingIcon : icon}
    >
      <Popup className="kp-popup" maxWidth={500} maxHeight={300}>
        <h3 className="kp-popup-header">
          {station.id} {title}
        </h3>
        <p className="kp-popup-text">{subtitle}</p>
        <p className="kp-popup-text">
          TIDE {station.type === 'R' ? 'Harmonic' : 'Subordinate'}
        </p>
        {tideTable ? makeTable(tideTable) : "Can't show the data"}
      </Popup>
    </Marker>
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
