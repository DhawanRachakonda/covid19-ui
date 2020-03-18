import axios from './axios';
import Services from './services';
import { UserCredentials } from '../store/user/types';

class UserServices extends Services {
  static async saveUser(user: any) {
    return axios.post(Services.getRegisterUserURL());
  }

  static async loginUser(user: UserCredentials) {
    return axios.post(Services.getLoginURL(), user);
  }

  static isLogginIn() {
    localStorage.getItem('isLoggedIn');
  }

  static async logout() {
    localStorage.setItem('isLoggedIn', 'false');
    return Promise.resolve('');
  }

  static setLoggedIn() {
    localStorage.setItem('isLoggedIn', 'true');
  }
}

export default UserServices;
