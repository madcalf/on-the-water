import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { getCurrentsIcon } from '../helpers/getSvg';
import axios from 'axios';
import { format, closestIndexTo } from 'date-fns';
import { scaleLinear } from 'd3-scale';
import { setMarker } from '../store';
import { getCurrentDisplayValues } from '../helpers/markers';

const CurrentsMarker = ({
  station,
  date,
  adjustedDate,
  marker,
  selectMarker,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isValidStation, setIsValidStation] = useState(true);
  const [rotation, setRotation] = useState(-999);
  const [speed, setSpeed] = useState(-0);
  const [scale, setScale] = useState(-1);
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
  const name = station.name.split(',');
  const title = name.shift();
  const subtitle = name.join(',');

  const currentsSvg = getCurrentsIcon(station.id);
  const loadingIcon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [32, 32],
    iconSize: L.point(32, 32),
    html: `<div data-testid="station-${station.id}" class="currents-marker-icon loader">Loading...</div>`,
  });

  const icon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [16, 0],
    iconSize: L.point(32, 32),
    html: `<div data-testid="station-${station.id}" class=${
      selected ? 'currents-marker-icon selected-marker' : 'currents-marker-icon'
    }><div data-testid="station-${
      station.id
    }" style="transform: rotate(${rotation}deg) scale(${scale})" transform-origin="center bottom" >${currentsSvg}</div><span class="currents-marker-label stroke-text">${speed}</span></div>`,
  });

  const fetchPredictions = async (interval) => {
    setIsLoading(true);
    try {
      const dateStr = format(date, 'yyyyMMdd');
      const rangeStr = `24`;

      const { data } = await axios.get(
        `/api/currents/${station.id}/${dateStr}/${rangeStr}/${interval}`
      );
      if (interval === 'MAX_SLACK') {
        setPredictions(data.current_predictions.cp);
      } else {
        setPredictionsLong(data.current_predictions.cp);
      }
      setIsValidStation(true);
    } catch (err) {
      setIsValidStation(false);
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

  useEffect(() => {
    try {
      const thesePredictions = predictionsLong ? predictionsLong : predictions;
      if (thesePredictions?.length > 0) {
        const { speed, rotation, scale } = getCurrentDisplayValues(
          thesePredictions,
          adjustedDate
        );

        console.log(station.id, 'current vals', speed, rotation, scale);
        setSpeed(speed);
        setScale(scale);
        if (!rotation) {
          setIsValidStation(false);
        }
        // Rotation value of -1 indicates we're at slack tide,
        // so don't change the rotation
        if (rotation > -1) {
          setRotation(rotation);
        }
      }
    } catch (err) {
      console.error(
        `Problem getting display data for ${station.id} (${station.type}) `,
        err
      );
    }
  }, [adjustedDate, predictions]);

  // Update all markers prediction data whenever the date is changed
  useEffect(() => {
    if (isValidStation) {
      // all markers get the MAX_SLACK data for popup view
      fetchPredictions('MAX_SLACK');

      // if it's a harmonic station, also get the detailed
      // interval data for marker rotation
      if (station.type === 'H') {
        fetchPredictions('6');
      }
    }
  }, [date, isValidStation]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      setCurrentsTable(makeTable(predictions));
    }
  }, [predictions]);

  useEffect(() => {
    setselected(marker === station.id);
  }, [marker]);

  return (
    isValidStation && (
      <Marker
        eventHandlers={{ click: () => handleClick() }}
        position={[station.lat, station.lng]}
        icon={isLoading ? loadingIcon : icon}
      >
        <Popup className="kp-popup" maxWidth={500} maxHeight={300}>
          <h3 className="kp-popup-header">
            {station.id} {title} CURRENT
          </h3>
          <p className="kp-popup-text">{subtitle}</p>
          <p className="kp-popup-text">
            {station.type === 'H' ? 'Harmonic' : 'Subordinate'}
          </p>
          {currentsTable ? currentsTable : "Can't show the data"}
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
