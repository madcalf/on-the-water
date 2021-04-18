import React from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { svgString } from '../../public/leaflet-images/div-icon-arrow.svg';
import getSvg from '../helpers/getSvg';

const CurrentsMarker = (props) => {
  // const map = useMapEvents({
  //   click(e) {
  //     console.log('CLICK');
  //     handleClick(e);
  //   },
  // });

  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');

  const thisSvg = getSvg(props.station.stationId);
  // console.log(thisSvg);

  Icon.Default.imagePath = 'leaflet-images/';
  const icon = L.divIcon({
    className: 'my-div-icon',
    // iconUrl: Icon.Default.imagePath + 'current_arrow.svg',
    iconSize: [30, 50],
    iconAnchor: [25, 0],
    html: `${thisSvg}`,
  });

  const handleClick = (e) => {
    console.log('HANDLE CLICK', e);
    // let svg = document.querySelector('.my-div-icon svg #arrow');
    let svg = document.querySelector(`#arrow-${station.stationId}`);
    console.log('svg', svg);
    svg.style.transform = 'rotate(10deg)';
  };

  // props: {position: [lat,lon], stationId: xx, stationName: xx, url:??}
  return (
    <Marker
      eventHandlers={{ click: handleClick }}
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
