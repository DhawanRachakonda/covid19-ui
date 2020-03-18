import { IReduxBaseAction, EReduxActionTypes } from '../types';

export type Doc = {
  id: string;
  docName: string;
  docBadges: string[];
  docImages: string[];
};

export interface IDocState {
  docs?: Doc[];
  isFetching: boolean;
  isSuccess: boolean;
  message: string;
}

interface IFetchDocsAction extends IReduxBaseAction {
  type: EReduxActionTypes.FETCH_DOCS;
  payload: {};
}

interface ISetDocsAction extends IReduxBaseAction {
  type: EReduxActionTypes.SET_DOCS;
  payload: {
    docs: Doc[];
  };
}

interface ISetErrorAction extends IReduxBaseAction {
  type: EReduxActionTypes.SET_FETCH_DOCS_ERROR;
  payload: {
    message: string;
  };
}

export type IDocActions = IFetchDocsAction | ISetDocsAction | ISetErrorAction;
