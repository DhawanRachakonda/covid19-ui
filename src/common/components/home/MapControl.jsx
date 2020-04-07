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
import { useUploadUserVisitedPlaces } from '../providers/UploadUserVisitedPlacesProvider';

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

  const fileInput = React.useRef(null);

  const {
    isFetchingVisitPlaces,
    errorObject,
    uploadVisitedPlaces
  } = useUploadUserVisitedPlaces();

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
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={uploadFileTooltip}
        onEnter={() => cancelShake()}
      >
        <div className="circle">
          <MdFileUpload
            className={`upload-file--previous-data center ${
              isToShake ? 'shake' : ''
            }`}
            color="white"
            style={{ fontSize: 30 }}
            onClick={() => {
              fileInput.current.click();
            }}
          />
        </div>
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
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={applyFiltersOnMap}
      >
        <div className="circle margin-top--1_5">
          <MdFilterList
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="filter-icon center display-block"
            color="white"
            style={{ fontSize: 30 }}
          />
        </div>
      </OverlayTrigger>
      {filter.date && (
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={clearFiltersTooltip}
        >
          <div className="circle margin-top--0_5">
            <MdRefresh
              onClick={reset}
              className="filter-icon center display-block"
              color="white"
              style={{ fontSize: 30 }}
            />
          </div>
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
        placement="left"
        delay={{ show: 250, hide: 400 }}
        overlay={reportACase}
      >
        <div className="circle margin-top--0_5">
          <MdReportProblem
            onClick={showRTGModal}
            className="margin-top--0_5 filter-icon report-problem display-block center"
            color="white"
            style={{ fontSize: 30 }}
          />
        </div>
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
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={enableFullScreen}
        >
          <div className="circle">
            <MdFullscreen
              className="full-screen display-block center filter-icon"
              style={{ fontSize: 30 }}
              color="white"
              onClick={() => {
                document
                  .querySelector('.infected-list--map')
                  .requestFullscreen();
                setIsFullScreenEnabled(!isFullScreenEnabled);
              }}
            />
          </div>
        </OverlayTrigger>
      )}
      {isFullScreenEnabled && (
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={disableFullScreen}
        >
          <div className="circle">
            <MdFullscreenExit
              className="full-screen--exit display-block center filter-icon"
              style={{ fontSize: 30 }}
              color="white"
              onClick={() => {
                document.exitFullscreen();
                setIsFullScreenEnabled(!isFullScreenEnabled);
              }}
            />
          </div>
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
