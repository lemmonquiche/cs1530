import React, { Component } from 'react';

class AddByCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      error: false
    };

    this.formSubmit= this.formSubmit.bind(this);
  }

  formSubmit(e) {
    console.log(this.state.value);
    e.preventDefault();
  }

  render() {
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
