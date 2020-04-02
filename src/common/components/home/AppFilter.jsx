import React from 'react';
import { Navbar, Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import './AppFilter.css';

import { useAppDispatch, useAppFormState } from './AppContext';
import SuccessToaster, { FailureToaster } from '../toaster/SuccessToaster';

const SCALAR_E7 = 0.0000001;

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

  const [isFetchingVisitPlaces, setIsFetchingVisitPlaces] = React.useState(
    false
  );

  const [errorObject, setErrorObject] = React.useState({
    isErrorOccurred: false,
    errorMessage: ''
  });

  const uploadVisitedPlaces = React.useCallback(
    (e) => {
      dispatch({
        type: 'RESET_PLACES_VISITED'
      });
      setIsFetchingVisitPlaces(true);
      const file = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function(evt) {
        try {
          const { timelineObjects = [] } = JSON.parse(evt.target.result);
          const placesVisited = timelineObjects.map((object, index) => {
            const {
              placeVisit = { location: { name: '' }, duration: {} }
            } = object;
            let reportedOn = '';
            if (
              placeVisit.duration.startTimestampMs &&
              !isNaN(Number(placeVisit.duration.startTimestampMs))
            ) {
              const reportedDateTime = new Date(
                Number(placeVisit.duration.startTimestampMs)
              );
              // Format : DD-MM-YYYY
              const date = `0${reportedDateTime.getDate()}`.slice(-2);
              const month = `0${reportedDateTime.getMonth() + 1}`.slice(-2);
              reportedOn = `${date}-${month}-${reportedDateTime.getFullYear()}`;
            }
            return {
              latitude: placeVisit.location.latitudeE7
                ? placeVisit.location.latitudeE7 * SCALAR_E7
                : 0,
              longitude: placeVisit.location.longitudeE7
                ? placeVisit.location.longitudeE7 * SCALAR_E7
                : 0,
              addressName: placeVisit.location.address
                ? `${placeVisit.location.name}\n${placeVisit.location.address}`
                : '',
              dateField: reportedOn,
              id: placeVisit.location.placeId + index
            };
          });
          dispatch({
            type: 'SET_PLACES_VISITED',
            payload: {
              data: placesVisited
            }
          });
        } catch (error) {
          setErrorObject({
            isErrorOccurred: true,
            errorMessage: error.message
          });
          setTimeout(
            () => setErrorObject({ isErrorOccurred: false, errorMessage: '' }),
            3000
          );
        }
        setIsFetchingVisitPlaces(false);
      };
      reader.onerror = function(evt) {
        setIsFetchingVisitPlaces(false);
        setErrorObject({
          isErrorOccurred: true,
          errorMessage: 'error Reading File'
        });
        setTimeout(
          () => setErrorObject({ isErrorOccurred: false, errorMessage: '' }),
          3000
        );
      };
    },
    [dispatch]
  );

  const setOpacity = () => {
    dispatch({
      type: 'SET_OPACITY_FOR_MAP',
      payload: {
        value: 'opacity-05'
      }
    });
  };

  const unSetOpacity = () => {
    dispatch({
      type: 'UNSET_OPACITY_FOR_MAP'
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
      {isFetchingVisitPlaces && (
        <SuccessToaster message="app.isFetchingVisitPlaces" />
      )}
      {errorObject.isErrorOccurred && (
        <FailureToaster message={errorObject.errorMessage} />
      )}
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
                onCalendarOpen={setOpacity}
                onCalendarClose={unSetOpacity}
                maxDate={new Date()}
              />
            </Col>
          </Form.Group>
          <Form.Group id="upload-attachment-input">
            <Col>
              <Form.Label className="text-color--white">
                Upload Visited Places
              </Form.Label>
            </Col>
            <Col>
              <Form.Control
                type="file"
                onChange={uploadVisitedPlaces}
                accept=".json"
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
