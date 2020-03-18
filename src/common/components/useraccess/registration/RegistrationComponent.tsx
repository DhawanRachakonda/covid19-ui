import React, { useState } from 'react';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';

import './Registration.css';
import { useHistory } from 'react-router-dom';
import paths from '../../../../routes/paths';
import SuccessToaster from '../../toaster/SuccessToaster';
import { saveUser } from '../../../../store/user';

interface IRegistrationFormProps {
  setEmail: any;
  setName: any;
  setPassword: any;
  email: string;
  name: string;
  password: string;
  onSubmit: any;
  onClear: any;
}

function RegistrationForm({
  setEmail,
  setName,
  setPassword,
  name,
  email,
  password,
  onClear,
  onSubmit
}: IRegistrationFormProps) {
  return (
    <Row className="justify-content-md-center">
      <Col lg={6} md={6}>
        <Card className="registartion-form">
          <Card.Header>
            <FormattedMessage id="app.register.form" />
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col md={6} lg={8}>
                  <Form.Group controlId="formBasicUserName">
                    <Form.Label>
                      <FormattedMessage id="app.input.userName" />
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter user name"
                      value={name}
                      onChange={setName}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} lg={8}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>
                      <FormattedMessage id="app.input.emailAddress" />
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={setEmail}
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
                      value={password}
                      onChange={setPassword}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Row>
              <Col lg={3} sm={2} xs={2}>
                <Button variant="primary" type="submit" onClick={onSubmit}>
                  <FormattedMessage id="app.input.createAccount" />
                </Button>
              </Col>
              <Col lg={3} sm={2} xs={2}>
                <Button variant="secondary" onClick={onClear}>
                  <FormattedMessage id="app.input.resetFields" />
                </Button>
              </Col>
            </Row>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const [isToasterEnabled, setToaster] = useState(false);
  const onSubmit = async (e: any) => {
    e.preventDefault();
    await saveUser({ name, email, password });
    setToaster(true);
    setTimeout(() => {
      setToaster(false);
      history.push(paths.login.routeLink);
    }, 3000);
    onClear();
  };

  const onClear = () => {
    setName('');
    setEmail('');
    setPassword('');
  };
  return (
    <React.Fragment>
      <Helmet>
        <title>Registration Page</title>
      </Helmet>
      {isToasterEnabled && <SuccessToaster message="app.accountCreated" />}
      <RegistrationForm
        name={name}
        setName={(e: any) => setName(e.target.value)}
        setEmail={(e: any) => setEmail(e.target.value)}
        email={email}
        password={password}
        setPassword={(e: any) => setPassword(e.target.value)}
        onSubmit={onSubmit}
        onClear={onClear}
      />
    </React.Fragment>
  );
}

export default Register;
