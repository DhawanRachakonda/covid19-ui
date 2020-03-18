import React from 'react';
import { Redirect } from 'react-router-dom';

import AppTemplate from '../Template';

import paths from '../../../routes/paths';
import { AppState } from '../../../store/rooReducerConfig';
import { useSelector } from 'react-redux';
import { ComponentLoader } from '../loaders';

export default () => {
  const user = useSelector((state: AppState) => state.user);
  if (!user.isFetching && user.isSuccess && !user.userDetails?.emailId) {
    return (
      <AppTemplate>
        <Redirect to={paths.login.path} />
      </AppTemplate>
    );
  }
  return <ComponentLoader />;
};
