import React, { useEffect, useState, useCallback } from 'react';
import Control from 'react-leaflet-control';
import { OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
import { MdFullscreenExit, MdFullscreen, MdFileUpload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

import SuccessToaster, { FailureToaster } from '../toaster/SuccessToaster';
import { useAppDispatch } from './AppContext';

const SCALAR_E7 = 0.0000001;

function uploadFileTooltip({ ...rest }) {
  return (
    <Tooltip id="upload-file--tooltip" {...rest}>
      <FormattedMessage id="help.uploadfile.pastweeks" />
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

export default function MapControls() {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = React.useState(false);

  return (
    <Control position="topright">
      {!isFullScreenEnabled && (
        <MdFullscreen
          className="full-screen display-block"
          style={{ fontSize: 30 }}
          onClick={() => {
            document.querySelector('.infected-list--map').requestFullscreen();
            setIsFullScreenEnabled(!isFullScreenEnabled);
          }}
        />
      )}
      {isFullScreenEnabled && (
        <MdFullscreenExit
          className="full-screen--exit display-block"
          style={{ fontSize: 30 }}
          onClick={() => {
            document.exitFullscreen();
            setIsFullScreenEnabled(!isFullScreenEnabled);
          }}
        />
      )}

      <UploadFileIcon />
    </Control>
  );
}
