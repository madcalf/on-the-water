import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import makeSvg from '../helpers/makeSvg';

const CurrentsMarker = (props) => {
  const [rotation, setRotation] = useState(0);

  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');

  const iconSvg = makeSvg(props.station.stationId);

  Icon.Default.imagePath = 'leaflet-images/';
  // using divIcon so we can embed an SVG. This will allow
  // us to rotate via css or apply other styling as needed.
  const icon = L.divIcon({
    className: 'my-div-icon',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    html: `${iconSvg}`,
  });

  // const handleClick = (e) => {
  //   // let svg = document.querySelector('.my-div-icon svg #arrow');
  //   let svg = document.querySelector(`#arrow-${station.stationId}`);
  //   const rot = svg.style.transform;
  //   const r = Math.random() * 360; // temp
  //   setRotation(rotation + 10);
  //   svg.style.transform = `rotate(15deg)`;
  // };

  useEffect(() => {
    // update the rotation when that state changes
    const svg = document.querySelector(`#arrow-${station.stationId}`);
    if (svg) {
      svg.style.transform = `rotate(${rotation}deg)`;
    }
  });

  // props: {position: [lat,lon], stationId: xx, stationName: xx, url:??}
  return (
    <Marker
      eventHandlers={{ click: () => setRotation(rotation + 10) }}
      rotationAngle={30}
      position={station.position}
      icon={icon}
    >
      <Popup className="kp-popup">
        <h3 className="kp-popup-header">
          {station.stationId} {title}
        </h3>
        <p className="kp-popup-text">{subtitle}</p>
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
