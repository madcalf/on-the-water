import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Marker, Popup, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { setMarker } from '../store';
import { getPoiIcon } from '../helpers/makeSvg';

const POIMarker = ({ station, marker, selectMarker }) => {
  const map = useMap();

  // rotation of marker icon
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(0);
  const [selected, setselected] = useState(false);

  // for some reason some city names have underscores in them
  const city = station.city.replace('_', ' ');
  const poiIcon = getPoiIcon();
  const loadingIcon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [25, 25],
    iconSize: L.point(15, 15),
    html: `<div class="poi-icon loader"/>`,
  });

  const icon = L.divIcon({
    className: 'my-div-icon',
    iconAnchor: [32, 32],
    iconSize: L.point(32, 32),
    html: `<div class="poi-icon">${poiIcon}</div>`,
  });

  const handleClick = () => {
    selectMarker(station.xid);
  };

  useEffect(() => {
    setselected(marker === station.xid);
  }, [marker]);

  return (
    <Marker
      eventHandlers={{ click: () => handleClick() }}
      className="marker-class"
      position={[station.marker.lat, station.marker.lng]}
      icon={isLoading ? loadingIcon : icon}
    >
      <Popup className="kp-popup" maxWidth={500} maxHeight={300}>
        <h3 className="kp-popup-header">{station.title}</h3>
        <p className="kp-popup-text">{city}</p>
        <div
          className="kp-popup-text"
          dangerouslySetInnerHTML={{ __html: station.details }}
        ></div>
      </Popup>
    </Marker>
  );
};

const mapState = (state) => {
  return {
    marker: state.marker,
  };
};

const mapDispatch = (dispatch) => {
  return {
    selectMarker: (stationId) => dispatch(setMarker(stationId)),
  };
};

export default connect(mapState, mapDispatch)(POIMarker);
