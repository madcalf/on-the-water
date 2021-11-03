import React, { useEffect } from 'react';
import * as L from 'leaflet';
import { Icon } from 'leaflet';
import {
  LayersControl,
  LayerGroup,
  MapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
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

function MapEventTracker() {
  const map = useMapEvents({
    click: () => {
      // console.log('Finding your location...');
      map.locate();
    },
    locationfound: (location) => {
      // map.flyTo(location.latlng);
      // console.log('location found:', location);
    },
    moveend: (args) => {
      console.log('moveEnd', args);
    },
  });
  return null;
}

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

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      {/* <MapEventTracker /> */}
      <ZoomControl position="bottomright" />
      <LayersControl position="bottomright">
        git{' '}
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
              return <TidesMarker key={station.id} station={station} />;
            })}
          </LayerGroup>

          {/* CURRENTS STATIONS */}
          <LayersControl.Overlay checked name="Currents Stations (NOAA)">
            <LayerGroup>
              {noaaCurrents.map((station) => {
                return <CurrentsMarker key={station.id} station={station} />;
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default MapView;
