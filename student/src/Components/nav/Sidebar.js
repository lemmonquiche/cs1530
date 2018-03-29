import React, { Component } from 'react';
import { Link/*, Route*/ } from 'react-router-dom';

class Sidebar extends Component {
  render() {
    var a = (s) => (s === window.location.pathname ? ' active' : '');

    return <div style={{ margin: 10 }}>
      <ul className="list-group list-group-flush">
        <Link to="/profile" ><li className={"list-group-item" + a('/profile')} >Profile</li></Link>
        <Link to="/classes" ><li className={"list-group-item" + a('/classes')} >Classes</li></Link>
        <Link to="/schedule"><li className={"list-group-item" + a('/schedule')}>Schedule</li></Link>
        <Link to="/help"    ><li className={"list-group-item" + a('/help')}    >Help</li></Link>
      </ul>
    </div>;
  }
}

export default Sidebar;
