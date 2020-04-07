import React from 'react';
import { Toast } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

interface ISuccessToaster {
  message: string;
}

function SuccessToaster({ message }: ISuccessToaster) {
  return (
    <Toast
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#d4edda',
        color: '#155724',
        zIndex: 9
      }}
      animation={true}
      delay={3000}
      className="success-toast"
    >
      <Toast.Header>
        <strong className="mr-auto">Success Message</strong>
      </Toast.Header>
      <Toast.Body>
        <strong>
          <FormattedMessage id={message} />
        </strong>
      </Toast.Body>
    </Toast>
  );
}

interface IFailureToaster {
  message: string;
}

export function FailureToaster({ message }: IFailureToaster) {
  return (
    <Toast
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#f8d7da',
        color: '#721c24',
        zIndex: 9
      }}
      animation={true}
      delay={3000}
    >
      <Toast.Header>
        <strong className="mr-auto">Failure Message</strong>
      </Toast.Header>
      <Toast.Body>
        <strong>{message}</strong>
      </Toast.Body>
    </Toast>
  );
}

export default SuccessToaster;
