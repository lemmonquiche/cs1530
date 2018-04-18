import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import jQuery from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

window.$ = window.jQuery = jQuery;

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
