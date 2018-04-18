import React, { Component } from 'react';
import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

import ReactTestUtils from 'react-dom/test-utils'; // ES6

import image from './sampleImage';

var success = false;
class PasswordForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      password: '',
      error: false
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.passwordChange = this.passwordChange.bind(this);
    this.passwordFormSubmit = this.passwordFormSubmit.bind(this);
  }

  componentDidMount() {
    jQuery('.popover.fade.bs-popover-right.show').remove();
    jQuery('[data-toggle="popover"]').popover('hide');
    jQuery('[data-toggle="popover"]').popover({
      container: 'body',
      trigger: 'manual'
    });

    jQuery('[data-toggle="popover"]').popover('show');
    setTimeout(function() {
      jQuery('[data-toggle="popover"]').popover('hide');
    }, 1300);
  }

  passwordChange(event) {
    this.setState({password: event.target.value});
  }

  passwordFormSubmit(event) {
    event.preventDefault();
    jQuery('[data-toggle="popover"]').popover('hide');
    var username = this.props.userData.username;
    var password = this.state.password;
    
    jQuery.ajax({
      method: 'post',
      url: '/api/login/credentials',
      contentType: 'application/json',
      data: JSON.stringify({ username, password }),
      dataType: 'json',
      error: function (jQReq, status, error) {
        console.log("error", arguments);
      }.bind(this),
      success: function (data, status, jQReq) {
        if (!data.err) {
          if (data.user_type === 'Student'){
              window.location.assign("/student")
          }
          if (data.user_type === 'Instructor'){
              window.location.assign("/instructor")
          }
 
          success = true;
          window.location.href = '/' + (data.role || 'student');
          return;
        }

        this.setState({ error: true });
      }.bind(this)
    });
  }

  testing(that) {
    setTimeout(function() {
      if (!(this.refs && this.refs.password && this.refs.form))
        return;

      if (success) return;

      if (this.state.error) return;

      // this.refs.password.value = "pwd";
      this.refs.password.value = "nope";
      ReactTestUtils.Simulate.change(this.refs.password);
      console.log("submitting form now");
      ReactTestUtils.Simulate.submit(this.refs.form);
    }.bind(that), 400);
  }

  render() {
    if (process.env.NODE_ENV !== 'production') {
      // this.testing(this);
    }

    var space = { margin: 5 };
    var err = this.state.error ? 'Password not recognized' : '.';
    return (
      <div style={{ width: '500px', margin: 'auto' }}>
        <div className="media">
          <div className="media-left" style={{ ...space }}>
            {/*<a href=""></a>*/}
              {/*data-src="holder.js/64x64"*/}
            {/*<img
              alt="64x64"
              className="media-object"
              src={image}
              data-holder-rendered="true"
              style={{ width: '64px', height: '64px', ...space }} />*/}
          </div>
          <div className="media-body" style={{ ...space }}>
            <h4 className="media-heading">{this.props.userData.name}</h4>
            <h4 className="media-heading" style={{ fontSize: '1em' }}>{this.props.userData.username}</h4>
            {/*{ this.props.userData.info }*/}
          </div>
        </div>
        <p>{err}</p>
        <form className="form-horizontal" ref='form' onSubmit={this.passwordFormSubmit}>
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor="user-form-password">
              Password:
              {this.helpEnabled
                ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                    data-container="body"
                    data-toggle="popover"
                    data-placement="right"
                    data-content="Enter your password in the field below “Password”"
                    onMouseOver={(e) => jQuery('[data-toggle="popover"]').popover('show')}
                    onMouseOut={(e) => jQuery('[data-toggle="popover"]').popover('hide')}
                    />
                : null}
            </label>
            <div className="col-sm-10">
              <input
                tabIndex="1"
                id="user-form-password"
                ref='password'
                className="form-control"
                placeholder="Password"
                type="password"
                autoComplete="username"
                value={this.state.password}
                onChange={this.passwordChange} />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default float-right" >
                Next
              </button>
              <button type="" onClick={(e) => {
                  e.preventDefault();
                  this.props.back();
                }} className="btn btn-default float-right" >
                Back
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default PasswordForm;
