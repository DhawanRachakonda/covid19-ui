import React, { Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';

import routes from './routes/routesconfig';

import { ComponentLoader } from './common/components/loaders';
import AppTemplate from './common/components/AppTemplate';
import { AppProvider } from './common/components/home/AppContext';

function AppEntry() {
  return (
    <AppProvider>
      <Router>
        <Suspense fallback={<ComponentLoader />}>
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </Suspense>
      </Router>
    </AppProvider>
  );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route: any) {
  if (route.exact) {
    return (
      <Route
        exact={true}
        path={route.path}
        render={(props: any) => (
          // pass the sub-routes down to keep nesting
          <AppTemplate {...props}>
            <route.Component {...props} routes={route.routes} />
          </AppTemplate>
        )}
      />
    );
  }
  return (
    <Route
      path={route.path}
      render={(props: any) => (
        // pass the sub-routes down to keep nesting
        <AppTemplate {...route}>
          <route.Component {...props} routes={route.routes} />
        </AppTemplate>
      )}
    />
  );
}

export default AppEntry;
