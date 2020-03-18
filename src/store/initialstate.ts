import { AppState } from './rooReducerConfig';

const appState: AppState = {
  docs: {
    docs: [],
    isFetching: false,
    isSuccess: true,
    message: ''
  },
  user: {
    userDetails: {
      displayName: '',
      emailId: '',
      userName: ''
    },
    isFetching: false,
    isSuccess: true,
    message: ''
  }
};

export { appState };
