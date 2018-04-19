import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { /*Link,*/ Route } from 'react-router-dom';

import $ from 'jquery';
import 'bootstrap';

import './App.css';

import Header from './Components/nav/Header';
import Sidebar from './Components/nav/Sidebar';
import routes from './routes';

class App extends Component {
  render() {
    return <div>
      <div id="page-top"></div>
      <Header />
      <div className="container-fluid" style={{
        padding: 0
      }}>
        <div className="row" style={{
          marginTop: 66,
          marginLeft: 0,
          marginRight: 0
        }}>
          <div className="full-height col-md-2">
            <div style={{ margin: 10 }}><Sidebar active="ipsum" /></div>
          </div>
          <div className="full-height col-md-10">
            <div style={{ margin: 10 }}>
              <Route path="/classes" component={routes.Classes} />
              <Route path="/profile" component={routes.Profile} />
              <Route path="/help"    component={routes.Help} />
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default App;
