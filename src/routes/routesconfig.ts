import paths from './paths';
import { lazy } from 'react';

const UserAccess = lazy(() => import('../common/components/useraccess'));
const LoginPage = lazy(() => import('../common/components/useraccess/login'));
const RegistrationPage = lazy(() =>
  import('../common/components/useraccess/registration')
);
const PageNotFound = lazy(() => import('../common/components/page_not_found'));
const ViewDocPage = lazy(() => import('../common/components/docs'));

export default [
  // {
  //   path: "/",
  //   component: UserAccess,
  //   routes: [
  //     {
  //       path: "/login",
  //       component: LoginPage
  //     },
  //     {
  //       path: "/registration",
  //       component: RegistrationPage
  //     }
  //   ]
  // },
  {
    path: '/',
    Component: UserAccess,
    exact: true
  },
  {
    path: paths.login.path,
    Component: LoginPage
  },
  {
    path: paths.registration.path,
    Component: RegistrationPage
  },
  {
    path: paths.viewDocs.path,
    Component: ViewDocPage
  },
  {
    path: '*',
    Component: PageNotFound
  }
];
