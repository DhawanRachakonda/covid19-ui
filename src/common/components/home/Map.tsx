import * as React from 'react';
import { useAppFormState } from './AppContext';


const key = '';

function GoogleMapReact(props: any) {
  return <h2>In Progress...</h2>
}

const GoogleMap = ({ children, ...props }: any) => (
    <div style={{marginTop: '2rem', height: '100vh'}}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key,
        }}
        {...props}
      >
        {children}
      </GoogleMapReact>
    </div>
  );

// InfoWindow component
const InfoWindow = (props: any) => {
    const { place } = props;
    const infoWindowStyle = {
      bottom: 150,
      left: '-45px',
      width: 220,
      backgroundColor: 'white',
      boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
      padding: 10,
      fontSize: 14,
      zIndex: 100,
    };
  
    return (
      <div style={{...infoWindowStyle, position: 'relative'}}>
        <div style={{fontSize: 16}}>
            ${place.formatted_address}
        </div>
      </div>
    );
  };

// Marker component
const Marker = (props: any) => {
    const markerStyle = {
      border: '1px solid white',
      borderRadius: '50%',
      height: 10,
      width: 10,
      backgroundColor: props.show ? 'red' : 'blue',
      cursor: 'pointer',
      zIndex: 10,
    };
  
    return (
      <React.Fragment>
        <div style={markerStyle} />
        {props.show && <InfoWindow place={props.place} />}
      </React.Fragment>
    );
};

function Map() {
    const {filter}: any = useAppFormState();
    const [isInfected, setIsInfected] = React.useState(false);
    const [places, setPlaces] = React.useState<any>([]);
    React.useEffect(() => {
        let apiresource = "infected-areas.json";
        if(filter.user) {
            apiresource = Number(filter.user) % 2 == 1 ? "user-infected.json" : "user-not-infected.json"
        }

        fetch(apiresource).then(response => response.json())
        .then((data) => {
            data.forEach((result: any) => {
                result.show = false; // eslint-disable-line no-param-reassign
            });
            setPlaces(data);
            if(apiresource === "user-infected.json") {
                setIsInfected(true);
            } else if(apiresource === "user-not-infected.json") {
                setIsInfected(false);
            }
        });
    }, [filter, setPlaces, setIsInfected]);

    // onChildClick callback can take two arguments: key and childProps
    const onChildClickCallback = (key: any) => {
        const index = places.findIndex((e: any) => e.id === key);
        places[index].show = !places[index].show; 
        setPlaces(places);
    };

    return (
        <React.Fragment>
            <h2>{isInfected ? 'You are infected': 'You are not infected, showing all infected places'}</h2>
          { places && places.length > 0 && (
            <GoogleMap
                defaultZoom={7}
                defaultCenter={[18.1124, 79.0193]}
                bootstrapURLKeys={{ key }}
                onChildClick={onChildClickCallback}
            >
                {places.map((place: any) =>
                (<Marker
                    key={place.formatted_address}
                    lat={place.geometry.location.lat}
                    lng={place.geometry.location.lng}
                    show={place.show}
                    place={place}
                />))}
            </GoogleMap>
          )}
        </React.Fragment>
    );
}

export default Map;