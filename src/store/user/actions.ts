import { Dispatch } from 'redux';

import { EReduxActionTypes } from '../types';
import {
  IFetchUserAction,
  ISetUserAction,
  IRegisterUserAction,
  IRegisteringUserAction,
  IRegisterUserErrorAction,
  ISetUserErrorAction,
  ILogoutUser
} from './types';
import { UserCredentials } from './types';

import UserServices from '../../services/user';

const loginUser = (user: UserCredentials) => async (
  dispatch: Dispatch<IFetchUserAction | ISetUserAction | ISetUserErrorAction>
) => {
  try {
    dispatch({
      type: EReduxActionTypes.FETCH_USER,
      payload: {}
    });
    const response = await UserServices.loginUser(user);
    dispatch({
      type: EReduxActionTypes.SET_USER_LOGGED_IN,
      payload: {
        userDetails: response.data
      }
    });
  } catch (error) {
    dispatch({
      type: EReduxActionTypes.SET_USER_ERROR,
      payload: {
        message: error.message
      }
    });
  }
};

const saveUser = (user: any) => async (
  dispatch: Dispatch<
    IRegisterUserAction | IRegisterUserErrorAction | IRegisteringUserAction
  >
) => {
  try {
    dispatch({
      type: EReduxActionTypes.REGISTERING_USER,
      payload: {}
    });
    const response = await UserServices.saveUser(user);
    dispatch({
      type: EReduxActionTypes.REGISTER_USER_ERROR,
      payload: {
        message: response.data
      }
    });
  } catch (error) {
    dispatch({
      type: EReduxActionTypes.REGISTER_USER_ERROR,
      payload: {
        message: error.message
      }
    });
  }
};

const logout = () => async (dispatch: Dispatch<ILogoutUser>) => {
  try {
    await UserServices.logout();
    dispatch({
      type: EReduxActionTypes.LOGOUT_USER,
      payload: {}
    });
  } catch (error) {
    dispatch({
      type: EReduxActionTypes.LOGOUT_USER,
      payload: {}
    });
  }
};

export { loginUser, saveUser, logout };
