import React, { Component } from 'react';

class ClassesSearchForm extends Component {
  render() {
    return <form className="form-horizontal" onSubmit={this.props.onSubmit}>
      <div className="form-group">
      </div>
      <div className="form-group">
        <label className="col-lg-2 control-label">Course Id:</label>
        <div className="col-lg-2">
          {/*<input className="form-control" type="text" value={this.state.id} onChange={(e) => this.setState({id: e.target.value})} />*/}
          <input className="form-control" type="text" value={this.props.id} onChange={this.props.idChange} />
        </div>
        <label className="col-lg-3 control-label">Course Name:</label>
        <div className="col-lg-5">
          {/*<input className="form-control" type="text" value={this.props.courseName} onChange={(e) => this.setState({courseName: e.target.value})} />*/}
          <input className="form-control" type="text" value={this.props.courseName} onChange={this.props.courseChange} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-lg-3 control-label">Instructor Name:</label>
        <div className="col-lg-5">
          {/*<input className="form-control" type="text" value={this.props.instructorName} onChange={(e) => this.setState({instructorName: e.target.value})} />*/}
          <input className="form-control" type="text" value={this.props.instructorName} onChange={this.props.instructorChange} />
        </div>
      </div>
      <div className="form-group">
        <label className="col-md-3 control-label"></label>
        <div className="col-md-8">
          <input type="submit" className="btn btn-primary" value="Search" />
          <span></span>
          <input
            onClick={this.props.reset}
            onTouchStart={this.props.reset}
            type="reset"
            className="btn btn-default"
            value="Clear" />
        </div>
      </div>
    </form>;
  }
}

export default ClassesSearchForm;
