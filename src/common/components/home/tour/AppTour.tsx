import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MdClose } from 'react-icons/md';

import './AppTour.scss';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import paths from '../../../../routes/paths';

function AppTour() {
  const [show, setShow] = React.useState(true);

  const onHide = () => {
    localStorage.userTookTour = 'yes';
    setShow(false);
  };

  const history = useHistory();

  const onUploadVisitedPlaces = (e: any) => {
    onHide();
    history.push(paths.uploadGoogleTakeOut.link);
  };

  const handleClose = () => {
    setShow(false);
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
        <MdClose
          size="30px"
          className="app-tour--close"
          onClick={handleClose}
        />
        <FormattedHTMLMessage id="appTour.heading" />
        <p className="description justify-content-center">
          <FormattedHTMLMessage id="appTour.message.description" />
        </p>
        <p className="d-flex justify-content-center">
          <Button variant="light" onClick={onUploadVisitedPlaces}>
            <FormattedMessage id="app.uploadVisitedPlaces.btn" />
          </Button>
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default AppTour;
