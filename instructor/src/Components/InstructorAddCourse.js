import React, { Component } from 'react';
import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

/**
 * Appears in the render method of Classes.js (in routes)
 */
class InstructorAddCourse extends Component {
  constructor(props) {
    super(props);

    /**
     * success shows "success" message, error shows error message
     * both should not be truthy
     * success sets success, error sets error, again button clears
     */
    this.state = {
      name: '',
      success: false,
      error: '',
      loaded: true
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.formSubmit = this.formSubmit.bind(this);
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
  }

  formSubmit(e) {
    e.preventDefault();
    this.setState({ loaded: false });

    jQuery.ajax({
      method: 'post',
      url: '/api/instructor/addCourse',
      contentType: 'application/json',
      data: JSON.stringify({
        name: this.state.name,
      }),
      dataType: 'json',
      error: function (jQReq, status, error) {

        this.setState({ error });

      }.bind(this),
      success: function (data, status, jQReq) {
        if (!data.error) {

          this.setState({ loaded: true, success: true });
          this.props.refresh();

        } else {

          this.setState({ error: data.error })

        }
      }.bind(this)
    });
  }

  render() {
    var addAnother = function(e) {
      e.preventDefault();
      this.setState({ name: '', error: '', success: false });
    }.bind(this);

    var body = <div className="card-body">
      <p className="card-text">Sucessfully added.</p>
      <button onClick={addAnother} onTouchStart={addAnother} className="btn btn-primary">Add another</button>
    </div>;

    if (!this.state.success) {
      body = <div className="card-body">
        <h5 className="card-title">
          Add a new class.
          {this.helpEnabled
            ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content="To add a new class, enter name of the course and click submit. Share the class code with students to allow them easy registration of the course."
                onMouseOver={(e) => jQuery(e.target).popover('show')}
                onMouseOut={(e) => jQuery(e.target).popover('hide')}
                />
            : null}
        </h5>
        {/*<p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>*/}
        <form className="form-horizontal" onSubmit={this.formSubmit}>
          <div className="form-group">
            <label className="col-lg-3 control-label">Name:</label>
            <div className="col-lg-8">
              <input className="form-control" type="text" value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="col-md-3 control-label"></label>
            <div className="col-md-8">
              <input type="submit" className="btn btn-primary" value="Submit" />
            </div>
          </div>
        </form>
        {this.state.error
          ? <p className="card-text"><small className="text-muted">{'Error: ' + this.state.error}</small></p> 
          : null}
      </div>;
    }

    return <div className="card bg-light mb-3 w-75">
      <div className="card-header">{'New Class' + (this.state.name ? ': ' + this.state.name : '')}</div>
      {body}
    </div>;
  }
}

export default InstructorAddCourse;
