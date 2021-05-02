import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import {
  LayersControl,
  LayerGroup,
  Circle,
  FeatureGroup,
  Rectangle,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import CurrentsMarker from './CurrentsMarker';
import TidesMarker from './TidesMarker';
import BuoyMarker from './BuoyMarker';

import baskData from '../../public/data/bask_datapoints.json';
import noaaCurrentsData from '../../public/data/noaa_stations_currents.json';
import noaaTidesData from '../../public/data/noaa_stations_tides.json';
import noaaMet from '../../public/data/noaa_stations_met.json';
// END IMPORTS //

export const MapView = (props) => {
  Icon.Default.imagePath = 'leaflet-images/';

  const icon = new Icon({
    iconUrl: Icon.Default.imagePath + 'kayak_marker.png',
    iconSize: [25, 25],
    iconAnchor: [13, 0],
    className: 'map-icon',
  });

  const center = [37.818809, -122.478161];
  const maxDistMeters = 5000; //805000;

  // filter the bask data to something managable
  const baskCurrents = baskData.filter((station) => {
    const stationPos = L.latLng(station.marker.lat, station.marker.lng);
    return (
      station.noaa_id !== '' &&
      station.marker &&
      station.station_type === 'current' &&
      stationPos.distanceTo(L.latLng(center)) < maxDistMeters
    );
  });

  const baskTides = baskData.filter((station) => {
    const stationPos = L.latLng(station.marker.lat, station.marker.lng);
    return (
      station.noaa_id !== '' &&
      station.marker &&
      station.station_type === 'tide' &&
      stationPos.distanceTo(L.latLng(center)) < maxDistMeters
    );
  });

  // note need to filter out the dupes try by only including
  // the first station encountered. That seems to be the
  // smallest depth version.
  const memo = [];
  const noaaCurrents = noaaCurrentsData.stations.filter((station) => {
    const stationPos = L.latLng(station.lat, station.lng);
    if (memo.includes(station.id)) {
      return false;
    } else {
      memo.push(station.id);
      return (
        station.id !== '' &&
        stationPos.distanceTo(L.latLng(center)) < maxDistMeters
      );
    }
  });

  // console.log('noaa currents length', noaaCurrents.length, memo);

  console.log('BASK ALL', baskData[0].marker.lat);
  console.log('BASK CURRENTS', baskCurrents.length);
  console.log('BASK TIDES', baskTides.length);

  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom={true}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Open Topo Map">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="NOAA Nautical Charts">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">NOAA</a> contributors'
            url="//tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Play Spots!">
          <LayerGroup>
            <Marker position={[37.813769, -122.52929]} icon={icon}>
              <Popup>
                <h2>Pt Bonita</h2> A nice spot to play! Watch out for the big
                waves tho...
              </Popup>
            </Marker>
            <Marker position={[37.824613, -122.477839]} icon={icon}>
              <Popup>
                <h2>Lime Point</h2>
                Can get some dicey swell here
              </Popup>
            </Marker>
            <Marker position={[37.826149, -122.487612]} icon={icon}>
              <Popup>
                <h2>Kirby Rock</h2>
                Great spot for beginner rock gardening
              </Popup>
            </Marker>
            <Marker position={[37.826597, -122.490004]} icon={icon}>
              <Popup>
                <h2>Kirby Cove</h2>
                Mild (mostly) beach to practice surf launches and landings
              </Popup>
            </Marker>
            <Marker position={[37.833063, -122.471861]} icon={icon}>
              <Popup>
                <h2>Yellow Bluff</h2>
                Wild times to be had in this bouncy tide race!
              </Popup>
            </Marker>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay unchecked name="Current Stations (BASK)">
          <LayerGroup>
            {baskCurrents.map((station) => {
              const data = {};
              data.type = station.station_type;
              data.position = [station.marker.lat, station.marker.lng];
              data.id = station.noaa_id.split('_')[0];
              data.stationName = station.title;
              {
                /* return <CurrentsMarker key={data.id} station={data} />; */
              }
            })}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Tide Stations (BASK)">
          <LayerGroup name="Tide Stations">
            {baskTides.map((station) => {
              const data = {};
              data.type = station.station_type;
              data.position = [station.marker.lat, station.marker.lng];
              data.id = station.noaa_id.split('_')[0];
              data.stationName = station.title;
              return <TidesMarker key={data.id} station={data} />;
            })}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Currents Stations (NOAA)">
          <LayerGroup>
            {noaaCurrents.map((station) => {
              const data = {};
              data.type = station.type;
              data.position = [station.lat, station.lng];
              data.id = station.id;
              data.stationName = station.name;
              return <CurrentsMarker key={data.id} station={data} />;
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
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

export default connect(mapState)(MapView);
