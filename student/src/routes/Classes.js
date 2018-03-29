import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';

import DataGrid from '../Components/DataGrid';
import AddByCode from '../Components/AddByCode';
// import EditableDataGrid from '../Components/EditableDataGrid';

import Search from '../Components/classes/Search';

class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,

    }

    setTimeout(function() { this.setState({ loaded: true }); }.bind(this), 10);
  }

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    var index = 1;

    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">Classes</h5>
        <h6 className="card-subtitle mb-2 text-muted">Find your classes by search or by code.</h6>
        
        <div style={{ margin: '30px 15px' }}>
          <Tabs>
            <TabList>
              <Tab>Added Classes</Tab>
              <Tab>Search Classes</Tab>
              <Tab>Add By Code</Tab>
              <Tab>Pending</Tab>
            </TabList>
            <TabPanel>
              <h6 className="card-subtitle mb-2 text-muted">Classes you are in.</h6>
              <DataGrid />
              {/*<table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>View Group Status</th>
                    <th>Cancel</th>
                    <th>Course</th>
                    <th>Professor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><Link to={'/joined/' + index}>[==]</Link></td>
                    <td>-</td>
                    <td>CS 1530</td>
                    <td>SK</td>
                  </tr>
                </tbody>
              </table>*/}
            </TabPanel>
            <TabPanel>
              <Search />
              {/*<table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Add</th>
                    <th>Withdraw</th>
                    <th>Course</th>
                    <th>Instructor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>+</td>
                    <td>-</td>
                    <td>CS 1530</td>
                    <td>SK</td>
                  </tr>
                </tbody>
              </table>*/}
            </TabPanel>
              
            <TabPanel>
              <h6 className="card-subtitle mb-2 text-muted">Join a class by entering its code.</h6>

              <AddByCode />
            </TabPanel>
            <TabPanel>
              <h6 className="card-subtitle mb-2 text-muted">See classes pending instructor's approval.</h6>

              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th>Cancel</th>
                    <th>Name</th>
                    <th>Professor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>-</td>
                    <td>CS 1530</td>
                    <td>SK</td>
                  </tr>
                </tbody>
              </table>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>;
  }
}

export default Classes;
