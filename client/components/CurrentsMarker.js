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
  console.log('Marker', props);
  /* 
  For dates, here's what we need
  formats accepted: 
    yyyyMMdd, 
    yyyyMMdd HH:mm, 
    MM/dd/yyyy, 
    MM/dd/yyyy HH:mm
  example if we want to send a date + range of hours
   begin_date=20120415&range=24
   begin_date=2012/04/15 00:00&range=24

   interval options
   Every 6 minutes: interval=6
   Slack & Max only: interval=MAX_SLACK
  */

  // hooks
  const map = useMap();
  const [rotation, setRotation] = useState(0);
  const [predictions, setPredictions] = useState(null); // json prediction data
  const [currentsTable, setCurrentsTable] = useState(null); // this is the formatted table
  const [isLoading, setIsLoading] = useState(false);

  // set values for marker icon
  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(props.station.id);

  const CORS_DEV_PREFIX = 'https://cors-anywhere.herokuapp.com/';
  Icon.Default.imagePath = 'leaflet-images/';

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
    console.log('fetching currents data');
    try {
      const dateStr = `begin_date=${props.date}&range=24`;
      let requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?${dateStr}&station=${props.station.id}&product=currents_predictions&time_zone=lst_ldt&interval=${interval}&units=english&format=json`;
      console.log('fetching...', requestUrl);

      // Hack to handle CORS errors when using the 6 interval
      if (interval === '6') {
        requestUrl = `${CORS_DEV_PREFIX}${requestUrl}`;
      }

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

  // load predictions on mount so we can set the initial
  // arrow directions
  useEffect(() => {
    fetchData('MAX_SLACK');
  }, [props.date]);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
      console.log('setting currents table', props.station.id);
      setCurrentsTable(predictions);
      setRotation(getNewRotation());
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
