import React from 'react';
import { connect } from 'react-redux';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

Icon.Default.imagePath = 'leaflet-images/';
const style = document.documentElement.style;

function rotateMarker() {
  console.log('ROTATE MARKER??');
  var img = document.querySelector('map-marker');
  img.style.transform = 'rotate(25deg)';
}

const icon = new Icon({
  iconUrl: Icon.Default.imagePath + 'favicon.png',
  iconSize: [25, 25],
  className: 'map-marker',
});

export const MapViewer = (props) => {
  // const tileLayer =
  //   'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
  // const options = {
  //   attribution:
  //     'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  //   maxZoom: 18,
  //   id: 'mapbox/streets-v11',
  //   tileSize: 512,
  //   zoomOffset: -1,
  //   accessToken: 'your.mapbox.access.token',
  // };

  return (
    <div id="map-viewer">
      <div id="map">
        <MapContainer
          center={[37.386051, -122.083855]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="//tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png"
          />
          <Marker
            position={[37.386051, -122.083855]}
            icon={icon}
            onClick={() => {
              console.log('ROTATE MARKER??');
              // var img = document.querySelector('map-marker');
              // img.style.transform = 'rotate(25deg)';
            }}
          >
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(MapViewer);
