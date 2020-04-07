import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import './AppTour.scss';
import { FormattedHTMLMessage } from 'react-intl';
import { useUploadUserVisitedPlaces } from '../../providers/UploadUserVisitedPlacesProvider';
import SuccessToaster, { FailureToaster } from '../../toaster/SuccessToaster';

function AppTour() {
  const [show, setShow] = React.useState(true);

  

  const handleClose = () => setShow(false);

  const onHide = () => {
    localStorage.userTookTour = 'yes';
    setShow(false);
  };

  const fileInput = React.useRef<any>({});

  const {
    errorObject,
    isFetchingVisitPlaces,
    uploadVisitedPlaces
  } = useUploadUserVisitedPlaces();

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="app-tour"
      centered
      show={show}
      onHide={onHide}
    >
      
      <Modal.Body >
        <FormattedHTMLMessage id="appTour.heading" />
        <p className="description">
          <FormattedHTMLMessage id="appTour.message.description" />
        </p>
        <p className="d-flex justify-content-center">
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
              onChange={(e: any) => {
                uploadVisitedPlaces(e);
                onHide();
              }}
            />
            
            <Button variant="light" onClick={() => fileInput.current.click()}>
              Upload Visited Places
            </Button><br/>
            <Button variant="light" onClick={handleClose} style={{marginLeft:'4em'}}>Close</Button>
            
          </Form.File>
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default AppTour;
