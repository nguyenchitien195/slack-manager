import React from 'react';
import ReactDOM from 'react-dom';
import Table from '@material-ui/core/Table';
import { Paper, TablePagination } from '@material-ui/core';
import TableHeader from './component/TableHeader';
import BodyTableFiles from './component/BodyTableFiles';
import TableToolbar from './component/TableToolbar';

class TableData extends React.Component {

    constructor(props) {
        super(props);
        this.auth = null;
        this.user = null;
        this.state = {
            order: 'desc',
            orderBy: 'created',
            selected: [],
            page: 0,
            rowsPerPage: 5,
            isLoaded: false,
            listFiles: [],
            filterFiles: [],
            error: false,
            general_info: {
                totalSize: 0
            }
        };
        this.handleRequestSort = this.handleRequestSort.bind(this);
    }

    componentDidMount() {
        this.getListUsers();
        this.getListFiles();
    }

    handleRequestSort(event, property) {
        const orderBy = property;
        let order = 'desc';
    
        if (this.state.orderBy === property && this.state.order === 'desc') {
          order = 'asc';
        }
    
        this.setState({ order, orderBy });
      };

    getListFiles() {
        fetch('https://slack.com/api/files.list?count=1000&token=' + this.props.token)
            .then(res => res.json())
            .then(
                (result) => {
                    let totalSize = 0;
                    let users = JSON.parse(window.localStorage.getItem('members'));
                    let userDatas = [];
                    users.members.map((item, index) => {
                        item.no = index;
                        userDatas[item.id] = item;
                    });
                    result.files.map((item, index) => {
                        item.name = item.name.trim();
                        item.account_name = userDatas[item.user].name;
                        totalSize += item.size;
                    });
                    this.setState({
                        listFiles: result.files,
                        filterFiles: result.files,
                        isLoaded: true,
                        general_info: {
                            totalSize: totalSize
                        }
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    getListUsers() {
        fetch('https://slack.com/api/users.list?token=' + this.props.token)
            .then(res => res.json())
            .then(
                (result) => {
                    localStorage.setItem('members', JSON.stringify(result));
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    render() {
        const { error, isLoaded, listFiles, order, orderBy, selected, rowsPerPage, page } = this.state;
        if (error) {
            return <div>Error</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            console.log('render');
            return (
                <Paper>
                    <TableToolbar
                        numSelected={selected.length}
                        selected={selected}
                        token={this.token}
                        files={this.state.listFiles}
                        updateListFiles={(listFiles, updateSelected) => this.setState({listFiles: listFiles, selected: updateSelected})}
                    />
                    <Table>
                        <TableHeader
                            order={order}
                            orderBy={orderBy}
                            rowCount={listFiles.length}
                            onRequestSort={this.handleRequestSort}
                            updateSelected={selected => this.setState({selected: selected})}
                        />
                        <BodyTableFiles
                            page={page}
                            rowsPerPage={rowsPerPage}
                            order={order}
                            orderBy={orderBy}
                            deleteFile={() => this.deleteFile()}
                            items={this.state.listFiles}
                            selected={this.state.selected}
                            setSelected={selected => this.setState({selected: selected})}
                        />
                    </Table>
                    <TablePagination
                        component="div"
                        count={listFiles.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={(e, value) => {this.setState({page: value})}}
                        onChangeRowsPerPage={(e) => {this.setState({rowsPerPage: e.target.value})}}
                    />
                </Paper>
            );
        }
    }
}

const auth = JSON.parse(localStorage.getItem('auth'));
const token = auth.access_token;
const user_id = auth.user_id;
ReactDOM.render(<TableData token={token} user_id={user_id}/>, document.querySelector('#table-list-files'));