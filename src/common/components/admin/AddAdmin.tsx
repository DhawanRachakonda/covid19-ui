import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import UserService from '../../../services/user-services';
import { useHistory } from 'react-router-dom';
import paths from '../../../routes/paths';
import SuccessToaster, { FailureToaster } from '../toaster/SuccessToaster';
import { FormattedMessage } from 'react-intl';

function AddAdmin() {
  const [isError, setIsError] = React.useState(false);
  const [isFormInvalid, setIsFormInvalid] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const history = useHistory();

  const onSuccess = () => {
    history.push(paths.home.routeLink);
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
    setIsFormInvalid(false);
    if (
      e.target.form.elements.username.value &&
      e.target.form.elements.password.value
    ) {
      setIsError(false);
      const response = await UserService.addAdmin(
        e.target.form.elements.username.value,
        e.target.form.elements.password.value
      );
      if (response.username) {
        UserService.saveUserToken(response);
        setIsSuccess(true);
        setTimeout(() => onSuccess(), 2000);
      } else {
        setIsError(true);
        setTimeout(() => setIsError(false), 3000);
      }
    } else {
      setIsFormInvalid(true);
      setTimeout(() => setIsFormInvalid(false), 3000);
    }
  };

  return (
    <React.Fragment>
      {isError && <FailureToaster message="Something went wrong" />}
      {isFormInvalid && (
        <FailureToaster message="All FIelds are required fields" />
      )}
      {isSuccess && <SuccessToaster message="app,addAdmin.successMessage" />}
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show
        onHide={() => {}}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            <FormattedMessage id="app.registerAdmin" />
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
            <Button variant="primary" type="submit" onClick={handleOnSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}

export default AddAdmin;
