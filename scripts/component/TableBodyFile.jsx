import React from 'react';
import { TableRow, TableCell, Button, Checkbox, Typography, TableBody } from '@material-ui/core';
import Helper from 'helper/Helper.js';

class TableBodyFile extends React.Component{

    constructor(props) {
        super(props);
        let obj = JSON.parse(localStorage.getItem('auth'));
        this.token = obj.access_token;
    }

    handleClick(event, id, selected) {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        console.log(newSelected);
        this.props.setSelected(newSelected);
    }

    render() {
        const { items, selected, page, rowsPerPage, order, orderBy } = this.props;
        let startSlice = page * rowsPerPage;
        let endSlice = startSlice + rowsPerPage;
        let data = Helper.stableSort(items, Helper.getSorting(order, orderBy)).slice(startSlice, endSlice);
        return(
            <TableBody>
                {data.map((item, key) => {
                    const isSelected = selected.indexOf(item.id) !== -1;
                    return (
                        <TableRow
                            hover
                            onClick={event => {item.is_delete && this.handleClick(event, item.id, selected)}}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={item.id}
                            selected={isSelected}
                        >
                            <TableCell>
                                {item.is_delete && <Checkbox checked={isSelected}/>}
                            </TableCell>
                            <TableCell>
                                <img src={item.thumb_160}/>
                                <a target='_blank' href={item.url_private}>
                                    <Typography>{item.name}</Typography>
                                </a>
                            </TableCell>
                            <TableCell>
                                {item.filetype}
                            </TableCell>
                            <TableCell>
                                {Helper.toSizeString(item.size)}
                            </TableCell>
                            <TableCell>
                                {Helper.convertDate(item.created)}
                            </TableCell>
                            <TableCell>
                                {item.account_name}
                            </TableCell>
                            <TableCell>
                                {item.channel_name}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }
}

export default TableBodyFile;