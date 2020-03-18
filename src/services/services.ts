export default class Services {
  static getRegisterUserURL(): string {
    return process.env.REACT_APP_POST_USER!;
  }

  static postDocURL(): string {
    return process.env.REACT_APP_POST_DOC!;
  }

  static getDocsURL(): string {
    return process.env.REACT_APP_GET_DOCS!;
  }

  static getLoginURL(): string {
    return process.env.REACT_APP_LOGIN_USER!;
  }
}
