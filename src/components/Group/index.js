import React, { Component } from 'react';

import data from '../../data';
import { forceUpdate } from '../../App';

function makeStudentRemover(studentId, groupId) {
  return function (event) {
    // delete from groups_students where group = ? and students = ?;
    data.groups.forEach(function (group) {
      if (group.id === groupId) {
        group.students.splice(group.students.indexOf(studentId), 1);
      }
    });

    // delete from students where id = ?;
    data.students.forEach(function (student) {
      if (student.id === studentId) {
        student.grouped = false;
      }
    });

    forceUpdate();
  }
}

function addStudentToGroup(studentId, groupId) {
  // update students set grouped = true where id = ?;
  data.students.forEach(function (student) {
    if (student.id === studentId) {
      student.grouped = true;
    }
  });

  // insert into groups_students (sid, gid) values (?, ?);
  data.groups.forEach(function (group) {
    if (group.id === groupId) {
      group.students.push(studentId);
    }
  });
}

class Group extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragOver(event) {
    event.preventDefault();
  }
  onDrop(event) {
    var studentId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    addStudentToGroup(studentId, this.props.group.id);
    forceUpdate();
    event.preventDefault();
  }

  render() {
    var group = this.props.group;
    return (
      <div className="panel panel-default" onDragOver={this.onDragOver} onDrop={this.onDrop}>
        <div className="panel-heading">
          <h3>{this.props.group.name}</h3>
        </div>
        <div className="panel-body">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {// select * from students join ...
              data.students.filter(function (student) {
                return group.students.indexOf(student.id) > -1;
              }).map(function (student) {
                var dragStart = function (event) {
                  event.dataTransfer.setData('text/plain', student.id);
                };

                var onClick = makeStudentRemover(student.id, group.id);
                student = student || {};

                return <tr key={student.id}>
                  <td>
                    <button onClick={onClick} type="button" className="btn btn-danger btn-sm">
                      <span className="glyphicon glyphicon-remove"></span>
                    </button>
                  </td>
                  <td>{student.name}</td>
                  <td>
                    <button draggable="true" onDragStart={dragStart} type="button" className="btn btn-success btn-sm">
                      <span className="glyphicon glyphicon-move"></span>
                    </button>
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export class Groups extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    var groups = this.props.groups;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3>Grouped Students</h3>
        </div>
        <div className="panel-body">
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Group;
