import React from 'react';
import { Spinner } from 'react-bootstrap';

import './component-loader.css';

import AppTemplate from '../Template';

export function ComponentLoader() {
  return (
    <AppTemplate>
      <div className="component-spinner">
        <Loader />
      </div>
    </AppTemplate>
  );
}

function Loader() {
  return <Spinner animation="grow" variant="dark" />;
}

export default Loader;
