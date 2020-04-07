import UserService from '../services/user-services';
import { BroadcastChannel } from 'broadcast-channel';
import {
  LOGIN_EVENTS_CHANNEL,
  INVALID_CRED_KEY,
  SERVER_ERROR_KEY,
  LOGIN_REQUIRED
} from '../constants';

const loginEventsChannel = new BroadcastChannel(LOGIN_EVENTS_CHANNEL);

enum MethodType {
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
  DELETE = 'DELETE'
}

interface HeaderValue {
  [key: string]: string;
}

interface IConfigParamsProps {
  method?: MethodType;
  requiresAuth?: boolean;
  body?: any;
  headers?: HeaderValue;
  containsMultipart?: boolean;
}

const configParams: IConfigParamsProps = {
  method: MethodType.GET,
  requiresAuth: false,
  body: '',
  containsMultipart: false
};

export async function client(endpoint: string, customConfig = configParams) {
  const headers: HeaderValue = {
    'Content-Type': 'application/json'
  };

  if (customConfig.requiresAuth) {
    if (UserService.isUserLoggedIn() && UserService.getAccessToken()) {
      headers['Authorization'] = 'Bearer ' + UserService.getAccessToken();
    } else {
      loginEventsChannel.postMessage(LOGIN_REQUIRED);
      UserService.logout();
      return;
    }
  }

  const config: RequestInit = {
    method: customConfig.method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers
    }
  };

  if (customConfig.body) {
    config.body = customConfig.containsMultipart
      ? customConfig.body
      : JSON.stringify(customConfig.body);
  }

  return await fetch(endpoint, config).then((response) => {
    if (FetchUtil.isResponseOkay(response)) {
      return response.json();
    } else if (FetchUtil.isResponseContainsInValidCredentials(response)) {
      loginEventsChannel.postMessage('Invalid Credentials!');
      return Promise.resolve({ [INVALID_CRED_KEY]: true });
    } else if (FetchUtil.isResponseContainsInSufficientPrivillegs(response)) {
      loginEventsChannel.postMessage('Insufficient Privileges!');
      return Promise.resolve({ [INVALID_CRED_KEY]: true });
    } else if (FetchUtil.isResponseContainsServerError(response)) {
      return Promise.resolve({ [SERVER_ERROR_KEY]: true });
    }
    return Promise.reject(`Unhandled response status : ${response.status}`);
  });
}

export default class FetchUtil {
  static async postCall(url: string, data: any, isSecure = false) {
    const headers: any = {
      'Content-Type': 'application/json'
    };
    if (isSecure) {
      headers['Authorization'] = 'Bearer ' + UserService.getAccessToken();
    }
    return await fetch(url, {
      method: 'POST',
      headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
  }

  static isResponseOkay(response: Response) {
    return response.ok;
  }

  static isResponseContainsInValidCredentials(response: Response) {
    return response.status === 401;
  }

  static isResponseContainsInSufficientPrivillegs(response: Response) {
    return response.status === 403;
  }

  static isResponseContainsServerError(response: Response) {
    return response.status >= 500 && response.status <= 509;
  }

  static async getJson(response: Response) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    return response.json();
  }
}
