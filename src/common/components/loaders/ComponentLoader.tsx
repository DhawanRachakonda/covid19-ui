import React from 'react';
import { Spinner } from 'react-bootstrap';

import './component-loader.css';
import { Template } from '../AppTemplate';

function SpecificTemplate() {
  return <div></div>;
}

export function ComponentLoader() {
  return (
    <Template specificTemplate={<SpecificTemplate />}>
      <div className="component-spinner">
        <Loader />
      </div>
    </Template>
  );
}

function Loader() {
  return <Spinner animation="grow" variant="dark" />;
}

export default Loader;
