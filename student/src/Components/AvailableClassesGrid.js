import React, {Component} from 'react';
// import { Link } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import _ from 'lodash';



class DataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    var options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };

    function add(row, cell) {
      var onClick = function () {
        console.log("deleting this students course number" + cell.id);
      };

      return <button type="button" className="btn btn-primary btn-sm" onClick={onClick}>
        {/*{cell.id}*/}
        +
      </button>
    }

    console.log(this.props.rows)
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
        <TableHeaderColumn dataField="id" isKey dataFormat={add} width='10%' dataAlign="center">Add</TableHeaderColumn>
        <TableHeaderColumn dataField="course"     width='50%' dataAlign="center">Course</TableHeaderColumn>
        <TableHeaderColumn dataField="instructors" width='50%' dataAlign="center">Instructor</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default DataGrid;
