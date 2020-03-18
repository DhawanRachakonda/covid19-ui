import { IUserActions, IUserState } from './types';
import { EReduxActionTypes } from '../types';
import { appState } from '../initialstate';

export default function(
  state: IUserState = appState.user,
  action: IUserActions
) {
  switch (action.type) {
    case EReduxActionTypes.REGISTERING_USER:
      return { ...state, isFetching: true, isSuccess: false, message: '' };
    case EReduxActionTypes.REGISTER_USER:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        message: action.payload.message
      };
    case EReduxActionTypes.REGISTER_USER_ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        message: action.payload.message
      };
    case EReduxActionTypes.SET_USER_LOGGED_IN:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        userDetails: action.payload.userDetails,
        message: ''
      };
    case EReduxActionTypes.FETCH_USER:
      return { ...state, isFetching: true, isSuccess: false };
    case EReduxActionTypes.SET_USER_ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        message: action.payload.message
      };
    case EReduxActionTypes.LOGOUT_USER:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        userDetails: {
          userName: '',
          emailId: '',
          displayName: ''
        }
      };
    default:
      return state;
  }
}
