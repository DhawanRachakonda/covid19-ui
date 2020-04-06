import paths from './paths';
import { lazy } from 'react';

const AdminPage = lazy(() => import('../common/components/admin'));
const PageNotFound = lazy(() => import('../common/components/page_not_found'));
const Home = lazy(() => import('../common/components/home'));
const AddAdminPage  = lazy(() => import('../common/components/admin/AddAdmin'));

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
    Component: AdminPage
  },
  {
    path: paths.addAdmin.path,
    Component: AddAdminPage
  },
  {
    path: '*',
    Component: PageNotFound
  }
];
