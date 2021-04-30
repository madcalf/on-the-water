import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';

const CurrentsMarker = (props) => {
  const requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${props.station.id}&product=currents_predictions&time_zone=lst_ldt&interval=30&units=english&format=json`;

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

  const fetchData = async () => {
    try {
      const { data } = await axios.get(requestUrl);
      // const predictions = data.current_predictions.cp;
      setPredictions(data.current_predictions.cp);

      // if we make this a Material UI data grid, we can use
      // the json directly without having to convert to
      // table
      // setCurrentsTable(makeTable(predictions));

      // Set arrow rotation based on the current's direction at specified time
      // right now we're just using the rotation of the
      // first item in the list. Later will base this on the
      // current time from app state.

      // const rot =
      //   predictions[0].Velocity_Major > 0
      //     ? predictions[0].meanFloodDir
      //     : predictions[0].meanEbbDir;
      // console.log(
      //   'rot',
      //   predictions[0].Velocity_Major,
      //   predictions[0].meanEbbDir,
      //   predictions[0].meanFloodDir,
      //   rot
      // );
      // setRotation(rot);
    } catch (err) {
      console.log('Problem loading or setting currents data', err);
    }
  };

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
    fetchData();
  }, []);

  // update the currents table when new predictions data is loaded
  useEffect(() => {
    if (predictions) {
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
  });

  // IMPORTANT NOTES:
  // Callback for useEffect can't BE async
  //  but you can use an async func within the callback
  // useEffect must return a cleanup function or nothing

  // props: {station: {position: [lat,lon], stationId: xx, stationName: xx, url:??}}
  return (
    <Marker
      eventHandlers={{ click: () => fetchData() }}
      position={station.position}
      icon={icon}
    >
      <Popup className="kp-popup" maxHeight={300}>
        <h3 className="kp-popup-header">
          {station.id} {title}
        </h3>
        <p className="kp-popup-text">{subtitle}</p>
        {currentsTable ? currentsTable : "Can't show the data"}
      </Popup>
    </Marker>
  );
};

export default CurrentsMarker;
