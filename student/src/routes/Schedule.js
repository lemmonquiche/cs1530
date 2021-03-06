import React, { Component } from 'react';

import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";
import FontAwesome from 'react-fontawesome';

import jQuery from 'jquery';

var defaultCells = [
  /* dis  mon    tues   wed    thurs  fri    sat    sun */
  [false, false, false, false, false, false, false, false],  // 8
  [false, false, false, false, false, false, false, false],  // 830
  [false, false, false, false, false, false, false, false],  // 9
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 10
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 11
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 12
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 13
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 2
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 3
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 4
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 5
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 6
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 7
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 8
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],  // 9
  [false, false, false, false, false, false, false, false],
];

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      cells: defaultCells,
      saved: true
    };

    this.helpEnabled = localStorage.getItem("grouperHelpEnabled") === 'true';

    this.save = this.save.bind(this);
  }

  componentDidCatch() {
    this.setState({ loaded: true, cells: defaultCells });
  }

  componentDidMount() {
    var that = this;

    function bitstringToArray(str) {
      return str.match(/.{7}/g)
        .map(function(row) {
          return [false].concat(row.match(/.{1}/g)
            .map(function(value) {return value === "1" ? true : false; }));
        });
    }

    if (!this.state.loaded) {
      jQuery.ajax({
        method: 'get',
        url: '/api/student/schedule',
        success: function (data) {
          that.setState({ loaded: true, cells: bitstringToArray(data.schedule) });
        }
      });
    }

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

  handleChange = cells => { this.setState({ cells }); this.setState({ saved: false }); }

  save(e) {
    console.log(this.state);
    e.preventDefault();

    var that = this;
    function adaptArray() {
      return that.state.cells.map(function (row) {
        return row.slice(1).map(function (value) {
          return value ? '1' : '0';
        });
      });
    }

    this.setState({ loaded: false });
    jQuery.ajax({
      method: 'post',
      url: '/api/student/schedule',
      contentType: 'application/json',
      data: JSON.stringify({
        schedule: JSON.stringify(adaptArray())
      }),
      dataType: 'json',
      error: function () {
        console.log(arguments);
        this.setState({ loaded: true, saved: false });
      }.bind(this),
      success: function (data) {
        this.setState({ loaded: true, saved: true });
      }.bind(this),
    });
    // setTimeout(function() {}.bind(this), 500);
  }

  render() {
    if (!this.state.loaded) {
      setTimeout(function() { this.setState({ loaded: true })}.bind(this), 500);
      return <div className="loading-spinner"></div>
    }

    /*var times =[
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30'
    ];*/

    var saveClass = 'card-link btn' + (this.state.saved ? ' disabled' : '');
    var saveMessage = this.state.saved ? 'Saved' : 'Save';

    return <div className="card">
      <div className="card-body">
        <h5 className="card-title">
          Schedule
          {this.helpEnabled
            ? <FontAwesome name="info-circle" style={{ display: 'inline', margin: '0 5px' }}
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content={"Enter your availability to meet by clicking " +
                  "and dragging times you are free. Light gray means you’re " +
                  "busy and dark gray means you’re available. Remember to " +
                  "enter this soon as possible so you can be matched to a " +
                  "great group."}
                onMouseOver={(e) => jQuery(e.target).popover('show')}
                onMouseOut={(e) => jQuery(e.target).popover('hide')}
                />
            : null}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">Enter your availability</h6>
        <p className="card-text">Click on the boxes to tell your teammates when you are available to meet.</p>
        <a className={saveClass} onClick={this.save} onTouchStart={this.save}>{saveMessage}</a>
        {/*<button type="button" className={saveClass} onClick={this.save} onTouchStart={this.save}>Save</button>*/}
        {/*<a href="#" class="card-link"></a>*/}

        <TableDragSelect value={this.state.cells} onChange={this.handleChange}>
        <tr>
          <td disabled />
          <td disabled>Mo</td>
          <td disabled>Tu</td>
          <td disabled>We</td>
          <td disabled>Th</td>
          <td disabled>Fr</td>
          <td disabled>Sa</td>
          <td disabled>Su</td>
        </tr>
        <tr>
          <td disabled>08:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>08:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>09:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>09:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>10:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>10:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>11:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>11:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>12:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>12:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>13:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>13:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>14:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>14:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>15:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>15:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>16:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>16:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>17:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>17:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>18:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>18:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>19:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>19:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>20:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>20:30</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
        <tr>
          <td disabled>21:00</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
        </tr>
      </TableDragSelect>
      </div>
    </div>;
  }
}

export default Schedule;
