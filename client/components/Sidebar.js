import React, { useState } from 'react';
import {
  Card,
  Image,
  Offcanvas,
  Stack,
  ListGroupItem,
  ListGroup,
} from 'react-bootstrap';
import poiIcon from '../images/kayak_marker.svg';
import hamburgerIcon from '../images/hamburger.svg';
import currentIcon from '../images/currents_arrow.svg';
import tideIcon from '../images/tide_low.png';
import mapIcon from '../images/tide_low.png';

const Sidebar = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const hamburgerIcon = (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     viewBox="0 0 30 30"
  //     width="30"
  //     height="30"
  //     focusable="false"
  //   >
  //     <title>Menu</title>
  //     <path
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeMiterlimit="10"
  //       d="M4 7h22M4 15h22M4 23h22"
  //     />
  //   </svg>
  // );

  return (
    <>
      <div className="hamburger" onClick={handleShow}>
        <img src={hamburgerIcon} alt="" />
      </div>
      {/* <div className="hamburger" onClick={handleShow}>
        {hamburgerIcon}
      </div> */}

      <Offcanvas
        className="sidebar p-3 text-center"
        show={show}
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <h1>On the Water</h1>
        </Offcanvas.Header>

        <Card>
          <Card.Body>
            <h3>A Kayak Trip Planning Tool</h3>
            <p>Or an excuse to play with maps and APIs </p>

            <div className="legendItem">
              <img src={mapIcon} alt="icon" />
              <p>Change the basemap</p>
            </div>

            <div className="legendItem">
              <img src={poiIcon} alt="icon" />
              <p>Launch site or landing</p>
            </div>

            <div className="legendItem">
              <img src={currentIcon} alt="icon" />
              <p>View full current table</p>
            </div>

            <div className="legendItem">
              <img src={tideIcon} alt="icon" />
              <p>View full tide table</p>
            </div>

            {/* 
              <ListGroupItem>
                <img src="images/kayak_marker.svg" alt="icon" />
                Click the markers to see info about a feature
              </ListGroupItem>

              <ListGroupItem>
                <img src="images/tide_low.png" alt="icon" />
                Click the markers to see info about a feature
              </ListGroupItem> */}
          </Card.Body>
        </Card>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
