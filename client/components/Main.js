import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import MapView from './Mapview';
import UIOverlay from './UIOverlay';

const Home = () => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <MapView />
      <UIOverlay />
    </MuiPickersUtilsProvider>
  );
};

export default Home;
