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
  const [currentsData, setCurrentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // marker icon init
  const station = props.station;
  const name = station.stationName.split(',');
  const title = name.shift();
  const subtitle = name.join(',');
  const iconSvg = makeSvg(props.station.id);
  Icon.Default.imagePath = 'leaflet-images/';

  // using divIcon so we can embed an SVG. This will allow
  // us to rotate via css or apply other styling as needed.
  // Also try: rotating an image instead of the svg

  // Note: the icon size below appears to be ignored or
  // maybe overridden by the css or the svg directly?
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

  // load predictions so we can set the arrow directions
  useEffect(() => {
    fetchData();
  }, []);

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
      </Popup>
    </Marker>
  );
};

export default CurrentsMarker;
