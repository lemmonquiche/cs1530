import React, { Component } from 'react';

import data from '../../data';
import { forceUpdate } from '../../App';

function makeGroups() {
  while (data.groups.length > 0) {
    data.groups.splice(0, 1);
  }

  data.students.forEach(function (student) {
    student.grouped = true;
  });

  data.groups.push({ id: 1, name: "group1", students: [1, 2, 3, 4] });
  data.groups.push({ id: 2, name: "group2", students: [5, 6, 7, 8] });
  forceUpdate();
}

class Roster extends Component {
  constructor(props) {
    super(props);
    this.render = this.render.bind(this);
  }

  render() {
    var students = this.props.students.filter(function (student) {
      return !student.grouped;
    });

    var more = students.length < this.props.students.length;

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3>Ungrouped Students</h3>
        </div>
        <div className="panel-body">
          <p style={{float: 'right'}}>
            <button onClick={makeGroups} type="button" className="btn btn-warning btn-sm">
              Random
              { ' ' }
              <span className="glyphicon glyphicon-random"></span>
            </button>
          </p>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th></th>
              </tr>
              <tr>
                <th><input type="text" className="form-control" /></th>
                <th><input type="text" className="form-control" /></th>
              </tr>
            </thead>
            <tbody>
              {students.map(function(student){
                var dragStart = function (event) {
                  event.dataTransfer.setData('text/plain', student.id);
                };

                return <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>
                    <button draggable="true" onDragStart={dragStart} type="button" className="btn btn-default btn-sm">
                      <span className="glyphicon glyphicon-move"></span>
                    </button>
                  </td>
                </tr>;
              })}
            </tbody>
          </table>
          {more ? <span className="glyphicon glyphicon-option-horizontal"></span> : null}
        </div>
      </div>
    );
  }
}

export default Roster;
