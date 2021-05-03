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
    width: 500,
  },
});

// // displays in the value label, if it's on
function valuetext(value) {
  return `${value}°C`;
}

export function TimeSlider(props) {
  const classes = useStyles();
  let [dateTime, setDateTime] = useState();

  function handleChange(event, value) {
    let dateTime = new Date(props.date);
    dateTime = addMinutes(new Date(props.date), value);
    setDateTime(format(dateTime, 'MM/dd/yyyy HH:mm'));
    // console.log('dateTime', props.date);
    props.setTime(value);
    // console.log('time', props.time);
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        <span className="time-slider-header">{dateTime}</span>
      </Typography>
      <Slider
        defaultValue={0}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={10}
        marks
        min={0}
        max={1440}
        valueLabelDisplay="auto"
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
