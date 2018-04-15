import React, {Component} from 'react';
// import { Link } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import $ from 'jquery';


class DataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      page: 1,
      sizePerPage: 10,
    };
    this.fetchData = this.fetchData.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSizePerPageChange = this.handleSizePerPageChange.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
    this.props.updatePages(page, sizePerPage);
  }

  handlePageChange(page, sizePerPage) {
    this.fetchData(page, sizePerPage);
  }

  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.fetchData(1, sizePerPage);
  }

  render() {
    /*var options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    }*/;

    var that = this;
    function add(row, cell) {
      var onClick = function () {
        $.ajax({
          url: '/api/student/classes/addJoin',
          method: 'post',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify({
            course_id: cell.course_id
          }),
          error: function (jqReq, status, error) {
            this.setState({ error: error });
          }.bind(that),
          success: function (data, success, jqReq) {
            alert("successfully added");
          }/*.bind(that)*/
        });
      };

      return <button type="button" className="btn btn-primary btn-sm" onClick={onClick}>
        {/*{cell.id}*/}
        +
      </button>
    }

    return (
       <BootstrapTable
        data={this.props.rows}
        options={{ onSearchChange: this.props.onSearchChange, clearSearch: true }}
        fetchInfo={{ dataTotalSize: this.props.rows.length }}
        version='4'
        pagination
        striped
        hover
        condensed
        search
        multiColumnSearch
      >
        <TableHeaderColumn dataField="course_id" isKey dataFormat={add} width='10%' dataAlign="center">Add</TableHeaderColumn>
        <TableHeaderColumn dataField="course_name"     width='50%' dataAlign="center">Course</TableHeaderColumn>
        <TableHeaderColumn dataField="instructors"     width='50%' dataAlign="center">Instructor</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default DataGrid;
