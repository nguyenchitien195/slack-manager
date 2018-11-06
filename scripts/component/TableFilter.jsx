import React from 'react';
import Select from 'react-select';
import { TextField, Grid, Typography } from '@material-ui/core';

class TableFilter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            members: null,
            channels: null
        }
        this.changeMember = this.changeMember.bind(this);
        this.changeChannel = this.changeChannel.bind(this);
    }

    changeMember(memberOptions) {
        this.setState({ members: memberOptions });
        this.props.filterByMember(memberOptions);
    }

    changeChannel(channelOptions) {
        this.setState({ channels: channelOptions });
        this.props.filterByChannel(channelOptions);
    }

    searchFile(e) {
        this.setState({ name: e.target.value });
        this.props.filterByName(e.target.value);
    }

    render() {
        return(
            <Grid container spacing={16}>
                <Grid item xs={4}>
                    <TextField
                        label='File name'
                        onChange={e => this.searchFile(e)}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography>Members:</Typography>
                    <Select
                        value={this.state.members}
                        onChange={this.changeMember}
                        options={memberOptions}
                        isMulti
                    />
                </Grid>
                <Grid item xs={4}>
                    <Typography>Channels:</Typography>
                    <Select
                        value={this.state.channels}
                        onChange={this.changeChannel}
                        options={channelOptions}
                        isMulti
                    />
                </Grid>
            </Grid>
        );
    }
}

var memberOptions = [], channelOptions = [];
if (localStorage.members) {
    memberOptions = JSON.parse(localStorage.members).members.map((item) => {
        return {value: item.id, label: item.name};
    })
}

if (localStorage.channels) {
    channelOptions = JSON.parse(localStorage.channels).channels.filter((item) => {
        return !item.is_archived;
    }).map((item) => {return {value: item.id, label: item.name};})
}

export default TableFilter;