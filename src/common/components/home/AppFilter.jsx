import React from 'react';
import { Navbar, Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import './AppFilter.css';

import { useAppDispatch, useAppFormState } from './AppContext';

function AppFilter({ id = 'search-bar' }) {
  const [isFixed, setFixedTop] = React.useState(false);

  React.useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px'
    };
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) =>
          entry.isIntersecting ? setFixedTop(false) : setFixedTop(true)
        ),
      options
    );
    const target = document.querySelector('#app-header');
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const dispatch = useAppDispatch();

  const setSelectedUser = (e) => {
    dispatch({
      type: 'SET_USER',
      payload: {
        value: e.currentTarget.value
      }
    });
  };

  const setSelectedDate = (date) => {
    dispatch({
      type: 'SET_DATE',
      payload: {
        value: date
      }
    });
  };

  const applyFilter = (e) => {
    e.preventDefault();
    dispatch({
      type: 'APPLY_FILTER'
    });
  };

  const reset = (e) => {
    dispatch({
      type: 'RESET'
    });
  };

  const { selectedUser, selectedDate } = useAppFormState();

  return (
    <Navbar
      className={`bg-light justify-content-between search-bar ${
        isFixed ? 'fixed-top' : ''
      }`}
      id={id}
      bg="dark"
      variant="dark"
    >
      <Form inline>
        <Row>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Col>
              <Form.Label className="text-color--white">Select User</Form.Label>
            </Col>
            <Col>
              <Form.Control as="select" custom onChange={setSelectedUser}>
                <option value="0" selected={selectedUser === '1'}>
                  Select User
                </option>
                <option value="1" selected={selectedUser === '1'}>
                  User 1
                </option>
                <option value="2" selected={selectedUser === '2'}>
                  User 2
                </option>
                <option value="3" selected={selectedUser === '3'}>
                  User 3
                </option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Form.Group>
            <Col>
              <Form.Label className="text-color--white">Date</Form.Label>
            </Col>
            <Col>
              <DatePicker
                className="form-control"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </Col>
          </Form.Group>
          <Form.Group>
            <Button type="submit" onClick={applyFilter}>
              Apply FIlter
            </Button>
            <Button type="reset" onClick={reset} className="margin-left--2">
              Reset
            </Button>
          </Form.Group>
        </Row>
      </Form>
    </Navbar>
  );
}

export default AppFilter;
