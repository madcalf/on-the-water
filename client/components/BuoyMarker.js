import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';

const TidesMarker = (props) => {
  const icon = new Icon({
    iconUrl: Icon.Default.imagePath + 'tide_low.png',
    iconSize: [50, 60],
    iconAnchor: [25, 0],
    className: 'map-icon',
  });

  const station = props.station;
  const isCurrent = station.type === 'current';

  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  // props: {position: [lat,lon], stationId: xx, stationName: xx, url:??}
  return (
    <Marker position={station.position} icon={icon}>
      <Popup className="kp-popup">
        <h3 className="kp-popup-header">
          Station {station.stationId}: {title}
        </h3>
        <p className="kp-popup-text">{subtitle}</p>
      </Popup>
    </Marker>
  );
};

export default TidesMarker;
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
