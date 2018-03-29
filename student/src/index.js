import React from 'react';
import ReactDOM from 'react-dom';

import jQuery from 'jquery';

import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.js';
import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './testServer';

import { BrowserRouter } from 'react-router-dom';

window.$ = window.jQuery = jQuery;

if (process.env.NODE_ENV === 'development') {
  window.token = window.token || process.env.REACT_APP_token || 'ok';
}

if (!window.token) {
  alert("forwarding to /login");
}

ReactDOM.render(
  <BrowserRouter>
    <App token={window.token} />
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
