import React, { Component } from 'react';
import $ from 'jquery';

import AvailableClassesGrid from '../AvailableClassesGrid';
import Form from './Form';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courseName: '',
      instructorName: '',
      id: '',
      rows: [],
      error: ''
    };

    this.updateAvailableQuery = this.updateAvailableQuery.bind(this);
    this.updateParams = this.updateParams.bind(this);
    this.updatePages = this.updatePages.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({ courseName: '', instructorName: '', id: '' });
  }

  updateParams(e) {
    e.preventDefault();
    this.updateAvailableQuery();
  }

  updateAvailableQuery() {
    console.log('tracing');
    $.ajax({
      url: '/api/student/classes/search',
      method: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        course_id:       this.state.id,
        course_name:     this.state.courseName,
        instructor_name: this.state.instructorName
      }),
      error: function (jQReq, status, error) {
        this.setState({ error: error });
      }.bind(this),
      success: function (data, status, req) {
        this.setState({ rows: data, error: '' });
      }.bind(this)
    });
  }

  /**
   * This method updates pagination information, and requeries with update
   */
  updatePages(page, sizePerPage) {
    this.updateAvailableQuery();
  }

  render() {
    return <div>
      <h6 className="card-subtitle mb-2 text-muted">Classes you can request access to.</h6>
      <Form 
        id={this.state.id}
        course={this.state.courseName}
        instructor={this.state.instructorName}
        onSubmit={this.updateParams}
        reset={this.reset}
        idChange={(e) => this.setState({ id: e.target.value })}
        courseChange={(e) => this.setState({ course: e.target.value })}
        instructorChange={(e) => this.setState({ instructor: e.target.value })}
        />
      <AvailableClassesGrid rows={this.state.rows} updatePages={this.updatePages}/>
    </div>;
  }
}

export default Search;
