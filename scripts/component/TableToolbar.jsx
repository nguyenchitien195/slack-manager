import React from 'react';
import classNames from 'classnames';
import { withStyles, Toolbar, Typography, Tooltip, IconButton, TextField } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import FilterListIcon from '@material-ui/icons/FilterList';
import TableFilter from './TableFilter';

class TableToolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    deleteFiles() {
        if (confirm('Do you want to delete?')) {
            this.props.selected.map(item => {
                this.deleteFile(item);
            });
            alert('Delete success');
        }
    }

    deleteFile(fileID) {
        fetch('https://slack.com/api/files.delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'token=' + this.props.token + '&file=' + fileID
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result.ok) {
                        let updateListFiles = this.props.files.filter(item => item.id !== fileID);
                        let updateSelected = this.props.selected.filter(item => item !== fileID);
                        this.props.updateListFiles(updateListFiles, updateSelected);
                    } else {
                        alert(result.error);
                    }
                },
                (error) => {
                    console.error(error);
                }
            )
    }

    render() {
        const { numSelected, classes, files } = this.props;
        return (
            <Toolbar
                className={classNames(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
            >
                <div className={classes.title} style={{'width': '800px'}}>
                    {numSelected > 0 ? (
                        <div>
                            <IconButton aria-label='Clear'>
                                <ClearIcon onClick={() => this.props.updateListFiles(files, [])}/>
                            </IconButton>
                            <Typography color="inherit" variant="subheading" className={classes.selected}>
                                {numSelected} selected
                            </Typography>
                        </div>
                    ) : (
                        <div>
                            <Typography variant="title" id="tableTitle">
                                Filter files
                            </Typography>
                            <TableFilter
                                filterByMember={members => this.props.filterByMember(members)}
                                filterByChannel={channels => this.props.filterByChannel(channels)}
                                filterByName={name => this.props.filterByName(name)}
                            />
                        </div>
                        )}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <Tooltip title="Delete">
                            <IconButton aria-label="Delete">
                                <DeleteIcon onClick={() => this.deleteFiles()}/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                            <Tooltip title="Filter list">
                                <IconButton aria-label="Filter list">
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                </div>
            </Toolbar>
        );
    }
}

const toolbarStyles = theme => ({
    root: {
      paddingRight: theme.spacing.unit,
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
    selected: {
        display: 'inline',
    }
});

  
export default withStyles(toolbarStyles)(TableToolbar);