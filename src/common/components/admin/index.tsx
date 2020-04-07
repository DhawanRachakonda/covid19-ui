import React from 'react';
import { Container } from 'react-bootstrap';

import Admin from './Admin';
import AddAdmin from './AddAdmin';

export default function AdminHomePage() {
  return (
    <Container>
      <Admin />
    </Container>
  );
}
export { AddAdmin };
