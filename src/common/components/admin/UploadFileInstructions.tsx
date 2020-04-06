import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import { Modal, Button } from 'react-bootstrap';

import './UploadFileInstructions.css';

function UploadFileInstructions() {
  return (
    <React.Fragment>
      <FormattedHTMLMessage id="app.uploadDoc.instructions" />
    </React.Fragment>
  );
}

function GoogleTakeoutPopup(props: any) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UploadFileInstructions />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default GoogleTakeoutPopup;
