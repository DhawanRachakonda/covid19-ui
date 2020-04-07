import { BroadcastChannel } from 'broadcast-channel';

import { LOGIN_REQUIRED } from '../constants';
import FetchUtil from '../util/fetch';

const loginEventsChannel = new BroadcastChannel('login-events');

export default class UserService {
  static getUserDate() {
    const userDetails = JSON.parse(localStorage.useDetails);
    return { userName: userDetails.userName, isAdmin: userDetails.isAdmin };
  }

  static isUserLoggedIn() {
    return (
      localStorage.useDetails &&
      JSON.parse(localStorage.useDetails).accessToken &&
      true
    );
  }

  static isAdmin() {
    let isAdmin = false;
    if (localStorage.useDetails) {
      const userDetails = JSON.parse(localStorage.useDetails);
      isAdmin = userDetails.isAdmin && true;
    }
    return isAdmin;
  }

  static async login(userName, password) {
    const response = await FetchUtil.postCall(
      process.env.REACT_APP_POST_AUTHENTICATE,
      {
        password: password,
        username: userName
      }
    );
    if (FetchUtil.isResponseOkay(response)) {
      return response.json();
    } else if (FetchUtil.isResponseInsufficientPrivilleges(response)) {
      loginEventsChannel.postMessage('Invalid Credentials!');
      return Promise.resolve(false);
    }
    return Promise.resolve({});
  }

  static async addAdmin(userName, password) {
    const response = await FetchUtil.postCall(
      process.env.REACT_APP_POST_REGISTER,
      {
        password: password,
        username: userName
      }
    );
    if (FetchUtil.isResponseOkay(response)) {
      return response.json();
    }
    return Promise.resolve({});
  }

  static getAccessToken() {
    if (UserService.isUserLoggedIn()) {
      return JSON.parse(localStorage.useDetails).accessToken;
    }
    const event = new CustomEvent(LOGIN_REQUIRED);
    window.dispatchEvent(event);
  }

  static logout() {
    localStorage.setItem('useDetails', '');
  }

  static saveUserToken(response) {
    localStorage.setItem(
      'useDetails',
      JSON.stringify({
        accessToken: response.token,
        userName: response.username,
        isAdmin: true
      })
    );
  }
}
