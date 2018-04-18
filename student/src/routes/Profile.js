import React, { Component } from 'react';
import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      username: '',
      password: '',
      loaded: false,
      error: ''
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.formSubmit = this.formSubmit.bind(this);
    this.fetchOld = this.fetchOld.bind(this);

    this.fetchOld();
  }

  fetchOld() {
    jQuery.get('/api/profile', function (data) {
      this.setState({
        loaded: true,
        fname: data.fname,
        lname: data.lname,
        username: data.username,
        email: data.email
      });
    }.bind(this));
  }

  formSubmit(e) {
    e.preventDefault();
    jQuery.ajax({
      method: 'post',
      url: '/api/profile',
      contentType: 'application/json',
      data: JSON.stringify({
        username: this.state.username,
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        role: this.state.role === 0 ? 'student' : 'instructor',
        password: this.state.password,
      }),
      dataType: 'json',
      error: function (jQReq, status, error) {
        this.setState({ error });
        console.log(arguments);
      }.bind(this),
      success: function (data, status, jQReq) {
        console.log('success', data, arguments);
        if (!data.err) {
          // return this.props.result({ success: data });
          console.log('Email sent, now refresh page.');
          this.setState({ loaded: true, error: '' });
        }
        
        this.setState({ error: data.err })
      }.bind(this)
    });

    this.setState({ password: '', loaded: false });
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    var errorUI = null;
    if (this.state.error) {
      errorUI = <div className="col-md-6">
        <p>Error: {this.state.error}</p>
      </div>;
    }

    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">Edit Profile</h5>
        <h6 className="card-subtitle mb-2 text-muted">Update your profile information.</h6>
        <hr />
        <div className="row">
          <div className="col-md-6 personal-info">
            <h3>Personal info</h3>
            <form className="form-horizontal" onSubmit={this.formSubmit}>
              <TextFormGroup
                label='First Name:'
                value={this.state.fname}
                onChange={(e) => this.setState({fname: e.target.value})} />
              <TextFormGroup
                label='Last Name:'
                value={this.state.lname}
                onChange={(e) => this.setState({lname: e.target.value})} />
              <TextFormGroup
                label='Email:'
                value={this.state.email}
                onChange={(e) => this.setState({email: e.target.value})} />
              <TextFormGroup
                label='Username:'
                value={this.state.username}
                onChange={(e) => this.setState({username: e.target.value})} />

              <PwdFormGroup
                label='Password:'
                value={this.state.password}
                onChange={(e) => this.setState({password: e.target.value})} />

              <div className="form-group">
                <label className="col-md-3 control-label"></label>
                <div className="col-md-8">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                    {this.helpEnabled
                      ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                          data-container="body"
                          data-toggle="popover"
                          data-placement="right"
                          data-content="Click “Save Changes” to finish the update to your profile."
                          onMouseOver={(e) => jQuery(e.target).popover('show')}
                          onMouseOut={(e) => jQuery(e.target).popover('hide')}
                          />
                      : null}
                  </button>
                  <button
                    className="btn btn-default"
                    value="Cancel"
                    onClick={this.fetchOld}
                    onTouchStart={this.fetchOld}
                    >
                    Cancel
                    {this.helpEnabled
                      ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                          data-container="body"
                          data-toggle="popover"
                          data-placement="right"
                          data-content="Click “Cancel” to revert back."
                          onMouseOver={(e) => jQuery(e.target).popover('show')}
                          onMouseOut={(e) => jQuery(e.target).popover('hide')}
                          />
                      : null}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {errorUI}
        </div>
      </div>
      <hr />
    </div>;
  }
}

export default Profile;

function TextFormGroup(props) {
  return <div className="form-group">
    <label className=" control-label">{props.label}</label>
    <div className="">
      <input className="form-control" type="text" value={props.value} onChange={props.onChange} />
    </div>
  </div>;
}

function PwdFormGroup(props) {
  return <div className="form-group">
    <label className=" control-label">{props.label}</label>
    <div className="">
      <input className="form-control" type="password" value={props.value} onChange={props.onChange} />
    </div>
  </div>;
}

