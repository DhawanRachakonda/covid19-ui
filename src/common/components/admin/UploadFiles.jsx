import React, { useState } from 'react';
import UserService from '../../../services/user-services';
import DatePicker from 'react-datepicker';
import { Form, Button } from 'react-bootstrap';

function UploadFiles() {
  const [dateOfSusInf, setDateOfSusInf] = React.useState(new Date());

  async function submitForm(contentType, data, setResponse) {
    var url = new URL(process.env.REACT_APP_POST_INFECTED_AREAS_FILE);

    var params = { infectedDate: dateOfSusInf };

    url.search = new URLSearchParams(params).toString();
    const rawresponse = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + UserService.getAccessToken()
      },
      body: data,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer' // no-referrer, *client
    });
    console.log(rawresponse);
    if (rawresponse.status == '201') {
      alert('The file has been submitted succesfully.');
    } else {
      alert('Oops! Something went wrong. Please try again later!');
    }
  }

  const [file, setFile] = useState(null);

  function uploadWithFormData() {
    const formData = new FormData();
    formData.append('files', [file]);

    submitForm('multipart/form-data', formData, (msg) => console.log(msg));
  }

  return (
    <div className="UploadFiles">
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Infected Date</Form.Label>
          <br />
          <DatePicker
            className="form-control"
            selected={dateOfSusInf}
            onChange={(date) => setDateOfSusInf(date)}
            maxDate={new Date()}
          />

          <Form.Text className="text-muted">
            Please enter the date on which the person is tested covid positive
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Choose a json file to upload</Form.Label>
          <br />

          <input
            type="file"
            name="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Form.Text className="text-muted">
            File format should be *.json
          </Form.Text>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={uploadWithFormData}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default UploadFiles;
