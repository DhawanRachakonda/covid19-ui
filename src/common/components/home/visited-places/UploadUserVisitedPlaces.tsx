import React, { useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { FormattedMessage } from 'react-intl';
import { GlassMagnifier } from '../../util/ImageMagnifier';

import './VisitedPlaces.scss';

import paths from '../../../../routes/paths';
import { useUploadUserVisitedPlaces } from '../../providers/UploadUserVisitedPlacesProvider';
import SuccessToaster, { FailureToaster } from '../../toaster/SuccessToaster';

function UploadUserVisitedPlacesModal() {
  const history = useHistory();

  const [showInstructions, setShowInstructions] = React.useState(false);

  const displayInstructions = () => {
    setShowInstructions(true);
  };

  const hideInstructions = () => {
    setShowInstructions(false);
  };

  const {
    errorObject,
    isFetchingVisitPlaces,
    uploadVisitedPlaces
  } = useUploadUserVisitedPlaces();

  const onUploadCallBack = (status: boolean) => {
    if (status) {
      onHide();
    }
  };

  const onUplaodClick = (e: any) => {
    uploadVisitedPlaces(e, onUploadCallBack);
  };

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
      {isFetchingVisitPlaces && (
        <SuccessToaster message="app.isFetchingVisitPlaces" />
      )}
      {errorObject.isErrorOccurred &&
        errorObject.bindedFor === 'visitedPlacesModal' && (
          <FailureToaster message={errorObject.errorMessage} />
        )}
      <Form>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <FormattedMessage id="app.uploadGoogleTakeout.link" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="user-upload--modal">
          <Form.Group controlId="formBasicEmail">
            <Form.File id="upload-visited--places-file">
              <Form.File.Label>
                <FormattedMessage id="app.uploadGoogleTakeout.link" />
              </Form.File.Label>
              <Form.File.Input onChange={onUplaodClick} accept=".json" />
            </Form.File>
            <Form.Text className="text-muted">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="color-black"
                href="https://takeout.google.com/"
              >
                <FormattedMessage id="help.uploadFileFromGoogleTakeOut.toolTip" />
              </a>
            </Form.Text>
          </Form.Group>

          {!showInstructions && (
            <Button onClick={displayInstructions}>
              <FormattedMessage id="app.showInstructions" />
            </Button>
          )}
          {showInstructions && (
            <Button onClick={hideInstructions}>
              <FormattedMessage id="app.hideInstructions" />
            </Button>
          )}
          {showInstructions && (
            <figure className="google-takeout--img-wrapper">
              <GlassMagnifier
                imageSrc={`${process.env.PUBLIC_URL}/swi-google-takeout.jpg`}
                imageAlt="Google Takeout Instructions"
                className="google-takeout--img"
              />
            </figure>
          )}
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
