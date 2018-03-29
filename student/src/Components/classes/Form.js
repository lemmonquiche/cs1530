import React, { Component } from 'react';

class ClassesSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseName: '',
      instructorName: '',
      id: ''
    };

    this.formSubmit = this.formSubmit.bind(this);
  }

  formSubmit(e) {
    e.preventDefault();
    console.log(this.state);
  }

  render() {
    // return <form className="form-inline">
    //   <div className="form-group" style={{margin:10}}>
    //     <label htmlFor="inputPassword90">Password</label>
    //     <input type="password" id="inputPassword90" className="form-control mx-sm-2" aria-describedby="passwordHelpInline" />
    //     {/*<small id="passwordHelpInline" className="text-muted">Must be 8-20 characters long.</small>*/}
    //   </div>
    //   <div className="form-group" style={{margin:10}}>
    //     <label htmlFor="inputPassword7">Password</label>
    //     <input type="password" id="inputPassword7" className="form-control mx-sm-2" aria-describedby="passwordHelpInline" />
    //     {/*<small id="passwordHelpInline" className="text-muted">Must be 8-20 characters long.</small>*/}
    //   </div>
    //   <div className="form-group"  style={{margin:10}}>
    //     <label htmlFor="inputPassword6">Password</label>
    //     <input type="password" id="inputPassword6" className="form-control mx-sm-2" aria-describedby="passwordHelpInline" />
    //     {/*<small id="passwordHelpInline" className="text-muted">Must be 8-20 characters long.</small>*/}
    //   </div>
    // </form>;
    return <form className="form-horizontal" onSubmit={this.formSubmit}>
      <div className="form-group">
      </div>
      <div className="form-group">
        <label className="col-lg-2 control-label">Course Id:</label>
        <div className="col-lg-2">
          <input className="form-control" type="text" value={this.state.id} onChange={(e) => this.setState({id: e.target.value})} />
        </div>
        <label className="col-lg-3 control-label">Course Name:</label>
        <div className="col-lg-5">
          <input className="form-control" type="text" value={this.state.courseName} onChange={(e) => this.setState({courseName: e.target.value})} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-lg-3 control-label">Instructor Name:</label>
        <div className="col-lg-5">
          <input className="form-control" type="text" value={this.state.instructorName} onChange={(e) => this.setState({instructorName: e.target.value})} />
        </div>
      </div>
      {/*<div className="form-group">
        <label className="col-lg-3 control-label">Time Zone:</label>
        <div className="col-lg-8">
          <div className="ui-select">
            <select id="user_time_zone" className="form-control">
              <option value="Hawaii">(GMT-10:00) Hawaii</option>
              <option value="Alaska">(GMT-09:00) Alaska</option>
              <option value="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
              <option value="Arizona">(GMT-07:00) Arizona</option>
              <option value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
              <option value="Central Time (US &amp; Canada)">(GMT-06:00) Central Time (US &amp; Canada)</option>
              <option value="Eastern Time (US &amp; Canada)" defaultValue="selected">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
              <option value="Indiana (East)">(GMT-05:00) Indiana (East)</option>
            </select>
          </div>
        </div>
      </div>*/}
      <div className="form-group">
        <label className="col-md-3 control-label"></label>
        <div className="col-md-8">
          <input type="submit" className="btn btn-primary" value="Search" />
          <span></span>
          <input type="reset" className="btn btn-default" value="Clear" />
        </div>
      </div>
    </form>;
  }
}

export default ClassesSearchForm;
