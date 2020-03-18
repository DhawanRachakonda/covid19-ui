import React from 'react';
import axios from 'axios';

import { withRouterAndProvider, render, wait } from '../../../test-utils';

import ViewDoc from './ViewDoc';
import { EReduxActionTypes } from '../../../store/types';

jest.useFakeTimers();

describe('tests for Login component', () => {
  const { get } = axios as any;

  beforeEach(() => {
    get.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: [
          {
            id: '1',
            docName: 'Medical Bill 🏥',
            docBadges: ['Medical', 'medical 2020', 'IT Submmission'],
            docImages: []
          },
          {
            id: '2',
            docName: 'Travel Bill - Bangalore 🏢 💻',
            docBadges: ['Travel', 'Travel 2020', 'IT Submmission', 'Bangalore'],
            docImages: []
          }
        ]
      });
    });
  });

  afterEach(() => {
    get.mockRestore();
  });

  it('generates snapshot for View Doc component', () => {
    const { container: injectRouterAndProvider } = withRouterAndProvider();
    (window as any).generateSnapshot(injectRouterAndProvider(<ViewDoc />));
  });

  it('should list docs', async (done) => {
    const {
      container: injectRouterAndProvider,
      globalStore
    } = withRouterAndProvider();
    const { getByText } = render(injectRouterAndProvider(<ViewDoc />));
    await wait(() => getByText(/Travel Bill - Bangalore/i));
    expect(globalStore.getState().docs.docs!.length).toBe(2);
    done();
  });

  it('should display something went wrong', async (done) => {
    const {
      container: injectRouterAndProvider,
      globalStore
    } = withRouterAndProvider();
    const { getByText } = render(injectRouterAndProvider(<ViewDoc />));
    await wait(() => getByText(/Travel Bill - Bangalore/i));
    expect(globalStore.getState().docs.docs!.length).toBe(2);
    globalStore.dispatch({
      type: EReduxActionTypes.SET_FETCH_DOCS_ERROR,
      payload: {
        message: 'Something went wrong'
      }
    });
    await wait(() => getByText(/Something Went Wrong/i));
    done();
  });
});
