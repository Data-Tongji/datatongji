import React from 'react'
import { Route, Redirect } from 'react-router-dom';

function authenticate_token() {
  const requestInfo = {
    method: 'POST',
    body: JSON.stringify({ "token": localStorage.getItem('token') }),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  };

  fetch('http://localhost:8080/auth/authenticate_token', requestInfo)
    .then(response => {
      if (response.ok) {
        localStorage.setItem('valid', 'OK');
        return true;
      } else {
        localStorage.setItem('valid', 'NO');
        return false;
      }
    });
};

const isAuthenticated = () => {
  if (localStorage.hasOwnProperty('token')) {
    authenticate_token();
    if (localStorage.getItem('valid') === 'OK') {
      return true;
    } else { return false }
  } else {
    return false;
  };
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
            <Redirect from="/admin"
              to={{
                pathname: '/#/auth/login',
                state: { message: 'Usuário não autorizado' }
              }}
            />
          )}
    />
  );
};

export default PrivateRoute;