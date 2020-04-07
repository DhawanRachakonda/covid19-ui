import * as React from 'react';
import { useAppFormState, useAppDispatch } from './AppContext';
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Card } from 'react-bootstrap';
import { DivIcon } from 'leaflet';

import './Map.css';

import MapControl from './MapControl';
import { FormattedMessage } from 'react-intl';

const RedIcon = new DivIcon({
  html: `<svg class="bi bi-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="8"/>
</svg>`,
  className: 'red-icon'
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BlueIcon = new DivIcon({
  html: `<svg class="bi bi-circle-fill" width="1em" height="1em"  viewBox="0 0 16 16" fill="blue" xmlns="http://www.w3.org/2000/svg">
  <circle cx="8" cy="8" r="8"/>
</svg>`,
  className: 'blue-icon'
});

interface IPlaceListOnMapProps {
  placeList: {
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
          <Card.Title>{dateField}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {addressName}
          </Card.Subtitle>
        </Card.Body>
      </Card>
    </Popup>
  );
}

function PlaceListOnMap({ placeList }: IPlaceListOnMapProps) {
  const [isPopupOpen, setIsPopupOpen] = React.useState<any>(null);
  const { filter } = useAppFormState();

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
      {placeList
        .filter((infectedPlace) =>
          filter.dateStr ? filter.dateStr === infectedPlace.dateField : true
        )
        .filter(
          (infectedPlace) => infectedPlace.latitude && infectedPlace.longitude
        )
        .map((infectedPlace: any) => (
          <Marker
            key={infectedPlace.id}
            position={[infectedPlace.latitude, infectedPlace.longitude]}
            onClick={() => setPlaceInfo(infectedPlace)}
            icon={infectedPlace.isFromInfectedList ? RedIcon : BlueIcon}
          />
        ))}
    </React.Fragment>
  );
}

function MapView() {
  const [center, setCenter] = React.useState<[number, number]>([
    20.5937,
    78.9629
  ]);

  React.useEffect(() => {
    const setPosition: PositionCallback = (position) => {
      setCenter([position.coords.latitude, position.coords.longitude]);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      setCenter([17.385, 78.4867]);
      alert(
        'Geolocation is not supported by this browser. It is used to get your current location.'
      );
    }
  }, []);

  const {
    infectedList,
    placesVisited,
    opacityClassName
  }: any = useAppFormState();
  const dispatch = useAppDispatch();

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

  return (
    <React.Fragment>
      <Map
        center={center}
        zoomControl={false}
        zoom={8}
        className={`infected-list--map ${opacityClassName}`}
        animate={true}
      >
        <PlaceListOnMap placeList={infectedList || []} />
        <PlaceListOnMap placeList={placesVisited || []} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="topright" />
        <MapControl />
      </Map>
      <div className={`legend-styles`}>
        {infectedList && infectedList.length > 0 && (
          <React.Fragment>
            <svg
              className="bi bi-circle-fill"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 16 16"
              fill="red"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
            <span className="margin-left--0_5">
              <FormattedMessage id="app.redIcon.describe" />
            </span>
          </React.Fragment>
        )}

        {placesVisited && placesVisited.length > 0 && (
          <React.Fragment>
            <svg
              className="bi bi-circle-fill margin-left--0_5"
              width="1.5em"
              height="1.5em"
              viewBox="0 0 16 16"
              fill="blue"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="8" cy="8" r="8" />
            </svg>
            <span className="margin-left--0_5">
              <FormattedMessage id="app.blueIcon.describe" />
            </span>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

export default MapView;
