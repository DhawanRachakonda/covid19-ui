import React from 'react';
import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import './AppFilter.css';

import { useAppDispatch, useAppFormState } from './AppContext';
import { FormattedMessage } from 'react-intl';

function AppFilter({ id = 'search-bar' }) {
  const dispatch = useAppDispatch();

  const setSelectedDate = (date) => {
    dispatch({
      type: 'SET_DATE',
      payload: {
        value: date
      }
    });
  };

  const { selectedDate } = useAppFormState();

  return (
    <Form.Group controlId="formBasicPassword">
      <Form.Label>Date</Form.Label>
      <DatePicker
        className="form-control"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        maxDate={new Date()}
      />
      <Form.Text className="text-muted">
        <FormattedMessage id="app.applyFiltersOnMap.date.info" />
      </Form.Text>
    </Form.Group>
  );
}

export default AppFilter;
