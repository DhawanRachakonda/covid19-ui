import UserService from '../services/user-services';

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

  static isResponseInsufficientPrivilleges(response: Response) {
    return response.status === 401 || response.status === 403;
  }

  static async getJson(response: Response) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    return response.json();
  }
}
