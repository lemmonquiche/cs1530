import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// import Groups from './Groups';

class Class extends Component {
  render() {
    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><Link to="/classes">Back</Link> to list of classes enrolled.</p>
          <p>Class {this.props.match.params.id}.</p>
        </div>
        {/*<div className="container">
          <div className="col-md-9">
            <Groups>
              {data.groups.map(function (group) {
                return <Group group={group} key={group.id} />;
              })}
            </Groups>
          </div>
          <div className="col-md-3">
            <Roster students={data.students} />
          </div>
        </div>*/}
      </div>
    </div>;
  }
}

export default Class;
