import React, { Component } from 'react';
import $ from 'jquery';

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

    this.formSubmit = this.formSubmit.bind(this);
    this.fetchOld = this.fetchOld.bind(this);

    this.fetchOld();
  }

  fetchOld() {
    $.get('/api/profile', function (data) {
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
    var user = Object.assign({}, this.props.state);
    delete user['loaded'];
    delete user['error'];
    $.post('/api/profile', JSON.stringify({ token: this.props.token, user }), function (res) {
      this.setState({ loaded: true });
      if (res.error) {
        this.setState({ error: res.error });
      }
    }.bind(this));

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
        <h1>Edit Profile</h1>
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
                  <input type="submit" className="btn btn-primary" value="Save Changes" />
                  <button
                    className="btn btn-default"
                    value="Cancel"
                    onClick={this.fetchOld}
                    onTouchStart={this.fetchOld}
                    >
                    Cancel
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

