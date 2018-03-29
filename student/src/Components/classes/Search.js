import React, { Component } from 'react';

import AvailableClassesGrid from '../AvailableClassesGrid';
import Form from './Form';

class Search extends Component {
  render() {
    return <div>
      <h6 className="card-subtitle mb-2 text-muted">Classes you can request access to.</h6>
      <Form />
      <AvailableClassesGrid />
    </div>;
  }
}

export default Search;
