import React, { Component } from 'react';
import $ from 'jquery';

class AddByCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      error: false,
      success: false
    };

    this.formSubmit = this.formSubmit.bind(this);
    this.reset = this.reset.bind(this);
  }

  reset() {
    this.setState({ value: '', error: false, success: false });
  }

  formSubmit(e) {
    console.log(this.state.value);
    e.preventDefault();

    $.ajax({
      url: '/api/student/classes/addByCode',
      method: 'post',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({ code: this.state.value }),
      error: function (jQReq, status, error) {
        this.setState({ error: true });
      }.bind(this),
      success: function (data, status, jQReq) {
        if (data.error) {
          this.setState({ error: true });
        } else {
          this.setState({ success: true });
        }
      }.bind(this)
    });
  }

  render() {
    if (this.state.success) {
      return <div>
        <p className='card-text'>Successfully added Course by code.</p>
        <button
          type="button"
          class="btn
          btn-primary"
          onClick={this.reset}
          onTouchStart={this.reset}>
          Add another
        </button>
      </div>;
    }

    var error = <p className='card-text'>There was an error.</p>
    return <div>
      <form className="form-horizontal" onSubmit={this.formSubmit}>
        <div className="form-group">
          <label htmlFor="add-class-code">Class Code</label>
          <input
            value={this.state.value}
            onChange={(e) => this.setState({ value: e.target.value })}
            type="password"
            id="add-class-code"
            className="form-control"
            aria-describedby="classCodeHelpBlock"
            />
          <small id="classCodeHelpBlock" className="form-text text-muted">
            You may join a class by entering a class code.
          </small>
        </div>
      </form>
      {this.state.error ? error : null}
    </div>;
  }
}

export default AddByCode;
