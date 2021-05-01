import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { setTime } from '../store';
import { subDays, startOfToday, format } from 'date-fns'; // not sure if i need these
import { scaleTime } from 'd3-scale';

const useStyles = makeStyles({
  root: {
    width: 500,
  },
});

// displays in the value label, if it's on
// not sure why this exists outside the component function
function valuetext(value) {
  return `${value}°C`;
}

export function TimeSlider(props) {
  const classes = useStyles();

  function handleChange(event, value) {
    // console.log(value);
    props.setTime(value);
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-small-steps" gutterBottom>
        Small steps
      </Typography>
      <Slider
        defaultValue={0.00000005}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-small-steps"
        step={5}
        marks
        min={0}
        max={1440}
        valueLabelDisplay="auto"
        onChange={handleChange}
      />
    </div>
  );
}

export default connect(null, { setTime })(TimeSlider);
