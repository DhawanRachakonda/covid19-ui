import React from 'react';

import Map from './Map';
import { UploadVisitedPlacesContextProder } from '../providers/UploadUserVisitedPlacesProvider';

export default () => {
  return (
    <UploadVisitedPlacesContextProder>
      <Map />
    </UploadVisitedPlacesContextProder>
  );
};
