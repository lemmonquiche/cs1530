import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
// import Groups from './Groups';

/**
 * Single class interface
 */
class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      groups: [],
      error: ''
    };
  }

  componentDidMount() {
    console.log("class has mounted")
    $.ajax({
      method: 'post',
      url: '/api/instructor/course/groups',
      contentType: 'application/json',
      data: JSON.stringify({
        class_id: this.props.match.params.id
      }),
      dataType: 'json',
      error: function (jQReq, status, error) {

        console.log('error', arguments);
        this.setState({ error });

      }.bind(this),
      success: function (data, status, jQReq) {
        console.log('Successfully fetched Single Class', this.props.match.params.id, ':', data, arguments);

        if (!data.err) {
          console.log('Successfully fetched Single Class w/Success response');
          this.setState({ loaded: true, error: '' });
        }
        
        this.setState({ error: data.err })
      }.bind(this)
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><Link to="/classes">Hide</Link>.</p>
          <p>Class {this.props.match.params.id}.</p>
          <p>{JSON.stringify(this.state.groups)}</p>
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
