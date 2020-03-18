import React from 'react';
import axios from 'axios';

import {
  withRouterAndProvider,
  render,
  wait,
  fireEvent
} from '../../../../test-utils';
import userEvent from '@testing-library/user-event';

import LoginComponent from './LoginComponent';

jest.useFakeTimers();

describe('tests for Login component', () => {
  const { create } = axios as any;
  const postCreate = create().post;

  beforeEach(() => {
    postCreate.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: {
          userName: 'mockuser',
          emailId: 'mockuser@icloud.com',
          displayName: 'Mock User'
        }
      });
    });
  });

  afterEach(() => {
    postCreate.mockRestore();
  });

  it('generates snapshot for Login component', () => {
    const { container: injectRouterAndProvider } = withRouterAndProvider();
    (window as any).generateSnapshot(
      injectRouterAndProvider(<LoginComponent />)
    );
  });

  it('should clear all fields when clicked on clear all', async (done) => {
    const { container: injectRouterAndProvider } = withRouterAndProvider();
    const { getByLabelText, getByTestId } = render(
      injectRouterAndProvider(<LoginComponent />)
    );
    await wait(() => getByLabelText('Email Address'));
    userEvent.type(getByTestId('emailInputEle'), 'r.dhawan27@icloud.com');
    userEvent.type(getByTestId('passwordInputEle'), 'mypassword');
    userEvent.click(getByTestId('cleanButton'));
    expect((getByTestId('emailInputEle') as HTMLInputElement).value).toBe('');
    expect((getByTestId('passwordInputEle') as HTMLInputElement).value).toBe(
      ''
    );
    done();
  });

  it('should set is loggedin value to true when logged in', async (done) => {
    const { container: injectRouterAndProvider } = withRouterAndProvider();
    const { getByLabelText, getByTestId, getByText } = render(
      injectRouterAndProvider(<LoginComponent />)
    );
    await wait(() => getByLabelText('Email Address'));
    userEvent.type(getByTestId('emailInputEle'), 'r.dhawan27@icloud.com');
    fireEvent.change(getByTestId('passwordInputEle'), {
      target: {
        value: 'mypassword'
      }
    });
    expect(localStorage.isLoggedIn).not.toBeTruthy();
    userEvent.click(getByTestId('loginButton'));
    await wait(() => getByText(/login success/i));
    expect(localStorage.isLoggedIn).toBeTruthy();
    done();
  });

  it('should able to submit login form', async (done) => {
    const {
      container: injectRouterAndProvider,
      globalStore
    } = withRouterAndProvider();
    const { getByLabelText, getByTestId, getByText } = render(
      injectRouterAndProvider(<LoginComponent />)
    );
    await wait(() => getByLabelText('Email Address'));
    userEvent.type(getByTestId('emailInputEle'), 'r.dhawan27@icloud.com');
    fireEvent.change(getByTestId('passwordInputEle'), {
      target: {
        value: 'mypassword'
      }
    });
    expect((getByTestId('emailInputEle') as HTMLInputElement).value).toBe(
      'r.dhawan27@icloud.com'
    );
    expect((getByTestId('passwordInputEle') as HTMLInputElement).value).toBe(
      'mypassword'
    );
    userEvent.click(getByTestId('loginButton'));
    await wait(() => getByText(/login success/i));
    // run all pending timers.
    jest.runAllTimers();
    expect((getByTestId('emailInputEle') as HTMLInputElement).value).toBe('');
    expect((getByTestId('passwordInputEle') as HTMLInputElement).value).toBe(
      ''
    );
    expect(setTimeout).toHaveBeenCalled();
    expect(globalStore.getState().user.userDetails!.emailId).toBe(
      'mockuser@icloud.com'
    );
    done();
  });
});
