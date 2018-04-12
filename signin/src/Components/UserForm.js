import React, { Component } from 'react';
import jQuery from 'jquery';

import ReactTestUtils from 'react-dom/test-utils'; // ES6

class UserForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      username: ''
    };

    this.usernameChange = this.usernameChange.bind(this);
    this.userFormSubmit = this.userFormSubmit.bind(this);
  }

  usernameChange(event) {
    this.setState({username: event.target.value});
  }

  userFormSubmit(event) {
    event.preventDefault();
    var username = this.state.username;
    
    jQuery.ajax({
      method: 'post',
      url: '/api/login/user',
      contentType: 'application/json',
      data: JSON.stringify({ username }),
      // data: { username },
      dataType: 'json',
      error: function (jQReq, status, error) {
        console.log(arguments);
      }.bind(this),
      success: function (data, status, jQReq) {
        console.log('success', data, arguments);
        if (!data.err) {
          return this.props.result({ success: data });
        }
        
        this.props.result({ missing: username });
      }.bind(this)
    });
  }

  testing (that) {
    setTimeout(function() {
      if (!(that.refs && that.refs.input && that.refs.form))
        return;

      that.refs.input.value = 'test';
      // that.refs.input.value = 'nope';
      ReactTestUtils.Simulate.change(that.refs.input);
      ReactTestUtils.Simulate.submit(that.refs.form);

    }.bind(that), 500);
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      this.testing(this);
    }
    return (
      <div style={{ maxWidth: '500px', margin: 'auto' }}>
        <form className="form-horizontal" onSubmit={this.userFormSubmit} ref='form'>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="user-form-username">Username:</label>
            <div className="col-sm-10">
              <input
                tabIndex="1"
                id="user-form-username"
                ref='input'
                className="form-control"
                placeholder="Username"
                type="text"
                autoComplete="username"
                value={this.state.username}
                onChange={this.usernameChange} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default pull-right" style={{ float: 'right' }}>
                Next
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default UserForm;
