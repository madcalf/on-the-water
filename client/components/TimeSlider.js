import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { setTime } from '../store';
import { format, addMinutes, closestTo } from 'date-fns';
import { scaleTime } from 'd3-scale';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

// // displays in the value label, if it's on
function valuetext(value) {
  return `Time: ${value}`;
}

export function TimeSlider({ date, time, setTime }) {
  const classes = useStyles();
  let [dateTime, setDateTime] = useState();

  const today = format(new Date(), 'MMMM dd yyyy h:mm aaa');

  function handleChange(event, minutes) {
    let dt = new Date(date);
    dt = addMinutes(new Date(date), minutes);
    console.log(dt);

    // local state to display in this component
    setDateTime(format(dt, 'MMMM dd yyyy h:mm aaa'));

    // app state
    setTime(minutes);
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        <span className="time-slider-header">{time}</span>
      </Typography>
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={10}
        marks
        min={0}
        max={1439}
        valueLabelDisplay="off"
        onChange={handleChange}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    date: state.date,
    time: state.time.ms,
  };
};
export default connect(mapStateToProps, { setTime })(TimeSlider);
