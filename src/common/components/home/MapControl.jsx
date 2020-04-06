import React, { useEffect, useState, useCallback } from 'react';
import Control from 'react-leaflet-control';
import { OverlayTrigger, Tooltip, Form, Modal, Button } from 'react-bootstrap';
import {
  MdFullscreenExit,
  MdFullscreen,
  MdFileUpload,
  MdFilterList,
  MdReportProblem,
  MdRefresh
} from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

import SuccessToaster, { FailureToaster } from '../toaster/SuccessToaster';
import { useAppDispatch, useAppFormState } from './AppContext';
import ApplyFilter from './AppFilter';
import AppRTG from '../report/AppRTG';

const SCALAR_E7 = 0.0000001;

function uploadFileTooltip({ ...rest }) {
  return (
    <Tooltip id="upload-file--tooltip" {...rest}>
      <FormattedMessage id="help.uploadfile.pastweeks" />
    </Tooltip>
  );
}

function clearFiltersTooltip({ ...rest }) {
  return (
    <Tooltip {...rest}>
      <FormattedMessage id="app.applyFiltersOnMap.clear" />
    </Tooltip>
  );
}

function reportACase({ ...rest }) {
  return (
    <Tooltip {...rest}>
      <FormattedMessage id="app.reportCase.info" />
    </Tooltip>
  );
}

function applyFiltersOnMap({ ...rest }) {
  return (
    <Tooltip {...rest}>
      <FormattedMessage id="app.filters.info" />
    </Tooltip>
  );
}

function enableFullScreen({ ...rest }) {
  return (
    <Tooltip {...rest}>
      <FormattedMessage id="app.filters.enableFullScreen" />
    </Tooltip>
  );
}

function disableFullScreen({ ...rest }) {
  return (
    <Tooltip {...rest}>
      <FormattedMessage id="app.filters.disableFullScreen" />
    </Tooltip>
  );
}

function UploadFileIcon() {
  const dispatch = useAppDispatch();

  const [isToShake, setIsToShake] = useState(false);

  let timerId;
  const setTimerId = (_timerId) => {
    timerId = _timerId;
  };
  const cancelShake = useCallback(() => {
    localStorage && (localStorage.hasSeenUploadOption = true);
    clearInterval(timerId);
  }, [timerId]);

  useEffect(() => {
    if (localStorage && !localStorage.hasSeenUploadOption) {
      const timerId = setInterval(() => {
        setIsToShake(true);
        setTimeout(() => setIsToShake(false), 2000);
      }, 5000);
      setTimerId(timerId);
      return () => clearTimeout(timerId);
    }
  }, [setIsToShake]);

  const [errorObject, setErrorObject] = React.useState({
    isErrorOccurred: false,
    errorMessage: ''
  });

  const [isFetchingVisitPlaces, setIsFetchingVisitPlaces] = React.useState(
    false
  );

  const fileInput = React.useRef(null);

  const uploadVisitedPlaces = React.useCallback(
    (e) => {
      if (!e.currentTarget.files[0]) return;
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

  return (
    <Form.File custom>
      {isFetchingVisitPlaces && (
        <SuccessToaster message="app.isFetchingVisitPlaces" />
      )}
      {errorObject.isErrorOccurred && (
        <FailureToaster message={errorObject.errorMessage} />
      )}
      <Form.File.Input
        ref={fileInput}
        isValid
        accept=".json"
        onChange={uploadVisitedPlaces}
      />
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={uploadFileTooltip}
        onEnter={() => cancelShake()}
      >
        <MdFileUpload
          className={`upload-file--previous-data ${isToShake ? 'shake' : ''}`}
          style={{ fontSize: 30 }}
          onClick={() => {
            fileInput.current.click();
          }}
        />
      </OverlayTrigger>
    </Form.File>
  );
}

function FilterList() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const dispatch = useAppDispatch();

  const { filter } = useAppFormState();

  const applyFilter = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
    dispatch({
      type: 'APPLY_FILTER'
    });
  };

  const reset = (e) => {
    dispatch({
      type: 'RESET'
    });
  };

  return (
    <React.Fragment>
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={isModalOpen}
        onHide={() => setIsModalOpen(!isModalOpen)}
      >
        <Form>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <FormattedMessage id="app.applyFiltersOnMap" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ApplyFilter />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit" onClick={applyFilter}>
              <FormattedMessage id="app.applyFiltersOnMap.btn" />
            </Button>
            <Button variant="secondary" type="reset" onClick={reset}>
              <FormattedMessage id="app.applyFiltersOnMap.resetBtn" />
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={applyFiltersOnMap}
      >
        <MdFilterList
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="filter-icon display-block"
          style={{ fontSize: 30 }}
        />
      </OverlayTrigger>
      {filter.date && (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={clearFiltersTooltip}
        >
          <MdRefresh
            onClick={reset}
            className="filter-icon display-block"
            style={{ fontSize: 30 }}
          />
        </OverlayTrigger>
      )}
    </React.Fragment>
  );
}

function ReportProblem() {
  const dispatch = useAppDispatch();
  const showRTGModal = () => {
    dispatch({
      type: 'SHOW_RTG',
      payload: {
        value: true
      }
    });
  };
  return (
    <React.Fragment>
      <OverlayTrigger
        placement="right"
        delay={{ show: 250, hide: 400 }}
        overlay={reportACase}
      >
        <MdReportProblem
          onClick={showRTGModal}
          className="margin-top--0_5 filter-icon report-problem display-block"
          style={{ fontSize: 30 }}
        />
      </OverlayTrigger>
      <AppRTG />
    </React.Fragment>
  );
}

export default function MapControls() {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = React.useState(false);

  return (
    <Control position="topright">
      {!isFullScreenEnabled && (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={enableFullScreen}
        >
          <MdFullscreen
            className="full-screen display-block"
            style={{ fontSize: 30 }}
            onClick={() => {
              document.querySelector('.infected-list--map').requestFullscreen();
              setIsFullScreenEnabled(!isFullScreenEnabled);
            }}
          />
        </OverlayTrigger>
      )}
      {isFullScreenEnabled && (
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={disableFullScreen}
        >
          <MdFullscreenExit
            className="full-screen--exit display-block"
            style={{ fontSize: 30 }}
            onClick={() => {
              document.exitFullscreen();
              setIsFullScreenEnabled(!isFullScreenEnabled);
            }}
          />
        </OverlayTrigger>
      )}

      {!isFullScreenEnabled && (
        <React.Fragment>
          {' '}
          <UploadFileIcon /> <FilterList /> <ReportProblem />
        </React.Fragment>
      )}
    </Control>
  );
}
