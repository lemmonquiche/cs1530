import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import { Link } from 'react-router-dom';
import 'react-tabs/style/react-tabs.css';
import jQuery from 'jquery';
import FontAwesome from 'react-fontawesome';

import DataGrid from '../Components/DataGrid';
import Pending from '../Components/Pending';
import AddByCode from '../Components/AddByCode';
// import EditableDataGrid from '../Components/EditableDataGrid';

import Search from '../Components/classes/Search';

class Classes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    setTimeout(function() { this.setState({ loaded: true }); }.bind(this), 10);
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

  render() {
    if (!this.state.loaded) {
      return <div className="loading-spinner"></div>
    }

    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          Classes
          {this.helpEnabled
            ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content="Here you can check your registered classes and search for new ones. Already have a class code? Go to “Add by Code” to register for the course now. Check your pending class registration under “Pending”."
                onMouseOver={(e) => jQuery(e.target).popover('show')}
                onMouseOut={(e) => jQuery(e.target).popover('hide')}
                />
            : null}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">Find your classes by search or by code.</h6>
        
        <div style={{ margin: '30px 15px' }}>
          <Tabs>
            <TabList>
              <Tab>
                Added Classes
                {this.helpEnabled
                  ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                      data-container="body"
                      data-toggle="popover"
                      data-placement="right"
                      data-content="Here is the classes you are registered for. Click the button under view for a class to learn about your group members!"
                      onMouseOver={(e) => jQuery(e.target).popover('show')}
                      onMouseOut={(e) => jQuery(e.target).popover('hide')}
                      />
                  : null}
              </Tab>
              <Tab>
                Search Classes
                {this.helpEnabled
                  ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                      data-container="body"
                      data-toggle="popover"
                      data-placement="right"
                      data-content="Search for classes here! Add in course id, course name, or instructor’s full name to find matching classes. Hit the + to register for the course. You’ll find the course under “Pending” until the instructor approves your registration request."
                      onMouseOver={(e) => jQuery(e.target).popover('show')}
                      onMouseOut={(e) => jQuery(e.target).popover('hide')}
                      />
                  : null}
              </Tab>
              <Tab>
                Add By Code
                {this.helpEnabled
                  ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                      data-container="body"
                      data-toggle="popover"
                      data-placement="right"
                      data-content="If the instructor has given you a join code, immediately register for the course here by entering the class code."
                      onMouseOver={(e) => jQuery(e.target).popover('show')}
                      onMouseOut={(e) => jQuery(e.target).popover('hide')}
                      />
                  : null}
              </Tab>
              <Tab>
                Pending
                {this.helpEnabled
                  ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                      data-container="body"
                      data-toggle="popover"
                      data-placement="right"
                      data-content="View your pending courses here. Click the x to remove your registration request."
                      onMouseOver={(e) => jQuery(e.target).popover('show')}
                      onMouseOut={(e) => jQuery(e.target).popover('hide')}
                      />
                  : null}
              </Tab>
            </TabList>
            <TabPanel>

              <h6 className="card-subtitle mb-2 text-muted">Classes you are in.</h6>
              <DataGrid />

            </TabPanel>
            <TabPanel>

              {/* UI for Searching for Classes */}
              <Search />

            </TabPanel>
              
            <TabPanel>

              <h6 className="card-subtitle mb-2 text-muted">Join a class by entering its code.</h6>
              <AddByCode />

            </TabPanel>
            <TabPanel>

              <h6 className="card-subtitle mb-2 text-muted">See classes pending instructor's approval.</h6>
              <Pending />

            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>;
  }
}

export default Classes;
