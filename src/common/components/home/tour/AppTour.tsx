import React from 'react';
import { Modal, Button } from 'react-bootstrap';

import './AppTour.scss';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import paths from '../../../../routes/paths';

function AppTour() {
  const [show, setShow] = React.useState(true);

  const handleClose = () => setShow(false);

  const onHide = () => {
    localStorage.userTookTour = 'yes';
    setShow(false);
  };

  const history = useHistory();

  const onUploadVisitedPlaces = (e: any) => {
    onHide();
    history.push(paths.uploadGoogleTakeOut.link);
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="app-tour"
      centered
      show={show}
      onHide={onHide}
    >
      <Modal.Body>
        <FormattedHTMLMessage id="appTour.heading" />
        <p className="description">
          <FormattedHTMLMessage id="appTour.message.description" />
        </p>
        <p className="d-flex justify-content-center">
          <Button variant="light" onClick={onUploadVisitedPlaces}>
            <FormattedMessage id="app.uploadVisitedPlaces.btn" />
          </Button>
        </p>
        <p className="d-flex justify-content-center">
          <Button variant="light" className="btn-close" onClick={handleClose}>
            <FormattedMessage id="app.closeButton" />
          </Button>
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default AppTour;
