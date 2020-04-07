import paths from './paths';
import { lazy } from 'react';

const AdminPage = lazy(() => import('../common/components/admin'));
const PageNotFound = lazy(() => import('../common/components/page_not_found'));
const Home = lazy(() => import('../common/components/home'));
const AddAdminPage = lazy(() => import('../common/components/admin/AddAdmin'));
const UploadUserVisistedPlaces = lazy(() =>
  import('../common/components/home/visited-places')
);

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
    Component: Home,
    exact: true
  },
  {
    path: paths.admin.path,
    Component: AdminPage,
    isSecure: true
  },
  {
    path: paths.addAdmin.path,
    Component: AddAdminPage,
    isSecure: true
  },
  {
    path: paths.uploadGoogleTakeOut.path,
    Component: UploadUserVisistedPlaces
  },
  {
    path: '*',
    Component: PageNotFound
  }
];
