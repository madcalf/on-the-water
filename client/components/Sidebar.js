import React, { Component, Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>On the Water</h2>
      <h3>Kayak Trip Planning Tool</h3>
      <p>Click the button on the top right to change the basemap</p>
      <p>Click the markers to see info about a feature</p>

      <Grid container justify="space-around">
        <DatePicker />
        <div className="sliderContainer">
          <TimeSlider />
        </div>
      </Grid>
    </div>
  );
};

export default Sidebar;
