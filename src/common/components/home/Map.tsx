import * as React from 'react';
import {
  useAppFormState,
  useAppDispatch,
  LAT_LONG_SEPARATOR
} from './AppContext';
import { Map, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Card } from 'react-bootstrap';
import { DivIcon } from 'leaflet';

import './Map.css';

import MapControl from './MapControl';
import { FormattedMessage } from 'react-intl';
import { client } from '../../../util/fetch';
import { SERVER_ERROR_KEY } from '../../../constants';
import { FailureToaster } from '../toaster/SuccessToaster';

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

const InfectedAreaIntersect = new DivIcon({
  html: `<svg class="bi bi-circle-fill intersect" width="1em" height="1em"  viewBox="0 0 16 16" fill="blue" xmlns="http://www.w3.org/2000/svg">
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
  const { infectedListMap } = useAppFormState();
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
        .map((infectedPlace: any) => {
          if (infectedPlace.isFromInfectedList) {
            return (
              <Marker
                key={infectedPlace.id}
                position={[infectedPlace.latitude, infectedPlace.longitude]}
                onClick={() => setPlaceInfo(infectedPlace)}
                icon={RedIcon}
              />
            );
          } else {
            // calculate whether it is intersecting.
            let isIntersected = false;
            if (infectedListMap.has(infectedPlace.dateField)) {
              const refinedLat = Math.trunc(infectedPlace.latitude / 10);
              const refinedLong = Math.trunc(infectedPlace.longitude / 10);
              isIntersected = infectedListMap
                .get(infectedPlace.dateField)
                .includes(`${refinedLat}${LAT_LONG_SEPARATOR}${refinedLong}`);
            }
            return (
              <Marker
                key={infectedPlace.id}
                position={[infectedPlace.latitude, infectedPlace.longitude]}
                onClick={() => setPlaceInfo(infectedPlace)}
                icon={isIntersected ? InfectedAreaIntersect : BlueIcon}
              />
            );
          }
        })}
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

  const [errorObject, setErrorObject] = React.useState({
    isError: false,
    errorMessage: ''
  });

  React.useEffect(() => {
    async function getInfectedList(callback: (successResponse: any) => void) {
      try {
        const response = await client(process.env.REACT_APP_GET_INFECTED_LIST!);
        if (response[SERVER_ERROR_KEY]) {
          setErrorObject({
            isError: true,
            errorMessage: 'Internal Server Error'
          });
        } else {
          callback(response);
        }
      } catch (error) {
        setErrorObject({ isError: true, errorMessage: 'Something went wrong' });
      }
    }

    function successCallBack(data: any) {
      data.forEach((result: any) => {
        result.isFromInfectedList = true; // eslint-disable-line no-param-reassign
      });
      dispatch({
        type: 'SET_INFECTED_LIST',
        payload: {
          data
        }
      });
    }

    setErrorObject({ isError: false, errorMessage: '' });
    getInfectedList(successCallBack);
  }, [dispatch]);

  return (
    <React.Fragment>
      {errorObject.isError && (
        <FailureToaster message={errorObject.errorMessage} />
      )}
      <Map
        center={center}
        zoomControl={false}
        zoom={16}
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
