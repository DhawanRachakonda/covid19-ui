import { IDocActions, IDocState } from './types';
import { EReduxActionTypes } from '../types';
import { appState } from '../initialstate';

export default function(state: IDocState = appState.docs, action: IDocActions) {
  switch (action.type) {
    case EReduxActionTypes.FETCH_DOCS:
      return { ...state, isFetching: true, isSuccess: false };
    case EReduxActionTypes.SET_DOCS:
      return {
        ...state,
        isFetching: false,
        isSuccess: true,
        docs: action.payload.docs
      };
    case EReduxActionTypes.SET_FETCH_DOCS_ERROR:
      return {
        ...state,
        isFetching: false,
        isSuccess: false,
        docs: [],
        message: action.payload.message
      };
    default:
      return state;
  }
}
