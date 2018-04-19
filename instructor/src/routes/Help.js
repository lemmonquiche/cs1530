import React, { Component } from 'react';

class Help extends Component {
  render() {
    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text">Welcome to Class Grouper: Instructor Interface Help!</p>
          <p className="card-text">
            Here you can toggle the walkthrough hints and tips to guide you through the application.
          </p>
          <HelpSwitch />
        </div>
      </div>
    </div>;
  }
}

export default Help;

class HelpSwitch extends Component {
  constructor(props) {
    super(props);

    var prevChecked = localStorage.getItem("grouperHelpEnabled") === 'true';
    this.state = {
      checked: prevChecked
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    localStorage.setItem("grouperHelpEnabled", !this.state.checked);
    this.setState({ checked: !this.state.checked });
  }

  render() {
    return <div className="onoffswitch">
      <input
        onChange={this.toggle}
        type="checkbox"
        name="onoffswitch"
        className="onoffswitch-checkbox"
        id="myonoffswitch"
        checked={!!this.state.checked}
        />
      <label className="onoffswitch-label" htmlFor="myonoffswitch"></label>
    </div>;
  }
}
