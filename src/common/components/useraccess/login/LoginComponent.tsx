import React, { useState } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import Helmet from 'react-helmet';
import { useHistory } from 'react-router-dom';

import './Login.css';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../../store/user';
import paths from '../../../../routes/paths';
import UserServices from '../../../../services/user';
import SuccessToaster from '../../toaster/SuccessToaster';

interface ILoginProps {
  setEmail: any;
  setPassword: any;
  onFormSubmit: any;
  clearAll: any;
  email: string;
  password: string;
}

function Login({
  setEmail,
  setPassword,
  onFormSubmit,
  clearAll,
  email,
  password
}: ILoginProps) {
  return (
    <Row className="justify-content-md-center">
      <Col lg={6} md={6}>
        <Card className="login-form">
          <Card.Header>
            <FormattedMessage id="app.login" />
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={6} lg={8}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>
                      <FormattedMessage id="app.input.emailAddress" />
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      onChange={setEmail}
                      data-testid="emailInputEle"
                      value={email}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} lg={8}>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>
                      <FormattedMessage id="app.input.password" />
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      onChange={setPassword}
                      data-testid="passwordInputEle"
                      value={password}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col lg={3} sm={2} xs={2}>
                <Button
                  variant="primary"
                  type="submit"
                  onClick={onFormSubmit}
                  data-testid="loginButton"
                >
                  <FormattedMessage id="app.login" />
                </Button>
              </Col>
              <Col lg={3} sm={2} xs={2}>
                <Button
                  variant="secondary"
                  data-testid="cleanButton"
                  onClick={clearAll}
                >
                  <FormattedMessage id="app.cancelLogin" />
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isToasterEnabled, setToaster] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const onFormSubmit = async () => {
    await dispatch(loginUser({ userName: email, password }));
    UserServices.setLoggedIn();
    setToaster(true);
    // go to view docs page
    setTimeout(() => history.push(paths.viewDocs.routeLink), 3000);
    clearAll();
  };

  const clearAll = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <React.Fragment>
      {isToasterEnabled && <SuccessToaster message="app.loginsuccessfull" />}
      <Login
        setEmail={(e: any) => setEmail(e.target.value)}
        setPassword={(e: any) => setPassword(e.target.value)}
        email={email}
        password={password}
        onFormSubmit={onFormSubmit}
        clearAll={clearAll}
      />
    </React.Fragment>
  );
}

export default () => {
  const { formatMessage } = useIntl();
  return (
    <React.Fragment>
      <Helmet>
        <title>{formatMessage({ id: 'app.loginPage' })}</title>
      </Helmet>
      <LoginComponent />
    </React.Fragment>
  );
};
