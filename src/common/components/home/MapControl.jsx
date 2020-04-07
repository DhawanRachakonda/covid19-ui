import React, { useEffect, useState, useCallback } from 'react';
import Control from 'react-leaflet-control';
import { OverlayTrigger, Tooltip, Form, Badge } from 'react-bootstrap';
import {
  MdFullscreenExit,
  MdFullscreen,
  MdFileUpload,
  MdReportProblem,
  MdRefresh,
  MdDateRange
} from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import DatePicker from 'react-datepicker';

import './MapControl.scss';

import SuccessToaster, { FailureToaster } from '../toaster/SuccessToaster';
import { useAppDispatch, useAppFormState } from './AppContext';
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

function ApplyFiltersOnMap({ className = 'show-tooltip', ...rest }) {
  return (
    <Tooltip className={`filter-date--tool-tip ${className}`} {...rest}>
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
  const dispatch = useAppDispatch();

  const { filter } = useAppFormState();

  const reset = (e) => {
    dispatch({
      type: 'RESET'
    });
  };

  const applyFilter = () => {
    dispatch({
      type: 'APPLY_FILTER'
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

  const { selectedDate } = useAppFormState();

  const onChangeDate = (date) => {
    setIsDatePickerOpen(!isDatePickerOpen);
    setSelectedDate(date);
    applyFilter();
  };

  const datePickerRef = React.useRef(null);

  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

  const onIconClick = () => {
    document.querySelector('.filter-date--tool-tip').style.display = 'none';
    datePickerRef.current.setOpen(!isDatePickerOpen);
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  return (
    <React.Fragment>
      <div className="filter-date--picker-wrapper">
        <OverlayTrigger
          className="filter-date--tooltip"
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={ApplyFiltersOnMap}
        >
          <div className="circle margin-top--1_5">
            <DatePicker
              ref={datePickerRef}
              className="filter-date-picker"
              selected={selectedDate}
              onChange={onChangeDate}
              maxDate={new Date()}
            />
            <MdDateRange
              onClick={onIconClick}
              className="filter-icon center display-block"
              color="white"
              style={{ fontSize: 30 }}
            />
          </div>
        </OverlayTrigger>
      </div>

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

function TopFilters() {
  const { filter } = useAppFormState();

  return (
    <Control position="topleft" className="map-control--filters-top">
      {filter.date && (
        <Badge pill className="filter-badge" variant="primary">
          <FormattedMessage id="app.filtersOnMap.dateFilter.on" />
          <span className="date-filter--str">{filter.dateStr}</span>
        </Badge>
      )}
    </Control>
  );
}

export default function MapControls() {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = React.useState(false);

  return (
    <React.Fragment>
      <Control position="topright" className="map-control--filters-right">
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
      <TopFilters />
    </React.Fragment>
  );
}
