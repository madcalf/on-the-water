import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setDate } from '../store/';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { stripTimeFromDate } from '../helpers/util';

const DatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    return stripTimeFromDate(new Date());
  });

  const handleChange = (date, value) => {
    // local state for display in this component
    setSelectedDate(stripTimeFromDate(date));
  };

  useEffect(() => {
    // update app state to local state
    props.setDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="datePicker">
      <KeyboardDatePicker
        autoOk
        margin="normal"
        variant="inline"
        // showTodayButton={true}// only works on dialog variant
        id="date-picker-keyboard"
        format="MMMM dd yyyy"
        value={selectedDate}
        onChange={handleChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </div>
  );
};

export default connect(null, { setDate })(DatePicker);
