import { Dispatch } from 'redux';

import { EReduxActionTypes, IReduxBaseAction } from '../types';

import DocServices from '../../services/docs';

const getDocs = () => async (dispatch: Dispatch<IReduxBaseAction>) => {
  try {
    const response = await DocServices.getDocs();
    dispatch({
      type: EReduxActionTypes.SET_DOCS,
      payload: {
        docs: response.data
      }
    });
  } catch (error) {
    dispatch({
      type: EReduxActionTypes.SET_FETCH_DOCS_ERROR,
      payload: {
        message: error.message
      }
    });
  }
};

const postDoc = (doc: any) => async (dispatch: Dispatch<IReduxBaseAction>) => {
  try {
    const response = await DocServices.postDoc(doc);
    dispatch({
      type: EReduxActionTypes.SET_DOCS,
      payload: {
        docs: response.data
      }
    });
  } catch (error) {
    dispatch({
      type: EReduxActionTypes.SET_FETCH_DOCS_ERROR,
      payload: {
        message: error.message
      }
    });
  }
};

export { getDocs, postDoc };
