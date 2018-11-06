import React from 'react';
import ReactDOM from 'react-dom';
import Table from '@material-ui/core/Table';
import { Paper, TablePagination } from '@material-ui/core';
import TableHeader from './component/TableHeader';
import TableBodyFile from './component/TableBodyFile';
import TableToolbar from './component/TableToolbar';
import Helper from './helper/Helper';

class TableData extends React.Component {

    constructor(props) {
        super(props);
        this.auth = null;
        this.user = null;
        this.filterName = '';
        this.filterMembers = [];
        this.filterChannels = [];
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
        this.filterByMember = this.filterByMember.bind(this);
        this.filter = this.filter.bind(this);
    }

    componentDidMount() {
        this.getListUsers();
        this.getListFiles();
        this.getListChannels();
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
                    let channelsJson = JSON.parse(window.localStorage.getItem('channels'));
                    let userDatas = [], channelDatas = [];
                    users.members.map((item, index) => {
                        item.no = index;
                        userDatas[item.id] = item;
                    });
                    channelsJson.channels.map((item, index) => {
                        channelDatas[item.id] = item;
                    });
                    result.files.map((item, index) => {
                        item.name = item.name.trim();
                        item.account_name = userDatas[item.user].name;
                        if (item.channels.length > 1) {
                            console.log(index);
                        }
                        item.channel_name = item.channels.map(i => {
                            return channelDatas[i].name;
                        });
                        item.is_delete = item.user === this.props.user_id;
                        totalSize += item.size;
                    });
                    this.setState({
                        listFiles: result.files,
                        filterFiles: result.files,
                        isLoaded: true,
                        general_info: {
                            totalSize: Helper.toSizeString(totalSize)
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

    getListChannels() {
        fetch('https://slack.com/api/channels.list?token=' + this.props.token)
            .then(res => res.json())
            .then(
                (result) => {
                    localStorage.setItem('channels', JSON.stringify(result));
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    }

    filterByName(filterFiles) {
        let results = [];
        let name = this.filterName;
        for (let i in filterFiles) {
            if (filterFiles[i].title.includes(name)) {
                results.push(filterFiles[i]);
            }
        }
        return results;
    }

    filterByMember(filterFiles) {
        let results = [];
        let members = this.filterMembers;
        for (let i in filterFiles) {
            for (let j in members) {
                if (members[j].value === filterFiles[i].user) {
                    results.push(filterFiles[i]);
                    break;
                }
            }
        }
        return results;
    }

    filterByChannel(filterFiles) {
        let results = [];
        let channels = this.filterChannels;
        for (let i in filterFiles) {
            let is_found = false;
            for (let j in filterFiles[i].channels) {
                for (let k in channels) {
                    if (channels[k].value === filterFiles[i].channels[j]) {
                        results.push(filterFiles[i]);
                        is_found = true;
                        break;
                    }
                }
                if (is_found) break;
            }
        }
        return results;
    }

    filter() {
        let filterFiles = this.state.listFiles;
        if (this.filterName) {
            filterFiles = this.filterByName(filterFiles);
        }
        if (this.filterMembers.length > 0) {
            filterFiles = this.filterByMember(filterFiles);
        }
        if (this.filterChannels.length > 0) {
            filterFiles = this.filterByChannel(filterFiles);
        }
        this.setState({filterFiles: filterFiles});
    }

    render() {
        const { error, isLoaded, filterFiles, listFiles, order, orderBy, selected, rowsPerPage, page } = this.state;
        if (error) {
            return <div>Error</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <Paper>
                    <TableToolbar
                        numSelected={selected.length}
                        selected={selected}
                        token={this.props.token}
                        filterFiles={this.state.filterFiles}
                        listFiles={this.state.filterFiles}
                        updateListFiles={(filterFiles, updateSelected) => this.setState({filterFiles: filterFiles, selected: updateSelected})}
                        filterByMember={members => {this.filterMembers = members; this.filter()}}
                        filterByChannel={channels => {this.filterChannels = channels; this.filter()}}
                        filterByName={name => {this.filterName = name; this.filter()}}
                    />
                    <Table>
                        <TableHeader
                            order={order}
                            orderBy={orderBy}
                            rowCount={filterFiles.length}
                            onRequestSort={this.handleRequestSort}
                            updateSelected={selected => this.setState({selected: selected})}
                        />
                        <TableBodyFile
                            page={page}
                            rowsPerPage={rowsPerPage}
                            order={order}
                            orderBy={orderBy}
                            deleteFile={() => this.deleteFile()}
                            items={this.state.filterFiles}
                            selected={this.state.selected}
                            setSelected={selected => this.setState({selected: selected})}
                        />
                    </Table>
                    <TablePagination
                        component="div"
                        count={filterFiles.length}
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

if (localStorage.getItem('auth')) {
    let auth = JSON.parse(localStorage.getItem('auth'));
    let token = auth.access_token;
    let user_id = auth.user_id;
    ReactDOM.render(<TableData token={token} user_id={user_id}/>, document.querySelector('#table-list-files'));
} else {
    window.location.href = '/slack-manager/login.html';
}