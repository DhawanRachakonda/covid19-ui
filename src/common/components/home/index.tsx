import React from 'react';
//import { Card } from 'react-bootstrap';
import Map from './Map';
import { UploadVisitedPlacesContextProder } from '../providers/UploadUserVisitedPlacesProvider';
import AppTour from './tour/AppTour';

export default () => {
  return (
    <UploadVisitedPlacesContextProder bindedFor="home">
      {!localStorage.userTookTour && <AppTour />}
      <Map />
      {/* <div> 
        <Card className="text-center">
        <p>
          <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8"/>
          </svg>
           - Infected areas on selected date
        </p>
        
          </Card>
      </div> */}
    </UploadVisitedPlacesContextProder>
  );
};
