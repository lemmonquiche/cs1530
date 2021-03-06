import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

import Group from './Group';

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
      students: [],
      pending: []
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.loadInitial = this.loadInitial.bind(this);
    this.callRandomize = this.callRandomize.bind(this);
  }

  loadInitial(loadId) {
    this.setState({ loaded: false });
    jQuery.ajax({
      method: 'post',
      url: '/api/instructor/course/pending/get',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ course_id: loadId }),
      error: function(jQReq, status, error) {
        alert("error");
        console.log(error);
        // this.setState({ error });
      }/*.bind(this)*/,
      success: function(data, status, jQReq) {
        this.setState({ pending: data });
      }.bind(this)
    });
    jQuery.ajax({
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
        console.log('Successfully fetched Single Class', this.props.match.params.id, ':', data);

        if (!data.err) {
          console.log('Successfully fetched Single Class w/Success response');

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

    (function animationFrameCallBack() {
      if (jQuery('[data-toggle="popover"]').length === 0) {
        window.requestAnimationFrame(animationFrameCallBack);
      } else {
        jQuery('.popover.fade.bs-popover-right.show').remove();
        jQuery('[data-toggle="popover"]').popover('hide');
        jQuery('[data-toggle="popover"]').popover({
          container: 'body',
          trigger: 'manual'
        });

        jQuery('[data-toggle="popover"]').popover('show');
        setTimeout(function() {
          jQuery('[data-toggle="popover"]').popover('hide');
        }, 1300);
      }
    })();
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
    jQuery.ajax({
      url: '/api/instructor/course/generategroup',
      method: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ course_id: that.props.match.params.id }),
      success: function() {
        console.log("callRandomize success");
        that.loadInitial(that.props.match.params.id);
      }
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    var pending = null;
    if (this.state.pending && this.state.pending.length) {
      pending = <div>
        <h2>
          Class {this.props.match.params.id} Pending
          {this.helpEnabled
            ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 10px' }}
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content="To accept or reject a pending student, either click accept or deny."
                onMouseOver={(e) => jQuery(e.target).popover('show')}
                onMouseOut={(e) => jQuery(e.target).popover('hide')}
                />
            : null}
        </h2>

        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th width="5%" scope="col">Id</th>
              <th width="15%" scope="col">Approve</th>
              <th width="15%" scope="col">Deny</th>
              <th width="65%" scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            {this.state.pending.map(function (request) {
              var apiCall = function (outcome) {
                jQuery.ajax({
                  url: '/api/instructor/course/pending/outcome',
                  method: 'post',
                  contentType: 'application/json',
                  dataType: 'json',
                  data: JSON.stringify({
                    student_id: request.student_id,
                    course_id: this.props.match.params.id,
                    outcome: (outcome ? true : false)
                  }),
                  error: function() { alert("could not submit"); },
                  success: function(data, status, req) {
                    this.loadInitial(this.props.match.params.id);
                  }.bind(this)
                });
              };

              var accept = apiCall.bind(this, true);
              var deny = apiCall.bind(this, false);

              return <tr key={request.student_id}>
                <th scope="row">{request.student_id}</th>
                <td>
                  <button
                    onClick={accept}
                    onTouchStart={accept}
                    type="button"
                    className="btn btn-success">Accept</button>
                </td>
                <td>
                  <button
                    onClick={deny}
                    onTouchStart={deny}
                    type="button"
                    className="btn btn-danger">Deny</button>
                </td>
                <td>{request.fname + ' ' + request.lname}</td>
              </tr>
            }.bind(this))}
          </tbody>
        </table>
      </div>;
    }

    return <div>
      <div className="card">
        <div className="card-body">
          <p className="card-text"><Link to="/classes">Hide</Link>.</p>
          <h1>Class {this.props.match.params.id}.</h1>

          {pending}

          <h2>Class {this.props.match.params.id} Groups</h2>

          <button
            style={{ margin: 30 }}
            onClick={this.callRandomize}
            onTouchStart={this.callRandomize}
            type="button"
            className="btn btn-success">
            Randomize
            {this.helpEnabled
              ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                  data-container="body"
                  data-toggle="popover"
                  data-placement="right"
                  data-content="To create groups, click on randomize. Groups will appear under this section. If groups are not what was wanted, hit randomize again to see a new grouping."
                  onMouseOver={(e) => jQuery(e.target).popover('show')}
                  onMouseOut={(e) => jQuery(e.target).popover('hide')}
                  />
              : null}
          </button>

          <div className="card-columns">
            {this.state.groups.map(function (group) {
              return <Group key={group.id} group={group}/>;
            })}
          </div>

          <h2>Class {this.props.match.params.id} Roster</h2>
          
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.students.map(function (student) {
                return <tr key={student.id}>
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
