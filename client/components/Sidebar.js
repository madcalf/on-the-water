import React, { useState } from 'react';
// import Grid from '@material-ui/core/Grid';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';
import { Card, Button, Image, Offcanvas } from 'react-bootstrap';

const Sidebar = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Image
        className="hamburger"
        src="images/hamburger.svg"
        onClick={handleShow}
      />

      <Offcanvas className="sidebar" show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <h2>On the Water</h2>
        </Offcanvas.Header>

        <Card>
          {/* <Card.Header>Some header thing</Card.Header> */}
          <Card.Body>
            <Card.Title>Title</Card.Title>
          </Card.Body>

          <h3>Kayak Trip Planning Tool</h3>
          <p>Click the button on the top right to change the basemap</p>
          <p>Click the markers to see info about a feature</p>
        </Card>

        {/* <Offcanvas.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Offcanvas.Body> */}
      </Offcanvas>

      {/* 
      <Grid container justify="space-around">
        <DatePicker />
        <div className="sliderContainer">
          <TimeSlider />
        </div>
      </Grid>
       */}
    </>
  );
};

export default Sidebar;
