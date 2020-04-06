import React from 'react';
import { Spinner } from 'react-bootstrap';

import './component-loader.css';

export function ComponentLoader() {
  return (
    <div className="component-spinner">
      <Loader />
    </div>
  );
}

function Loader() {
  return <Spinner animation="grow" variant="dark" />;
}

export default Loader;
