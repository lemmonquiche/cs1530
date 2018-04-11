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
  componentDidMount () {
    var $this = $(ReactDOM.findDOMNode(this));
    window.thing = $this.find('.full-height');
    // window.thing.height($(window).height() - 66);
  }

  render() {
    return <div>
      <div id="page-top"></div>
      {/*<!-- Navigation -->*/}
      <Header />
      <div className="container-fluid" style={{
        padding: 0
      }}>
        <div className="row" style={{
          marginTop: 66,
          marginLeft: 0,
          marginRight: 0
        }}>
          <div className="full-height col-md-2" style={{/*{ paddingRight: 0 }*/}}>
            <div style={{ margin: 10 }}><Sidebar active="ipsum" /></div>
          </div>
          <div className="full-height col-md-10" style={{/*{ paddingLeft: 0 }*/}}>
            <div style={{ margin: 10 }}>
              <Route path="/classes" component={routes.Classes}/>
              <Route path="/profile" component={routes.Profile}/>
              <Route path="/help" component={routes.Help}/>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default App;
