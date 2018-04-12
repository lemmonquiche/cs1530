import React, { Component } from 'react';

import TableDragSelect from "react-table-drag-select";
import "react-table-drag-select/style.css";

import $ from 'jquery';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      cells: [
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
        [false, false, false, false, false, false, false, false],
      ],
      saved: true
    };

    this.save = this.save.bind(this);
  }

  componentDidCatch(error, info) {
    console.log("componentDidCatch", error, info);
  }

  componentDidMount() {
    var that = this;

    function bitstringToArray(str) {
      console.log("str is ", str);
      try {
        return str.match(/.{7}/g)
          .map(function(row) {
            return [false].concat(row.match(/.{1}/g)
              .map(function(value) {return value === "1" ? true : false; }));
          });
      } catch (e) {
        console.log(e);
        alert("error", str);
      }
    }

    if (!this.state.loaded) {
      $.ajax({
        method: 'get',
        url: '/api/student/schedule',
        success: function (data) {
          console.log("API CALL to /api/student/schedule returned:", data, arguments);
          that.setState({ loaded: true, cells: bitstringToArray(data.schedule), loaded: true });
        }
      });
    }
  }

  handleChange = cells => { this.setState({ cells }); this.setState({ saved: false }); }

  save(e) {
    console.log(this.state);
    e.preventDefault();

    var that = this;
    function adaptArray() {
      var result = that.state.cells.map(function (row) {
        return row.slice(1).map(function (value) {
          return value ? '1' : '0';
        });
      });

      console.log("result length", result.length);
      return result;
    }

    this.setState({ loaded: false });
    $.ajax({
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
        <h5 className="card-title">Schedule</h5>
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
        <tr>
          <td disabled>21:30</td>
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
