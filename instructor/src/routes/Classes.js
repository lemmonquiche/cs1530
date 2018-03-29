import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link, Route } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';

import Class from '../Components/Class'

class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,

    }

    setTimeout(function() { this.setState({ loaded: true }); }.bind(this), 10);
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    var index = 1;

    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">Classes</h5>
        <h6 className="card-subtitle mb-2 text-muted">Manage or Add classes for students to join.</h6>
        
        <Route path="/classes/:id" component={Class}/>
      </div>
    </div>;
  }
}

export default Classes;
