import React from 'react'
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.jsx";
import RTLLayout from "layouts/RTL/RTL.jsx";
import AuthLayout from "layouts/Auth/Auth.jsx";
import PrivateRoute from './auth';

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import 'flag-icon-css/css/flag-icon.css'

const hist = createBrowserHistory();

var http = require("http");
setInterval(function() {
    http.get("http://datatongji-backend.herokuapp.com");
}, 150000); // every 2,5 minutes 

const authenticate_token = () => {
  const requestInfo = {
    method: 'POST',
    body: JSON.stringify({ "token": localStorage.getItem('token') }),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  };

  fetch('https://datatongji-backend.herokuapp.com/auth/authenticate_token', requestInfo)
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

ReactDOM.render(
  <BrowserRouter basename={window.location.pathname || ''} >
    <Router history={hist} basename={window.location.pathname || ''}>
      <Switch>
        <PrivateRoute path="/admin" component={AdminLayout} />
        {/* <Route path="/admin" render={props => <AdminLayout {...props} />} /> */}
        <Route path="/auth" render={props => <AuthLayout {...props} />} />
        <Redirect from="/auth/login" to={
          isAuthenticated() ? "/admin/dashboard" : "/auth/login"
        } />
        <Redirect from="/" to="/auth/login" />
      </Switch>
    </Router>
  </BrowserRouter>,
  document.getElementById("root")
);
