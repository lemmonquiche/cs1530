import React, { Component } from 'react';

import Roster from './components/Roster';
import Group, { Groups } from './components/Group';
import data from './data';

import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

var forceUpdate;

class App extends Component {
  constructor(args) {
    super(args);

    // this.render = this.render.bind(this);
    this.updateRoster = this.updateRoster.bind(this);
    this.updateGroups = this.updateGroups.bind(this);
    this.students = data.students;
    this.groups = data.groups;
    forceUpdate = this.forceUpdate.bind(this);
  }

  updateRoster () {
    this.students = data.students;
    this.forceUpdate();
  }

  updateGroups () {
    this.groups = data.groups;
    this.forceUpdate();
  }

  render() {
    var groups = this.groups;
    var students = this.students;
    var updateGroups = this.updateGroups;

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
              {groups.map(function (group) {
                return <Group group={group} key={group.id} updateGroups={updateGroups} />;
              })}
            </Groups>
          </div>
          <div className="col-md-3">
            <Roster students={students} />
          </div>
        </div>
      </div>
    );
  }
}

export { forceUpdate };
export default App;
