import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';

import './index.css';
import * as serviceWorker from './serviceWorker';
import App from './App';
import messages from './common/lang/messages';
import { configureStore } from './store/storeConfig';

render(
  <Provider store={configureStore()}>
    <IntlProvider
      locale={navigator.language}
      messages={(messages as any)[navigator.language]}
    >
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
