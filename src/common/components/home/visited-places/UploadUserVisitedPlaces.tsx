import React, { useCallback } from 'react';
import { Modal, Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { MdFileUpload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { GlassMagnifier } from '../../util/ImageMagnifier';

import './VisitedPlaces.scss';

import paths from '../../../../routes/paths';
import { useUploadUserVisitedPlaces } from '../../providers/UploadUserVisitedPlacesProvider';
import SuccessToaster, { FailureToaster } from '../../toaster/SuccessToaster';

function uploadFileTooltip({ ...rest }) {
  return (
    <Tooltip id="upload-file--tooltip" {...rest}>
      <FormattedMessage id="help.uploadfile.pastweeks" />
    </Tooltip>
  );
}

function UploadUserVisitedPlacesModal() {
  const history = useHistory();

  const {
    errorObject,
    isFetchingVisitPlaces,
    uploadVisitedPlaces
  } = useUploadUserVisitedPlaces();

  const onUplaodClick = (e: any) => {
    uploadVisitedPlaces(e);
    onHide();
  };

  const fileInput = React.useRef<any>({});

  const onHide = useCallback(() => {
    if (history.length > 0) {
      history.goBack();
    } else {
      history.push(paths.uploadGoogleTakeOut.routeLink);
    }
  }, [history]);
  return (
    <Modal
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      show
      onHide={onHide}
    >
      <Form className="user-upload--modal">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              onChange={onUplaodClick}
            />
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={uploadFileTooltip}
            >
              <MdFileUpload
                className="upload-file--previous-data"
                style={{ fontSize: 60 }}
                onClick={() => {
                  fileInput.current.click();
                }}
              />
            </OverlayTrigger>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="color-black"
              href="https://takeout.google.com/"
            >
              <FormattedMessage id="help.uploadFileFromGoogleTakeOut.toolTip" />
            </a>
          </Form.File>
          <figure className="google-takeout--img-wrapper">
            <GlassMagnifier
              imageSrc={`${process.env.PUBLIC_URL}/swi-google-takeout.jpg`}
              imageAlt="Google Takeout Instructions"
              className="google-takeout--img"
            />
          </figure>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onHide}>
            <FormattedMessage id="app.closeButton" />
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UploadUserVisitedPlacesModal;
