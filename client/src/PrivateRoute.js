import React from 'react';
import { connect } from 'react-redux';

function PrivateRoute({ children, isAuthenticated, ...rest}){
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


