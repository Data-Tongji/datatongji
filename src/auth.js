import React from 'react'
import {Route, Redirect } from 'react-router-dom';

function authenticate_token () {
  const requestInfo = {
    method: 'POST',
    body: JSON.stringify({"token": localStorage.getItem('token')}),
    headers: new Headers ({
      'Content-Type': 'application/json'
    }),
  };

  fetch('https://api-data-statistic.herokuapp.com/auth/authenticate_token', requestInfo)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
        localStorage.setItem('valid', "NO"); 
    }
  })
  .then(valid => {
    localStorage.setItem('valid', valid);  
  }) 
};

const isAuthenticated = () => {
  authenticate_token ();
  if (localStorage.hasOwnProperty('token') && (localStorage.getItem('valid'))==='OK'){
    return true;    
  } else {
      return false;
  }
};

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    <Route 
          {...rest}
          render={props => 
            isAuthenticated() ? (
              <Component {...props} /> 
          ): (
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

export default PrivateRoute ;