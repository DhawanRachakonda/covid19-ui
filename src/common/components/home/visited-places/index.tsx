import React from 'react';
import UploadUserVisitedPlacesModal from './UploadUserVisitedPlaces';
import Map from '../Map';
import { UploadVisitedPlacesContextProder } from '../../providers/UploadUserVisitedPlacesProvider';

function UploadUserVisitedPlacesHome() {
  return (
    <UploadVisitedPlacesContextProder bindedFor="visitedPlacesModal">
      <UploadUserVisitedPlacesModal />
      <Map />
    </UploadVisitedPlacesContextProder>
  );
}

export default UploadUserVisitedPlacesHome;
