import * as React from 'react';

import ReportCase from '../model/ReportCase';
import UserService from '../../../services/user-services';

const AppStateContext = React.createContext(undefined);
const AppDispatchContext = React.createContext(undefined);

const initialState = {
  selectedUser: '',
  selectedDate: new Date(),
  filter: {
    date: '',
    dateStr: ''
  },
  infectedList: [],
  placesVisited: [],
  loginUserName: '',
  loginUserEmail: '',
  showRTG: false,
  reportCase: new ReportCase(),
  isLoggedIn: UserService.isUserLoggedIn(),
  // Contains date and corresponding lat long. Note these lat long are floor based values,
  //used for finding intersection with user visited places.
  infectedListMap: new Map()
};

export const LAT_LONG_SEPARATOR = ':';

function returnInfectedListMap(infectedList) {
  const infectedListMap = new Map();
  infectedList
    .filter(
      (infectedPlace) =>
        infectedPlace.latitude &&
        infectedPlace.longitude &&
        infectedPlace.dateField
    )
    .forEach((infectedPlace) => {
      const { latitude, longitude, dateField } = infectedPlace;

      const refinedLat = Math.trunc(latitude / 10);
      const refinedLong = Math.trunc(longitude / 10);

      const refinedLatLongEntry = `${refinedLat}${LAT_LONG_SEPARATOR}${refinedLong}`;

      if (infectedListMap.has(dateField)) {
        const infectedLatsLongs = infectedListMap.get(dateField);

        // Don't include duplicates
        if (!infectedLatsLongs.includes(refinedLatLongEntry)) {
          infectedLatsLongs.push(refinedLatLongEntry);
          infectedListMap.set(dateField, infectedLatsLongs);
        }
      } else {
        // create entry
        infectedListMap.set(dateField, [refinedLatLongEntry]);
      }
    });

  return infectedListMap;
}

function AppReducer(state, action) {
  switch (action.type) {
    case 'SET_DATE':
      return {
        ...state,
        selectedDate: action.payload.value
      };
    case 'RESET':
      return {
        ...state,
        selectedUser: '',
        selectedDate: new Date(),
        filter: {
          date: '',
          dateStr: ''
        }
      };
    case 'APPLY_FILTER':
      const date = `0${state.selectedDate.getDate()}`.slice(-2);
      const month = `0${state.selectedDate.getMonth() + 1}`.slice(-2);
      const dateStr = `${date}-${month}-${state.selectedDate.getFullYear()}`;
      return {
        ...state,
        filter: {
          date: state.selectedDate,
          dateStr
        }
      };
    case 'SET_INFECTED_LIST':
      const infectedListMap = action.payload.data
        ? returnInfectedListMap(action.payload.data)
        : new Map();
      return {
        ...state,
        infectedList: action.payload.data,
        infectedListMap
      };

    case 'SET_PLACES_VISITED':
      return {
        ...state,
        placesVisited: action.payload.data
      };

    case 'RESET_PLACES_VISITED':
      return {
        ...state,
        placesVisited: []
      };
    case 'SHOW_RTG':
      return {
        ...state,
        showRTG: action.payload.value
      };
    case 'CLEAR_REPORT_CASE':
      return {
        ...state,
        reportCase: new ReportCase()
      };
    case 'SET_USER_DETAILS_IN_RTG':
      return {
        ...state,
        loginUserName: action.payload.nameValue,
        loginUserEmail: action.payload.emailValue
      };
    case 'SET_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true
      };
    case 'LOG_OUT':
      return {
        ...state,
        isLoggedIn: false
      };
    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = React.useReducer(AppReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

function useAppFormState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useCountState must be used within a CountProvider');
  }
  return context;
}

export { AppProvider, useAppFormState, useAppDispatch };
