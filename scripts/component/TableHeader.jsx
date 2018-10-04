import React from 'react';
import { TableHead, TableRow, TableCell, Checkbox, Tooltip, TableSortLabel } from '@material-ui/core';

const rows = [
    { id: 'name', numeric: false, disablePadding: true, label: 'File Name' },
    { id: 'filetype', numeric: false, disablePadding: true, label: 'File Type' },
    { id: 'size', numeric: true, disablePadding: true, label: 'Size' },
    { id: 'created', numeric: true, disablePadding: false, label: 'Date' },
    { id: 'user', numeric: true, disablePadding: false, label: 'User' }
  ];

class TableHeader extends React.Component{
    createSortHandler(event, property){
        this.props.onRequestSort(event, property);
    };

    selectAllOnCurrentPage(event) {
        console.log(event.target.checked);
    }

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

        return(
            <TableHead>
                <TableRow>
                    <TableCell>
                        <Checkbox onClick={(e) => this.selectAllOnCurrentPage(e)}/>
                    </TableCell>
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                numeric={row.numeric}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderBy === row.id}
                                        direction={order}
                                        onClick={(e) => this.createSortHandler(e, row.id)}
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default TableHeader;