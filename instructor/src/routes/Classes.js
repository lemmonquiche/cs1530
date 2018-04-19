import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

import Class from '../Components/Class';
import InstructorAddCourse from '../Components/InstructorAddCourse';

/**
 * All classes for an instructor
 */
class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '',
      loaded: false,
      classes: [],
      numClasses: 0,
      showNew: false
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.loadClasses = this.loadClasses.bind(this);
  }

  componentDidMount() {
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
    this.loadClasses();
  }

  loadClasses () {
    jQuery.ajax({
      method: 'get',
      url: '/api/instructor/course',
    })
      .then(function (data) {
        this.setState({ /*loaded: true,*/ courses: data.courses });
      }.bind(this))
      .fail(function(r, test, e) {
        /*this.setState({ error: e });*/
        throw e;
      }/*.bind(this)*/)
      .always(function() {
        console.log("AJAX always on all classes (noargs)");
        this.setState({ loaded: true });
      }.bind(this));
  }

  componentDidCatch() {
    /*console.log("this is running")*/
    this.setState({ error: true });
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    if (this.state.error) {
      return <ClassesCard
        title="Courses"
        caption="Manage or Add courses for students to join."
      >
        <p>{this.state.error}</p>
      </ClassesCard>
    }

    function viewLink(row, cell) {
      return <Link to={'/classes/' + cell.course_id}>
        <button type="button" className="btn btn-primary btn-sm">
          {cell.course_id}
        </button>
      </Link>;
    };

    return <ClassesCard
      title="Courses"
      caption="Manage or add new courses for students to join here."
    >
      <button
        onClick={() => { this.setState({ showNew: !this.state.showNew }); }}
        onTouchStart={() => { this.setState({ showNew: !this.state.showNew }); }}
        style={{ margin: "10px 0" }}
        type="button"
        className="btn btn-success">
        {(this.state.showNew ? 'Hide' : 'Show') + ' New Course Form'}
        {this.helpEnabled
          ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
              data-container="body"
              data-toggle="popover"
              data-placement="right"
              data-content="To create a new course, go to “Show New Course Form”."
              onMouseOver={(e) => jQuery(e.target).popover('show')}
              onMouseOut={(e) => jQuery(e.target).popover('hide')}
              />
          : null}
      </button>
      {this.state.showNew ? <InstructorAddCourse refresh={this.loadClasses}/> : null}
      <BootstrapTable
        data={this.state.courses}
        fetchInfo={{dataTotalSize: this.state.courses.length}}
        version='4'
        pagination
        striped
        hover
        condensed
      >
        <TableHeaderColumn dataField="course_id" isKey dataFormat={viewLink} width='10%' dataAlign="center">
          Id
          {this.helpEnabled
            ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content="To manage a course, click on the course ID."
                onMouseOver={(e) => jQuery(e.target).popover('show')}
                onMouseOut={(e) => jQuery(e.target).popover('hide')}
                />
            : null}
        </TableHeaderColumn>
        <TableHeaderColumn dataField="course_name"                           width='45%' dataAlign="center">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="passcode"                              width='45%' dataAlign="center">Code</TableHeaderColumn>

      </BootstrapTable>
      <Route path="/classes/:id" component={Class}/>
    </ClassesCard>;
  }
}

export default Classes;


class ClassesCard extends Component {
  render() {
    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">{this.props.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{this.props.caption}</h6>
        {this.props.children}
      </div>
    </div>;
  }
}
