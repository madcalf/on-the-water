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
      <Container fluid className="p-0">
        <Row className="m-0">
          <Col className="d-flex p-0 justify-content-center position-relative">
            <Sidebar />
            <MapView />
            <UIOverlay />
          </Col>
        </Row>
      </Container>
    </MuiPickersUtilsProvider>
  );
};

export default App;
