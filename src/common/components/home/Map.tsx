import * as React from 'react';
import { useAppFormState, useAppDispatch } from './AppContext';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card } from 'react-bootstrap';
import { DivIcon } from 'leaflet';

// const markerStyle = {
//   border: '1px solid white',
//   borderRadius: '50%',
//   height: 10,
//   width: 10,
//   backgroundColor: props.show ? 'red' : 'blue',
//   cursor: 'pointer',
//   zIndex: 10,
// };

const RedIcon = new DivIcon({
  html: `<svg class="bi bi-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="8"/>
</svg>`
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlueIcon = new DivIcon({
  html: `<svg class="bi bi-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="blue" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="8"/>
</svg>`
});

interface IPlaceListOnMapProps {
  infectedList: {
    id: string;
    latitude: string;
    longitude: string;
    isFromInfectedList: boolean;
    addressName: string;
    dateField: string;
  }[];
}

interface IPlaceInfoProps {
  latitude: number;
  longitude: number;
  addressName: string;
  dateField: string;
  onClose: () => void;
}

function PlaceInfo({
  latitude,
  longitude,
  addressName,
  dateField,
  onClose
}: IPlaceInfoProps) {
  return (
    <Popup position={[latitude, longitude]} onClose={onClose}>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{addressName}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{dateField}</Card.Subtitle>
        </Card.Body>
      </Card>
    </Popup>
  );
}

function PlaceListOnMap({ infectedList }: IPlaceListOnMapProps) {
  const [isPopupOpen, setIsPopupOpen] = React.useState<any>(null);

  const onClosePopup = () => {
    setIsPopupOpen(null);
  };

  const setPlaceInfo = (place: any) => {
    setIsPopupOpen(place);
  };

  return (
    <React.Fragment>
      {isPopupOpen && (
        <PlaceInfo
          addressName={isPopupOpen.addressName}
          dateField={isPopupOpen.dateField}
          latitude={Number(isPopupOpen.latitude)}
          longitude={Number(isPopupOpen.longitude)}
          onClose={onClosePopup}
        />
      )}
      {infectedList.map((infectedPlace: any) => (
        <Marker
          key={infectedPlace.id}
          position={[infectedPlace.latitude, infectedPlace.longitude]}
          onClick={() => setPlaceInfo(infectedPlace)}
          icon={RedIcon}
        />
      ))}
    </React.Fragment>
  );
}

function MapView() {
  const { filter, infectedList }: any = useAppFormState();
  const dispatch = useAppDispatch();
  const [isInfected, setIsInfected] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [places, setPlaces] = React.useState<any>([]);

  React.useEffect(() => {
    fetch(process.env.REACT_APP_GET_INFECTED_LIST!)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((result: any) => {
          result.isFromInfectedList = true; // eslint-disable-line no-param-reassign
        });
        dispatch({
          type: 'SET_INFECTED_LIST',
          payload: {
            data
          }
        });
      });
  }, [dispatch]);

  React.useEffect(() => {
    let apiresource = 'infected-areas.json';
    if (filter.user) {
      apiresource =
        Number(filter.user) % 2 === 1
          ? 'user-infected.json'
          : 'user-not-infected.json';
    }

    fetch(apiresource)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((result: any) => {
          result.show = false; // eslint-disable-line no-param-reassign
        });
        setPlaces(data);
        if (apiresource === 'user-infected.json') {
          setIsInfected(true);
        } else if (apiresource === 'user-not-infected.json') {
          setIsInfected(false);
        }
      });
  }, [filter, setPlaces, setIsInfected]);

  return (
    <React.Fragment>
      <h2>
        {isInfected
          ? 'You are infected'
          : 'You are not infected, showing all infected places'}
      </h2>
      {infectedList && infectedList.length > 0 && (
        <Map center={[18.1124, 79.0193]} zoom={8}>
          <PlaceListOnMap infectedList={infectedList} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
      )}
    </React.Fragment>
  );
}

export default MapView;
