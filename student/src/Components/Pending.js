import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import _ from 'lodash';
import $ from 'jquery';

var dataTable = [];
var fakeDataFetcher = function() {};
if (process.env.NODE_ENV === 'development') {
  dataTable = _.range(1, 50).map(x => ({
    id: x, course: `Course ${x}`, instructor: `Professor ${x}`
  }));

  // Simulates the call to the server to get the data
  fakeDataFetcher = {
    fetch(page, size) {
      return new Promise((resolve, reject) => {
        resolve({items: _.slice(dataTable, (page-1)*size, ((page-1)*size) + size), total: dataTable.length});
      });
    }
  };
}

class DataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      totalSize: 0,
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
    if (process.env.NODE_ENV === 'development') {
      fakeDataFetcher.fetch(page, sizePerPage)
        .then(data => {
          this.setState({items: data.items, totalSize: data.total, page, sizePerPage});
        });
    } else {
      $.ajax({
        url: '/api/student/classes/pending',
        method: 'post',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          page, sizePerPage
        }),
        error: function (jQReq, status, error) {
          console.log('Error fetching /api/student/classes/added')
        }.bind(this),
        success: function (data, status, jQReq) {
          console.log(data);
          this.setState({ items: data.courses })
        }.bind(this),
      })
    }
  }

  handlePageChange(page, sizePerPage) {
    this.fetchData(page, sizePerPage);
  }

  handleSizePerPageChange(sizePerPage) {
    // When changing the size per page always navigating to the first page
    this.fetchData(1, sizePerPage);
  }

  render() {
    const options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };

    // var datas = this.state.items;
    // var first = JSON.stringify(datas);
        // <div>
        //   <p>{first}</p>
        //   <p>{JSON.stringify(options)}</p>
        //   <p>{JSON.stringify(this.state.totalSize)}</p>
        // </div>

    function viewLink(row, cell) {
      return <Link to={'/joined/' + cell.id}>
        <button type="button" className="btn btn-primary btn-sm">
          {cell.id}
        </button>
      </Link>;
    };

    function remove(row, cell) {
      var onClick = function () {
        console.log("deleting this students course number" + cell.id);
      };

      return <button type="button" className="btn btn-primary btn-sm" onClick={onClick}>
        {cell.id}
      </button>
    }

        // remote
    return (
       <BootstrapTable
        data={this.state.items}
        options={options}
        fetchInfo={{dataTotalSize: this.state.totalSize}}
        version='4'
        pagination
        striped
        hover
        condensed
      >
        <TableHeaderColumn dataField="id" isKey dataFormat={viewLink} width='10%' dataAlign="center">View</TableHeaderColumn>
        <TableHeaderColumn dataField="id"       dataFormat={remove}   width='10%' dataAlign="center">Remove</TableHeaderColumn>
        <TableHeaderColumn dataField="course"     width='40%' dataAlign="center">Course</TableHeaderColumn>
        <TableHeaderColumn dataField="instructor" width='40%' dataAlign="center">Instructor</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default DataGrid;