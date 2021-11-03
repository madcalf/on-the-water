import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { setAdjustedDate } from '../store';
import { format, addMinutes } from 'date-fns';

const useStyles = makeStyles({
  root: {
    width: 200,
  },
});

// // displays in the value label, if it's on
function valueText(value) {
  return `Time: ${value}`;
}

export function TimeSlider({ date, adjustedDate, setAdjustedDate }) {
  const classes = useStyles();
  let [currentValue, setCurrentValue] = useState(date);

  function handleChange(event, minutes) {
    const d = addMinutes(new Date(date), minutes);
    setCurrentValue(d);
  }

  useEffect(() => {
    setAdjustedDate(currentValue);
  }, [currentValue]);

  return (
    <div className="timeSlider">
      <Typography id="discrete-slider-small-steps" gutterBottom>
        <span className="timeSliderHeader">
          {format(currentValue, 'h:mm aaa')}
        </span>
      </Typography>
      <Slider
        defaultValue={0}
        getAriaValueText={valueText}
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
    adjustedDate: state.adjustedDate,
  };
};
export default connect(mapStateToProps, { setAdjustedDate })(TimeSlider);
