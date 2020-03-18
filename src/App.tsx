import React, { Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import routes from './routes/routesconfig';

import { ComponentLoader } from './common/components/loaders';

function AppEntry() {
  return (
    <Router>
      <Suspense fallback={<ComponentLoader />}>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </Suspense>
    </Router>
  );
}

// A special wrapper for <Route> that knows how to
// handle "sub"-routes by passing them in a `routes`
// prop to the component it renders.
function RouteWithSubRoutes(route: any) {
  console.log(route);
  if (route.exact) {
    return (
      <Route
        exact={true}
        path={route.path}
        render={(props: any) => (
          // pass the sub-routes down to keep nesting
          <route.Component {...props} routes={route.routes} />
        )}
      />
    );
  }
  return (
    <Route
      path={route.path}
      render={(props: any) => (
        // pass the sub-routes down to keep nesting
        <route.Component {...props} routes={route.routes} />
      )}
    />
  );
}

export default AppEntry;
