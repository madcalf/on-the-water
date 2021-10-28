import React, { useState } from 'react';
import { connect } from 'react-redux';
import { setDate } from '../store/';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { format } from 'date-fns';

const DatePicker = (props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  //
  const handleChange = (date, value) => {
    console.dir(date);
    console.dir(value);
    // local state for display
    setSelectedDate(value);
    // app state
    props.setDate(date);
    // props.setDate(format(date, 'yyyyMMdd'));
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
