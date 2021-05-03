import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';
import { format } from 'date-fns';

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

  const fetchData = async (interval) => {
    try {
      const dateStr = `${props.date}`;
      const rangeStr = `24`;
      // load the display data
      // let interval = "MAX_SLACK"
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

  const getNewRotation = () => {
    // get the correct prediction when we do this for real
    return predictions[0].Velocity_Major > 0
      ? predictions[0].meanFloodDir
      : predictions[0].meanEbbDir;
  };

  useEffect(() => {
    // all markers get the MAX_SLACK data for popup view
    fetchData('MAX_SLACK');
    // if it's a harmonic station, also get the detailed
    // interval data for rotation
    if (props.station.type === 'H') {
      fetchData('6');
    }
  }, [props.date]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      console.log('setting currents table', props.station.id);
      setCurrentsTable(predictions);
      setRotation(getNewRotation());
      console.log(predictions[0]);
    }
  }, [predictions]);

  // update the marker rotation when new rotation value is set
  useEffect(() => {
    const svg = document.querySelector(`#arrow-${station.id}`);
    if (svg) {
      svg.style.transform = `rotate(${rotation}deg)`;
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
