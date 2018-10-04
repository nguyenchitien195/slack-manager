import React from 'react';
import { TableRow, TableCell, Button, Checkbox, Typography, TableBody } from '@material-ui/core';

class BodyTableFiles extends React.Component{

    constructor(props) {
        super(props);
        let obj = JSON.parse(localStorage.getItem('auth'));
        this.token = obj.access_token;
    }

    convertDate(unixtimestamp){
        // Months array
        var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
       
        // Convert timestamp to milliseconds
        var date = new Date(unixtimestamp*1000);
       
        // Year
        var year = date.getFullYear();
       
        // Month
        // var month = months_arr[date.getMonth()];
        var month = date.getMonth() + 1;
       
        // Day
        var day = date.getDate();
       
        // Hours
        var hours = date.getHours();
       
        // Minutes
        var minutes = "0" + date.getMinutes();
       
        // Seconds
        var seconds = "0" + date.getSeconds();
       
        // Display date time in MM-dd-yyyy h:m:s format
        var convdataTime = day + '-' + month + '-' + year;

        return convdataTime;
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
    
        this.props.setSelected(newSelected);
    }

    render() {
        const { items, selected, page, rowsPerPage, order, orderBy } = this.props;
        let startSlice = page * rowsPerPage;
        let endSlice = startSlice + rowsPerPage;
        let data = stableSort(items, getSorting(order, orderBy)).slice(startSlice, endSlice);
        return(
            <TableBody>
                {data.map((item, key) => {
                    const isSelected = selected.indexOf(item.id) !== -1;
                    return (
                        <TableRow
                            hover
                            onClick={event => this.handleClick(event, item.id, selected)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={item.id}
                            selected={isSelected}
                        >
                            <TableCell>
                                <Checkbox checked={isSelected}/>
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
                                {item.size}
                            </TableCell>
                            <TableCell>
                                {this.convertDate(item.created)}
                            </TableCell>
                            <TableCell>
                                {item.account_name}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }
}

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

export default BodyTableFiles;