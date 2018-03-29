import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { /*Link,*/ Route } from 'react-router-dom';

import $ from 'jquery';
import 'bootstrap';

import './App.css';

import Header from './Components/nav/Header';
import Sidebar from './Components/nav/Sidebar';

import routes from './routes';
import Class from './Components/Class';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: ''
    };
  }

  componentDidMount () {
    var $this = $(ReactDOM.findDOMNode(this));
    window.thing = $this.find('.full-height');
    // window.thing.height($(window).height() - 66);
  }

  render() {
    return <div>
      <div id="page-top"></div>
      <Header name={this.state.name}/>
      <div className="container-fluid" style={{ padding: 0 }}>
        <div className="row" style={{ marginTop: 66, marginLeft: 0, marginRight: 0 }}>

          <div className="full-height col-md-2">
            <Sidebar />
          </div>

          <div className="full-height col-md-10">
            <div style={{ margin: 10 }}>
              <Route path="/profile"    render={(props) => <routes.Profile  token={this.props.token} {...props} /> }/>
              <Route path="/classes"    render={(props) => <routes.Classes  token={this.props.token} {...props} /> }/>
              <Route path="/joined/:id" render={(props) => <Class           token={this.props.token} {...props} /> }/>
              <Route path="/schedule"   render={(props) => <routes.Schedule token={this.props.token} {...props} /> }/>
              <Route path="/help"       render={(props) => <routes.Help     token={this.props.token} {...props} /> }/>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default App;
