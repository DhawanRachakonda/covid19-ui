import React from 'react';
import { Button, Col, Form, Modal } from 'react-bootstrap';
import { useAppDispatch, useAppFormState } from '../home/AppContext';
import './AppRTG.css';


function AppRTG() {

  const dispatch = useAppDispatch();
  const { showRTG, reportCase, loginUserName, loginUserEmail } = useAppFormState();

  const handleCancelRTG = (e) => {
    hideRTGModal();
  }

  const handleSendRTG = (e) => {
    console.log("Date to be send:\n" + JSON.stringify(reportCase, undefined, 4));
    hideRTGModal();
  }

  const hideRTGModal = (e) => {
    dispatch({
      type: 'SHOW_RTG',
      payload: {
        value: false
      }
    });
    dispatch({
      type: 'CLEAR_REPORT_CASE'
    });
  }

  if (reportCase.name == '') {
    reportCase.name = loginUserName;
  }
  if (reportCase.email == '') {
    reportCase.email = loginUserEmail;
  }

  return (
    <Modal show={showRTG} onHide={handleCancelRTG} size="lg" className="rtg-modal">
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Report To Govt.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Name:</Form.Label>
              <Form.Control size="sm" defaultValue={reportCase.name} onChange={(e) => reportCase.name = e.target.value} required />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Aadhar Number:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.aadharNo = e.target.value} />
            </Form.Group>

          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Suspected Location:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.suspectedLocationId = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Suspected Infection Date:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.dateOfSusInf = e.target.value} type="date" />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Email:</Form.Label>
              <Form.Control size="sm" defaultValue={reportCase.email} onChange={(e) => reportCase.email = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Mobile Number:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.mobileNo = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Country:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.country = e.target.value} />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Address Line 1:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.line1 = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Address Line 2:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.line2 = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Address Line 3:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.line3 = e.target.value} />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>City:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.city = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>State:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.state = e.target.value} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Zipcode:</Form.Label>
              <Form.Control size="sm" onChange={(e) => reportCase.address.zipcode = e.target.value} />
            </Form.Group>
          </Form.Row>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelRTG}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSendRTG}>
            Send Report
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default AppRTG;

