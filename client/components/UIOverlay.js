import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TimeSlider from './TimeSlider';
import DatePicker from './DatePicker';

const UIOverlay = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  // for date picker
  // const handleDateChange = (date) => {
  //   console.log('date:', date);
  //   setSelectedDate(date);
  // };

  // // for time picker
  // const handleTimeChange = (date) => {
  //   console.log('date:', date.getTime());
  //   setSelectedTime(date.getTime());
  // };

  // // for time slider
  // const handleUpdate = (event) => {
  //   console.log(event);
  // };

  useEffect(() => {});

  return (
    <div className="overlay">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around">
          <DatePicker />
          <TimeSlider />
          <div>{`${selectedDate}`}</div>

          {/* <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            label="Time picker"
            value={selectedDate}
            onChange={handleTimeChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          /> */}
        </Grid>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default UIOverlay;
