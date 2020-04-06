import React from 'react';
import {
  Form,
  Button,
  CardColumns,
  Card,
  Tabs,
  Tab,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import { MdFileUpload } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import UploadFiles from './UploadFiles';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng
} from 'react-places-autocomplete';
import { FormattedMessage } from 'react-intl';

const renderFunc = ({ getInputProps, getSuggestionItemProps, suggestions }) => (
  <div className="autocomplete-root">
    <input {...getInputProps()} />
    <div className="autocomplete-dropdown-container">
      {suggestions.map((suggestion) => (
        <div {...getSuggestionItemProps(suggestion)}>
          <span>{suggestion.description}</span>
        </div>
      ))}
    </div>
  </div>
);

function InfectedAreas({ infectedList }) {
  return (
    <CardColumns style={{ marginTop: '2.5rem' }}>
      {infectedList.map((infectedPlace, index) => (
        <Card key={index}>
          <Card.Body>
            <Card.Title>{infectedPlace.data}</Card.Title>
            <Card.Text>{infectedPlace.place}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </CardColumns>
  );
}

function InfectedPlaceForm() {
  const [infectedList, setInfectedList] = React.useState([]);

  const [place, setPlace] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const handleChange = (address) => {
    setPlace(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        getLatLng(results[0]);
        setPlace(address);
      })
      .then((latLng) => console.log('Success', latLng))
      .catch((error) => console.error('Error', error));
  };

  const addInfectedPlace = (e) => {
    e.preventDefault();
    if (selectedDate && place) {
      setInfectedList([
        ...infectedList,
        { place, data: selectedDate.toDateString() }
      ]);
      setSelectedDate(new Date());
      setPlace('');
    }
  };

  return (
    <React.Fragment>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Infected Place</Form.Label>
          <PlacesAutocomplete
            value={place}
            onChange={handleChange}
            onSelect={handleSelect}
          >
            {renderFunc}
          </PlacesAutocomplete>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Infected Date</Form.Label>
          <br />
          <DatePicker
            className="form-control"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
          />
        </Form.Group>
        <Button variant="primary" type="click" onClick={addInfectedPlace}>
          Submit
        </Button>
      </Form>
      {infectedList.length > 0 && <InfectedAreas infectedList={infectedList} />}
    </React.Fragment>
  );
}

function uploadFromGoogleTakeOutToolTip({ ...rest }) {
  return (
    <Tooltip id="upload-file--tooltip" {...rest}>
      <FormattedMessage id="help.uploadFileFromGoogleTakeOut.toolTip" />
    </Tooltip>
  );
}

function UploadFromGoogle() {
  return (
    <div style={{ marginTop: '2.5rem' }}>
      <p className="how-takout--works">
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={uploadFromGoogleTakeOutToolTip}
        >
          <a
            target="_blank"
            className="color-black"
            href="https://takeout.google.com/"
          >
            <MdFileUpload style={{ fontSize: 60 }} />
          </a>
        </OverlayTrigger>
        <a
          target="_blank"
          href={`${process.env.PUBLIC_URL}/IncubationTrackerCovid19.html`}
        >
          <FormattedMessage id="help.googleTakeOut.instructions" />
        </a>
      </p>
      <UploadFiles></UploadFiles>
    </div>
  );
}

export default function AdminHomePage() {
  return (
    <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      style={{ marginTop: '2.5rem' }}
    >
      <Tab eventKey="home" title="Add Infect Pace">
        <InfectedPlaceForm />
      </Tab>
      <Tab eventKey="profile" title="Upload From Google">
        <UploadFromGoogle />
      </Tab>
    </Tabs>
  );
}
