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
import { MdFileUpload } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import UserService from '../../services/user-services';
import { FailureToaster } from './toaster/SuccessToaster';
import paths from '../../routes/paths';
import Loader from './loaders';
import { UserProvider, useUserState } from './providers/UserProvider';
import { useAppDispatch, useAppFormState } from './home/AppContext';

interface IAdminTemplateProps {
  children: React.ReactNode;
  onLoginRequired: () => void;
  onLogout: () => void;
}

interface IAdminOptionsProps {
  onLogout: () => void;
}

function AdminOptions({ onLogout }: IAdminOptionsProps) {
  const { userName } = useUserState();
  return (
    <React.Fragment>
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
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>Signed in as: {userName}</Navbar.Text>
        <Nav.Link onClick={onLogout}>Logout</Nav.Link>
      </Navbar.Collapse>
    </React.Fragment>
  );
}

function AdminTemplate({ onLogout, children }: IAdminTemplateProps) {
  return (
    <Template specificTemplate={<AdminOptions onLogout={onLogout} />}>
      {children}
    </Template>
  );
}

function UserOptions({ onLoginRequired }: any) {
  const onLoginClick = (e: any) => {
    onLoginRequired();
  };

  const { formatMessage } = useIntl();

  return (
    <React.Fragment>
      <Nav className="mr-auto">
        <Nav.Link
          title={formatMessage({
            id: 'help.uploadFileFromGoogleTakeOut.toolTip'
          })}
          href={paths.uploadGoogleTakeOut.routeLink}
          className="upload-places-header-link"
        >
          <MdFileUpload size="28px" />
          <FormattedMessage id="app.uploadGoogleTakeout.link" />
        </Nav.Link>
      </Nav>
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

export function Template({ children, specificTemplate }: ITemplateProps) {
  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" id="app-header">
        <Navbar.Brand className="brand-name" href="/">
          <img
            alt="Incubation Tracker"
            src="/images/favicon-32X32.png"
            style={{ marginRight: '0.5em' }}
          />
          <h2>
            <FormattedMessage id="app.name" />
          </h2>
        </Navbar.Brand>
        {specificTemplate}
      </Navbar>
      <Container className="max-width--100-imp">{children}</Container>
    </React.Fragment>
  );
}

interface ILoginPopupProps {
  onSuccess: () => void;
  onHide: () => void;
}

function LoginPopup({ onSuccess, onHide, ...rest }: ILoginPopupProps) {
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
        onHide={onHide}
      >
        <Modal.Header closeButton>
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

  const dispatch = useAppDispatch();

  const onLoginRequired = React.useCallback(() => {
    setIsLoginRequired(true);
  }, [setIsLoginRequired]);

  const { isLoggedIn } = useAppFormState();

  const onSuccess = () => {
    setIsLoginRequired(false);
    dispatch({
      type: 'SET_LOGGED_IN',
      payload: {}
    });
  };
  const onHide = () => {
    setIsLoginRequired(false);
  };

  const onLogout = () => {
    UserService.logout();
    dispatch({
      type: 'LOG_OUT',
      payload: {}
    });
  };

  if (isLoggedIn) {
    const isAdmin = UserService.isAdmin();
    return (
      <React.Fragment>
        {isAdmin && (
          <UserProvider>
            <AdminTemplate
              onLogout={onLogout}
              onLoginRequired={onLoginRequired}
            >
              {children}
            </AdminTemplate>
          </UserProvider>
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
        <Navbar.Brand className="brand-name" href="/">
          <h2>
            <FormattedMessage id="app.name" />
          </h2>
        </Navbar.Brand>
      </Navbar>
      {(isLoginRequired || isSecure) && (
        <LoginPopup onSuccess={onSuccess} onHide={onHide} />
      )}
    </React.Fragment>
  );
}

export default AppTemplate;
