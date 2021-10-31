import React from 'react';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import {
  LayersControl,
  LayerGroup,
  Circle,
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';
import CurrentsMarker from './CurrentsMarker';
import TidesMarker from './TidesMarker';
import POIMarker from './POIMarker';
import noaaCurrentsData from '../../public/data/noaa_stations_currents.json';
import noaaTidesData from '../../public/data/noaa_stations_tides.json';
import baskData from '../../public/data/bask_datapoints.json';
// Later...
// import BuoyMarker from './BuoyMarker';
// import noaaMet from '../../public/data/noaa_stations_met.json';

export const MapView = (props) => {
  Icon.Default.imagePath = 'leaflet-images/';

  const icon = new Icon({
    iconUrl: Icon.Default.imagePath + 'kayak_marker.png',
    iconSize: [15, 15],
    iconAnchor: [13, 0],
    className: 'map-icon',
  });

  const center = [37.818809, -122.478161]; // SF
  // const center = [40.69993, -73.997876]; // NYC

  const maxDistMeters = 70000; //805000;

  // filter the bask data to something managable
  const pois = baskData.filter((station) => {
    const stationPos = L.latLng(station.marker.lat, station.marker.lng);
    return (
      station.xid !== '' &&
      station.marker &&
      station.station_type === 'destination' &&
      stationPos.distanceTo(L.latLng(center)) < maxDistMeters
    );
  });

  // note need to filter out the dupes try by only including
  // the first station encountered. That seems to be the
  // smallest depth version.
  let memo = [];
  const noaaCurrents = noaaCurrentsData.stations.filter((station) => {
    const stationPos = L.latLng(station.lat, station.lng);
    if (memo.includes(station.id)) {
      return false;
    } else {
      memo.push(station.id);
      return (
        station.id !== '' &&
        station.type === 'H' &&
        stationPos.distanceTo(L.latLng(center)) < maxDistMeters
      );
    }
  });

  // note need to filter out the dupes try by only including
  // the first station encountered. That seems to be the
  // smallest depth version.
  memo = [];
  const noaaTides = noaaTidesData.stations.filter((station) => {
    const stationPos = L.latLng(station.lat, station.lng);
    if (memo.includes(station.id)) {
      return false;
    } else {
      memo.push(station.id);
      return (
        station.type === 'R' &&
        station.id !== '' &&
        stationPos.distanceTo(L.latLng(center)) < maxDistMeters
      );
    }
  });

  console.log('BASK ALL', baskData[0].marker.lat);
  // console.log('BASK CURRENTS', baskCurrents.length);
  // console.log('BASK TIDES', baskTides.length);
  console.log('NOAA CURRENTS', noaaCurrents.length);
  console.log('NOAA TIDES', noaaTides.length);
  console.log('BASK POIs', pois.length);

  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom={true}>
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Esri.WorldImagery">
          <TileLayer
            attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="NOAA Nautical Charts">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">NOAA</a> contributors'
            url="//tileservice.charts.noaa.gov/tiles/50000_1/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Points of Interest">
          {/* POINTS OF INTEREST */}
          <LayerGroup>
            {pois.map((station) => {
              return <POIMarker key={station.xid} station={station} />;
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* TIDES STATIONS */}
        <LayersControl.Overlay checked name="Tide Stations (NOAA)">
          <LayerGroup>
            {noaaTides.map((station) => {
              const data = {};
              data.type = station.type;
              data.position = [station.lat, station.lng];
              data.id = station.id;
              data.stationName = station.name;
              return <TidesMarker key={data.id} station={data} />;
            })}
          </LayerGroup>

          {/* CURRENTS STATIONS */}
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
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default MapView;
