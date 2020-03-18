import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { createStore, Store, AnyAction, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleWare from 'redux-thunk';
import { IntlProvider } from 'react-intl';

import { rootReducer, AppState } from './store/rooReducerConfig';
import messages from './common/lang/messages';

import getUser from './mocks/post_login.json';

interface IRouterProps {
  route?: string;
  history?: any;
}

interface IStateProps {
  initialState?: any;
  store?: Store<AppState, AnyAction>;
}

function createInitialState() {
  return {
    docs: {
      docs: [],
      isFetching: true,
      isSuccess: false,
      message: ''
    },
    user: {
      userDetails: getUser,
      isFetching: false,
      isSuccess: true,
      message: ''
    }
  };
}

function render(ui: JSX.Element, { ...options } = {}) {
  function Wrapper({ children }: any) {
    return (
      <IntlProvider locale="en-US" messages={(messages as any)['en-US']}>
        {children}
      </IntlProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export function withRouter({
  route = '/',
  history = createMemoryHistory({ initialEntries: [route + ''] })
}: IRouterProps) {
  const container = (component: JSX.Element) => (
    <Router history={history}> {component}</Router>
  );
  return {
    container,
    history
  };
}

export function withProvider({
  initialState = createInitialState(),
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...[thunkMiddleWare])
  )
}: IStateProps = {}) {
  const container = (component: JSX.Element) => (
    <Provider store={store}>{component}</Provider>
  );
  return {
    container,
    store
  };
}

export function withRouterAndProvider({
  route = '/',
  history = createMemoryHistory({ initialEntries: [route] }),
  initialState = createInitialState(),
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...[thunkMiddleWare])
  )
}: IStateProps & IRouterProps = {}) {
  const { container: wrapHistory, history: memHistory } = withRouter({
    route,
    history
  });
  const { container: wrapProvider, store: globalStore } = withProvider({
    initialState,
    store
  });
  return {
    container: (component: JSX.Element) => wrapProvider(wrapHistory(component)),
    globalStore,
    memHistory
  };
}

export * from '@testing-library/react';
export { render };
