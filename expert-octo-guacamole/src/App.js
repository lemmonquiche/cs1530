import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import 'bootstrap/dist/css/bootstrap.css';

import UserForm from './Components/UserForm';
import PasswordForm from './Components/PasswordForm';
import SignupForm from './Components/SignupForm';
//import server from './testServer';

class App extends Component {
  constructor (props) {
    super(props);

    // This state is only used for passing props (not duplicate)
    this.state = {
      userData: null,
      username: '',  // not found username
    };

    this.userFormResult = this.userFormResult.bind(this);
    this.signupFormResult = this.signupFormResult.bind(this);
  }

  /**
   * Expects outcome either
   * 
   * * { success: {username, ...data...} }
   * * { missing: 'username' }
   */
  userFormResult (outcome) {
    if (outcome.success) {
      return this.setState({ userData: outcome.success });
    }

    else if (outcome.missing) {
      console.log("user missing!!", outcome.missing);
      this.setState({ userData: null });
      this.setState({ username: outcome.missing });
    }
  }

  signupFormResult (outcome) {
    this.setState({
      userData: null,
      username: ''
    });
  }

  /**
   * The default behavior is to ask for a username.
   * If userData is set, then ask for a password.
   * If the username is missing (in state.username), show signup.
   */
  render() {
    var form = <UserForm result={this.userFormResult} />;
    if (this.state.userData) {
      form = <PasswordForm userData={this.state.userData} />;
    }

    else if (this.state.username) {
      form = <SignupForm result={this.signupFormResult} username={this.state.username} />
      // form = <SignupForm result={this.signupFormResult} username={'new'}/>;
    }

    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
        {form}
      </div>
    );
  }
}

export default App;
