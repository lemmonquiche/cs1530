import React, {Component} from 'react';
// import { Link } from 'react-router-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import _ from 'lodash';

const dataTable = _.range(1, 50).map(x => ({
  id: x, course: `Course ${x}`, instructor: `Professor ${x}`
}));

// Simulates the call to the server to get the data
const fakeDataFetcher = {
  fetch(page, size) {
    return new Promise((resolve, reject) => {
      resolve({items: _.slice(dataTable, (page-1)*size, ((page-1)*size) + size), total: dataTable.length});
    });
  }
};

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
    fakeDataFetcher.fetch(page, sizePerPage)
      .then(data => {
        this.setState({items: data.items, totalSize: data.total, page, sizePerPage});
      });
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

      // onSearchChange: this.props.onSearchChange,
      // clearSearch: true
    };

    // console.log(Object.keys(this.props));

    // var datas = this.state.items;
    // var first = JSON.stringify(datas);
        // <div>
        //   <p>{first}</p>
        //   <p>{JSON.stringify(options)}</p>
        //   <p>{JSON.stringify(this.state.totalSize)}</p>
        // </div>

    function add(row, cell) {
      var onClick = function () {
        console.log("deleting this students course number" + cell.id);
      };

      return <button type="button" className="btn btn-primary btn-sm" onClick={onClick}>
        {/*{cell.id}*/}
        +
      </button>
    }

    return (
       <BootstrapTable
        data={this.state.items}
        options={ { onSearchChange: this.props.onSearchChange, clearSearch: true } }
        fetchInfo={{dataTotalSize: this.state.totalSize}}
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
        <TableHeaderColumn dataField="instructor" width='50%' dataAlign="center">Instructor</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default DataGrid;
