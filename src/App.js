import React, { Component } from 'react';

import Roster from './components/Roster';
import Group, { Groups } from './components/Group';
import data from './data';

import logo from './logo.jpg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

var forceUpdate;

class App extends Component {
  constructor(args) {
    super(args);
    forceUpdate = this.forceUpdate.bind(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Hello Class Grouper</h1>
        </header>
        <p className="App-intro">
          To get started, click <code>Random</code> on the class roster and drag some students around.
        </p>
        <div className="container">
          <div className="col-md-9">
            <Groups>
              {data.groups.map(function (group) {
                return <Group group={group} key={group.id} />;
              })}
            </Groups>
          </div>
          <div className="col-md-3">
            <Roster students={data.students} />
          </div>
        </div>
      </div>
    );
  }
}

export { forceUpdate };
export default App;
