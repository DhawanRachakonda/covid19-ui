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
        right: 0
      }}
      animation={true}
      delay={3000}
    >
      <Toast.Body>
        <FormattedMessage id={message} />
      </Toast.Body>
    </Toast>
  );
}

export default SuccessToaster;
