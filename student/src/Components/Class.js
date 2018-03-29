import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Class extends Component {
  render() {
    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><Link to="/classes">Back</Link> to list of classes enrolled.</p>
          <p>Class {this.props.match.params.id}.</p>
        </div>
      </div>
    </div>;
  }
}

export default Class;
