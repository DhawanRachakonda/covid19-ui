import React from 'react';
import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  Modal,
  Form,
  Button
} from 'react-bootstrap';

import AppLogin from './login/AppLogin';
import { FormattedMessage } from 'react-intl';
import UserService from '../../services/user-services';
import { FailureToaster } from './toaster/SuccessToaster';
import paths from '../../routes/paths';
import Loader from './loaders';

interface IAdminTemplateProps {
  children: React.ReactNode;
  onLoginRequired: () => void;
}

function AdminOptions() {
  return (
    <Nav className="mr-auto">
      <NavDropdown title="Services" id="basic-nav-dropdown">
        <NavDropdown.Item href={paths.addAdmin.routeLink}>
          <FormattedMessage id="app.registerUserText" />
        </NavDropdown.Item>
        <NavDropdown.Item href={paths.admin.routeLink}>
          <FormattedMessage id="app.uploadInfectedPlaces" />
        </NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
}

function AdminTemplate({ children }: IAdminTemplateProps) {
  return <Template specificTemplate={<AdminOptions />}>{children}</Template>;
}

function UserOptions({ onLoginRequired }: any) {
  const onLoginClick = (e: any) => {
    onLoginRequired();
  };

  return (
    <React.Fragment>
      <Nav className="mr-auto"></Nav>
      <Nav className="justify-content-end" activeKey="/home">
        <Nav.Item className="line-height--none">
          <Button
            variant="light"
            type="button"
            className="padding-top-bottom--045"
            onClick={onLoginClick}
          >
            <FormattedMessage id="app.adminLogin.btn" />
          </Button>
        </Nav.Item>
        <Nav.Item className="line-height--none">
          <AppLogin />
        </Nav.Item>
      </Nav>
    </React.Fragment>
  );
}

interface IUserTemplateProps {
  children: React.ReactNode;
  onLoginRequired: () => void;
}

function UserTemplate({ children, onLoginRequired }: IUserTemplateProps) {
  return (
    <Template
      specificTemplate={<UserOptions onLoginRequired={onLoginRequired} />}
    >
      {children}
    </Template>
  );
}

interface ITemplateProps {
  children: React.ReactNode;
  specificTemplate: JSX.Element;
}

function Template({ children, specificTemplate }: ITemplateProps) {
  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" id="app-header">
        <Navbar.Brand href="/">
          <FormattedMessage id="app.name" />
        </Navbar.Brand>
        {specificTemplate}
      </Navbar>
      <Container>{children}</Container>
    </React.Fragment>
  );
}

interface ILoginPopupProps {
  onSuccess: () => void;
}

function LoginPopup({ onSuccess, ...rest }: ILoginPopupProps) {
  const [isError, setIsError] = React.useState(false);
  const [isFormInvalid, setIsFormInvalid] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    setIsFormInvalid(false);
    if (
      e.target.form.elements.username.value &&
      e.target.form.elements.password.value
    ) {
      try {
        setIsError(false);
        setIsAuthenticating(true);
        const response = await UserService.login(
          e.target.form.elements.username.value,
          e.target.form.elements.password.value
        );
        if (response.username) {
          UserService.saveUserToken(response);
          onSuccess();
        } else {
          setIsError(true);
          setTimeout(() => setIsError(false), 3000);
        }
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      setIsFormInvalid(true);
      setTimeout(() => setIsFormInvalid(false), 3000);
    }
  };

  return (
    <React.Fragment>
      {isError && <FailureToaster message="Invalid username or password" />}
      {isFormInvalid && (
        <FailureToaster message="All FIelds are required fields" />
      )}
      <Modal
        {...rest}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show
        onHide={() => {}}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <FormattedMessage id="app.loginHeader" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Enter user name"
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            {isAuthenticating && (
              <p className="margin-left--7">
                <Loader />
              </p>
            )}
            {!isAuthenticating && (
              <Button variant="primary" type="submit" onClick={handleOnSubmit}>
                Submit
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

interface IAppTemplateProps {
  isSecure?: boolean;
  children: React.ReactNode;
}

function AppTemplate({ children, isSecure }: IAppTemplateProps) {
  const [isLoginRequired, setIsLoginRequired] = React.useState<boolean>(false);

  const onLoginRequired = React.useCallback(() => {
    setIsLoginRequired(true);
  }, [setIsLoginRequired]);

  const isLoggedIn = UserService.isUserLoggedIn();

  const onSuccess = () => {
    setIsLoginRequired(false);
  };
  if (isLoggedIn) {
    const isAdmin = UserService.isAdmin();
    return (
      <React.Fragment>
        {isAdmin && (
          <AdminTemplate onLoginRequired={onLoginRequired}>
            {children}
          </AdminTemplate>
        )}
        {!isAdmin && (
          <UserTemplate onLoginRequired={onLoginRequired}>
            {children}
          </UserTemplate>
        )}
      </React.Fragment>
    );
  } else if (!isLoginRequired && !isSecure) {
    return (
      <React.Fragment>
        <UserTemplate onLoginRequired={onLoginRequired}>
          {children}
        </UserTemplate>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" id="app-header">
        <Navbar.Brand href="/">
          <FormattedMessage id="app.name" />
        </Navbar.Brand>
      </Navbar>
      {isLoginRequired && <LoginPopup onSuccess={onSuccess} />}
    </React.Fragment>
  );
}

export default AppTemplate;
