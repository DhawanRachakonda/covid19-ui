import { compose, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

import { rootReducer, AppState } from './rooReducerConfig';

export function configureStore(initialState?: AppState) {
  // configure middlewares
  const middlewares = [thunk, logger];
  // compose enhancers
  const enhancer = compose(applyMiddleware(...middlewares));
  // create store
  return createStore(rootReducer, initialState!, enhancer);
}
