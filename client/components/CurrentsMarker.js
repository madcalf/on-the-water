import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';
import axios from 'axios';

const CurrentsMarker = (props) => {
  const requestUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=${props.station.id}&product=currents_predictions&time_zone=lst_ldt&interval=30&units=english&format=json`;

  const map = useMap();
  // let currentData = null;
  let randomText = 'Some randomness right here';

  const [rotation, setRotation] = useState(0);
  const [currentsData, setCurrentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(props.station.id);
  Icon.Default.imagePath = 'leaflet-images/';

  // using divIcon so we can embed an SVG. This will allow
  // us to rotate via css or apply other styling as needed.
  const icon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    html: `${iconSvg}`,
  });

  const fetchData = async () => {
    try {
      const { data } = await axios.get(requestUrl);
      console.log(data);
      const predictions = data.current_predictions.cp;
      setCurrentsData(currentsTable(predictions));
      const rot =
        predictions[0].Velocity_Major > 0
          ? predictions[0].meanFloodDir
          : predictions[0].meanEbbDir;
      console.log(
        'rot',
        predictions[0].Velocity_Major,
        predictions[0].meanEbbDir,
        predictions[0].meanFloodDir,
        rot
      );
      setRotation(rot);
    } catch (err) {
      console.log('Problem loading or setting currents data');
    }
  };

  const currentsTable = (data) => {
    return (
      <div>
        {data.map((prediction, index) => {
          return (
            <p key={index}>
              {prediction.Time} {prediction.Type} {prediction.Velocity_Major}
            </p>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    // update the rotation when that state changes
    const svg = document.querySelector(`#arrow-${station.id}`);
    if (svg) {
      console.log('useEffect', rotation);
      svg.style.transform = `rotate(${rotation}deg)`;
    }
  });

  // IMPORTANT NOTES:
  // Callback for useEffect can't BE async
  //  but you can use an async func within the callback
  // useEffect must return a cleanup function or nothing

  // props: {position: [lat,lon], stationId: xx, stationName: xx, url:??}
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
        {currentsData ? currentsData : "Can't show the data"}
        <p>{randomText}</p>
        {/* <div>{currentData}</div> */}
      </Popup>
    </Marker>
  );
};

export default CurrentsMarker;
/* 
 <Marker position={[37.833063, -122.471861]}>
  <Popup>
<h2>Station: SFB1203</h2>
<h2>Golden Gate Bridge</h2>
<table>
  <thead>
    <tr>
      <th>Date/Time (LST/LDT)</th>
      <th>Speed (knots)</th>
      <th>Dir (true)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>2012-05-29 00:00:00</td>
      <td>1.20</td>
      <td>217</td>
    </tr>
    <tr>
      <td>2012-05-29 00:06:00</td>
      <td>1.42</td>
      <td>221</td>
    </tr>

  </tbody>
</table>
</Popup>
</Marker> */
