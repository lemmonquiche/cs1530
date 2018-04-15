import React, { Component } from 'react';

class Group extends Component {
  // constructor() {
  //   super(props);

  //   this.state;
  // }
  render() {
    /*return <div style={{ border: '2px solid black' }}>
      <p>Group Number: {this.props.group.id}</p>
      <pre>{JSON.stringify(this.props.group, null, 2)}</pre>
    </div>;*/

    return <div className="card bg-light mb-3 h-100">
      <div className="card-header">Group Number: {this.props.group.id}</div>
      <div className="card-body">
        {/*<h5 className="card-title">Light card title</h5>*/}
        {/*<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>*/}
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
                var style = {};
                if (this.props.me === student.id)
                  style['background'] = 'goldenrod';

                return <tr key={student.id} style={style} >
                  <th scope="row">{student.id}</th>
                  <td>{student.name}</td>
                  <td>{student.id}</td>
                </tr>;
              }.bind(this))}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  }
}

export default Group;
