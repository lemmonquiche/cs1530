import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import $ from 'jquery';
import Group from './Group';
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
      error: '',
      // name: '',
      students: []
    };

    this.loadInitial = this.loadInitial.bind(this);
    this.callRandomize = this.callRandomize.bind(this);
  }

  loadInitial(loadId) {
    this.setState({ loaded: false });
    $.ajax({
      method: 'post',
      url: '/api/instructor/course/groups',
      contentType: 'application/json',
      data: JSON.stringify({
        course_id: loadId
      }),
      dataType: 'json',
      error: function (jQReq, status, error) {

        // console.log('error', arguments);
        this.setState({ error });

      }.bind(this),
      success: function (data, status, jQReq) {
        console.log('Successfully fetched Single Class', this.props.match.params.id, ':', data, arguments);

        if (!data.err) {
          console.log('Successfully fetched Single Class w/Success response');

          var students = (data.group_list || []).reduce(function (list, group) {
            return list.concat(group.students);
          }, []);

          this.setState({
            loaded: true,
            error: '',
            // name:     data.name,
            groups:   data.group_list,
            students: data.students,
          });

          return;
        }


        console.log(data);
        
        this.setState({ error: data.err })
      }.bind(this)
    });
  }

  componentDidMount() {
    console.log("src/Components/Class.js#componentDidMount");
    this.loadInitial(this.props.match.params.id);
  }

  componentWillUpdate() {
    console.log("src/Components/Class.js#componentWillUpdate");
    // this.loadInitial();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if its not loaded, it should update
    if (!this.state.loaded) {
      return true;
    }

    // if the id changes, load new and update
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.loadInitial(nextProps.match.params.id);
      return true;
    }

    return false;
  }

  callRandomize() {
    var that = this;
    $.ajax({
      url: '/api/instructor/course/generategroup',
      method: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ course_id: that.props.match.params.id }),
      success: function() { alert("success"); }
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

          <div className="card-columns">
            {this.state.groups.map(function (group) {
              return <Group key={group.id} group={group}/>;
            })}
          </div>

          <p>Class {this.props.match.params.id} Roster</p>
          <button
            onClick={this.callRandomize}
            onTouchStart={this.callRandomize}
            type="button"
            class="btn btn-success">Randomize</button>
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map(function (student) {
                return <tr>
                  <th scope="row">{student.id}</th>
                  <td>{student.fname + ' ' + student.lname}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
  }
}

export default Class;
