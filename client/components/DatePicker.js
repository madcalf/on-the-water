import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setDate } from '../store/';
import { KeyboardDatePicker } from '@material-ui/pickers';

const DatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //
  const handleChange = (date, value) => {
    console.dir(date);
    console.dir(value);
    setSelectedDate(value);
    props.setDate(value);
  };

  return (
    <KeyboardDatePicker
      autoOk
      margin="normal"
      variant="inline"
      // showTodayButton={true}// only works on dialog variant
      id="date-picker-dialog"
      label="Date picker dialog"
      format="MM/dd/yyyy HH:mm"
      value={selectedDate}
      onChange={handleChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  );
};

export default connect(null, { setDate })(DatePicker);
