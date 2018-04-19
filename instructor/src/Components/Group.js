import React, { Component } from 'react';

class Group extends Component {
  render() {
    return <div className="card bg-light mb-3 h-100">
      <div className="card-header">Group Number: {this.props.group.id}</div>
      <div className="card-body">
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Drag/Drop</th>
              </tr>
            </thead>
            <tbody>
              {this.props.group.students.map(function (student) {
                return <tr key={student.id}>
                  <th scope="row">{student.id}</th>
                  <td>{student.name}</td>
                  <td>{student.id}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  }
}

export default Group;
