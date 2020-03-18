import React, { ReactNode, useCallback } from 'react';

import './template.css';

import { Navbar, Nav, Container } from 'react-bootstrap';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import paths from '../../routes/paths';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store/rooReducerConfig';
import { Redirect } from 'react-router-dom';
import { UserProvider, useUserState } from './providers/UserProvider';
import { logout } from '../../store/user/actions';

interface IAppTemplateProps {
  children: ReactNode;
  isSecure?: boolean;
}

export default function AppTemplate({ isSecure, children }: IAppTemplateProps) {
  const user = useSelector((state: AppState) => state.user);
  if (
    isSecure &&
    !user.isFetching &&
    user.isSuccess &&
    user.userDetails?.emailId
  ) {
    return (
      <UserProvider>
        <SecureHeader />
        <Container>{children}</Container>
        <Footer />
      </UserProvider>
    );
  } else if (isSecure) {
    return <Redirect to={paths.login.path} />;
  } else {
    return (
      <React.Fragment>
        <Header />
        <Container>{children}</Container>
        <Footer />
      </React.Fragment>
    );
  }
}

function SecureHeader() {
  const { displayName } = useUserState();
  const dispatch = useDispatch();
  const logoutUser = useCallback(
    (e: any) => {
      dispatch(logout());
    },
    [dispatch]
  );
  return (
    <Navbar collapseOnSelect={true} expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href={paths.login.link}>
        <FormattedMessage id="app.appName" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="navbar-right">
          <Nav.Link>
            <span>
              <FormattedMessage id="app.hi" /> {displayName}
            </span>
          </Nav.Link>
          {
            // eslint-disable-next-line no-script-url
            <Nav.Link href="javascript:void(0)" onClick={logoutUser}>
              <FormattedMessage id="app.logout" />
            </Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function Header() {
  return (
    <Navbar collapseOnSelect={true} expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href={paths.login.link}>
        <FormattedMessage id="app.appName" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="navbar-right">
          <Nav.Link href={paths.login.link}>
            <FormattedMessage id="app.login" />
          </Nav.Link>
          <Nav.Link eventKey={2} href={paths.registration.link}>
            <FormattedMessage id="app.register" />
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

function Footer() {
  return <FormattedHTMLMessage id="app.rightsReceived" />;
}
