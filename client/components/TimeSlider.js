import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { setTime } from '../store';
import { subDays, startOfToday, format } from 'date-fns'; // not sure if i need these
import { scaleTime } from 'd3-scale';
import { addMinutes, closestTo, closestIndexTo } from 'date-fns';

const useStyles = makeStyles({
  root: {
    width: 300,
  },
});

// // displays in the value label, if it's on
function valuetext(value) {
  return `${value}°C`;
}

export function TimeSlider(props) {
  const classes = useStyles();
  let [dateTime, setDateTime] = useState();
  const today = format(new Date(), 'MMMM dd yyyy h:mm aaa');

  function handleChange(event, minutes) {
    let dt = new Date(props.date);
    dt = addMinutes(new Date(props.date), minutes);
    setDateTime(format(dt, 'MMMM dd yyyy h:mm aaa'));

    // send minutes to app state
    props.setTime(minutes);
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        <span className="time-slider-header">
          {dateTime ? dateTime : today}
        </span>
      </Typography>
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={10}
        marks
        min={0}
        max={1430}
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
