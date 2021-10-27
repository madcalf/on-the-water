import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';

const UIOverlay = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  /*  */
  //
  useEffect(() => {});

  return (
    <div className="overlay">
      <Grid container justify="space-around">
        <DatePicker />
        <TimeSlider />
        <div>Welcome to Mordor!!!!</div>
        <div>{`${selectedDate}`}</div>
      </Grid>
    </div>
  );
};

export default UIOverlay;
