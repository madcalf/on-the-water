import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import MapView from './Mapview';
import UIOverlay from './UIOverlay';

const Home = () => {
  return (
    <>
      <MapView />
      <UIOverlay />
    </>
  );
};

export default Home;
