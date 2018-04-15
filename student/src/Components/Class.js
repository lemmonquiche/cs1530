import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

import Group from './Group';

class Class extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);

    this.state = {
      me: 0,
      loaded: false,
      studentsInClass: [],
      studentsInGroups: [],
      error: ''
    };

    this.load = this.load.bind(this);
  }

  load() {
    var that = this;
    that.setState({ loaded: false });
    $.getJSON('/whoami')
      .then(function (data) {
        that.setState({ me: data.me });
        $.ajax({
          method: 'post',
          url: '/api/student/joined/view',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            course_id: that.props.match.params.id
          }),
          error: function (jQReq, status, error) {
            that.setState({ loaded: true, error });
          },
          success: function (data, status, req) {
            console.log(data);
            if (data.error) {
              that.setState({ loaded: true, error: data.error });
              return;
            }

            that.setState({
              loaded: true,
              studentsInClass: data.students_in_course,
              studentsInGroups: data.students_in_groups
            });
          }
        });
      })
      .catch(function () {
        that.setState({ loaded: true, error: 'Failed to determine user' });
      });
  }

  componentDidMount() {
    this.load();
  }

  render() {
    if (!this.state.loaded)
      return <Container id={this.props.match.params.id}>
        <div className="loading-spinner"></div>
      </Container>;

    if (this.state.error)
      return <Container id={this.props.match.params.id}>
        <p className="card-text">{this.state.error}</p>
      </Container>;

    var groups = [];
    function getGroup(id) {
      for (var idx = 0; idx < groups.length; idx++)
        if (groups[idx].id === id)
          return idx;
      return -1;
    }

    this.state.studentsInGroups.forEach(function (student) {
      var groupIdx = getGroup(student.group);
      if (groupIdx !== -1) {
        groups[groupIdx].students.push(student);
      } else {
        groups.push({ id: student.group, students: [student] });
      }
    });

    return <Container id={this.props.match.params.id}>
      <div className="row">
        <div className="col-md-6">
          <p className="card-text">Groups in your class (you are highlighted in <span style={{ color: 'goldenrod' }}>gold</span>).</p>

          <div className="card-columns" style={{ columnCount: 1 }}>
            {groups.map(function (group) {
              return <Group key={group.id} group={group} me={this.state.me}/>;
            }.bind(this))}
          </div>
        </div>
        <div className="col-md-6">
          <p className="card-text">Students in your class (you are highlighted in <span style={{ color: 'goldenrod' }}>gold</span>).</p>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Contact</th>
              </tr>
            </thead>
            <tbody>
              {this.state.studentsInClass.map(function (student) {
                var style = {};
                if (this.state.me === student.id)
                  style['background'] = 'goldenrod';

                return <tr key={student.id} style={style} >
                  <th scope="row">{student.id}</th>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>;
              }.bind(this))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>;
  }
}

export default Class;

class Container extends Component {
  render() {
    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><Link to="/classes">Back</Link> to list of classes enrolled.</p>
          <p>Class {this.props.id}.</p>
          {this.props.children}
        </div>
      </div>
    </div>;
  }
}
