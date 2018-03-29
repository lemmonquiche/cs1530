import React, {Component} from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import _ from 'lodash';

const dataTable = _.range(1, 50).map(x => ({id: x, name: `Name ${x}`, surname: `Surname ${x}`}));

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
    const options = {
      onPageChange: this.handlePageChange,
      onSizePerPageList: this.handleSizePerPageChange,
      page: this.state.page,
      sizePerPage: this.state.sizePerPage,
    };

    var datas = this.state.items;
    var first = JSON.stringify(datas);
        // <div>
        //   <p>{first}</p>
        //   <p>{JSON.stringify(options)}</p>
        //   <p>{JSON.stringify(this.state.totalSize)}</p>
        // </div>

    return (
       <BootstrapTable
        data={this.state.items}
        options={options}
        fetchInfo={{dataTotalSize: this.state.totalSize}}
        version='4'
        remote
        pagination
        striped
        hover
        condensed
      >
        <TableHeaderColumn dataField="id" isKey width='33%' dataAlign="center">Id</TableHeaderColumn>
        <TableHeaderColumn dataField="name"     width='33%' dataAlign="center">Name</TableHeaderColumn>
        <TableHeaderColumn dataField="surname"  width='33%' dataAlign="center">Surname</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default DataGrid;
