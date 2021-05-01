import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setDate } from '../store/';
import { KeyboardDatePicker } from '@material-ui/pickers';

const DatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //
  const handleChange = (event, value) => {
    // props.setDate(value);
    setSelectedDate(value);
    console.log(value);
  };

  return (
    <KeyboardDatePicker
      margin="normal"
      variant="inline"
      id="date-picker-dialog"
      label="Date picker dialog"
      format="MM/dd/yyyy"
      value={selectedDate}
      onChange={handleChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  );
};

export default connect(null, { setDate })(DatePicker);
