import React from 'react';
import { useAppDispatch } from '../home/AppContext';

declare type UserUploadVisitedPlacesType = {
  setIsFetchingVisitPlaces:
    | React.Dispatch<React.SetStateAction<boolean>>
    | Function;
  uploadVisitedPlaces: (e: any) => void;
  isFetchingVisitPlaces: boolean;
  errorObject: {
    isErrorOccurred: boolean;
    errorMessage: string;
  };
};

const initialContext: UserUploadVisitedPlacesType = {
  uploadVisitedPlaces: (e: any) => {},
  setIsFetchingVisitPlaces: () => {},
  isFetchingVisitPlaces: false,
  errorObject: {
    isErrorOccurred: false,
    errorMessage: ''
  }
};

const SCALAR_E7 = 0.0000001;

const UploadUserVisitedPlacesContext = React.createContext(initialContext);

function UploadVisitedPlacesContextProder({ children }: any) {
  const dispatch = useAppDispatch();

  const [errorObject, setErrorObject] = React.useState({
    isErrorOccurred: false,
    errorMessage: ''
  });

  const [isFetchingVisitPlaces, setIsFetchingVisitPlaces] = React.useState(
    false
  );

  const uploadVisitedPlaces = React.useCallback(
    (e) => {
      if (!e.currentTarget.files[0]) return;
      dispatch({
        type: 'RESET_PLACES_VISITED'
      });
      setIsFetchingVisitPlaces(true);
      const file = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function(evt) {
        try {
          const result = String(evt.target?.result);
          const { timelineObjects = [] } = JSON.parse(result);
          const placesVisited = timelineObjects.map(
            (object: any, index: number) => {
              const {
                placeVisit = { location: { name: '' }, duration: {} }
              } = object;
              let reportedOn = '';
              if (
                placeVisit.duration.startTimestampMs &&
                !isNaN(Number(placeVisit.duration.startTimestampMs))
              ) {
                const reportedDateTime = new Date(
                  Number(placeVisit.duration.startTimestampMs)
                );
                // Format : DD-MM-YYYY
                const date = `0${reportedDateTime.getDate()}`.slice(-2);
                const month = `0${reportedDateTime.getMonth() + 1}`.slice(-2);
                reportedOn = `${date}-${month}-${reportedDateTime.getFullYear()}`;
              }
              return {
                latitude: placeVisit.location.latitudeE7
                  ? placeVisit.location.latitudeE7 * SCALAR_E7
                  : 0,
                longitude: placeVisit.location.longitudeE7
                  ? placeVisit.location.longitudeE7 * SCALAR_E7
                  : 0,
                addressName: placeVisit.location.address
                  ? `${placeVisit.location.name}\n${placeVisit.location.address}`
                  : '',
                dateField: reportedOn,
                id: placeVisit.location.placeId + index
              };
            }
          );
          dispatch({
            type: 'SET_PLACES_VISITED',
            payload: {
              data: placesVisited
            }
          });
        } catch (error) {
          setErrorObject({
            isErrorOccurred: true,
            errorMessage: error.message
          });
          setTimeout(
            () => setErrorObject({ isErrorOccurred: false, errorMessage: '' }),
            3000
          );
        }
        setIsFetchingVisitPlaces(false);
      };
      reader.onerror = function(evt) {
        setIsFetchingVisitPlaces(false);
        setErrorObject({
          isErrorOccurred: true,
          errorMessage: 'error Reading File'
        });
        setTimeout(
          () => setErrorObject({ isErrorOccurred: false, errorMessage: '' }),
          3000
        );
      };
    },
    [dispatch]
  );

  const exportValues = {
    uploadVisitedPlaces,
    isFetchingVisitPlaces,
    setIsFetchingVisitPlaces,
    errorObject
  };

  return (
    <UploadUserVisitedPlacesContext.Provider value={exportValues}>
      {children}
    </UploadUserVisitedPlacesContext.Provider>
  );
}

function useUploadUserVisitedPlaces() {
  const context = React.useContext(UploadUserVisitedPlacesContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

export { UploadVisitedPlacesContextProder, useUploadUserVisitedPlaces };
