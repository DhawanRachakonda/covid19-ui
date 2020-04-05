import React from 'react';
import { Button, Col, Form, Modal, Alert } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { useAppDispatch, useAppFormState } from '../home/AppContext';
import './AppRTG.css';


function AppRTG() {

  const dispatch = useAppDispatch();
  const { showRTG, reportCase, loginUserName, loginUserEmail, infectedList } = useAppFormState();
  const [dateOfSusInf, setDateOfSusInf] = React.useState(new Date());

  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState('');
  const [alertVariant, setAlertVariant] = React.useState('');

  const [locationSelected, setLocationSelected] = React.useState([]);

  const handleCancelRTG = (e) => {
    hideRTGModal();
  }

  const locationOptions = infectedList.filter(item => item.addressName && true).map(item => 
    { return { value: item.id, label: item.addressName }});
      

  const handleSendRTG = async (e) => {
    e.preventDefault();
    reportCase.dateOfSusInf = dateOfSusInf;
    reportCase.suspectedLocationId = locationSelected.value;
    console.log("Date to be send:\n" + JSON.stringify(reportCase, undefined, 4));
    const rawresponse = await fetch(process.env.REACT_APP_POST_SUSPECTION_DETAILS,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportCase)
      })
      .then((response) => response);
    console.log(rawresponse);
    if (rawresponse.status == '201') {
      setShowAlert(true);
      setAlertMsg("The authorities have been notified about your details of suspicious covid contact. You will be contacted shortly. Please stay home and stay safe.");
      setAlertVariant("success");
    } else {
      setShowAlert(true);
      setAlertMsg("Oops! Something went wrong. Please send your details to incubationtracker@gmail.com.");
      setAlertVariant("danger");
    }
    hideRTGModal(); 
  }

  const hideAlert = (e) => {
    setShowAlert(false);
    setAlertMsg("");
    setAlertVariant("");
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
  if (reportCase.dateOfSusInf == '') {
    reportCase.dateOfSusInf = new Date();
  }

  return (
    <>
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
              <Form.Group as={Col}>
                <Form.Label>Suspected Infection Date:</Form.Label>
                <DatePicker className="form-control"
                  selected={dateOfSusInf}
                  onChange={(date) => setDateOfSusInf(date)}
                  maxDate={new Date()}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Suspected Location:</Form.Label>
                <Select onChange={setLocationSelected} options={locationOptions}/>
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
            <Button type="submit" variant="primary" onClick={handleSendRTG}>
              Send Report
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={showAlert} onHide={hideAlert} className="rtg-alert-modal">
        <Alert  variant={alertVariant} >
          <p>
            {alertMsg}
          </p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button onClick={hideAlert} variant={"outline-"+alertVariant}>
                Close
            </Button>
        </div>
        </Alert>
      </Modal>
    </>
  );
}


export default AppRTG;

