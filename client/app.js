import React, { Fragment } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
// import styles from './app.module.scss';

const App = () => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <main className="content">
        <Sidebar />
        <MapView className="mapView" />
      </main>
      {/* <header className={'header'}>
        <h1>On The Water</h1>
        <p>Trip Planning tool for coastal kayakers</p>
      </header> */}
    </MuiPickersUtilsProvider>
  );
};

export default App;
