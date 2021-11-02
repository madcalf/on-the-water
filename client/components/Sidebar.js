import React, { useState } from 'react';
import { Card, Offcanvas, ListGroupItem, ListGroup } from 'react-bootstrap';
import poiIcon from '../images/kayak_marker.svg';
import hamburgerIcon from '../images/hamburger.svg';
import currentIcon from '../images/currents_arrow.svg';
import tideIcon from '../images/tide_low.svg';

const Sidebar = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="hamburger" onClick={handleShow}>
        <img src={hamburgerIcon} alt="" />
      </div>

      <Offcanvas
        className="sidebar p-3 text-center"
        show={show}
        onHide={handleClose}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <h1>On the Water</h1>
        </Offcanvas.Header>

        <Card>
          <Card.Body>
            <h3>A Kayak Trip Planning Tool</h3>
            <p>Really just an excuse to play with maps and APIs </p>

            <ListGroup className="legend">
              <ListGroupItem className="border-0">
                <div className="legendItem poi">
                  <img src={poiIcon} alt="icon" />
                  <p>Launch site or landing</p>
                </div>
              </ListGroupItem>

              <ListGroupItem className="border-0">
                <div className="legendItem current">
                  <img src={currentIcon} alt="icon" />
                  <p>Current Marker</p>
                </div>
              </ListGroupItem>

              <ListGroupItem className="border-0">
                <div className="legendItem tide">
                  <img src={tideIcon} alt="icon" />
                  <p>Tide Marker</p>
                </div>
              </ListGroupItem>

              <ListGroupItem className="border-0">
                <p>
                  Use the date selector and time slider to view tides and
                  currents at the desired time
                </p>
              </ListGroupItem>

              <ListGroupItem className="border-0">
                <p>Click any marker to view more details</p>
              </ListGroupItem>
            </ListGroup>
          </Card.Body>
          <Card.Footer className="text-muted">
            <p>Inspired by the following super cool sites:</p>
            <p>
              <a href="http://bask.org/TripPlanner">BASK Trip Planner</a>
            </p>
            <p>
              <a href="http://deepzoom.com">Deep Zoom</a>
            </p>
          </Card.Footer>
        </Card>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
