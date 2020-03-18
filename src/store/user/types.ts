import { IReduxBaseAction, EReduxActionTypes } from '../types';

export type UserCredentials = {
  userName: string;
  password: string;
};

export type User = {
  userName: string;
  emailId: string;
  displayName: string;
};

export interface IUserState {
  userDetails?: User;
  isFetching: boolean;
  isSuccess: boolean;
  message: string;
}

export interface IFetchUserAction extends IReduxBaseAction {
  type: EReduxActionTypes.FETCH_USER;
  payload: {};
}

export interface ISetUserAction extends IReduxBaseAction {
  type: EReduxActionTypes.SET_USER_LOGGED_IN;
  payload: {
    userDetails: User;
  };
}

export interface ISetUserErrorAction extends IReduxBaseAction {
  type: EReduxActionTypes.SET_USER_ERROR;
  payload: {
    message: string;
  };
}

export interface IRegisteringUserAction extends IReduxBaseAction {
  type: EReduxActionTypes.REGISTERING_USER;
  payload: {};
}

export interface IRegisterUserAction extends IReduxBaseAction {
  type: EReduxActionTypes.REGISTER_USER;
  payload: {
    message: string;
  };
}

export interface IRegisterUserErrorAction extends IReduxBaseAction {
  type: EReduxActionTypes.REGISTER_USER_ERROR;
  payload: {
    message: string;
  };
}

export interface ILogoutUser extends IReduxBaseAction {
  type: EReduxActionTypes.LOGOUT_USER;
  payload: {};
}

export type IUserActions =
  | IRegisterUserAction
  | IRegisterUserErrorAction
  | IFetchUserAction
  | ISetUserAction
  | ISetUserErrorAction
  | IRegisteringUserAction
  | ILogoutUser;
