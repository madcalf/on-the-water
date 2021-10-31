import React, { Fragment } from 'react';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import UIOverlay from './components/UIOverlay';

import './app.scss';

const App = () => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Container fluid>
        <Row>
          <Col xs={12} md={3}>
            <Sidebar />
          </Col>
          <Col>
            <MapView />
            <UIOverlay />
          </Col>
        </Row>
      </Container>
      {/* <main className="content">
        <Sidebar />
        <MapView className="mapView" />
      </main> */}

      {/* <header className={'header'}>
        <h1>On The Water</h1>
        <p>Trip Planning tool for coastal kayakers</p>
      </header> */}
    </MuiPickersUtilsProvider>
  );
};

export default App;
