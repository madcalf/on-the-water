import React, { useState, useEffect } from 'react';
// import Grid from '@material-ui/core/Grid';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';
import { Stack, Card } from 'react-bootstrap';

const UIOverlay = (props) => {
  useEffect(() => {});

  return (
    <div className="overlay">
      <Card>
        <DatePicker />
        <TimeSlider />
      </Card>
    </div>
  );
};

export default UIOverlay;
