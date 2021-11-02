import React, { useState, useEffect } from 'react';
// import Grid from '@material-ui/core/Grid';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';
import { Stack, Card, Button, Badge } from 'react-bootstrap';

const UIOverlay = (props) => {
  useEffect(() => {});

  return (
    <Card className="overlay flex-row">
      <DatePicker />
      <TimeSlider />
    </Card>
  );
};

export default UIOverlay;
